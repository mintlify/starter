---
sidebarTitle: 'Omni'
slug: /integrations/omni
keywords: ['clickhouse', 'Omni', 'connect', 'integrate', 'ui']
description: 'Omni is an enterprise platform for BI, data applications, and embedded analytics that helps you explore and share insights in real time.'
title: 'Omni'
doc_type: 'guide'
---

import {PartnerBadge} from '/snippets/components/PartnerBadge/PartnerBadge.jsx'

import GatherYourDetailsHttp from '/snippets/_gather_your_details_http.mdx';

<PartnerBadge/>

Omni can connect to ClickHouse Cloud or on-premise deployment via the official ClickHouse data source.

## 1. Gather your connection details 

<GatherYourDetailsHttp />

## 2. Create a ClickHouse data source 

Navigate to Admin -> Connections and click the "Add Connection" button in the top right corner.

<img src="/images/integrations/data-visualization/omni_01.png" alt="Omni admin interface showing the Add Connection button in the Connections section" />
<br/>

Select `ClickHouse`. Enter your credentials in the form.

<img src="/images/integrations/data-visualization/omni_02.png" alt="Omni connection configuration interface for ClickHouse showing credential form fields" />
<br/>

Now you should can query and visualize data from ClickHouse in Omni.
