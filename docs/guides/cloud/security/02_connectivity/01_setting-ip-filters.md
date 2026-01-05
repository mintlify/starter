---
sidebarTitle: 'Setting IP filters'
slug: /cloud/security/setting-ip-filters
title: 'Setting IP filters'
description: 'This page explains how to set IP filters in ClickHouse Cloud to control access to ClickHouse services.'
doc_type: 'guide'
keywords: ['IP filters', 'IP access list']
---

## Setting IP filters [#setting-ip-filters]

IP access lists filter traffic to ClickHouse services or API keys by specifying which source addresses are permitted to connect.  These lists are configurable for each service and each API key.  Lists can be configured during service or API key creation, or afterward.

<Warning>
If you skip the creation of the IP access list for a ClickHouse Cloud service then no traffic will be permitted to the service. If IP access lists for ClickHouse services are set to `Allow from anywhere` your service may be periodically moved from an idle to an active state by internet crawlers and scanners that look for public IPs, which may result in nominal unexpected cost.
</Warning>

## Prepare [#prepare]

Before you begin, collect the IP addresses or ranges that should be added to the access list.  Take into consideration remote workers, on-call locations, VPNs, etc. The IP access list user interface accepts individual addresses and CIDR notation.

Classless Inter-domain Routing (CIDR) notation, allows you to specify IP address ranges smaller than the traditional Class A, B, or C (8, 6, or 24) subnet mask sizes. [ARIN](https://account.arin.net/public/cidrCalculator) and several other organizations provide CIDR calculators if you need one, and if you would like more information on CIDR notation, please see the [Classless Inter-domain Routing (CIDR)](https://www.rfc-editor.org/rfc/rfc4632.html) RFC.

## Create or modify an IP access list [#create-or-modify-an-ip-access-list]

<Note title="Applicable only to connections outside of PrivateLink">
IP access lists only apply to connections from the public internet, outside of [PrivateLink](/cloud/security/connectivity/private-networking).
If you only want traffic from PrivateLink, set `DenyAll` in IP Allow list.
</Note>

<AccordionGroup>
<Accordion title="IP access list for ClickHouse services">

When you create a ClickHouse service, the default setting for the IP allow list is 'Allow from nowhere.'
From your ClickHouse Cloud services list select the service and then select **Settings**. 
Under the **Security** section, you will find the IP access list.
Click on the Add IPs button.

A sidebar will appear with options for you to configure:

- Allow incoming traffic from anywhere to the service
- Allow access from specific locations to the service
- Deny all access to the service

</Accordion>

<Accordion title="IP access list for API keys">

When you create an API key, the default setting for the IP allow list is 'Allow from anywhere.'

From the API key list, click the three dots next to the API key under the **Actions** column and select **Edit**.
At the bottom of the screen you will find the IP access list and options to configure:

- Allow incoming traffic from anywhere to the service
- Allow access from specific locations to the service
- Deny all access to the service

</Accordion>
</AccordionGroup>

This screenshot shows an access list which allows traffic from a range of IP addresses, described as "NY Office range":
  
<img src="/images/cloud/security/ip-filtering-after-provisioning.png" alt="Existing access list in ClickHouse Cloud"/>

### Possible actions [#possible-actions]

1. To add an additional entry you can use **+ Add new IP**

  This example adds a single IP address, with a description of `London server`:

<img src="/images/cloud/security/ip-filter-add-single-ip.png" alt="Adding a single IP to the access list in ClickHouse Cloud"/>

2. Delete an existing entry

  Clicking the cross (x) can deletes an entry

3. Edit an existing entry

  Directly modifying the entry

4. Switch to allow access from **Anywhere**

  This is not recommended, but it is allowed.  We recommend that you expose an application built on top of ClickHouse to the public and restrict access to the back-end ClickHouse Cloud service.

To apply the changes you made, you must click **Save**.

## Verification [#verification]

Once you create your filter confirm connectivity to a service from within the range, and confirm that connections from outside the permitted range are denied.  A simple `curl` command can be used to verify:

```bash title="Attempt rejected from outside the allow list"
curl https://<HOSTNAME>.clickhouse.cloud:8443
```

```response
curl: (35) error:02FFF036:system library:func(4095):Connection reset by peer
```

or

```response
curl: (35) LibreSSL SSL_connect: SSL_ERROR_SYSCALL in connection to HOSTNAME.clickhouse.cloud:8443
```

```bash title="Attempt permitted from inside the allow list"
curl https://<HOSTNAME>.clickhouse.cloud:8443
```

```response
Ok.
```

## Limitations [#limitations]

- Currently, IP access lists support only IPv4
