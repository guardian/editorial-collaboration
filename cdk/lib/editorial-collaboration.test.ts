import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { EditorialCollaboration } from './editorial-collaboration';

describe('The EditorialCollaboration stack', () => {
	it('matches the snapshot', () => {
		const app = new App();
		const stack = new EditorialCollaboration(app, 'EditorialCollaboration', {
			stack: 'composer',
			stage: 'TEST',
			domainName: 'test.dev-gutools.co.uk',
		});
		const template = Template.fromStack(stack);
		expect(template.toJSON()).toMatchSnapshot();
	});
});
