import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import { HitCounter } from './hitcounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';
export class CdkDemoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new apigw.RestApi(this, 'ExampleApi', {
      restApiName: 'ExampleApi',
      description: 'Example OPA API',
    });

    const opaCustomAuthLambda = new lambda.Function(this, 'OpaAuthorizer', {
      runtime: lambda.Runtime.GO_1_X,
      code: lambda.AssetCode.fromAsset('opaCustomGoAuthorizer'),
      handler: 'main',
      functionName: 'OpaCustomerGoAuthorizer',
    });

    const customOpaAuthorizer = new apigw.RequestAuthorizer(
      this,
      'customOpaAuthorizer',
      {
        handler: opaCustomAuthLambda,
        authorizerName: 'CustomOpaLambdaAuthorizer',
        identitySources: [
          apigw.IdentitySource.header('Usergroup'),
          apigw.IdentitySource.header('Resource'),
        ],
      },
    );

    const example = api.root.addResource('example');

    const app = new lambda.Function(this, 'AppHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'example.handler',
      functionName: 'ExampleAppLambdaFunction',
    });

    const appGetIntegration = new apigw.LambdaIntegration(app);

    example.addMethod('GET', appGetIntegration, {
      authorizer: customOpaAuthorizer,
    });

    new cdk.CfnOutput(this, 'Example API URL:', {
      value: api.url + 'example' ?? 'Something went wrong with the deploy step',
    });

    const appWithCounter = new HitCounter(this, 'AppHitCounter', {
      downstream: app,
    });

    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: appWithCounter.handler,
    });

    new TableViewer(this, 'ViewHitCounter', {
      title: 'App Hits',
      table: appWithCounter.table,
    });
  }
}
