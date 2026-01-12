---
slug: /use-cases/observability/clickstack/alerts
title: 'Search with ClickStack'
sidebarTitle: 'Alerts'
pagination_prev: null
pagination_next: null
description: 'Alerts with ClickStack'
doc_type: 'guide'
keywords: ['ClickStack', 'observability', 'alerts', 'search-alerts', 'notifications', 'thresholds', 'slack', 'email', 'pagerduty', 'error-monitoring', 'performance-monitoring', 'user-events']
---

## Search alerts 

After entering a [search](/use-cases/observability/clickstack/search), you can create an alert to be
notified when the number of events (logs or spans) matching the search exceeds or falls below a threshold.

### Creating an alert 

You can create an alert by clicking the `Alerts` button on the top right of the `Search` page. 

From here, you can name the alert, as well as set the threshold, duration, and notification method for the alert (Slack, Email, PagerDuty or Slack webhook).

The `grouped by` value allows the search to be subject to an aggregation e.g. `ServiceName`, thus allowing potential multiple alerts to be triggered off the same search.

<img src="/images/use-cases/observability/search_alert.png" alt="Search alerts"/>

### Common alert scenarios 

Here are a few common alert scenarios that you can use HyperDX for:

**Errors:** We first recommend setting up alerts for the default
`All Error Events` and `HTTP Status >= 400` saved searches to be notified when
excess error occurs.

**Slow Operations:** You can set up a search for slow operations (ex.
`duration:>5000`) and then alert when there are too many slow operations
occurring.

**User Events:** You can also set up alerts for customer-facing teams to be
notified when new users sign up, or a critical user action is performed.
