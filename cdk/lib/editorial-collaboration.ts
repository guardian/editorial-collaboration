import { GuEc2App } from '@guardian/cdk';
import { AccessScope } from '@guardian/cdk/lib/constants';
import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import { GuCname } from '@guardian/cdk/lib/constructs/dns';
import type { App } from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType } from 'aws-cdk-lib/aws-ec2';

interface EditorialCollaborationProps extends GuStackProps {
	domainName: string;
}

export class EditorialCollaboration extends GuStack {
	constructor(scope: App, id: string, props: EditorialCollaborationProps) {
		super(scope, id, props);

		const { domainName, stage } = props;

		const appName = 'editorial-collaboration';

		const guPlayApp = new GuEc2App(this, {
			access: { scope: AccessScope.PUBLIC },
			app: appName,
			applicationPort: 3000,
			certificateProps: {
				domainName,
			},
			monitoringConfiguration: { noMonitoring: true },
			scaling: {
				minimumInstances: 1,
				maximumInstances: 2,
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
			imageRecipe: 'editorial-tools-focal-node20-ARM',
		});

		// Add the domain name
		new GuCname(this, 'DnsRecord', {
			app: appName,
			domainName: domainName,
			ttl: Duration.hours(1),
			resourceRecord: guPlayApp.loadBalancer.loadBalancerDnsName,
		});
	}
}
