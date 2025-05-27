/* eslint-disable no-undef */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: 'umami',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      protect: ['production'].includes(input?.stage),
      home: 'aws',
    };
  },
  async run() {
    const vpc = sst.aws.Vpc.get('BigskyVpc', 'vpc-03c527b561aff09b8');
    const rds = sst.aws.Postgres.get('BigskyDb', {
      id: 'bigskybuyerswebsite-dev-bigskydbinstance',
    });
    const rdsSchema = 'umami';
    const rdsUrl = $interpolate`postgresql://${rds.username}:${rds.password}@${rds.host}:${rds.port}/${rds.database}?schema=${rdsSchema}`;

    new sst.aws.Nextjs('bigsky-umami', {
      vpc: vpc,
      link: [rds],
      environment: {
        DATABASE_URL: rdsUrl,
      },
      domain: {
        name: 'stats.bigskybuyers.com',
      },
    });
  },
});
