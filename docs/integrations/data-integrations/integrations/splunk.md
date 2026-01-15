---
sidebarTitle: 'Splunk'
slug: /integrations/audit-splunk
keywords: ['clickhouse', 'Splunk', 'audit', 'cloud']
description: 'Store ClickHouse Cloud audit logs into Splunk.'
title: 'Storing ClickHouse Cloud Audit logs into Splunk'
doc_type: 'guide'
---

import {PartnerBadge} from '/snippets/components/PartnerBadge/PartnerBadge.jsx'

<PartnerBadge/>

[Splunk](https://www.splunk.com/) is a data analytics and monitoring platform.

This add-on allows users to store the [ClickHouse Cloud audit logs](/cloud/security/audit-logging) into Splunk. It uses [ClickHouse Cloud API](/cloud/manage/api/api-overview) to download the audit logs.

This add-on contains only a modular input, no additional UI are provided with this add-on.

## Installation

### For Splunk Enterprise 

Download the ClickHouse Cloud Audit Add-on for Splunk from [Splunkbase](https://splunkbase.splunk.com/app/7709).

<img src="/images/integrations/tools/data-integration/splunk/splunk_001.png" alt="Splunkbase website showing the ClickHouse Cloud Audit Add-on for Splunk download page"/>

In Splunk Enterprise, navigate to Apps -> Manage. Then click on Install app from file.

<img src="/images/integrations/tools/data-integration/splunk/splunk_002.png" alt="Splunk Enterprise interface showing the Apps management page with Install app from file option"/>

Select the archived file downloaded from Splunkbase and click on Upload.

<img src="/images/integrations/tools/data-integration/splunk/splunk_003.png" alt="Splunk app installation dialog for uploading the ClickHouse add-on"/>

If everything goes fine, you should now see the ClickHouse Audit logs application installed. If not, consult the Splunkd logs for any errors.

### Modular input configuration

To configure the modular input, you'll first need information from your ClickHouse Cloud deployment:

- The organization ID
- An admin [API Key](/cloud/manage/openapi)

### Getting information from ClickHouse Cloud 

Log in to the [ClickHouse Cloud console](https://console.clickhouse.cloud/).

Navigate to your Organization -> Organization details. There you can copy the Organization ID.

<img src="/images/integrations/tools/data-integration/splunk/splunk_004.png" alt="ClickHouse Cloud console showing the Organization details page with Organization ID"/>

Then, navigate to API Keys from the left-end menu.

<img src="/images/integrations/tools/data-integration/splunk/splunk_005.png" alt="ClickHouse Cloud console showing the API Keys section in the left navigation menu"/>

Create an API Key, give a meaningful name and select `Admin` privileges. Click on Generate API Key.

<img src="/images/integrations/tools/data-integration/splunk/splunk_006.png" alt="ClickHouse Cloud console showing the API Key creation interface with Admin privileges selected"/>

Save the API Key and secret in a safe place.

<img src="/images/integrations/tools/data-integration/splunk/splunk_007.png" alt="ClickHouse Cloud console showing the generated API Key and secret to be saved"/>

## Configure data input in Splunk 

Back in Splunk, navigate to Settings -> Data inputs.

<img src="/images/integrations/tools/data-integration/splunk/splunk_008.png" alt="Splunk interface showing the Settings menu with Data inputs option"/>

Select the ClickHouse Cloud Audit Logs data input.

<img src="/images/integrations/tools/data-integration/splunk/splunk_009.png" alt="Splunk Data inputs page showing the ClickHouse Cloud Audit Logs option"/>

Click "New" to configure a new instance of the data input.

<img src="/images/integrations/tools/data-integration/splunk/splunk_010.png" alt="Splunk interface for configuring a new ClickHouse Cloud Audit Logs data input"/>

Once you have entered all the information, click Next.

<img src="/images/integrations/tools/data-integration/splunk/splunk_011.png" alt="Splunk configuration page with completed ClickHouse data input settings"/>

The input is configured, you can start browsing the audit logs.

## Usage

The modular input stores data in Splunk. To view the data, you can use the general search view in Splunk.

<img src="/images/integrations/tools/data-integration/splunk/splunk_012.png" alt="Splunk search interface showing ClickHouse audit logs data"/>
