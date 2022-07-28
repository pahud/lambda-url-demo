import {
  App, Stack, StackProps, CfnOutput,
  aws_lambda as lambda,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const handler = new lambda.Function(this, 'handler', {
      runtime: lambda.Runtime.NODEJS_16_X,
      handler: 'index.handler',
      code: new lambda.InlineCode(`
    exports.handler = async function(event, context) {
      return {
        statusCode: 200,
        headers: { "content-type": "text/html" },
        body: '<h1>Hello Hackathon!</h1>',
      };
    };`),
    });

    const fnUrl = handler.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    });

    new CfnOutput(this, 'URL', { value: fnUrl.url });

    // define resources here...
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

const stackName = app.node.tryGetContext('stackName') || 'lambda-url-demo-test';

new MyStack(app, stackName, { env: devEnv });
// new MyStack(app, 'lambda-url-demo-prod', { env: prodEnv });

app.synth();