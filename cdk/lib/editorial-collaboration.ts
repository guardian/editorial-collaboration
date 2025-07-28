import { GuEc2App } from '@guardian/cdk';
import { AccessScope } from '@guardian/cdk/lib/constants';
import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import { GuCname } from '@guardian/cdk/lib/constructs/dns';
import { GuSecurityGroup, GuVpc } from '@guardian/cdk/lib/constructs/ec2';
import { GuAllowPolicy } from '@guardian/cdk/lib/constructs/iam';
import { GuDatabaseInstance } from '@guardian/cdk/lib/constructs/rds';
import type { App } from 'aws-cdk-lib';
import { Duration, aws_rds as rds, RemovalPolicy } from 'aws-cdk-lib';
import {
	InstanceClass,
	InstanceSize,
	InstanceType,
	Port,
} from 'aws-cdk-lib/aws-ec2';
import { SubnetGroup } from 'aws-cdk-lib/aws-rds';

interface EditorialCollaborationProps extends GuStackProps {
	domainName: string;
}

export class EditorialCollaboration extends GuStack {
	constructor(scope: App, id: string, props: EditorialCollaborationProps) {
		super(scope, id, props);

		const { domainName, stage } = props;

		const appName = 'editorial-collaboration';
		const appPort = 3000;

		const dbUsername = 'editorial_collaboration';
		const dbPort = 5432;

		const guEc2App = new GuEc2App(this, {
			access: { scope: AccessScope.PUBLIC },
			app: appName,
			applicationPort: appPort,
			certificateProps: {
				domainName,
			},
			monitoringConfiguration: { noMonitoring: true },
			scaling: {
				minimumInstances: 1,
				maximumInstances: 2,
			},
			roleConfiguration: {
				additionalPolicies: [
					new GuAllowPolicy(this, 'PanDomainPolicy', {
						resources: ['arn:aws:s3:::pan-domain-auth-settings/*'],
						actions: ['s3:GetObject'],
					}),
				],
			},
			userData: {
				distributable: {
					fileName: 'main.js',
					executionStatement: `
# add user
groupadd ${appName}
useradd -r -s /usr/bin/nologin -g ${appName} ${appName}
# write out systemd file
cat >/etc/systemd/system/${appName}.service <<EOL
[Service]
ExecStart=/usr/bin/node /${appName}/main.js
Restart=always
StandardOutput=journal
StandardError=journal
Environment=STAGE=${stage}
User=${appName}
Group=${appName}
[Install]
WantedBy=multi-user.target
EOL
# RUN
systemctl enable ${appName}
systemctl start ${appName}
					`,
				},
			},
			applicationLogging: { enabled: true, systemdUnitName: appName },
			instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.MICRO),
			imageRecipe: 'editorial-tools-jammy-node20-ARM',
		});

		// Add the domain name
		new GuCname(this, 'DnsRecord', {
			app: appName,
			domainName: domainName,
			ttl: Duration.hours(1),
			resourceRecord: guEc2App.loadBalancer.loadBalancerDnsName,
		});

		const dbAccessSecurityGroup = new GuSecurityGroup(this, 'DBSecurityGroup', {
			app: appName,
			description: 'Allow traffic from EC2 instance to DB',
			vpc: guEc2App.vpc,
			allowAllOutbound: false,
		});

		dbAccessSecurityGroup.connections.allowFrom(
			guEc2App.autoScalingGroup,
			Port.tcp(dbPort),
			'Allow connections from EC2 instance to DB',
		);

		new GuDatabaseInstance(this, 'Database', {
			app: `${appName}-db`,
			databaseName: 'collaboration',
			instanceIdentifier: `${appName}-${stage}-db`,
			instanceType: 'db.t4g.micro',
			engine: rds.DatabaseInstanceEngine.postgres({
				version: rds.PostgresEngineVersion.VER_16_2,
			}),
			vpc: guEc2App.vpc,
			subnetGroup: new SubnetGroup(this, 'DBSubnetGroup', {
				vpc: guEc2App.vpc,
				vpcSubnets: {
					subnets: GuVpc.subnetsFromParameter(this),
				},
				description: 'Subnet for editorial collaboration database',
			}),
			port: dbPort,
			preferredMaintenanceWindow: 'Mon:06:30-Mon:07:00',
			credentials: rds.Credentials.fromGeneratedSecret(dbUsername, {
				secretName: `/${stage}/flexible/editorial-collaboration/db`,
			}),
			iamAuthentication: true,
			storageType: rds.StorageType.GP2, // SSD
			allocatedStorage: 150,
			storageEncrypted: true,
			multiAz: stage === 'PROD',
			publiclyAccessible: false,
			removalPolicy: RemovalPolicy.RETAIN,
			securityGroups: [dbAccessSecurityGroup],
			devXBackups: { enabled: true },
			allowMajorVersionUpgrade: false,
			autoMinorVersionUpgrade: true,
			deleteAutomatedBackups: false,
		});
	}
}
