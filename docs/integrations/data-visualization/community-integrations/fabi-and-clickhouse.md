---
sidebarTitle: 'Fabi.ai'
slug: /integrations/fabi.ai
keywords: ['clickhouse', 'Fabi.ai', 'connect', 'integrate', 'notebook', 'ui', 'analytics']
description: 'Fabi.ai is an all-in-one collaborate data analysis platform. You can leverage SQL, Python, AI, and no-code to build dashboard and data workflows faster than ever before'
title: 'Connect ClickHouse to Fabi.ai'
doc_type: 'guide'
---

import {CommunityMaintainedBadge} from '/snippets/components/CommunityMaintainedBadge/CommunityMaintainedBadge.jsx'

import GatherYourDetailsHttp from '/snippets/_gather_your_details_http.mdx';

<CommunityMaintainedBadge/>

<a href="https://www.fabi.ai/" target="_blank">Fabi.ai</a> is an all-in-one collaborate data analysis platform. You can leverage SQL, Python, AI, and no-code to build dashboard and data workflows faster than ever before. Combined with the scale and power of ClickHouse, you can build and share your first highly performant dashboard on a massive dataset in minutes.

<img src="/images/integrations/data-visualization/fabi_01.png" alt="Fabi.ai data exploration and workflow platform" />

## Gather Your Connection Details 

<GatherYourDetailsHttp />

## Create your Fabi.ai account and connect ClickHouse 

Log in or create your Fabi.ai account: https://app.fabi.ai/

1. You’ll be prompted to connect your database when you first create your account, or if you already have an account, click on the data source panel on the left of any Smartbook and select Add Data Source.
   
   <img src="/images/integrations/data-visualization/fabi_02.png" alt="Add data source" />

2. You’ll then be prompted to enter your connection details.

   <img src="/images/integrations/data-visualization/fabi_03.png" alt="ClickHouse credentials form" />

3. Congratulations! You have now integrated ClickHouse into Fabi.ai.

## Querying ClickHouse. 

Once you’ve connected Fabi.ai to ClickHouse, go to any [Smartbook](https://docs.fabi.ai/analysis_and_reporting/smartbooks) and create a SQL cell. If you only have one data source connected to your Fabi.ai instance, the SQL cell will automatically default to ClickHouse, otherwise you can choose the source to query from the source dropdown.

   <img src="/images/integrations/data-visualization/fabi_04.png" alt="Querying ClickHouse" />

## Additional Resources 

[Fabi.ai](https://www.fabi.ai) documentation: https://docs.fabi.ai/introduction

[Fabi.ai](https://www.fabi.ai) getting started tutorial videos: https://www.youtube.com/playlist?list=PLjxPRVnyBCQXxxByw2CLC0q7c-Aw6t2nl
