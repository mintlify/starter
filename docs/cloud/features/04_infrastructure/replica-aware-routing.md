---
title: 'Replica-aware routing'
slug: /manage/replica-aware-routing
description: 'How to use Replica-aware routing to increase cache re-use'
keywords: ['cloud', 'sticky endpoints', 'sticky', 'endpoints', 'sticky routing', 'routing', 'replica aware routing']
doc_type: 'guide'
---

import {PrivatePreviewBadge} from '/snippets/components/PrivatePreviewBadge/PrivatePreviewBadge.jsx'

# Replica-aware routing

<PrivatePreviewBadge/>

Replica-aware routing (also known as sticky sessions, sticky routing, or session affinity) utilizes [Envoy proxy's ring hash load balancing](https://www.envoyproxy.io/docs/envoy/latest/intro/arch_overview/upstream/load_balancing/load_balancers#ring-hash). The main purpose of replica-aware routing is to increase the chance of cache reuse. It does not guarantee isolation.

When enabling replica-aware routing for a service, we allow a wildcard subdomain on top of the service hostname. For a service with the host name `abcxyz123.us-west-2.aws.clickhouse.cloud`, you can use any hostname which matches `*.sticky.abcxyz123.us-west-2.aws.clickhouse.cloud` to visit the service:

|Example hostnames|
|---|
|`aaa.sticky.abcxyz123.us-west-2.aws.clickhouse.cloud`|
|`000.sticky.abcxyz123.us-west-2.aws.clickhouse.cloud`|
|`clickhouse-is-the-best.sticky.abcxyz123.us-west-2.aws.clickhouse.cloud`|

When Envoy receives a hostname that matches such a pattern, it will compute the routing hash based on the hostname and find the corresponding ClickHouse server on the hash ring based on the computed hash. Assuming that there is no ongoing change to the service (e.g. server restarts, scale out/in), Envoy will always choose the same ClickHouse server to connect to.

Note the original hostname will still use `LEAST_CONNECTION` load balancing, which is the default routing algorithm.

## Limitations of Replica-aware routing 

### Replica-aware routing does not guarantee isolation 

Any disruption to the service, e.g. server pod restarts (due to any reason like a version upgrade, crash, vertical scaling up, etc.), server scaled out / in, will cause a disruption to the routing hash ring. This will cause connections with the same hostname to land on a different server pod.

### Replica-aware routing does not work out of the box with private link 

Customers need to manually add a DNS entry to make name resolution work for the new hostname pattern. It is possible that this can cause imbalance in the server load if customers use it incorrectly.

## Configuring replica-aware routing 

To enable Replica-aware routing, please contact [our support team](https://clickhouse.com/support/program).
