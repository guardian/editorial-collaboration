import 'source-map-support/register';
import { GuRoot } from '@guardian/cdk/lib/constructs/root';
import { EditorialCollaboration } from '../lib/editorial-collaboration';

const app = new GuRoot();

new EditorialCollaboration(app, 'EditorialCollaboration-CODE', {
	stack: 'composer',
	stage: 'CODE',
	env: { region: 'eu-west-1' },
	domainName: 'editorial-collaboration.code.dev-gutools.co.uk',
});

new EditorialCollaboration(app, 'EditorialCollaboration-PROD', {
	stack: 'composer',
	stage: 'PROD',
	env: { region: 'eu-west-1' },
	domainName: 'editorial-collaboration.gutools.co.uk',
});
