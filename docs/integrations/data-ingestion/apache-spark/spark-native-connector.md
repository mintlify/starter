---
sidebarTitle: 'Spark Native Connector'
sidebar_position: 2
slug: /integrations/apache-spark/spark-native-connector
description: 'Introduction to Apache Spark with ClickHouse'
keywords: ['clickhouse', 'Apache Spark', 'migrating', 'data']
title: 'Spark Connector'
doc_type: 'guide'
---

This connector leverages ClickHouse-specific optimizations, such as advanced partitioning and predicate pushdown, to
improve query performance and data handling.
The connector is based on [ClickHouse's official JDBC connector](https://github.com/ClickHouse/clickhouse-java), and
manages its own catalog.

Before Spark 3.0, Spark lacked a built-in catalog concept, so users typically relied on external catalog systems such as
Hive Metastore or AWS Glue.
With these external solutions, users had to register their data source tables manually before accessing them in Spark.
However, since Spark 3.0 introduced the catalog concept, Spark can now automatically discover tables by registering
catalog plugins.

Spark's default catalog is `spark_catalog`, and tables are identified by `{catalog name}.{database}.{table}`. With the new
catalog feature, it is now possible to add and work with multiple catalogs in a single Spark application.

## Requirements 

- Java 8 or 17
- Scala 2.12 or 2.13
- Apache Spark 3.3 or 3.4 or 3.5

## Compatibility matrix 

| Version | Compatible Spark Versions | ClickHouse JDBC version |
|---------|---------------------------|-------------------------|
| main    | Spark 3.3, 3.4, 3.5       | 0.6.3                   |
| 0.8.1   | Spark 3.3, 3.4, 3.5       | 0.6.3                   |
| 0.8.0   | Spark 3.3, 3.4, 3.5       | 0.6.3                   |
| 0.7.3   | Spark 3.3, 3.4            | 0.4.6                   |
| 0.6.0   | Spark 3.3                 | 0.3.2-patch11           |
| 0.5.0   | Spark 3.2, 3.3            | 0.3.2-patch11           |
| 0.4.0   | Spark 3.2, 3.3            | Not depend on           |
| 0.3.0   | Spark 3.2, 3.3            | Not depend on           |
| 0.2.1   | Spark 3.2                 | Not depend on           |
| 0.1.2   | Spark 3.2                 | Not depend on           |

## Installation & setup 

For integrating ClickHouse with Spark, there are multiple installation options to suit different project setups.
You can add the ClickHouse Spark connector as a dependency directly in your project's build file (such as in `pom.xml`
for Maven or `build.sbt` for SBT).
Alternatively, you can put the required JAR files in your `$SPARK_HOME/jars/` folder, or pass them directly as a Spark
option using the `--jars` flag in the `spark-submit` command.
Both approaches ensure the ClickHouse connector is available in your Spark environment.

### Import as a Dependency 


<Tabs>
<Tab title="Maven">

```maven
<dependency>
  <groupId>com.clickhouse.spark</groupId>
  <artifactId>clickhouse-spark-runtime-{{ spark_binary_version }}_{{ scala_binary_version }}</artifactId>
  <version>{{ stable_version }}</version>
</dependency>
<dependency>
  <groupId>com.clickhouse</groupId>
  <artifactId>clickhouse-jdbc</artifactId>
  <classifier>all</classifier>
  <version>{{ clickhouse_jdbc_version }}</version>
  <exclusions>
    <exclusion>
      <groupId>*</groupId>
      <artifactId>*</artifactId>
    </exclusion>
  </exclusions>
</dependency>
```

Add the following repository if you want to use SNAPSHOT version.

```maven
<repositories>
  <repository>
    <id>sonatype-oss-snapshots</id>
    <name>Sonatype OSS Snapshots Repository</name>
    <url>https://s01.oss.sonatype.org/content/repositories/snapshots</url>
  </repository>
</repositories>
```

</Tab>
<Tab title="Gradle">

```gradle
dependencies {
  implementation("com.clickhouse.spark:clickhouse-spark-runtime-{{ spark_binary_version }}_{{ scala_binary_version }}:{{ stable_version }}")
  implementation("com.clickhouse:clickhouse-jdbc:{{ clickhouse_jdbc_version }}:all") { transitive = false }
}
```

Add the following repository if you want to use the SNAPSHOT version:

```gradle
repositries {
  maven { url = "https://s01.oss.sonatype.org/content/repositories/snapshots" }
}
```

</Tab>
<Tab title="SBT">

```sbt
libraryDependencies += "com.clickhouse" % "clickhouse-jdbc" % {{ clickhouse_jdbc_version }} classifier "all"
libraryDependencies += "com.clickhouse.spark" %% clickhouse-spark-runtime-{{ spark_binary_version }}_{{ scala_binary_version }} % {{ stable_version }}
```

</Tab>
<Tab title="Spark SQL/Shell CLI">

When working with Spark's shell options (Spark SQL CLI, Spark Shell CLI, and Spark Submit command), the dependencies can be
registered by passing the required jars:

```text
$SPARK_HOME/bin/spark-sql \
  --jars /path/clickhouse-spark-runtime-{{ spark_binary_version }}_{{ scala_binary_version }}:{{ stable_version }}.jar,/path/clickhouse-jdbc-{{ clickhouse_jdbc_version }}-all.jar
```

If you want to avoid copying the JAR files to your Spark client node, you can use the following instead:

```text
  --repositories https://{maven-central-mirror or private-nexus-repo} \
  --packages com.clickhouse.spark:clickhouse-spark-runtime-{{ spark_binary_version }}_{{ scala_binary_version }}:{{ stable_version }},com.clickhouse:clickhouse-jdbc:{{ clickhouse_jdbc_version }}
```

Note: For SQL-only use cases, [Apache Kyuubi](https://github.com/apache/kyuubi) is recommended
for production.

</Tab>
</Tabs>

### Download the library 

The name pattern of the binary JAR is:

```bash
clickhouse-spark-runtime-${spark_binary_version}_${scala_binary_version}-${version}.jar
```

You can find all available released JAR files
in the [Maven Central Repository](https://repo1.maven.org/maven2/com/clickhouse/spark/)
and all daily build SNAPSHOT JAR files in the [Sonatype OSS Snapshots Repository](https://s01.oss.sonatype.org/content/repositories/snapshots/com/clickhouse/).

:::important
It's essential to include the [clickhouse-jdbc JAR](https://mvnrepository.com/artifact/com.clickhouse/clickhouse-jdbc)
with the "all" classifier,
as the connector relies on [clickhouse-http](https://mvnrepository.com/artifact/com.clickhouse/clickhouse-http-client)
and [clickhouse-client](https://mvnrepository.com/artifact/com.clickhouse/clickhouse-client) — both of which are bundled
in clickhouse-jdbc:all.
Alternatively, you can add [clickhouse-client JAR](https://mvnrepository.com/artifact/com.clickhouse/clickhouse-client)
and [clickhouse-http](https://mvnrepository.com/artifact/com.clickhouse/clickhouse-http-client) individually if you
prefer not to use the full JDBC package.

In any case, ensure that the package versions are compatible according to
the [Compatibility Matrix](#compatibility-matrix).
:::

## Register the catalog (required) 

In order to access your ClickHouse tables, you must configure a new Spark catalog with the following configs:

| Property                                     | Value                                    | Default Value  | Required |
|----------------------------------------------|------------------------------------------|----------------|----------|
| `spark.sql.catalog.<catalog_name>`           | `com.clickhouse.spark.ClickHouseCatalog` | N/A            | Yes      |
| `spark.sql.catalog.<catalog_name>.host`      | `<clickhouse_host>`                      | `localhost`    | No       |
| `spark.sql.catalog.<catalog_name>.protocol`  | `http`                                   | `http`         | No       |
| `spark.sql.catalog.<catalog_name>.http_port` | `<clickhouse_port>`                      | `8123`         | No       |
| `spark.sql.catalog.<catalog_name>.user`      | `<clickhouse_username>`                  | `default`      | No       |
| `spark.sql.catalog.<catalog_name>.password`  | `<clickhouse_password>`                  | (empty string) | No       |
| `spark.sql.catalog.<catalog_name>.database`  | `<database>`                             | `default`      | No       |
| `spark.<catalog_name>.write.format`          | `json`                                   | `arrow`        | No       |

These settings could be set via one of the following:

* Edit/Create `spark-defaults.conf`.
* Pass the configuration to your `spark-submit` command (or to your `spark-shell`/`spark-sql` CLI commands).
* Add the configuration when initiating your context.

:::important
When working with a ClickHouse cluster, you need to set a unique catalog name for each instance.
For example:

```text
spark.sql.catalog.clickhouse1                com.clickhouse.spark.ClickHouseCatalog
spark.sql.catalog.clickhouse1.host           10.0.0.1
spark.sql.catalog.clickhouse1.protocol       https
spark.sql.catalog.clickhouse1.http_port      8443
spark.sql.catalog.clickhouse1.user           default
spark.sql.catalog.clickhouse1.password
spark.sql.catalog.clickhouse1.database       default
spark.sql.catalog.clickhouse1.option.ssl     true

spark.sql.catalog.clickhouse2                com.clickhouse.spark.ClickHouseCatalog
spark.sql.catalog.clickhouse2.host           10.0.0.2
spark.sql.catalog.clickhouse2.protocol       https
spark.sql.catalog.clickhouse2.http_port      8443
spark.sql.catalog.clickhouse2.user           default
spark.sql.catalog.clickhouse2.password
spark.sql.catalog.clickhouse2.database       default
spark.sql.catalog.clickhouse2.option.ssl     true
```

That way, you would be able to access clickhouse1 table `<ck_db>.<ck_table>` from Spark SQL by
`clickhouse1.<ck_db>.<ck_table>`, and access clickhouse2 table `<ck_db>.<ck_table>` by `clickhouse2.<ck_db>.<ck_table>`.

:::

## ClickHouse Cloud settings 

When connecting to [ClickHouse Cloud](https://clickhouse.com), make sure to enable SSL and set the appropriate SSL mode. For example:

```text
spark.sql.catalog.clickhouse.option.ssl        true
spark.sql.catalog.clickhouse.option.ssl_mode   NONE
```

## Read data 


<Tabs>
<Tab title="Java">

```java
public static void main(String[] args) {
        // Create a Spark session
        SparkSession spark = SparkSession.builder()
                .appName("example")
                .master("local[*]")
                .config("spark.sql.catalog.clickhouse", "com.clickhouse.spark.ClickHouseCatalog")
                .config("spark.sql.catalog.clickhouse.host", "127.0.0.1")
                .config("spark.sql.catalog.clickhouse.protocol", "http")
                .config("spark.sql.catalog.clickhouse.http_port", "8123")
                .config("spark.sql.catalog.clickhouse.user", "default")
                .config("spark.sql.catalog.clickhouse.password", "123456")
                .config("spark.sql.catalog.clickhouse.database", "default")
                .config("spark.clickhouse.write.format", "json")
                .getOrCreate();

        Dataset<Row> df = spark.sql("select * from clickhouse.default.example_table");

        df.show();

        spark.stop();
    }
```

</Tab>
<Tab title="Scala">

```java
object NativeSparkRead extends App {
  val spark = SparkSession.builder
    .appName("example")
    .master("local[*]")
    .config("spark.sql.catalog.clickhouse", "com.clickhouse.spark.ClickHouseCatalog")
    .config("spark.sql.catalog.clickhouse.host", "127.0.0.1")
    .config("spark.sql.catalog.clickhouse.protocol", "http")
    .config("spark.sql.catalog.clickhouse.http_port", "8123")
    .config("spark.sql.catalog.clickhouse.user", "default")
    .config("spark.sql.catalog.clickhouse.password", "123456")
    .config("spark.sql.catalog.clickhouse.database", "default")
    .config("spark.clickhouse.write.format", "json")
    .getOrCreate

  val df = spark.sql("select * from clickhouse.default.example_table")

  df.show()

  spark.stop()
}
```

</Tab>
<Tab title="Python">

```python
from pyspark.sql import SparkSession

packages = [
    "com.clickhouse.spark:clickhouse-spark-runtime-3.4_2.12:0.8.0",
    "com.clickhouse:clickhouse-client:0.7.0",
    "com.clickhouse:clickhouse-http-client:0.7.0",
    "org.apache.httpcomponents.client5:httpclient5:5.2.1"

]

spark = (SparkSession.builder
         .config("spark.jars.packages", ",".join(packages))
         .getOrCreate())

spark.conf.set("spark.sql.catalog.clickhouse", "com.clickhouse.spark.ClickHouseCatalog")
spark.conf.set("spark.sql.catalog.clickhouse.host", "127.0.0.1")
spark.conf.set("spark.sql.catalog.clickhouse.protocol", "http")
spark.conf.set("spark.sql.catalog.clickhouse.http_port", "8123")
spark.conf.set("spark.sql.catalog.clickhouse.user", "default")
spark.conf.set("spark.sql.catalog.clickhouse.password", "123456")
spark.conf.set("spark.sql.catalog.clickhouse.database", "default")
spark.conf.set("spark.clickhouse.write.format", "json")

df = spark.sql("select * from clickhouse.default.example_table")
df.show()

```

</Tab>
<Tab title="Spark SQL">

```sql
   CREATE TEMPORARY VIEW jdbcTable
           USING org.apache.spark.sql.jdbc
           OPTIONS (
                   url "jdbc:ch://localhost:8123/default", 
                   dbtable "schema.tablename",
                   user "username",
                   password "password",
                   driver "com.clickhouse.jdbc.ClickHouseDriver" 
           );
           
   SELECT * FROM jdbcTable;
```

</Tab>
</Tabs>

## Write data 


<Tabs>
<Tab title="Java">

```java
 public static void main(String[] args) throws AnalysisException {

        // Create a Spark session
        SparkSession spark = SparkSession.builder()
                .appName("example")
                .master("local[*]")
                .config("spark.sql.catalog.clickhouse", "com.clickhouse.spark.ClickHouseCatalog")
                .config("spark.sql.catalog.clickhouse.host", "127.0.0.1")
                .config("spark.sql.catalog.clickhouse.protocol", "http")
                .config("spark.sql.catalog.clickhouse.http_port", "8123")
                .config("spark.sql.catalog.clickhouse.user", "default")
                .config("spark.sql.catalog.clickhouse.password", "123456")
                .config("spark.sql.catalog.clickhouse.database", "default")
                .config("spark.clickhouse.write.format", "json")
                .getOrCreate();

        // Define the schema for the DataFrame
        StructType schema = new StructType(new StructField[]{
                DataTypes.createStructField("id", DataTypes.IntegerType, false),
                DataTypes.createStructField("name", DataTypes.StringType, false),
        });

        List<Row> data = Arrays.asList(
                RowFactory.create(1, "Alice"),
                RowFactory.create(2, "Bob")
        );

        // Create a DataFrame
        Dataset<Row> df = spark.createDataFrame(data, schema);

        df.writeTo("clickhouse.default.example_table").append();

        spark.stop();
    }
```

</Tab>
<Tab title="Scala">

```java
object NativeSparkWrite extends App {
  // Create a Spark session
  val spark: SparkSession = SparkSession.builder
    .appName("example")
    .master("local[*]")
    .config("spark.sql.catalog.clickhouse", "com.clickhouse.spark.ClickHouseCatalog")
    .config("spark.sql.catalog.clickhouse.host", "127.0.0.1")
    .config("spark.sql.catalog.clickhouse.protocol", "http")
    .config("spark.sql.catalog.clickhouse.http_port", "8123")
    .config("spark.sql.catalog.clickhouse.user", "default")
    .config("spark.sql.catalog.clickhouse.password", "123456")
    .config("spark.sql.catalog.clickhouse.database", "default")
    .config("spark.clickhouse.write.format", "json")
    .getOrCreate

  // Define the schema for the DataFrame
  val rows = Seq(Row(1, "John"), Row(2, "Doe"))

  val schema = List(
    StructField("id", DataTypes.IntegerType, nullable = false),
    StructField("name", StringType, nullable = true)
  )
  // Create the df
  val df: DataFrame = spark.createDataFrame(
    spark.sparkContext.parallelize(rows),
    StructType(schema)
  )

  df.writeTo("clickhouse.default.example_table").append()

  spark.stop()
}
```

</Tab>
<Tab title="Python">

```python
from pyspark.sql import SparkSession
from pyspark.sql import Row

# Feel free to use any other packages combination satesfying the compatibility matrix provided above.
packages = [
    "com.clickhouse.spark:clickhouse-spark-runtime-3.4_2.12:0.8.0",
    "com.clickhouse:clickhouse-client:0.7.0",
    "com.clickhouse:clickhouse-http-client:0.7.0",
    "org.apache.httpcomponents.client5:httpclient5:5.2.1"

]

spark = (SparkSession.builder
         .config("spark.jars.packages", ",".join(packages))
         .getOrCreate())

spark.conf.set("spark.sql.catalog.clickhouse", "com.clickhouse.spark.ClickHouseCatalog")
spark.conf.set("spark.sql.catalog.clickhouse.host", "127.0.0.1")
spark.conf.set("spark.sql.catalog.clickhouse.protocol", "http")
spark.conf.set("spark.sql.catalog.clickhouse.http_port", "8123")
spark.conf.set("spark.sql.catalog.clickhouse.user", "default")
spark.conf.set("spark.sql.catalog.clickhouse.password", "123456")
spark.conf.set("spark.sql.catalog.clickhouse.database", "default")
spark.conf.set("spark.clickhouse.write.format", "json")

# Create DataFrame
data = [Row(id=11, name="John"), Row(id=12, name="Doe")]
df = spark.createDataFrame(data)

# Write DataFrame to ClickHouse
df.writeTo("clickhouse.default.example_table").append()

```

</Tab>
<Tab title="Spark SQL">

```sql
    -- resultTable is the Spark intermediate df we want to insert into clickhouse.default.example_table
   INSERT INTO TABLE clickhouse.default.example_table
                SELECT * FROM resultTable;
                
```

</Tab>
</Tabs>

## DDL operations 

You can perform DDL operations on your ClickHouse instance using Spark SQL, with all changes immediately persisted in
ClickHouse.
Spark SQL allows you to write queries exactly as you would in ClickHouse,
so you can directly execute commands such as CREATE TABLE, TRUNCATE, and more - without modification, for instance:

<Note>
When using Spark SQL, only one statement can be executed at a time.
</Note>

```sql
USE clickhouse; 
```

```sql

CREATE TABLE test_db.tbl_sql (
  create_time TIMESTAMP NOT NULL,
  m           INT       NOT NULL COMMENT 'part key',
  id          BIGINT    NOT NULL COMMENT 'sort key',
  value       STRING
) USING ClickHouse
PARTITIONED BY (m)
TBLPROPERTIES (
  engine = 'MergeTree()',
  order_by = 'id',
  settings.index_granularity = 8192
);
```

The above examples demonstrate Spark SQL queries, which you can run within your application using any API—Java, Scala,
PySpark, or shell.

## Configurations 

The following are the adjustable configurations available in the connector:

<br/>

| Key                                                | Default                                                | Description                                                                                                                                                                                                                                                                                                                                                                                                     | Since |
|----------------------------------------------------|--------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| spark.clickhouse.ignoreUnsupportedTransform        | false                                                  | ClickHouse supports using complex expressions as sharding keys or partition values, e.g. `cityHash64(col_1, col_2)`, which are currently not supported by Spark. If `true`, ignore the unsupported expressions, otherwise fail fast w/ an exception. Note, when `spark.clickhouse.write.distributed.convertLocal` is enabled, ignore unsupported sharding keys may corrupt the data.                            | 0.4.0 |
| spark.clickhouse.read.compression.codec            | lz4                                                    | The codec used to decompress data for reading. Supported codecs: none, lz4.                                                                                                                                                                                                                                                                                                                                     | 0.5.0 |
| spark.clickhouse.read.distributed.convertLocal     | true                                                   | When reading Distributed table, read local table instead of itself. If `true`, ignore `spark.clickhouse.read.distributed.useClusterNodes`.                                                                                                                                                                                                                                                                      | 0.1.0 |
| spark.clickhouse.read.fixedStringAs                | binary                                                 | Read ClickHouse FixedString type as the specified Spark data type. Supported types: binary, string                                                                                                                                                                                                                                                                                                              | 0.8.0 |
| spark.clickhouse.read.format                       | json                                                   | Serialize format for reading. Supported formats: json, binary                                                                                                                                                                                                                                                                                                                                                   | 0.6.0 |
| spark.clickhouse.read.runtimeFilter.enabled        | false                                                  | Enable runtime filter for reading.                                                                                                                                                                                                                                                                                                                                                                              | 0.8.0 |
| spark.clickhouse.read.splitByPartitionId           | true                                                   | If `true`, construct input partition filter by virtual column `_partition_id`, instead of partition value. There are known issues with assembling SQL predicates by partition value. This feature requires ClickHouse Server v21.6+                                                                                                                                                                             | 0.4.0 |
| spark.clickhouse.useNullableQuerySchema            | false                                                  | If `true`, mark all the fields of the query schema as nullable when executing `CREATE/REPLACE TABLE ... AS SELECT ...` on creating the table. Note, this configuration requires SPARK-43390(available in Spark 3.5), w/o this patch, it always acts as `true`.                                                                                                                                                  | 0.8.0 |
| spark.clickhouse.write.batchSize                   | 10000                                                  | The number of records per batch on writing to ClickHouse.                                                                                                                                                                                                                                                                                                                                                       | 0.1.0 |
| spark.clickhouse.write.compression.codec           | lz4                                                    | The codec used to compress data for writing. Supported codecs: none, lz4.                                                                                                                                                                                                                                                                                                                                       | 0.3.0 |
| spark.clickhouse.write.distributed.convertLocal    | false                                                  | When writing Distributed table, write local table instead of itself. If `true`, ignore `spark.clickhouse.write.distributed.useClusterNodes`.                                                                                                                                                                                                                                                                    | 0.1.0 |
| spark.clickhouse.write.distributed.useClusterNodes | true                                                   | Write to all nodes of cluster when writing Distributed table.                                                                                                                                                                                                                                                                                                                                                   | 0.1.0 |
| spark.clickhouse.write.format                      | arrow                                                  | Serialize format for writing. Supported formats: json, arrow                                                                                                                                                                                                                                                                                                                                                    | 0.4.0 |
| spark.clickhouse.write.localSortByKey              | true                                                   | If `true`, do local sort by sort keys before writing.                                                                                                                                                                                                                                                                                                                                                           | 0.3.0 |
| spark.clickhouse.write.localSortByPartition        | value of spark.clickhouse.write.repartitionByPartition | If `true`, do local sort by partition before writing. If not set, it equals to `spark.clickhouse.write.repartitionByPartition`.                                                                                                                                                                                                                                                                                 | 0.3.0 |
| spark.clickhouse.write.maxRetry                    | 3                                                      | The maximum number of write we will retry for a single batch write failed with retryable codes.                                                                                                                                                                                                                                                                                                                 | 0.1.0 |
| spark.clickhouse.write.repartitionByPartition      | true                                                   | Whether to repartition data by ClickHouse partition keys to meet the distributions of ClickHouse table before writing.                                                                                                                                                                                                                                                                                          | 0.3.0 |
| spark.clickhouse.write.repartitionNum              | 0                                                      | Repartition data to meet the distributions of ClickHouse table is required before writing, use this conf to specific the repartition number, value less than 1 mean no requirement.                                                                                                                                                                                                                             | 0.1.0 |
| spark.clickhouse.write.repartitionStrictly         | false                                                  | If `true`, Spark will strictly distribute incoming records across partitions to satisfy the required distribution before passing the records to the data source table on write. Otherwise, Spark may apply certain optimizations to speed up the query but break the distribution requirement. Note, this configuration requires SPARK-37523(available in Spark 3.4), w/o this patch, it always acts as `true`. | 0.3.0 |
| spark.clickhouse.write.retryInterval               | 10s                                                    | The interval in seconds between write retry.                                                                                                                                                                                                                                                                                                                                                                    | 0.1.0 |
| spark.clickhouse.write.retryableErrorCodes         | 241                                                    | The retryable error codes returned by ClickHouse server when write failing.                                                                                                                                                                                                                                                                                                                                     | 0.1.0 |

## Supported data types 

This section outlines the mapping of data types between Spark and ClickHouse. The tables below provide quick references
for converting data types when reading from ClickHouse into Spark and when inserting data from Spark into ClickHouse.

### Reading data from ClickHouse into Spark 

| ClickHouse Data Type                                              | Spark Data Type                | Supported | Is Primitive | Notes                                              |
|-------------------------------------------------------------------|--------------------------------|-----------|--------------|----------------------------------------------------|
| `Nothing`                                                         | `NullType`                     | ✅         | Yes          |                                                    |
| `Bool`                                                            | `BooleanType`                  | ✅         | Yes          |                                                    |
| `UInt8`, `Int16`                                                  | `ShortType`                    | ✅         | Yes          |                                                    |
| `Int8`                                                            | `ByteType`                     | ✅         | Yes          |                                                    |
| `UInt16`,`Int32`                                                  | `IntegerType`                  | ✅         | Yes          |                                                    |
| `UInt32`,`Int64`, `UInt64`                                        | `LongType`                     | ✅         | Yes          |                                                    |
| `Int128`,`UInt128`, `Int256`, `UInt256`                           | `DecimalType(38, 0)`           | ✅         | Yes          |                                                    |
| `Float32`                                                         | `FloatType`                    | ✅         | Yes          |                                                    |
| `Float64`                                                         | `DoubleType`                   | ✅         | Yes          |                                                    |
| `String`, `JSON`, `UUID`, `Enum8`, `Enum16`, `IPv4`, `IPv6`       | `StringType`                   | ✅         | Yes          |                                                    |
| `FixedString`                                                     | `BinaryType`, `StringType`     | ✅         | Yes          | Controlled by configuration `READ_FIXED_STRING_AS` |
| `Decimal`                                                         | `DecimalType`                  | ✅         | Yes          | Precision and scale up to `Decimal128`             |
| `Decimal32`                                                       | `DecimalType(9, scale)`        | ✅         | Yes          |                                                    |
| `Decimal64`                                                       | `DecimalType(18, scale)`       | ✅         | Yes          |                                                    |
| `Decimal128`                                                      | `DecimalType(38, scale)`       | ✅         | Yes          |                                                    |
| `Date`, `Date32`                                                  | `DateType`                     | ✅         | Yes          |                                                    |
| `DateTime`, `DateTime32`, `DateTime64`                            | `TimestampType`                | ✅         | Yes          |                                                    |
| `Array`                                                           | `ArrayType`                    | ✅         | No           | Array element type is also converted               |
| `Map`                                                             | `MapType`                      | ✅         | No           | Keys are limited to `StringType`                   |
| `IntervalYear`                                                    | `YearMonthIntervalType(Year)`  | ✅         | Yes          |                                                    |
| `IntervalMonth`                                                   | `YearMonthIntervalType(Month)` | ✅         | Yes          |                                                    |
| `IntervalDay`, `IntervalHour`, `IntervalMinute`, `IntervalSecond` | `DayTimeIntervalType`          | ✅         | No           | Specific interval type is used                     |
| `Object`                                                          |                                | ❌         |              |                                                    |
| `Nested`                                                          |                                | ❌         |              |                                                    |
| `Tuple`                                                           |                                | ❌         |              |                                                    |
| `Point`                                                           |                                | ❌         |              |                                                    |
| `Polygon`                                                         |                                | ❌         |              |                                                    |
| `MultiPolygon`                                                    |                                | ❌         |              |                                                    |
| `Ring`                                                            |                                | ❌         |              |                                                    |
| `IntervalQuarter`                                                 |                                | ❌         |              |                                                    |
| `IntervalWeek`                                                    |                                | ❌         |              |                                                    |
| `Decimal256`                                                      |                                | ❌         |              |                                                    |
| `AggregateFunction`                                               |                                | ❌         |              |                                                    |
| `SimpleAggregateFunction`                                         |                                | ❌         |              |                                                    |

### Inserting data from Spark into ClickHouse 

| Spark Data Type                     | ClickHouse Data Type | Supported | Is Primitive | Notes                                  |
|-------------------------------------|----------------------|-----------|--------------|----------------------------------------|
| `BooleanType`                       | `UInt8`              | ✅         | Yes          |                                        |
| `ByteType`                          | `Int8`               | ✅         | Yes          |                                        |
| `ShortType`                         | `Int16`              | ✅         | Yes          |                                        |
| `IntegerType`                       | `Int32`              | ✅         | Yes          |                                        |
| `LongType`                          | `Int64`              | ✅         | Yes          |                                        |
| `FloatType`                         | `Float32`            | ✅         | Yes          |                                        |
| `DoubleType`                        | `Float64`            | ✅         | Yes          |                                        |
| `StringType`                        | `String`             | ✅         | Yes          |                                        |
| `VarcharType`                       | `String`             | ✅         | Yes          |                                        |
| `CharType`                          | `String`             | ✅         | Yes          |                                        |
| `DecimalType`                       | `Decimal(p, s)`      | ✅         | Yes          | Precision and scale up to `Decimal128` |
| `DateType`                          | `Date`               | ✅         | Yes          |                                        |
| `TimestampType`                     | `DateTime`           | ✅         | Yes          |                                        |
| `ArrayType` (list, tuple, or array) | `Array`              | ✅         | No           | Array element type is also converted   |
| `MapType`                           | `Map`                | ✅         | No           | Keys are limited to `StringType`       |
| `Object`                            |                      | ❌         |              |                                        |
| `Nested`                            |                      | ❌         |              |                                        |

## Contributing and support 

If you'd like to contribute to the project or report any issues, we welcome your input!
Visit our [GitHub repository](https://github.com/ClickHouse/spark-clickhouse-connector) to open an issue, suggest
improvements, or submit a pull request.
Contributions are welcome! Please check the contribution guidelines in the repository before starting.
Thank you for helping improve our ClickHouse Spark connector!
