import * as cdk from '@aws-cdk/core';
import * as s3 from '@aws-cdk/aws-s3';
// import * as msk from '@aws-cdk/aws-msk';
import * as ec2 from '@aws-cdk/aws-ec2';

// vpc id: vpc-0feb1388aa8e6f3df
// kafka-m5-large
// storage volume per broker 100

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new s3.Bucket(this, 'TestCDKBucket', {
      versioned: true,
    });
  }
}

// const cluster = new msk.Cluster(this, 'Cluster', {
//   kafkaVersion: msk.KafkaVersion.V2_6_2,
//   bootstrapBrokers: '',
//   vpc,
// });

// cluster.connections.allowFrom(ec2.Peer.ipv4('1.2.3.4/8'), ec2.Port.tcp(2181));

// new cdk.CfnOutput(this, 'BootstrapBrokers', {
//   value: cluster.bootstrapBrokers,
// });
// new cdk.CfnOutput(this, 'BootstrapBrokersTls', {
//   value: cluster.bootstrapBrokersTls,
// });
// new cdk.CfnOutput(this, 'BootstrapBrokersSaslScram', {
//   value: cluster.bootstrapBrokersSaslScram,
// });
// new cdk.CfnOutput(this, 'ZookeeperConnection', {
//   value: cluster.zookeeperConnectionString,
// });
// new cdk.CfnOutput(this, 'ZookeeperConnectionTls', {
//   value: cluster.zookeeperConnectionStringTls,
// });
