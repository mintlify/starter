---
slug: /cloud/data-sources/secure-s3
sidebarTitle: 'Accessing S3 data securely'
title: 'Accessing S3 data securely'
description: 'This article demonstrates how ClickHouse Cloud customers can leverage role-based access to authenticate with Amazon Simple Storage Service(S3) and access their data securely.'
keywords: ['RBAC', 'Amazon S3', 'authentication']
doc_type: 'guide'
---

This article demonstrates how ClickHouse Cloud customers can leverage role-based access to authenticate with Amazon Simple Storage Service (S3) and access their data securely.

## Introduction [#introduction]

Before diving into the setup for secure S3 access, it is important to understand how this works. Below is an overview of how ClickHouse services can access private S3 buckets by assuming into a role within customers' AWS account.

<img src="/images/cloud/security/secures3.jpg" alt="Overview of Secure S3 Access with ClickHouse"/>

This approach allows customers to manage all access to their S3 buckets in a single place (the IAM policy of the assumed-role) without having to go through all of their bucket policies to add or remove access.

## Setup [#setup]

### Obtaining the ClickHouse service IAM role ARN [#obtaining-the-clickhouse-service-iam-role-arn]

1 - Login to your ClickHouse cloud account.

2 - Select the ClickHouse service you want to create the integration

3 - Select the **Settings** tab

4 - Scroll down to the **Network security information** section at the bottom of the page

5 - Copy the **Service role ID (IAM)** value belong to the service as shown below.

<img src="/images/cloud/security/secures3_arn.png" alt="Obtaining ClickHouse service IAM Role ARN"/>

### Setting up IAM assume role [#setting-up-iam-assume-role]

#### Option 1: Deploying with CloudFormation stack [#option-1-deploying-with-cloudformation-stack]

1 - Login to your AWS Account in the web browser with an IAM user that has permission to create & manage IAM role.

2 - Visit [this url](https://us-west-2.console.aws.amazon.com/cloudformation/home?region=us-west-2#/stacks/quickcreate?templateURL=https://s3.us-east-2.amazonaws.com/clickhouse-public-resources.clickhouse.cloud/cf-templates/secure-s3.yaml&stackName=ClickHouseSecureS3) to populate the CloudFormation stack.

3 - Enter (or paste) the **IAM Role** belong to the ClickHouse service

4 - Configure the CloudFormation stack. Below is additional information about these parameters.

| Parameter                 | Default Value        | Description                                                                                        |
| :---                      |    :----:            | :----                                                                                              |
| RoleName                  | ClickHouseAccess-001 | The name of the new role that ClickHouse Cloud will use to access your S3 bucket                   |
| Role Session Name         |      *               | Role Session Name can be used as a shared secret to further protect your bucket.                   |
| ClickHouse Instance Roles |                      | Comma separated list of ClickHouse service IAM roles that can use this Secure S3 integration.      |
| Bucket Access             |    Read              | Sets the level of access for the provided buckets.                                                 |
| Bucket Names              |                      | Comma separated list of **bucket names** that this role will have access to.                       |

*Note*: Do not put the full bucket Arn but instead just the bucket name only.

5 - Select the **I acknowledge that AWS CloudFormation might create IAM resources with custom names.** checkbox

6 - Click **Create stack** button at bottom right

7 - Make sure the CloudFormation stack completes with no error.

8 - Select the **Outputs** of the CloudFormation stack

9 - Copy the **RoleArn** value for this integration. This is what needed to access your S3 bucket.

<img src="/images/cloud/security/secures3_output.jpg" alt="CloudFormation stack output showing IAM Role ARN"/>

#### Option 2: Manually create IAM role [#option-2-manually-create-iam-role]

1 - Login to your AWS Account in the web browser with an IAM user that has permission to create & manage IAM role.

2 - Browse to IAM Service Console

3 - Create a new IAM role with the following IAM & Trust policy.

Trust policy  (Please replace `{ClickHouse_IAM_ARN}` with the IAM Role arn belong to your ClickHouse instance):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "{ClickHouse_IAM_ARN}"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```

IAM policy (Please replace `{BUCKET_NAME}` with your bucket name):

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "s3:GetBucketLocation",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::{BUCKET_NAME}"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": [
                "arn:aws:s3:::{BUCKET_NAME}/*"
            ],
            "Effect": "Allow"
        }
    ]
}
```

4 - Copy the new **IAM Role Arn** after creation. This is what needed to access your S3 bucket.

## Access your S3 bucket with the ClickHouseAccess role [#access-your-s3-bucket-with-the-clickhouseaccess-role]

ClickHouse Cloud has a new feature that allows you to specify `extra_credentials` as part of the S3 table function. Below is an example of how to run a query using the newly created role copied from above.

```sql
DESCRIBE TABLE s3('https://s3.amazonaws.com/BUCKETNAME/BUCKETOBJECT.csv','CSVWithNames',extra_credentials(role_arn = 'arn:aws:iam::111111111111:role/ClickHouseAccessRole-001'))
```

Below is an example query that uses the `role_session_name` as a shared secret to query data from a bucket. If the `role_session_name` is not correct, this operation will fail.

```sql
DESCRIBE TABLE s3('https://s3.amazonaws.com/BUCKETNAME/BUCKETOBJECT.csv','CSVWithNames',extra_credentials(role_arn = 'arn:aws:iam::111111111111:role/ClickHouseAccessRole-001', role_session_name = 'secret-role-name'))
```

<Note>
We recommend that your source S3 is in the same region as your ClickHouse Cloud Service to reduce on data transfer costs. For more information, refer to [S3 pricing]( https://aws.amazon.com/s3/pricing/)
</Note>
