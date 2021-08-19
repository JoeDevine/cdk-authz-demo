import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as iam from '@aws-cdk/aws-iam';
import * as apigw from '@aws-cdk/aws-apigateway';
import * as dotenv from 'dotenv';

dotenv.config();

const { BASE_NAME, LAMBDA_ROLE_NAME = '', LAMBDA_ROLE_ARN = '' } = process.env;
export class CdkDemoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, `${BASE_NAME}Bucket`, {
      versioned: true,
    });

    const lambdaRole = iam.Role.fromRoleArn(
      this,
      LAMBDA_ROLE_NAME,
      LAMBDA_ROLE_ARN,
    );

    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'example.handler',
      role: lambdaRole,
    });

    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: hello,
      cloudWatchRole: false,
    });
  }
}
