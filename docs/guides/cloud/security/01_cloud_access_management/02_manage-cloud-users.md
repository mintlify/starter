---
sidebarTitle: 'Manage cloud users'
slug: /cloud/security/manage-cloud-users
title: 'Manage cloud users'
description: 'This page describes how administrators can add users, manage assignments, and remove users'
doc_type: 'guide'
keywords: ['cloud users', 'access management', 'security', 'permissions', 'team management']
---

import {EnterprisePlanFeatureBadge} from '/snippets/components/EnterprisePlanFeatureBadge/EnterprisePlanFeatureBadge.jsx'

This guide is intended for users with the Organization Admin role in ClickHouse Cloud.

## Add users to your organization [#add-users]

### Invite users [#invite-users]

Administrators may invite up to three (3) users at a time and assign organization and service level roles at the time of invitation. 

To invite users:
1. Select the organization name in the lower left corner
2. Click `Users and roles`
3. Select `Invite members` in the upper left corner
4. Enter the email address of up to 3 new users
5. Select the organization and service roles that will be assigned to the users
6. Click `Send invites`

Users will receive an email from which they can join the organization. For more information on accepting invitations, see [Manage my account](/cloud/security/manage-my-account).

### Add users via SAML identity provider [#add-users-via-saml]

<EnterprisePlanFeatureBadge feature="SAML SSO"/>

If your organization is configured for [SAML SSO](/cloud/security/saml-setup) follow these steps to add users to your organization.

1. Add users to your SAML application in your identity provider, the users will not appear in ClickHouse until they have logged in once
2. When the user logs in to ClickHouse Cloud they will automatically be assigned the `Member` role which may only log in and has no other access
3. Follow the instructions in the `Manage user role assignments` below to grant permissions

### Enforcing SAML-only authentication [#enforce-saml]

Once you have at least one SAML user in the organization assigned to the Organization Admin role, remove users with other authentication methods from the organization to enforce SAML only authentication for the organization.

## Manage user role assignments [#manage-role-assignments]

Users assigned the Organization Admin role may update permissions for other users at any time.

<Steps>

<Step>
### Access organization settings [#access-organization-settings]

From the services page, select the name of your organization:

<img src="/images/cloud/guides/sql_console/org_level_access/1_org_settings.png"/>

</Step>

<Step>
### Access users and roles [#access-users-and-roles]

Select the `Users and roles` menu item from the popup menu.

<img src="/images/cloud/guides/sql_console/org_level_access/2_org_settings.png"/>

</Step>

<Step>
### Select the user to update [#select-user-to-update]

Select the menu item at the end of the row for the user that you which to modify access for:

<img src="/images/cloud/guides/sql_console/org_level_access/3_org_settings.png"/>

</Step>

<Step>
### Select `edit` [#select-edit]

<img src="/images/cloud/guides/sql_console/org_level_access/4_org_settings.png"/>

A tab will display on the right hand side of the page:

<img src="/images/cloud/guides/sql_console/org_level_access/5_org_settings.png"/>

</Step>

<Step>
### Update permissions [#update-permissions]

Select the drop-down menu items to adjust console-wide access permissions and which features a user can access from within the ClickHouse console. Refer to [Console roles and permissions](/cloud/security/console-roles) for a listing of roles and associated permissions.

Select the drop-down menu items to adjust the access scope of the service role of the selected user. When selecting `Specific services`, you can control the role of the user per service.

<img src="/images/cloud/guides/sql_console/org_level_access/6_org_settings.png"/>

</Step>

<Step>
### Save your changes [#save-changes]

Save your changes with the `Save changes` button at the bottom of the tab:

<img src="/images/cloud/guides/sql_console/org_level_access/7_org_settings.png"/>

</Step>

</Steps>

## Remove a user [#remove-user]
<Note title="Remove SAML users">
SAML users that have been unassigned from the ClickHouse application in your identity provider are not able to log in to ClickHouse Cloud. The account is not removed from the console and will need to be manually removed.
</Note>

Follow the steps below to remove a user. 

1. Select the organization name in the lower left corner
2. Click `Users and roles`
3. Click the three dots next to the user's name and select `Remove`
4. Confirm the action by clicking the `Remove user` button
