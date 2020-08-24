import { Stack, StackProps, Construct } from "@aws-cdk/core";
import { HostedZone, CnameRecord } from "@aws-cdk/aws-route53";

const DOMAIN_NAME = "graphique.mattb.tech";
const ZONE_NAME = "mattb.tech";
const ZONE_ID = "Z2GPSB1CDK86DH";

export default class GraphiqueStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, "HostedZone", {
      hostedZoneId: ZONE_ID,
      zoneName: ZONE_NAME,
    });

    new CnameRecord(this, "CNAME", {
      zone: hostedZone,
      recordName: DOMAIN_NAME,
      domainName: "cname.vercel-dns.com",
    });
  }
}
