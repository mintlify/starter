---
slug: /use-cases/observability/clickstack/event_patterns
title: 'Event Patterns with ClickStack'
sidebarTitle: 'Event Patterns'
pagination_prev: null
pagination_next: null
description: 'Event Patterns with ClickStack'
doc_type: 'guide'
keywords: ['clickstack', 'event patterns', 'log analysis', 'pattern matching', 'observability']
---

Event patterns in ClickStack allow you to quickly make sense of large volumes of logs or traces by automatically clustering similar messages together, so instead of digging through millions of individual events, you only need to review a small number of meaningful groups.

<img src="/images/use-cases/observability/event_patterns.png" alt="Event patterns"/>

This makes it much easier to spot which errors or warnings are new, which are recurring, and which are driving sudden spikes in log volume. Because the patterns are generated dynamically, you don't need to define regular expressions or maintain parsing rules - ClickStack adapts to your events automatically, regardless of format.

Beyond incident response, this high-level view also helps you identify noisy log sources that can be trimmed to reduce cost, discover the different types of logs a service produces, and more quickly answer whether the system is already emitting the signals you care about.

## Accessing event patterns 

Event patterns are available directly through the **Search** panel in ClickStack.  

From the top-left **Analysis Mode** selector, choose **Event Patterns** to switch from the standard results table to a clustered view of similar events.  

<img src="/images/use-cases/observability/event_patterns_highlight.png" alt="Event patterns"/>

This provides an alternative to the default **Results Table** which allows users to scroll through every individual log or trace.

## Recommendations 

Event patterns are most effective when applied to **narrowed subsets** of your data. For example, filtering down to a single service before enabling event patterns will usually surface more relevant and interesting messages than applying patterns across thousands of services at once.  

They are also particularly powerful for summarizing error messages, where repeated errors with varying IDs or payloads are grouped into concise clusters.  

For a live example, see how event patterns are used in the [Remote Demo Dataset](/use-cases/observability/clickstack/getting-started/remote-demo-data#identify-error-patterns).
