---
sidebarTitle: 'FAQ'
description: 'Frequently asked questions about ClickPipes for MySQL.'
slug: /integrations/clickpipes/mysql/faq
sidebar_position: 2
title: 'ClickPipes for MySQL FAQ'
doc_type: 'reference'
keywords: ['MySQL ClickPipes FAQ', 'ClickPipes MySQL troubleshooting', 'MySQL ClickHouse replication', 'ClickPipes MySQL support', 'MySQL CDC ClickHouse']
---

### Does the MySQL ClickPipe support MariaDB?  
Yes, the MySQL ClickPipe supports MariaDB 10.0 and above. The configuration for it is very similar to MySQL, using GTID replication by default.

### Does the MySQL ClickPipe support PlanetScale, Vitess, or TiDB? 
No, these do not support MySQL's binlog API.

### How is replication managed? 
We support both `GTID` & `FilePos` replication. Unlike Postgres there is no slot to manage offset. Instead, you must configure your MySQL server to have a sufficient binlog retention period. If our offset into the binlog becomes invalidated *(eg, mirror paused too long, or database failover occurs while using `FilePos` replication)* then you will need to resync the pipe. Make sure to optimize materialized views depending on destination tables, as inefficient queries can slow down ingestion to fall behind the retention period.

It's also possible for an inactive database to rotate the log file without allowing ClickPipes to progress to a more recent offset. You may need to setup a heartbeat table with regularly scheduled updates.

At the start of an initial load we record the binlog offset to start at. This offset must still be valid when the initial load finishes in order for CDC to progress. If you are ingesting a large amount of data be sure to configure an appropriate binlog retention period. While setting up tables you can speed up initial load by configuring *Use a custom partitioning key for initial load* for large tables under advanced settings so that we can load a single table in parallel.

### Why am I getting a TLS certificate validation error when connecting to MySQL? 

When connecting to MySQL, you may encounter certificate errors like `x509: certificate is not valid for any names` or `x509: certificate signed by unknown authority`. These occur because ClickPipes enables TLS encryption by default.

You have several options to resolve these issues:

1. **Set the TLS Host field** - When the hostname in your connection differs from the certificate (common with AWS PrivateLink via Endpoint Service). Set "TLS Host (optional)" to match the certificate's Common Name (CN) or Subject Alternative Name (SAN).

2. **Upload your Root CA** - For MySQL servers using internal Certificate Authorities or Google Cloud SQL in the default per-instance CA configuration. For more information on how to access Google Cloud SQL certificates, see [this section](https://clickhouse.com/docs/integrations/clickpipes/mysql/source/gcp#download-root-ca-certificate-gcp-mysql).

3. **Configure server certificate** - Update your server's SSL certificate to include all connection hostnames and use a trusted Certificate Authority.

4. **Skip certificate verification** - For self-hosted MySQL or MariaDB, whose default configurations provision a self-signed certificate we can't validate ([MySQL](https://dev.mysql.com/doc/refman/8.4/en/creating-ssl-rsa-files-using-mysql.html#creating-ssl-rsa-files-using-mysql-automatic), [MariaDB](https://mariadb.com/kb/en/securing-connections-for-client-and-server/#enabling-tls-for-mariadb-server)). Relying on this certificate encrypts the data in transit but runs the risk of server impersonation. We recommend properly signed certificates for production environments, but this option is useful for testing on a one-off instance or connecting to legacy infrastructure.

### Do you support schema changes? 

Please refer to the [ClickPipes for MySQL: Schema Changes Propagation Support](./schema-changes) page for more information.

### Do you support replicating MySQL foreign key cascading deletes `ON DELETE CASCADE`? 

Due to how MySQL [handles cascading deletes](https://dev.mysql.com/doc/refman/8.0/en/innodb-and-mysql-replication.html), they are not written to the binlog. Therefore it's not possible for ClickPipes (or any CDC tool) to replicate them. This can lead to inconsistent data. It's advised to use triggers instead for supporting cascading deletes.

### Why can I not replicate my table which has a dot in it? 
PeerDB has a limitation currently where dots in source table identifiers - aka either schema name or table name - is not supported for replication as PeerDB cannot discern, in that case, what is the schema and what is the table as it splits on dot.
Effort is being made to support input of schema and table separately to get around this limitation.