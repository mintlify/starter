---
sidebarTitle: 'Overview'
slug: /integrations/dbt
sidebar_position: 1
description: 'Users can transform and model their data in ClickHouse using dbt'
title: 'Integrating dbt and ClickHouse'
keywords: ['dbt', 'data transformation', 'analytics engineering', 'SQL modeling', 'ELT pipeline']
doc_type: 'guide'
integration:
  - support_level: 'core'
  - category: 'data_integration'
  - website: 'https://github.com/ClickHouse/dbt-clickhouse'
---

import ClickHouseSupportedBadge from '/snippets/components/ClickHouseSupported/ClickHouseSupported.jsx'

<ClickHouseSupportedBadge/>

## The dbt-clickhouse Adapter 
**dbt** (data build tool) enables analytics engineers to transform data in their warehouses by simply writing select statements. dbt handles materializing these select statements into objects in the database in the form of tables and views - performing the T of [Extract Load and Transform (ELT)](https://en.wikipedia.org/wiki/Extract,_load,_transform). Users can create a model defined by a SELECT statement.

Within dbt, these models can be cross-referenced and layered to allow the construction of higher-level concepts. The boilerplate SQL required to connect models is automatically generated. Furthermore, dbt identifies dependencies between models and ensures they are created in the appropriate order using a directed acyclic graph (DAG).

dbt is compatible with ClickHouse through a [ClickHouse-supported adapter](https://github.com/ClickHouse/dbt-clickhouse).

## Supported features 

List of supported features:
- [x] Table materialization
- [x] View materialization
- [x] Incremental materialization
- [x] Microbatch incremental materialization
- [x] Materialized View materializations (uses the `TO` form of MATERIALIZED VIEW, experimental)
- [x] Seeds
- [x] Sources
- [x] Docs generate
- [x] Tests
- [x] Snapshots
- [x] Most dbt-utils macros (now included in dbt-core)
- [x] Ephemeral materialization
- [x] Distributed table materialization (experimental)
- [x] Distributed incremental materialization (experimental)
- [x] Contracts
- [x] ClickHouse-specific column configurations (Codec, TTL...)
- [x] ClickHouse-specific table settings (indexes, projections...)

All features up to dbt-core 1.9 are supported. We will soon add the features added in dbt-core 1.10.

This adapter is still not available for use inside [dbt Cloud](https://docs.getdbt.com/docs/dbt-cloud/cloud-overview), but we expect to make it available soon. Please reach out to support to get more information on this.

## Concepts 

dbt introduces the concept of a model. This is defined as a SQL statement, potentially joining many tables. A model can be "materialized" in a number of ways. A materialization represents a build strategy for the model's select query. The code behind a materialization is boilerplate SQL that wraps your SELECT query in a statement in order to create a new or update an existing relation.

dbt provides 4 types of materialization:

* **view** (default): The model is built as a view in the database.
* **table**: The model is built as a table in the database.
* **ephemeral**: The model is not directly built in the database but is instead pulled into dependent models as common table expressions.
* **incremental**: The model is initially materialized as a table, and in subsequent runs, dbt inserts new rows and updates changed rows in the table.

Additional syntax and clauses define how these models should be updated if their underlying data changes. dbt generally recommends starting with the view materialization until performance becomes a concern. The table materialization provides a query time performance improvement by capturing the results of the model's query as a table at the expense of increased storage. The incremental approach builds on this further to allow subsequent updates to the underlying data to be captured in the target table.

The[ current adapter](https://github.com/silentsokolov/dbt-clickhouse) for ClickHouse supports also support **materialized view**, **dictionary**, **distributed table** and **distributed incremental** materializations. The adapter also supports dbt[ snapshots](https://docs.getdbt.com/docs/building-a-dbt-project/snapshots#check-strategy) and [seeds](https://docs.getdbt.com/docs/building-a-dbt-project/seeds).

### Details about supported materializations 

| Type                        | Supported? | Details                                                                                                                          |
|-----------------------------|------------|----------------------------------------------------------------------------------------------------------------------------------|
| view materialization        | YES        | Creates a [view](https://clickhouse.com/docs/en/sql-reference/table-functions/view/).                                            |
| table materialization       | YES        | Creates a [table](https://clickhouse.com/docs/en/operations/system-tables/tables/). See below for the list of supported engines. |
| incremental materialization | YES        | Creates a table if it doesn't exist, and then writes only updates to it.                                                         |
| ephemeral materialized      | YES        | Creates a ephemeral/CTE materialization.  This does model is internal to dbt and does not create any database objects            |

The following are [experimental features](https://clickhouse.com/docs/en/beta-and-experimental-features) in ClickHouse:

| Type                                    | Supported?        | Details                                                                                                                                                                                                                                         |
|-----------------------------------------|-------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Materialized View materialization       | YES, Experimental | Creates a [materialized view](https://clickhouse.com/docs/en/materialized-view).                                                                                                                                                                |
| Distributed table materialization       | YES, Experimental | Creates a [distributed table](https://clickhouse.com/docs/en/engines/table-engines/special/distributed).                                                                                                                                        |
| Distributed incremental materialization | YES, Experimental | Incremental model based on the same idea as distributed table. Note that not all strategies are supported, visit [this](https://github.com/ClickHouse/dbt-clickhouse?tab=readme-ov-file#distributed-incremental-materialization) for more info. |
| Dictionary materialization              | YES, Experimental | Creates a [dictionary](https://clickhouse.com/docs/en/engines/table-engines/special/dictionary).                                                                                                                                                |

## Setup of dbt and the ClickHouse adapter 

### Install dbt-core and dbt-clickhouse 

dbt provides several options for installing the command-line interface (CLI), which are detailed [here](https://docs.getdbt.com/dbt-cli/install/overview). We recommend using `pip` to install both dbt and dbt-clickhouse.

```sh
pip install dbt-core dbt-clickhouse
```

### Provide dbt with the connection details for our ClickHouse instance. 
Configure the `clickhouse-service` profile in the `~/.dbt/profiles.yml` file and provide the schema, host, port, user, and password properties. The full list of connection configuration options is available in the [Features and configurations](/integrations/dbt/features-and-configurations) page:
```yaml
clickhouse-service:
  target: dev
  outputs:
    dev:
      type: clickhouse
      schema: [ default ] # ClickHouse database for dbt models

      # Optional
      host: [ localhost ]
      port: [ 8123 ]  # Defaults to 8123, 8443, 9000, 9440 depending on the secure and driver settings 
      user: [ default ] # User for all database operations
      password: [ <empty string> ] # Password for the user
      secure: True  # Use TLS (native protocol) or HTTPS (http protocol)
```

### Create a dbt project 
You can now use this profile in one of your existing projects or create a new one using:

```sh
dbt init project_name
```

Inside `project_name` dir, update your `dbt_project.yml` file to specify a profile name to connect to the ClickHouse server.

```yaml
profile: 'clickhouse-service'
```

### Test connection 
Execute `dbt debug` with the CLI tool to confirm whether dbt is able to connect to ClickHouse. Confirm the response includes `Connection test: [OK connection ok]` indicating a successful connection.

Go to the [guides page](/integrations/dbt/guides) to learn more about how to use dbt with ClickHouse.

### Testing and Deploying your models (CI/CD) 

There are many ways to test and deploy your dbt project. dbt has some suggestions for [best practice workflows](https://docs.getdbt.com/best-practices/best-practice-workflows#pro-tips-for-workflows) and [CI jobs](https://docs.getdbt.com/docs/deploy/ci-jobs). We are going to discuss several strategies, but keep in mind that these strategies may need to be deeply adjusted to fit your specific use case.

#### CI/CD with simple data tests and unit tests 

One simple way to kick-start your CI pipeline is to run a ClickHouse cluster inside your job and then run your models against it. You can insert demo data into this cluster before running your models. You can just use a [seed](https://docs.getdbt.com/reference/commands/seed) to populate the staging environment with a subset of your production data.

Once the data is inserted, you can then run your [data tests](https://docs.getdbt.com/docs/build/data-tests) and your [unit tests](https://docs.getdbt.com/docs/build/unit-tests).

Your CD step can be as simple as running `dbt build` against your production ClickHouse cluster.

#### More complete CI/CD stage: Use recent data, only test affected models 

One common strategy is to use [Slim CI](https://docs.getdbt.com/best-practices/best-practice-workflows#run-only-modified-models-to-test-changes-slim-ci) jobs, where only the modified models (and their up- and downstream dependencies) are re-deployed. This approach uses artifacts from your production runs (i.e., the [dbt manifest](https://docs.getdbt.com/reference/artifacts/manifest-json)) to reduce the run time of your project and ensure there is no schema drift across environments.

To keep your development environments in sync and avoid running your models against stale deployments, you can use [clone](https://docs.getdbt.com/reference/commands/clone) or even [defer](https://docs.getdbt.com/reference/node-selection/defer).

We recommend using a dedicated ClickHouse cluster or service for the testing environment (i.e., a staging environment) to avoid impacting the operation of your production environment. To ensure the testing environment is representative, it's important that you use a subset of your production data, as well as run dbt in a way that prevents schema drift between environments.

- If you don't need fresh data to test against, you can restore a backup of your production data into the staging environment.
- If you need fresh data to test against, you can use a combination of the [`remoteSecure()` table function](/sql-reference/table-functions/remote) and refreshable materialized views to insert at the desired frequency. Another option is to use object storage as an intermediate and periodically write data from your production service, then import it into the staging environment using the object storage table functions or ClickPipes (for continuous ingestion).

Using a dedicated environment for CI testing also allows you to perform manual testing without impacting your production environment. For example, you may want to point a BI tool to this environment for testing.

For deployment (i.e., the CD step), we recommend using the artifacts from your production deployments to only update the models that have changed. This requires setting up object storage (e.g., S3) as intermediate storage for your dbt artifacts. Once that is set up, you can run a command like `dbt build --select state:modified+ --state path/to/last/deploy/state.json` to selectively rebuild the minimum amount of models needed based on what changed since the last run in production.

## Troubleshooting common issues 

### Connections 

If you encounter issues connecting to ClickHouse from dbt, make sure the following criteria are met:

- The engine must be one of the [supported engines](/integrations/dbt/features-and-configurations#supported-table-engines).
- You must have adequate permissions to access the database.
- If you're not using the default table engine for the database, you must specify a table engine in your model
  configuration.

### Understanding long-running operations 

Some operations may take longer than expected due to specific ClickHouse queries. To gain more insight into which queries are taking longer, increase the [log level](https://docs.getdbt.com/reference/global-configs/logs#log-level) to `debug` — this will print the time used by each query. For example, this can be achieved by appending `--log-level debug` to dbt commands.

## Limitations 

The current ClickHouse adapter for dbt has several limitations users should be aware of:

- The plugin uses syntax that requires ClickHouse version 25.3 or newer. We do not test older versions of Clickhouse. We also do not currently test Replicated tables.
- Different runs of the `dbt-adapter` may collide if they are run at the same time as internally they can use the same table names for the same operations. For more information, check the issue (https://github.com/ClickHouse/dbt-clickhouse/issues/420).
- The adapter currently materializes models as tables using an [INSERT INTO SELECT](https://clickhouse.com/docs/sql-reference/statements/insert-into#inserting-the-results-of-select). This effectively means data duplication if the run is executed again. Very large datasets (PB) can result in extremely long run times, making some models unviable. To improve performance, use ClickHouse Materialized Views by implementing the view as `materialized: materialization_view`. Additionally, aim to minimize the number of rows returned by any query by utilizing `GROUP BY` where possible. Prefer models that summarize data over those that simply transform while maintaining row counts of the source.
- To use Distributed tables to represent a model, users must create the underlying replicated tables on each node manually. The Distributed table can, in turn, be created on top of these. The adapter does not manage cluster creation.
- When dbt creates a relation (table/view) in a database, it usually creates it as: `{{ database }}.{{ schema }}.{{ table/view id }}`. ClickHouse has no notion of schemas. The adapter therefore uses `{{schema}}.{{ table/view id }}`, where `schema` is the ClickHouse database.
- Ephemeral models/CTEs don't work if placed before the `INSERT INTO` in a ClickHouse insert statement, see https://github.com/ClickHouse/ClickHouse/issues/30323. This should not affect most models, but care should be taken where an ephemeral model is placed in model definitions and other SQL statements. {/* {/* TODO review this limitation, looks like the issue was already closed and the fix was introduced in 24.10 */} */}

## Fivetran 

The `dbt-clickhouse` connector is also available for use in [Fivetran transformations](https://fivetran.com/docs/transformations/dbt), allowing seamless integration and transformation capabilities directly within the Fivetran platform using `dbt`.
