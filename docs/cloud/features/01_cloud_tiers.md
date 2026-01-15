---
sidebarTitle: ClickHouse Cloud tiers
slug: /cloud/manage/cloud-tiers
title: ClickHouse Cloud Tiers
description: Cloud tiers available in ClickHouse Cloud
keywords:
  - cloud tiers
  - service plans
  - cloud pricing tiers
  - cloud service levels
doc_type: reference
---

There are several tiers available in ClickHouse Cloud. 
Tiers are assigned at any organizational level. Services within an organization therefore belong to the same tier.
This page discusses which tiers are right for your specific use case.

**Summary of cloud tiers:**

<table><thead>
  <tr>
    <th></th>
    <th>[Basic](#basic)</th>
    <th>[Scale](#scale)</th>
    <th>[Enterprise](#enterprise)</th>
  </tr></thead>
<tbody>
  <tr>
    <td>**Service Features**</td>
    <td colspan="3"></td>
  </tr>
  <tr>
    <td>Number of services</td>
    <td>✓ Unlimited</td>
    <td>✓ Unlimited</td>
    <td>✓ Unlimited</td>
  </tr>
  <tr>
    <td>Storage</td>
    <td>✓ Maximum of 1 TB / Service</td>
    <td>✓ Unlimited</td>
    <td>✓ Unlimited</td>
  </tr>
  <tr>
    <td>Memory</td>
    <td>✓ 8-12 GiB total memory</td>
    <td>✓ Configurable</td>
    <td>✓ Configurable</td>
  </tr>
  <tr>
    <td>Availability</td>
    <td>✓ 1 zone</td>
    <td>✓ 2+ zones</td>
    <td>✓ 2+ zones</td>
  </tr>
  <tr>
    <td>Backups</td>
    <td>✓ 1 backup every 24h, retained for 1 day</td>
    <td>✓ Configurable</td>
    <td>✓ Configurable</td>
  </tr>
  <tr>
    <td>Vertical scaling</td>
    <td></td>
    <td>✓ Automatic Scaling</td>
    <td>✓ Automatic for standard profiles, manual for custom profiles</td>
  </tr>
  <tr>
    <td>Horizontal scaling</td>
    <td></td>
    <td>✓ Manual Scaling</td>
    <td>✓ Manual Scaling</td>
  </tr>
  <tr>
    <td>ClickPipes</td>
    <td>✓</td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td>Early upgrades</td>
    <td></td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td>Compute-compute separation</td>
    <td></td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td>Export backups to your own cloud account</td>
    <td></td>
    <td></td>
    <td>✓</td>
  </tr>
  <tr>
    <td>Scheduled upgrades</td>
    <td></td>
    <td></td>
    <td>✓</td>
  </tr>
  <tr>
    <td>Custom hardware profiles</td>
    <td></td>
    <td></td>
    <td>✓</td>
  </tr>
  <tr>
    <td>**Security**</td>
    <td colspan="3"></td>
  </tr>
  <tr>
    <td>SAML/SSO</td>
    <td></td>
    <td></td>
    <td>✓</td>
  </tr>
  <tr>
    <td>MFA</td>
    <td>✓</td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td>SOC 2 Type II</td>
    <td>✓</td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td>ISO 27001</td>
    <td>✓</td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td>Private Networking</td>
    <td></td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td>S3 role based access</td>
    <td></td>
    <td>✓</td>
    <td>✓</td>
  </tr>
  <tr>
    <td>Transparent data encryption (CMEK for TDE)</td>
    <td></td>
    <td></td>
    <td>✓</td>
  </tr>
  <tr>
    <td>HIPAA</td>
    <td></td>
    <td></td>
    <td>✓</td>
  </tr>
</tbody></table>

## Basic 

- This is a cost-effective option that supports single-replica deployments.
- It is Ideal for departmental use cases with smaller data volumes that do not have hard reliability guarantees.

<Note>
Services in the basic tier are meant to be fixed in size and do not allow scaling, both automatic and manual. 
You can upgrade to the Scale or Enterprise tier to scale their services.
</Note>

## Scale 

Designed for workloads requiring enhanced SLAs (2+ replica deployments), scalability, and advanced security.

- It offers support for features such as:
  - [Private networking support](/cloud/security/connectivity/private-networking)
  - [Compute-compute separation](../reference/warehouses#what-is-compute-compute-separation)
  - [Flexible scaling](/manage/scaling) options (scale up/down, in/out)
  - [Configurable backups](/cloud/manage/backups/configurable-backups)

## Enterprise 

Caters to large-scale, mission critical deployments that have stringent security and compliance needs.

- Flexible scaling: standard profiles (`1:4 vCPU:memory ratio`), as well as `HighMemory (1:8 ratio)` and `HighCPU (1:2 ratio)` custom profiles.
- Provides the highest levels of performance and reliability guarantees.
- Supports enterprise-grade security:
  - Single Sign On (SSO)
  - Enhanced Encryption: For AWS and GCP services. Services are encrypted by our key by default and can be rotated to their key to enable Customer Managed Encryption Keys (CMEK).
- Allows scheduled upgrades in which you can select the day of the week/time window for upgrades, both database and cloud releases.
- Offers [HIPAA](/cloud/security/compliance-overview#hipaa-since-2024) and PCI compliance.
- Exports backups to the user's account.

<Note>
Single replica services across all three tiers are meant to be fixed in size (`8 GiB`, `12 GiB`)
</Note>

## Upgrading to a different tier 

You can always upgrade from Basic to Scale or from Scale to Enterprise. Downgrading tiers will require disabling premium features.

---

If you have any questions about service types, please see the [pricing page](https://clickhouse.com/pricing) or contact support@clickhouse.com.
