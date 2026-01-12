---
slug: /cloud/get-started/cloud/use-cases/observability
title: 'Observability'
description: 'Use ClickHouse Cloud for observability, monitoring, logging, and system performance analysis in distributed applications'
keywords: ['use cases', 'observability']
sidebarTitle: 'Observability'
doc_type: 'guide'
---

<Frame>
<iframe width="758" height="426" src="https://www.youtube.com/embed/eKlZoT6hPwI?si=Wyrft2T04E1v8US6" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</Frame>

Modern software systems are complex. Microservices, cloud infrastructure, and 
distributed systems have made it increasingly difficult to understand what's 
happening inside our applications. When something goes wrong, teams need to know
where and why quickly.

This is where observability comes in. It's evolved from simple system monitoring
into a comprehensive approach to understanding system behavior. However, 
implementing effective observability isn't straightforward - it requires 
understanding technical concepts and organizational challenges.

## What is Observability? 

Observability is understanding a system's internal state by examining its outputs.
In software systems, this means understanding what's happening inside your 
applications and infrastructure through the data they generate.

This field has evolved significantly and can be understood through two distinct 
generations of observability approaches.

The first generation, often called Observability 1.0, was built around the 
traditional "three pillars" approach of metrics, logs, and traces. This approach 
required multiple tools and data stores for different types of telemetry. It 
often forced engineers to pre-define what they wanted to measure, making it 
costly and complex to maintain multiple systems.

Modern observability, or Observability 2.0, takes a fundamentally different 
approach. It's based on collecting wide, structured events for each unit of work
(e.g., an HTTP request and response) in our system. This approach captures 
high-cardinality data, such as user IDs, request IDs, Git commit hashes, 
instance IDs, Kubernetes pod names, specific route parameters, and vendor 
transaction IDs. A rule of thumb is adding a piece of metadata if it could help 
us understand how the system behaves.

This rich data collection enables dynamic slicing and dicing of data without 
pre-defining metrics. Teams can derive metrics, traces, and other visualizations
from this base data, allowing them to answer complex questions about system 
behavior that weren't anticipated when the instrumentation was first added.

However, implementing modern observability capabilities presents its challenges.
Organizations need reliable ways to collect, process, and export this rich 
telemetry data across diverse systems and technologies. While modern approaches 
have evolved beyond traditional boundaries, understanding the fundamental 
building blocks of observability remains crucial.

## The three pillars of observability 

To better understand how observability has evolved and works in practice, let's 
examine the three pillars of observability - logs, metrics, and traces.

While modern observability has moved beyond treating these as separate concerns, 
they remain fundamental concepts for understanding different aspects of system 
behavior.

1. **Logs** - Text-based records of discrete events that occur within a system. 
These provide detailed context about specific occurrences, errors, and state changes.
2. **Metrics** - Numerical measurements collected over time. These include counters,
gauges, and histograms that help track system performance, resource usage, and business KPIs.
3. **Traces** - Records that track the journey of requests as they flow through distributed systems.
These help understand the relationships between services and identify performance bottlenecks.

These pillars enable teams to monitor, troubleshoot, and optimize their systems. 
However, the real power comes from understanding how to effectively collect, 
analyze, and correlate data across all three pillars to gain meaningful insights
into system behavior.

## The benefits of observability 

While the technical aspects of observability - logs, metrics, and traces - are 
well understood, the business benefits are equally important to consider.

In their book ["Observability Engineering"](https://clickhouse.com/engineering-resources/observability#:~:text=Observability%20Engineering) 
(O'Reilly, 2022), Charity Majors, Liz Fong-Jones, and George Miranda draw from 
industry research and anecdotal feedback to identify four key business benefits 
that organizations can expect from implementing proper observability practices. 
Let's examine these benefits:

### Higher incremental revenue 

The authors note that observability tools that help teams improve uptime and 
performance can lead to increased incremental revenue through improved code quality.
This manifests in several ways:

1. Improved customer experience: Fast problem resolution and prevention of service 
degradation leads to higher customer satisfaction and retention
2. Increased system reliability: Better uptime means more successful transactions 
and fewer lost business opportunities
3. Enhanced performance: The ability to identify and optimize performance bottlenecks
helps maintain responsive services that keep customers engaged
4. Competitive advantage: Organizations that can maintain high service quality 
through comprehensive monitoring and quick issue resolution often gain an edge 
over competitors

### Cost Savings from faster incident response 

One of the most immediate benefits of observability is reduced labor costs 
through faster detection and resolution of issues. This comes from:

* Reduced Mean Time to Detect (MTTD) and Mean Time to Resolve (MTTR)
* Improved query response times, enabling faster investigation
* Quicker identification of performance bottlenecks
* Reduced time spent on-call
* Fewer resources wasted on unnecessary rollbacks

We see this in practice - [trip.com built their observability system with ClickHouse](trip.com built their observability system with ClickHouse)
and achieved query speeds 4-30x faster than their previous solution, with 90% of
queries completing in under 300ms, enabling rapid issue investigation.

### Cost savings from incidents avoided 

Observability doesn't just help resolve issues faster - it helps prevent them entirely. 
The authors emphasize how teams can prevent critical issues by:

* Identifying potential problems before they become critical
* Analyzing patterns to prevent recurring issues
* Understanding system behavior under different conditions
* Proactively addressing performance bottlenecks
* Making data-driven decisions about system improvements

ClickHouse's [own observability platform, LogHouse](https://clickhouse.com/blog/building-a-logging-platform-with-clickhouse-and-saving-millions-over-datadog), 
demonstrates this. It enables our core engineers to search historical patterns across all clusters, helping prevent 
recurring issues.

### Cost savings from decreased employee churn 

One of the most overlooked benefits is the impact on team satisfaction and retention.
The authors highlight how observability leads to:

* Improved job satisfaction through better tooling
* Decreased developer burnout from fewer unresolved issues
* Reduced alert fatigue through better signal-to-noise ratio
* Lower on-call stress due to better incident management
* Increased team confidence in system reliability

We see this in practice - when [Fastly migrated to ClickHouse](https://clickhouse.com/videos/scaling-graphite-with-clickhouse),
their engineers were amazed by the improvement in query performance, noting:

> "I couldn't believe it. I actually had to go back a couple of times just to 
> make sure that I was querying it properly... this is coming back too fast. 
> This doesn't make sense."

As the authors emphasize, while the specific measures of these benefits may vary
depending on the tools and implementation, these fundamental improvements can be
expected across organizations that adopt robust observability practices. The key
is choosing and implementing the right tools effectively to maximize these benefits.

Achieving these benefits requires overcoming several significant hurdles. Even 
organizations that understand the value of observability often find that 
implementation presents unexpected complexities and challenges that must be 
carefully navigated.

## Challenges in implementing observability 

Implementing observability within an organization is a transformative step toward
gaining deeper insights into system performance and reliability. However, this 
journey is not without its challenges. As organizations strive to harness the 
full potential of observability, they encounter various obstacles that can impede
progress. Let’s go through some of them.

### Data volume and scalability 

One of the primary hurdles in implementing observability is managing the sheer 
volume and scalability of telemetry data generated by modern systems. As 
organizations grow, so does the data they need to monitor, necessitating 
solutions that efficiently handle large-scale data ingestion and 
real-time analytics.

### Integration with existing systems 

Integration with existing systems poses another significant challenge. Many
organizations operate in heterogeneous environments with diverse technologies,
making it essential for observability tools to seamlessly integrate with current 
infrastructure. Open standards are crucial in facilitating this integration,
ensuring interoperability and reducing the complexity of deploying observability
solutions across varied tech stacks.

### Skill gaps 

Skill gaps can also impede the successful implementation of observability. The 
transition to advanced observability solutions often requires specialized 
knowledge of data analytics and specific tools. Teams may need to invest in 
training or hiring to bridge these gaps and fully leverage the capabilities of
their observability platforms.

### Cost management 

Cost management is critical, as observability solutions can become expensive, 
particularly at scale. Organizations must balance the costs of these tools with 
the value they provide, seeking cost-effective solutions that offer significant 
savings compared to traditional approaches.

### Data retention and storage 

Data retention and storage management present additional challenges. Deciding 
how long to retain observability data without compromising performance or 
insights requires careful planning and efficient storage solutions that reduce 
storage requirements while maintaining data accessibility.

### Standardization and vendor lock-in 

Ensuring standardization and avoiding vendor lock-in are vital for maintaining 
flexibility and adaptability in observability solutions. By adhering to open 
standards, organizations can prevent being tied to specific vendors and ensure 
their observability stack can evolve with their needs.

### Security and compliance 

Security and compliance considerations remain crucial, especially when handling 
sensitive data within observability systems. Organizations must ensure that their
observability solutions adhere to relevant regulations and effectively protect 
sensitive information.

These challenges underscore the importance of strategic planning and informed 
decision-making in implementing observability solutions that effectively meet 
organizational needs.

To address these challenges, organizations need a well-structured approach to 
implementing observability. The standard observability pipeline has evolved to 
provide a framework for effectively collecting, processing, and analyzing 
telemetry data. One of the earliest and most influential examples of this 
evolution comes from Twitter's experience in 2013.
