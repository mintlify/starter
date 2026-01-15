---
sidebarTitle: 'Templates'
slug: /integrations/google-dataflow/templates
sidebar_position: 3
description: 'Users can ingest data into ClickHouse using Google Dataflow Templates'
title: 'Google Dataflow Templates'
doc_type: 'guide'
keywords: ['google dataflow', 'gcp', 'data pipeline', 'templates', 'batch processing']
---

import ClickHouseSupportedBadge from '/snippets/components/ClickHouseSupported/ClickHouseSupported.jsx'

<ClickHouseSupportedBadge/>

Google Dataflow templates provide a convenient way to execute prebuilt, ready-to-use data pipelines without the need to write custom code. These templates are designed to simplify common data processing tasks and are built using [Apache Beam](https://beam.apache.org/), leveraging connectors like `ClickHouseIO` for seamless integration with ClickHouse databases. By running these templates on Google Dataflow, you can achieve highly scalable, distributed data processing with minimal effort.

## Why use Dataflow templates? 

- **Ease of Use**: Templates eliminate the need for coding by offering preconfigured pipelines tailored to specific use cases.
- **Scalability**: Dataflow ensures your pipeline scales efficiently, handling large volumes of data with distributed processing.
- **Cost Efficiency**: Pay only for the resources you consume, with the ability to optimize pipeline execution costs.

## How to run Dataflow templates 

As of today, the ClickHouse official template is available via the Google Cloud Console, CLI or Dataflow REST API.
For detailed step-by-step instructions, refer to the [Google Dataflow Run Pipeline From a Template Guide](https://cloud.google.com/dataflow/docs/templates/provided-templates).

## List of ClickHouse Templates 
* [BigQuery To ClickHouse](./templates/bigquery-to-clickhouse)
* [GCS To ClickHouse](https://github.com/ClickHouse/DataflowTemplates/issues/3) (coming soon!)
* [Pub Sub To ClickHouse](https://github.com/ClickHouse/DataflowTemplates/issues/4) (coming soon!)
