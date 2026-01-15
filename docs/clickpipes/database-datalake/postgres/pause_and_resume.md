---
title: 'Pausing and Resuming a Postgres ClickPipe'
description: 'Pausing and Resuming a Postgres ClickPipe'
sidebarTitle: 'Pause table'
slug: /integrations/clickpipes/postgres/pause_and_resume
doc_type: 'guide'
keywords: ['clickpipes', 'postgresql', 'cdc', 'data ingestion', 'real-time sync']
---

There are scenarios where it would be useful to pause a Postgres ClickPipe. For example, you may want to run some analytics on existing data in a static state. Or, you might be performing upgrades on Postgres. Here is how you can pause and resume a Postgres ClickPipe.

## Steps to pause a Postgres ClickPipe 

1. In the Data Sources tab, click on the Postgres ClickPipe you wish to pause.
2. Head over to the **Settings** tab.
3. Click on the **Pause** button.

<img src="/images/integrations/data-ingestion/clickpipes/postgres/pause_button.png"/>

4. A dialog box should appear for confirmation. Click on Pause again.

<img src="/images/integrations/data-ingestion/clickpipes/postgres/pause_dialog.png"/>

4. Head over to the **Metrics** tab.
5. In around 5 seconds (and also on page refresh), the status of the pipe should be **Paused**.

<Warning>
Pausing a Postgres ClickPipe will not pause the growth of replication slots.
</Warning>

<img src="/images/integrations/data-ingestion/clickpipes/postgres/pause_status.png"/>

## Steps to resume a Postgres ClickPipe 
1. In the Data Sources tab, click on the Postgres ClickPipe you wish to resume. The status of the mirror should be **Paused** initially.
2. Head over to the **Settings** tab.
3. Click on the **Resume** button.

<img src="/images/integrations/data-ingestion/clickpipes/postgres/resume_button.png"/>

4. A dialog box should appear for confirmation. Click on Resume again.

<img src="/images/integrations/data-ingestion/clickpipes/postgres/resume_dialog.png"/>

5. Head over to the **Metrics** tab.
6. In around 5 seconds (and also on page refresh), the status of the pipe should be **Running**.
