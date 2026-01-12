---
sidebarTitle: 'Ingesting data from Postgres to ClickHouse'
description: 'Seamlessly connect your Postgres to ClickHouse Cloud.'
slug: /integrations/clickpipes/postgres
title: 'Ingesting data from Postgres to ClickHouse (using CDC)'
keywords: ['PostgreSQL', 'ClickPipes', 'CDC', 'change data capture', 'database replication']
doc_type: 'guide'
integration:
  - support_level: 'core'
  - category: 'clickpipes'
---

import {BetaBadge} from '/snippets/components/BetaBadge/BetaBadge.jsx'

You can use ClickPipes to ingest data from your source Postgres database into ClickHouse Cloud. The source Postgres database can be hosted on-premises or in the cloud including Amazon RDS, Google Cloud SQL, Azure Database for Postgres, Supabase and others.

## Prerequisites 

To get started, you first need to make sure that your Postgres database is set up correctly. Depending on your source Postgres instance, you may follow any of the following guides:

<CardGroup cols={2}>
  <Card
    title="Amazon RDS Postgres"
    href="./postgres/source/rds"
  >
    Set up ClickPipes with Amazon RDS for PostgreSQL
  </Card>
  <Card
    title="Amazon Aurora Postgres"
    href="./postgres/source/aurora"
  >
    Set up ClickPipes with Amazon Aurora PostgreSQL
  </Card>
  <Card
    title="Supabase Postgres"
    href="./postgres/source/supabase"
  >
    Set up ClickPipes with Supabase PostgreSQL
  </Card>
  <Card
    title="Google Cloud SQL Postgres"
    href="./postgres/source/google-cloudsql"
  >
    Set up ClickPipes with Google Cloud SQL for PostgreSQL
  </Card>
  <Card
    title="Azure Flexible Server for Postgres"
    href="./postgres/source/azure-flexible-server-postgres"
  >
    Set up ClickPipes with Azure Flexible Server for PostgreSQL
  </Card>
  <Card
    title="Neon Postgres"
    href="./postgres/source/neon-postgres"
  >
    Set up ClickPipes with Neon PostgreSQL
  </Card>
  <Card
    title="Crunchy Bridge Postgres"
    href="./postgres/source/crunchy-postgres"
  >
    Set up ClickPipes with Crunchy Bridge PostgreSQL
  </Card>
  <Card
    title="TimescaleDB"
    href="./postgres/source/timescale"
  >
    Set up ClickPipes with TimescaleDB extension
  </Card>
  <Card
    title="Generic Postgres Source"
    href="./postgres/source/generic"
  >
    Set up ClickPipes with any other Postgres provider or self-hosted instance
  </Card>
</CardGroup>

<Warning>

Postgres Proxies like PgBouncer, RDS Proxy, Supabase Pooler, etc., are not supported for CDC based replication. Please make sure to NOT use them for the ClickPipes setup and instead add connection details of the actual Postgres database.

</Warning>

Once your source Postgres database is set up, you can continue creating your ClickPipe.

## Creating your ClickPipe 

Make sure you are logged in to your ClickHouse Cloud account. If you don't have an account yet, you can sign up [here](https://cloud.clickhouse.com/).

[//]: # (   TODO update image here)
1. In the ClickHouse Cloud console, navigate to your ClickHouse Cloud Service.

<img src="/images/integrations/data-ingestion/clickpipes/cp_service.png" alt="ClickPipes service"/>

2. Select the `Data Sources` button on the left-side menu and click on "Set up a ClickPipe"

<img src="/images/integrations/data-ingestion/clickpipes/cp_step0.png" alt="Select imports"/>

3. Select the `Postgres CDC` tile

   <img src="/images/integrations/data-ingestion/clickpipes/postgres/postgres-tile.png" alt="Select Postgres"/>

### Adding your source Postgres database connection 

4. Fill in the connection details for your source Postgres database which you configured in the prerequisites step.

   <Note>
   
   Before you start adding your connection details make sure that you have whitelisted ClickPipes IP addresses in your firewall rules. You can find the list of ClickPipes IP addresses [here](../index.md#list-of-static-ips).
   For more information refer to the source Postgres setup guides linked at [the top of this page](#prerequisites).
   
   </Note>

   <img src="/images/integrations/data-ingestion/clickpipes/postgres/postgres-connection-details.jpg" alt="Fill in connection details"/>

#### (Optional) Setting up AWS Private Link 

You can use AWS Private Link to connect to your source Postgres database if it is hosted on AWS. This is useful if you
want to keep your data transfer private.
You can follow the [setup guide to set up the connection](/integrations/clickpipes/aws-privatelink).

#### (Optional) Setting up SSH tunneling 

You can specify SSH tunneling details if your source Postgres database is not publicly accessible.

1. Enable the "Use SSH Tunnelling" toggle.
2. Fill in the SSH connection details.

   <img src="/images/integrations/data-ingestion/clickpipes/postgres/ssh-tunnel.jpg" alt="SSH tunneling"/>

3. To use Key-based authentication, click on "Revoke and generate key pair" to generate a new key pair and copy the generated public key to your SSH server under `~/.ssh/authorized_keys`.
4. Click on "Verify Connection" to verify the connection.

<Note>

Make sure to whitelist [ClickPipes IP addresses](../clickpipes#list-of-static-ips) in your firewall rules for the SSH bastion host so that ClickPipes can establish the SSH tunnel.

</Note>

Once the connection details are filled in, click on "Next".

### Configuring the replication settings 

5. Make sure to select the replication slot from the dropdown list you created in the prerequisites step.

   <img src="/images/integrations/data-ingestion/clickpipes/postgres/select-replication-slot.jpg" alt="Select replication slot"/>

#### Advanced settings 

You can configure the Advanced settings if needed. A brief description of each setting is provided below:

- **Sync interval**: This is the interval at which ClickPipes will poll the source database for changes. This has implication on the destination ClickHouse service, for cost-sensitive users we recommend to keep this at a higher value (over `3600`).
- **Parallel threads for initial load**: This is the number of parallel workers that will be used to fetch the initial snapshot. This is useful when you have a large number of tables and you want to control the number of parallel workers used to fetch the initial snapshot. This setting is per-table.
- **Pull batch size**: The number of rows to fetch in a single batch. This is a best effort setting and may not be respected in all cases.
- **Snapshot number of rows per partition**: This is the number of rows that will be fetched in each partition during the initial snapshot. This is useful when you have a large number of rows in your tables and you want to control the number of rows fetched in each partition.
- **Snapshot number of tables in parallel**: This is the number of tables that will be fetched in parallel during the initial snapshot. This is useful when you have a large number of tables and you want to control the number of tables fetched in parallel.

### Configuring the tables 

6. Here you can select the destination database for your ClickPipe. You can either select an existing database or create a new one.

   <img src="/images/integrations/data-ingestion/clickpipes/postgres/select-destination-db.jpg" alt="Select destination database"/>

7. You can select the tables you want to replicate from the source Postgres database. While selecting the tables, you can also choose to rename the tables in the destination ClickHouse database as well as exclude specific columns.

   <Warning>
   If you are defining an ordering key in ClickHouse differently than from the primary key in Postgres, don't forget to read all the [considerations](/integrations/clickpipes/postgres/ordering_keys) around it
   </Warning>

### Review permissions and start the ClickPipe 

8. Select the "Full access" role from the permissions dropdown and click "Complete Setup".

   <img src="/images/integrations/data-ingestion/clickpipes/postgres/ch-permissions.jpg" alt="Review permissions"/>

## What's next? 

Once you've set up your ClickPipe to replicate data from PostgreSQL to ClickHouse Cloud, you can focus on how to query and model your data for optimal performance. See the [migration guide](/migrations/postgresql/overview) to assess which strategy best suits your requirements, as well as the [Deduplication strategies (using CDC)](/integrations/clickpipes/postgres/deduplication) and [Ordering Keys](/integrations/clickpipes/postgres/ordering_keys) pages for best practices on CDC workloads.

For common questions around PostgreSQL CDC and troubleshooting, see the [Postgres FAQs page](/integrations/clickpipes/postgres/faq).
