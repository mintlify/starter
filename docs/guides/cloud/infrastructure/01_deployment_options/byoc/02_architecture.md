---
title: 'Architecture'
slug: /cloud/reference/byoc/architecture
sidebarTitle: 'Architecture'
keywords: ['BYOC', 'cloud', 'bring your own cloud']
description: 'Deploy ClickHouse on your own cloud infrastructure'
doc_type: 'reference'
---

Metrics and logs are stored within the customer's BYOC VPC. Logs are currently stored in locally in EBS. In a future update, logs will be stored in LogHouse, which is a ClickHouse service in the customer's BYOC VPC. Metrics are implemented via a Prometheus and Thanos stack stored locally in the customer's BYOC VPC.

<img src="/images/cloud/reference/byoc-1.png" alt="BYOC Architecture"/>

