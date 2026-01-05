---
sidebarTitle: 'Console audit log'
slug: /cloud/security/audit-logging/console-audit-log
title: 'Console audit log'
description: 'This page describes how users can review the cloud audit log'
doc_type: 'guide'
keywords: ['audit log']
---

# Console audit log [#console-audit-log]

User console activities are recorded in the audit log, which is available to users with the Admin or Developer organization role to review and integrate with logging systems. Specific events included in the console audit log are shown in the 

## Access the console log via the user interface [#console-audit-log-ui]

<Steps>

## Select organization [#select-org]

In ClickHouse Cloud, navigate to your organization details. 

<img src="/images/cloud/security/activity_log1.png" alt="ClickHouse Cloud activity tab"/>

<br/>

## Select audit [#select-audit]

Select the **Audit** tab on the left menu to see what changes have been made to your ClickHouse Cloud organization - including who made the change and when it occurred.

The **Activity** page displays a table containing a list of events logged about your organization. By default, this list is sorted in a reverse-chronological order (most-recent event at the top). Change the order of the table by clicking on the columns headers. Each item of the table contains the following fields:

- **Activity:** A text snippet describing the event
- **User:** The user that initiated the event
- **IP Address:** When applicable, this flied lists the IP Address of the user that initiated the event
- **Time:** The timestamp of the event

<img src="/images/cloud/security/activity_log2.png" alt="ClickHouse Cloud Activity Table"/>

<br/>

## Use the search bar [#use-search-bar]

You can use the search bar provided to isolate events based on some criteria like for example service name or IP address. You can also export this information in a CSV format for distribution or analysis in an external tool.

</Steps>

<div class="eighty-percent">
    <img src="/images/cloud/security/activity_log3.png" alt="ClickHouse Cloud Activity CSV export"/>
</div>

## Access the console audit log via the API [#console-audit-log-api]

Users can use the ClickHouse Cloud API `activity` endpoint to obtain an export 
of audit events. Further details can be found in the [API reference](https://clickhouse.com/docs/cloud/manage/api/swagger).

## Log integrations [#log-integrations]

Users can use the API to integrate with a logging platform of their choice. The following have supported out-of-the-box connectors:
- [ClickHouse Cloud Audit add-on for Splunk](/integrations/audit-splunk)
