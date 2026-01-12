---
title: 'Notifications'
slug: /cloud/notifications
description: 'Notifications for your ClickHouse Cloud service'
keywords: ['cloud', 'notifications']
doc_type: 'guide'
---

ClickHouse Cloud sends notifications about critical events related to your service or organization. There are a few concepts to keep in mind to understand how notifications are sent and configured:

1. **Notification category**: Refers to groups of notifications such as billing notifications, service related notifications etc. Within each category, there are multiple notifications for which the delivery mode can be configured.
2. **Notification severity**: Notification severity can be `info`, `warning`, or `critical` depending on how important a notification is. This is not configurable.
3. **Notification channel**: Channel refers to the mode by which the notification is received such as UI, email, Slack etc. This is configurable for most notifications.

## Receiving notifications 

Notifications can be received via various channels. For now, ClickHouse Cloud supports receiving notifications through email, ClickHouse Cloud UI, and Slack.  You can click on the bell icon in the top left menu to view current notifications, which opens a flyout. Clicking the button **View All** the bottom of the flyout will take you to a page that shows an activity log of all notifications.

<img src="/images/cloud/manage/notifications-1.png" alt="ClickHouse Cloud notifications flyout"/>

<img src="/images/cloud/manage/notifications-2.png" alt="ClickHouse Cloud notifications activity log"/>

## Customizing notifications 

For each notification, you can customize how you receive the notification. You can access the settings screen from the notifications flyout or from the second tab on the notifications activity log.

Cloud users can customize notifications delivered via the Cloud UI, and these customizations are reflected for each individual user. Cloud users can also customize notifications delivered to their own emails, but only users with admin permissions can customize notifications delivered to custom emails and notifications delivered to Slack channels.

To configure delivery for a specific notification, click on the pencil icon to modify the notification delivery channels.

<img src="/images/cloud/manage/notifications-3.png" alt="ClickHouse Cloud notifications settings screen"/>

<img src="/images/cloud/manage/notifications-4.png" alt="ClickHouse Cloud notification delivery settings"/>

<Note>
Certain **required** notifications such as **Payment failed** are not configurable.
</Note>

## Supported notifications 

Currently, we send out notifications related to billing (payment failure, usage exceeded ascertain threshold, etc.) as well as notifications related to scaling events (scaling completed, scaling blocked etc.).
