---
slug: /cloud/guides/sql-console/manage-sql-console-role-assignments
sidebarTitle: 'Manage SQL console role assignments'
title: 'Configuring SQL console role assignments'
description: 'Guide showing how to manage SQL console role assignments'
doc_type: 'guide'
keywords: ['sql console', 'role assignments', 'access management', 'permissions', 'security']
---

> This guide shows you how to configure SQL console role assignments, which
determine console-wide access permissions and the features that a user can
access within Cloud console.

<Steps>

<Step>
### Access service settings [#access-service-settings]

From the services page, click the menu in the top right corner of the service for which you want to adjust SQL console access settings.

<img src="/images/cloud/guides/sql_console/service_level_access/1_service_settings.png"/>

Select `settings` from the popup menu.

<img src="/images/cloud/guides/sql_console/service_level_access/2_service_settings.png"/>

</Step>

<Step>
### Adjust SQL console access [#adjust-sql-console-access]

Under the "Security" section, find the "SQL console access" area:

<img src="/images/cloud/guides/sql_console/service_level_access/3_service_settings.png"/>

</Step>

<Step>
### Update the settings for Service Admin [#update-settings-for-service-admin]

Select the drop-down menu for Service Admin to change the access control settings for Service Admin roles:

<img src="/images/cloud/guides/sql_console/service_level_access/4_service_settings.png"/>

You can choose from the following roles:

| Role          |
|---------------|
| `No access`   |
| `Read only`   |
| `Full access` |

</Step>

<Step>
### Update the settings for Service Read Only [#update-settings-for-service-read-only]

Select the drop-down menu for Service Read Only to change the access control settings for Service Read Only roles:

<img src="/images/cloud/guides/sql_console/service_level_access/5_service_settings.png"/>

You can choose from the following roles:

| Role          |
|---------------|
| `No access`   |
| `Read only`   |
| `Full access` |

</Step>

<Step>
### Review users with access [#review-users-with-access]

An overview of users for the service can be viewed by selecting the user count:

<img src="/images/cloud/guides/sql_console/service_level_access/6_service_settings.png"/>

A tab will open to the right of the page showing the total number of users and their roles:

<img src="/images/cloud/guides/sql_console/service_level_access/7_service_settings.png"/>

</Step>

</Steps>
