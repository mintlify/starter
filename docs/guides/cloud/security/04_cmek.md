---
sidebarTitle: 'Data encryption'
slug: /cloud/security/cmek
title: 'Data encryption'
description: 'Learn more about data encryption in ClickHouse Cloud'
doc_type: 'guide'
keywords: ['ClickHouse Cloud', 'encryption', 'CMEK', 'KMS key poller']
---

import {EnterprisePlanFeatureBadge} from '/snippets/components/EnterprisePlanFeatureBadge/EnterprisePlanFeatureBadge.jsx'

## Storage level encryption [#storage-encryption]

ClickHouse Cloud is configured with encryption at rest by default utilizing cloud provider-managed AES 256 keys. For more information review:
- [AWS server-side encryption for S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingServerSideEncryption.html)
- [GCP default encryption at rest](https://cloud.google.com/docs/security/encryption/default-encryption)
- [Azure storage encryption for data at rest](https://learn.microsoft.com/en-us/azure/storage/common/storage-service-encryption)

## Database level encryption [#database-encryption]

<EnterprisePlanFeatureBadge feature="Enhanced Encryption"/>

Data at rest is encrypted by default using cloud provider-managed AES 256 keys. Customers may enable Transparent Data Encryption (TDE) to provide an additional layer of protection for service data or supply their own key to implement Customer Managed Encryption Keys (CMEK) for their service.

Enhanced encryption is currently available in AWS and GCP services. Azure is coming soon.

### Transparent Data Encryption (TDE) [#transparent-data-encryption-tde]

TDE must be enabled on service creation. Existing services cannot be encrypted after creation. Once TDE is enabled, it cannot be disabled. All data in the service will remain encrypted. If you want to disable TDE after it has been enabled, you must create a new service and migrate your data there.

1. Select `Create new service`
2. Name the service
3. Select AWS or GCP as the cloud provider and the desired region from the drop-down
4. Click the drop-down for Enterprise features and toggle Enable Transparent Data Encryption (TDE)
5. Click Create service

### Customer Managed Encryption Keys (CMEK) [#customer-managed-encryption-keys-cmek]

<Warning>
Deleting a KMS key used to encrypt a ClickHouse Cloud service will cause your ClickHouse service to be stopped and its data will be unretrievable, along with existing backups. To prevent accidental data loss when rotating keys you may wish to maintain old KMS keys for a period of time prior to deletion. 
</Warning>

Once a service is encrypted with TDE, customers may update the key to enable CMEK. The service will automatically restart after updating the TDE setting. During this process, the old KMS key decrypts the data encrypting key (DEK), and the new KMS key re-encrypts the DEK. This ensures that the service on restart will use the new KMS key for encryption operations moving forward. This process may take several minutes.

<details>
    <summary>Enable CMEK with AWS KMS</summary>
    
1. In ClickHouse Cloud, select the encrypted service
2. Click on the Settings on the left
3. At the bottom of the screen, expand the Network security information
4. Copy the Encryption role ID (AWS) or Encryption Service Account (GCP) - you will need this in a future step
5. [Create a KMS key for AWS](https://docs.aws.amazon.com/kms/latest/developerguide/create-keys.html)
6. Click the key
7. Update the AWS key policy as follows:
    
    ```json
    {
        "Sid": "Allow ClickHouse Access",
        "Effect": "Allow",
        "Principal": {
            "AWS": [ "Encryption role ID " ]
        },
        "Action": [
            "kms:Encrypt",
            "kms:Decrypt",
            "kms:ReEncrypt*",
            "kms:DescribeKey"
        ],
        "Resource": "*"
    }
    ```
    
10. Save the Key policy
11. Copy the Key ARN
12. Return to ClickHouse Cloud and paste the Key ARN in the Transparent Data Encryption section of the Service Settings
13. Save the change
    
</details>

<details>
    <summary>Enable CMEK with GCP KMS</summary>

1. In ClickHouse Cloud, select the encrypted service
2. Click on the Settings on the left
3. At the bottom of the screen, expand the Network security information
4. Copy the Encryption Service Account (GCP) - you will need this in a future step
5. [Create a KMS key for GCP](https://cloud.google.com/kms/docs/create-key)
6. Click the key
7. Grant the following permissions to the GCP Encryption Service Account copied in step 4 above.
   - Cloud KMS CryptoKey Encrypter/Decrypter
   - Cloud KMS Viewer
10. Save the Key permission
11. Copy the Key Resource Path
12. Return to ClickHouse Cloud and paste the Key Resource Path in the Transparent Data Encryption section of the Service Settings
13. Save the change
    
</details>

#### Key rotation [#key-rotation]

Once you set up CMEK, rotate the key by following the procedures above for creating a new KMS key and granting permissions. Return to the service settings to paste the new ARN (AWS) or Key Resource Path (GCP) and save the settings. The service will restart to apply the new key.

#### KMS key poller [#kms-key-poller]

When using CMEK, the validity of the provided KMS key is checked every 10 minutes. If access to the KMS key is invalid, the ClickHouse service will stop. To resume service, restore access to the KMS key by following the steps in this guide, and then restart the service.

### Backup and restore [#backup-and-restore]

Backups are encrypted using the same key as the associated service. When you restore an encrypted backup, it creates an encrypted instance that uses the same KMS key as the original instance. If needed, you can rotate the KMS key after restoration; see [Key Rotation](#key-rotation) for more details.

## Performance [#performance]

Database encryption leverages ClickHouse's built-in [Virtual File System for Data Encryption feature](/operations/storing-data#encrypted-virtual-file-system) to encrypt and protect your data. The algorithm in use for this feature is `AES_256_CTR`, which is expected to have a performance penalty of 5-15% depending on the workload:

<img src="/images/_snippets/cmek-performance.png" alt="CMEK Performance Penalty"/>
