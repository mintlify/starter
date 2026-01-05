---
sidebar_position: 2
sidebarTitle: 'What is OLAP?'
description: 'OLAP stands for Online Analytical Processing. It is a broad term that can be looked at from two perspectives: technical and business.'
title: 'What is OLAP?'
slug: /concepts/olap
keywords: ['OLAP']
doc_type: 'reference'
---

[OLAP](https://en.wikipedia.org/wiki/Online_analytical_processing) stands for Online Analytical Processing. It is a broad term that can be looked at from two perspectives: technical and business. At the highest level, you can just read these words backward:

**Processing** — Some source data is processed…

**Analytical** — …to produce some analytical reports and insights…

**Online** — …in real-time.

## OLAP from the business perspective [#olap-from-the-business-perspective]

In recent years business people have started to realize the value of data. Companies who make their decisions blindly more often than not fail to keep up with the competition. The data-driven approach of successful companies forces them to collect all data that might be even remotely useful for making business decisions, and imposes on them a need for mechanisms which allow them to analyze this data in a timely manner. Here's where OLAP database management systems (DBMS) come in.

In a business sense, OLAP allows companies to continuously plan, analyze, and report operational activities, thus maximizing efficiency, reducing expenses, and ultimately conquering the market share. It could be done either in an in-house system or outsourced to SaaS providers like web/mobile analytics services, CRM services, etc. OLAP is the technology behind many BI (business intelligence) applications.

ClickHouse is an OLAP database management system that is pretty often used as a backend for those SaaS solutions for analyzing domain-specific data. However, some businesses are still reluctant to share their data with third-party providers and so an in-house data warehouse scenario is also viable.

## OLAP from the technical perspective [#olap-from-the-technical-perspective]

All database management systems could be classified into two groups: OLAP (Online **Analytical** Processing) and OLTP (Online **Transactional** Processing). The former focuses on building reports, each based on large volumes of historical data, but by doing it less frequently. The latter usually handles a continuous stream of transactions, constantly modifying the current state of data.

In practice OLAP and OLTP are not viewed as binary categories, but more like a spectrum. Most real systems usually focus on one of them but provide some solutions or workarounds if the opposite kind of workload is also desired. This situation often forces businesses to operate multiple storage systems that are integrated. This might not be such a big deal, but having more systems increases maintenance costs, and as such the trend in recent years is towards HTAP (**Hybrid Transactional/Analytical Processing**) when both kinds of workload are handled equally well by a single database management system.

Even if a DBMS started out as a pure OLAP or pure OLTP, it is forced to move in the HTAP direction to keep up with the competition. ClickHouse is no exception. Initially, it has been designed as a [fast-as-possible OLAP system](/concepts/why-clickhouse-is-so-fast) and it still does not have full-fledged transaction support, but some features like consistent read/writes and mutations for updating/deleting data have been added.

The fundamental trade-off between OLAP and OLTP systems remains:

- To build analytical reports efficiently it's crucial to be able to read columns separately, thus most OLAP databases are [columnar](https://clickhouse.com/engineering-resources/what-is-columnar-database);
- While storing columns separately increases costs of operations on rows, like append or in-place modification, proportionally to the number of columns (which can be huge if the systems try to collect all details of an event just in case). Thus, most OLTP systems store data arranged by rows.
