---
slug: /cloud/get-started/cloud/use-cases/data_lake_and_warehouse
title: 'Data Lakehouse'
description: 'Build modern data warehousing architectures with ClickHouse Cloud combining the flexibility of data lakes with database performance'
keywords: ['use cases', 'data lake and warehouse']
sidebarTitle: 'Data warehousing'
doc_type: 'guide'
---

<Frame>
<iframe width="758" height="426" src="https://www.youtube.com/embed/mueG6z1mo8Y" title="Data lakehouses (in under 3 minutes)" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</Frame>

The data lakehouse is a convergent architecture that applies database principles
to data lake infrastructure while maintaining the flexibility and scale of cloud storage systems.

The lakehouse is not just taking a database apart but building database-like 
capabilities onto a fundamentally different foundation (cloud object storage) 
that focuses on supporting traditional analytics and modern AI/ML workloads in 
a unified platform.

## What are the components of the data lakehouse? 

The modern data lakehouse architecture represents a convergence of data warehouse
and data lake technologies, combining the best aspects of both approaches. This 
architecture comprises several distinct but interconnected layers providing a 
flexible, robust data storage, management, and analysis platform.

Understanding these components is essential for organizations looking to 
implement or optimize their data lakehouse strategy. The layered approach allows
for component substitution and independent evolution of each layer, providing 
architectural flexibility and future-proofing.

Let's explore the core building blocks of a typical data lakehouse architecture 
and how they interact to create a cohesive data management platform.

<img src="/images/cloud/onboard/discover/use_cases/datalakehouse_01.png" alt="Components of the data lakehouse"/>

| Component               | Description                                                                                                                                                                                                                                                                                                                                    |
|-------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Data sources**        | Lakehouse data sources include operational databases, streaming platforms, IoT devices, application logs, and external providers.                                                                                                                                                                                                              |
| **Query engine**        | Processes analytical queries against the data stored in the object storage, leveraging the metadata and optimizations provided by the table format layer. Supports SQL and potentially other query languages to analyze large volumes of data efficiently.                                                                                     |
| **Metadata catalog**    | The [data catalog](https://clickhouse.com/engineering-resources/data-catalog) acts as a central repository for metadata, storing and managing table definitions and schemas, partitioning information, and access control policies. Enables data discovery, lineage tracking, and governance across the lakehouse.                             |
| **Table format layer**  | The [table format layer](https://clickhouse.com/engineering-resources/open-table-formats) manages the logical organization of data files into tables, providing database-like features such as ACID transactions, schema enforcement and evolution, time travel capabilities, and performance optimizations like data skipping and clustering. |
| **Object storage**      | This layer provides scalable, durable, cost-effective storage for all data files and metadata. It handles the physical persistence of data in an open format, enabling direct access from multiple tools and systems.                                                                                                                          |
| **Client applications** | Various tools and applications that connect to the lakehouse to query data, visualize insights, or build data products. These can include BI tools, data science notebooks, custom applications, and ETL/ELT tools.                                                                                                                            |

## What are the benefits of the data lakehouse? 

The data lakehouse architecture offers several significant advantages when compared
directly to both traditional data warehouses and data lakes:

### Compared to traditional data warehouses 

| # | Benefit                                          | Description                                                                                                                                                                                                                                                                                                                                                                                                                                |
|---|--------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | **Cost efficiency**                              | Lakehouses leverage inexpensive object storage rather than proprietary storage formats, significantly reducing storage costs compared to data warehouses that charge premium prices for their integrated storage.                                                                                                                                                                                                                          |
| 2 | **Component flexibility and interchangeability** | The lakehouse architecture allows organizations to substitute different components. Traditional systems require wholesale replacement when requirements change or technology advances, while lakehouses enable incremental evolution by swapping out individual components like query engines or table formats. This flexibility reduces vendor lock-in and allows organizations to adapt to changing needs without disruptive migrations. |
| 3 | **Open format support**                          | Lakehouses store data in open file formats like Parquet, allowing direct access from various tools without vendor lock-in, unlike proprietary data warehouse formats that restrict access to their ecosystem.                                                                                                                                                                                                                              |
| 4 | **AI/ML integration**                            | Lakehouses provide direct access to data for machine learning frameworks and Python/R libraries, whereas data warehouses typically require extracting data before using it for advanced analytics.                                                                                                                                                                                                                                         |
| 5 | **Independent scaling**                          | Lakehouses separate storage from compute, allowing each to scale independently based on actual needs, unlike many data warehouses, where they scale together.                                                                                                                                                                                                                                                                              |

### Compared to data lakes 

| # | Benefit                     | Description                                                                                                                                                                                         |
|---|-----------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | **Query performance**       | Lakehouses implement indexing, statistics, and data layout optimizations that enable SQL queries to run at speeds comparable to data warehouses, overcoming the poor performance of raw data lakes. |
| 2 | **Data consistency**        | Through ACID transaction support, lakehouses ensure consistency during concurrent operations, solving a major limitation of traditional data lakes, where file conflicts can corrupt data.          |
| 3 | **Schema management**       | Lakehouses enforce schema validation and track schema evolution, preventing the "data swamp" problem common in data lakes where data becomes unusable due to schema inconsistencies.                |
| 4 | **Governance capabilities** | Lakehouses provide fine-grained access control and auditing features at row/column levels, addressing the limited security controls in basic data lakes.                                            |
| 5 | **BI Tool support**         | Lakehouses offer SQL interfaces and optimizations that make them compatible with standard BI tools, unlike raw data lakes that require additional processing layers before visualization.           |

## Where does ClickHouse fit in the data lakehouse architecture? 

ClickHouse is a powerful analytical query engine within the modern data lakehouse
ecosystem. It offers organizations a high-performance option for analyzing data 
at scale. ClickHouse is a compelling choice due to its exceptional query speed and
efficiency.

Within the lakehouse architecture, ClickHouse functions as a specialized 
processing layer that can flexibly interact with the underlying data. It can 
directly query Parquet files stored in cloud object storage systems like S3, 
Azure Blob Storage, or Google Cloud Storage, leveraging its optimized columnar 
processing capabilities to deliver rapid results even on massive datasets. 
This direct query capability allows organizations to analyze their lake data 
without complex data movement or transformation processes.

ClickHouse integrates with open table formats such as Apache Iceberg, Delta Lake,
or Apache Hudi for more sophisticated data management needs. This integration 
enables ClickHouse to take advantage of these formats' advanced features, while
still delivering the exceptional query performance it's known for. Organizations 
can integrate these table formats directly or connect through metadata catalogs 
like AWS Glue, Unity, or other catalog services.

By incorporating ClickHouse as a query engine in their lakehouse architecture, 
organizations can run lightning-fast analytical queries against their data lake
while maintaining the flexibility and openness that define the lakehouse approach.
This combination delivers the performance characteristics of a specialized 
analytical database without sacrificing the core benefits of the lakehouse model,
including component interchangeability, open formats, and unified data management.

## Hybrid architecture: The best of both worlds 

While ClickHouse excels at querying lakehouse components, its highly optimized 
storage engine offers an additional advantage. For use cases demanding ultra-low
latency queries - such as real-time dashboards, operational analytics, or 
interactive user experiences - organizations can selectively store 
performance-critical data directly in ClickHouse's native format. This hybrid 
approach delivers the best of both worlds: the unmatched query speed of 
ClickHouse's specialized storage for time-sensitive analytics and the flexibility
to query the broader data lakehouse when needed.

This dual capability allows organizations to implement tiered data strategies 
where hot, frequently accessed data resides in ClickHouse's optimized storage 
for sub-second query responses, while maintaining seamless access to the complete
data history in the lakehouse. Teams can make architectural decisions based on 
performance requirements rather than technical limitations, using ClickHouse as
a lightning-fast analytical database for critical workloads and a flexible query
engine for the broader data ecosystem.
