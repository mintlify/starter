---
slug: /cloud/get-started/cloud/use-cases/real-time-analytics
title: 'Real-time analytics'
description: 'Learn how to build real-time analytics applications with ClickHouse Cloud for instant insights and data-driven decision making'
keywords: ['use cases', 'real-time analytics']
sidebarTitle: 'Real-time analytics'
doc_type: 'guide'
---

<Frame>
<iframe width="758" height="426" src="https://www.youtube.com/embed/SnFff0KYwuo?si=aNpGzSobzFhUlyX5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</Frame>

## What is real-time analytics? 

Real-time analytics refers to data processing that delivers insights to end users
and customers as soon as the data is generated. It differs from traditional or 
batch analytics, where data is collected in batches and processed, often a long 
time after it was generated.

Real-time analytics systems are built on top of event streams, which consist of 
a series of events ordered in time. An event is something that’s already happened.
It could be the addition of an item to the shopping cart on an e-commerce website,
the emission of a reading from an Internet of Things (IoT) sensor, or a shot on 
goal in a football (soccer) match.

An event (from an imaginary IoT sensor) is shown below, as an example:

```json
{
  "deviceId": "sensor-001",
  "timestamp": "2023-10-05T14:30:00Z",
  "eventType": "temperatureAlert",
  "data": {
    "temperature": 28.5,
    "unit": "Celsius",
    "thresholdExceeded": true
  }
}
```

Organizations can discover insights about their customers by aggregating and 
analyzing events like this. This has traditionally been done using batch analytics,
and in the next section, we’ll compare batch and real-time analytics.

## Real-Time analytics vs batch analytics 

The diagram below shows what a typical batch analytics system would look like 
from the perspective of an individual event:

<img src="/images/cloud/onboard/discover/use_cases/0_rta.png" alt="batch analytics diagram"/>

You can see that there’s quite a big gap from when the event happens until we 
process and gain some insight from it. Traditionally, this was the only means of
data analysis, and we’d need to create artificial time boundaries to process 
the data in batches. For example, we might process all the data collected at the
end of a day. This worked for many use cases, but for others, it’s sub-optimal 
because we’re working with stale data, and it doesn’t allow us to react to the 
data quickly enough.

By contrast, in real-time analytics systems, we react to an event as soon as it 
happens, as shown in the following diagram:

<img src="/images/cloud/onboard/discover/use_cases/1_rta.png" alt="Real-time analytics diagram"/>

We can now derive insights from events almost as soon as they’re generated. But 
why is this useful?

## Benefits of real-time analytics 

In today's fast-paced world, organizations rely on real-time analytics to stay 
agile and responsive to ever-changing conditions. A real-time analytics system 
can benefit a business in many ways.

### Better decision-making 

Decision-making can be improved by having access to actionable insights via 
real-time analytics. When business operators can see events as they’re happening,
it makes it much easier to make timely interventions.

For example, if we make changes to an application and want to know whether it’s
having a detrimental effect on the user experience, we want to know this as 
quickly as possible so that we can revert the changes if necessary. With a less
real-time approach, we might have to wait until the next day to do this 
analysis, by which type we’ll have a lot of unhappy users.

### New products and revenue streams 

Real-time analytics can help businesses generate new revenue streams. Organizations
can develop new data-centered products and services that give users access to 
analytical querying capabilities. These products are often compelling enough for 
users to pay for access.

In addition, existing applications can be made stickier, increasing user 
engagement and retention. This will result in more application use, creating more
revenue for the organization.

### Improved customer experience 

With real-time analytics, businesses can gain instant insights into customer 
behavior, preferences, and needs. This lets businesses offer timely assistance, 
personalize interactions, and create more engaging experiences that keep 
customers returning.

## Real-time analytics use cases 

The actual value of real-time analytics becomes evident when we consider its 
practical applications. Let’s examine some of them.

### Fraud detection 

Fraud detection is about detecting fraudulent patterns, ranging from fake accounts
to payment fraud. We want to detect this fraud as quickly as possible, flagging 
suspicious activities, blocking transactions, and disabling accounts when necessary.

This use case stretches across industries: healthcare, digital banking, financial
services, retail, and more.

[Instacart](https://www.instacart.com/) is North America's leading online grocery
company, with millions of active customers and shoppers. It uses ClickHouse as 
part of Yoda, its fraud detection platform. In addition to the general types of 
fraud described above, it also tries to detect collusion between customers and 
shoppers.

<img src="/images/cloud/onboard/discover/use_cases/2_rta.png" alt="Real-time analytics for fraud detection"/>

They identified the following characteristics of ClickHouse that enable real-time
fraud detection:

> ClickHouse supports LSM-tree based MergeTree family engines. 
> These are optimized for writing which is suitable for ingesting large amounts 
> of data in real-time.

> ClickHouse is designed and optimized explicitly for analytical queries. This 
> fits perfectly with the needs of applications where data is continuously 
> analyzed for patterns that might indicate fraud.

### Time-sensitive decision making 

Time-sensitive decision-making refers to situations where users or organizations 
need to make informed choices quickly based on the most current information 
available. Real-time analytics empowers users to make informed choices in 
dynamic environments, whether they're traders reacting to market fluctuations, 
consumers making purchasing decisions, or professionals adapting to real-time 
operational changes.

Coinhall provides its users with real-time insights into price movements over 
time via a candlestick chart, which shows the open, high, low, and close prices 
for each trading period. They needed to be able to run these types of queries 
quickly and with a large number of concurrent users.

<img src="/images/cloud/onboard/discover/use_cases/3_rta.png" alt="Real-time analutics for time-sensitive decision making"/>

> In terms of performance, ClickHouse was the clear winner, executing candlestick queries in 20 milliseconds, compared 
> to 400 milliseconds or more for the other databases. It ran latest-price queries in 8 milliseconds, outpacing the 
> next-best performance (SingleStore) which came in at 45 milliseconds. Finally, it handled ASOF JOIN queries in 
> 50 milliseconds, while Snowflake took 20 minutes and Rockset timed out.
