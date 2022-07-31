import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { aws_route53 as r53 } from "aws-cdk-lib";

const DOMAIN_NAME = "graphique.mattb.tech";
const ZONE_NAME = "mattb.tech";
const ZONE_ID = "Z2GPSB1CDK86DH";

export default class GraphiqueStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = r53.HostedZone.fromHostedZoneAttributes(
      this,
      "HostedZone",
      {
        hostedZoneId: ZONE_ID,
        zoneName: ZONE_NAME,
      }
    );

    new r53.CnameRecord(this, "CNAME", {
      zone: hostedZone,
      recordName: DOMAIN_NAME,
      domainName: "cname.vercel-dns.com",
    });
  }
}
