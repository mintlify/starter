---
sidebarTitle: 'Java Runner'
slug: /integrations/google-dataflow/java-runner
sidebar_position: 2
description: 'Users can ingest data into ClickHouse using Google Dataflow Java Runner'
title: 'Dataflow Java Runner'
doc_type: 'guide'
keywords: ['Dataflow Java Runner', 'Google Dataflow ClickHouse', 'Apache Beam Java ClickHouse', 'ClickHouseIO connector']
---

import ClickHouseSupportedBadge from '/snippets/components/ClickHouseSupported/ClickHouseSupported.jsx'

<ClickHouseSupportedBadge/>

The Dataflow Java Runner lets you execute custom Apache Beam pipelines on Google Cloud's Dataflow service. This approach provides maximum flexibility and is well-suited for advanced ETL workflows.

## How it works 

1. **Pipeline Implementation**
   To use the Java Runner, you need to implement your Beam pipeline using the `ClickHouseIO` - our official Apache Beam connector. For code examples and instructions on how to use the `ClickHouseIO`, please visit [ClickHouse Apache Beam](/integrations/apache-beam).

2. **Deployment**
   Once your pipeline is implemented and configured, you can deploy it to Dataflow using Google Cloud's deployment tools. Comprehensive deployment instructions are provided in the [Google Cloud Dataflow documentation - Java Pipeline](https://cloud.google.com/dataflow/docs/quickstarts/create-pipeline-java).

**Note**: This approach assumes familiarity with the Beam framework and coding expertise. If you prefer a no-code solution, consider using [ClickHouse's predefined templates](./templates).
