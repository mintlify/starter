---
slug: /guides/sre/scaling-clusters
sidebarTitle: 'Rebalancing shards'
sidebar_position: 20
description: 'ClickHouse does not support automatic shard rebalancing, so we provide some best practices for how to rebalance shards.'
title: 'Rebalancing Data'
doc_type: 'guide'
keywords: ['scaling', 'clusters', 'horizontal scaling', 'capacity planning', 'performance']
---

ClickHouse does not support automatic shard rebalancing. However, there are ways to rebalance shards in order of preference:

1. Adjust the shard for the [distributed table](/engines/table-engines/special/distributed.md), allowing writes to be biased to the new shard. This potentially will cause load imbalances and hot spots on the cluster but can be viable in most scenarios where write throughput is not extremely high. It does not require the user to change their write target i.e. It can remain as the distributed table. This does not assist with rebalancing existing data.

2. As an alternative to (1), modify the existing cluster and write exclusively to the new shard until the cluster is balanced - manually weighting writes. This has the same limitations as (1).

3. If you need to rebalance existing data and you have partitioned your data, consider detaching partitions and manually relocating them to another node before reattaching to the new shard. This is more manual than subsequent techniques but may be faster and less resource-intensive. This is a manual operation and thus needs to consider the rebalancing of the data.

4. Export the data from the source cluster to the new cluster via an [INSERT FROM SELECT](/sql-reference/statements/insert-into.md/#inserting-the-results-of-select). This will not be performant on very large datasets and will potentially incur significant IO on the source cluster and use considerable network resources. This represents a last resort.
