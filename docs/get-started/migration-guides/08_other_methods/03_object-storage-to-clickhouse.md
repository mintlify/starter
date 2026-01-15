---
title: 'Move data from cloud object storage to ClickHouse Cloud'
description: 'Moving data from object storage to ClickHouse Cloud'
keywords: ['object storage', 's3', 'azure blob', 'gcs', 'migration']
slug: /integrations/migration/object-storage-to-clickhouse
doc_type: 'guide'
---

<img src="/images/integrations/migration/object-storage-01.png" alt="Migrating Self-managed ClickHouse"/>

If you use a Cloud Object Storage as a data lake and wish to import this data into ClickHouse Cloud,
or if your current database system is able to directly offload data into a Cloud Object Storage, then you can use one of the
table functions for migrating data stored in Cloud Object Storage into a ClickHouse Cloud table:

- [s3](/sql-reference/table-functions/s3.md) or [s3Cluster](/sql-reference/table-functions/s3Cluster.md)
- [gcs](/sql-reference/table-functions/gcs)
- [azureBlobStorage](/sql-reference/table-functions/azureBlobStorage)

If your current database system is not able to directly offload data into a Cloud Object Storage, you could use a [third-party ETL/ELT tool](/cloud/migration/etl-tool-to-clickhouse) or [clickhouse-local](/cloud/migration/clickhouse-local) for moving data
from you current database system to Cloud Object Storage, in order to migrate that data in a second step into a ClickHouse Cloud table.

Although this is a two steps process (offload data into a Cloud Object Storage, then load into ClickHouse), the advantage is that this
scales to petabytes thanks to a [solid ClickHouse Cloud](https://clickhouse.com/blog/getting-data-into-clickhouse-part-3-s3) support of highly-parallel reads from Cloud Object Storage.
Also you can leverage sophisticated and compressed formats like [Parquet](/interfaces/formats/#data-format-parquet).

There is a [blog article](https://clickhouse.com/blog/getting-data-into-clickhouse-part-3-s3) with concrete code examples showing how you can get data into ClickHouse Cloud using S3.
