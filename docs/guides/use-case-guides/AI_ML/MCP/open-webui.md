---
slug: /use-cases/AI/MCP/open-webui
sidebar_label: 'Integrate Open WebUI'
title: 'Set Up ClickHouse MCP Server with Open WebUI and ClickHouse Cloud'
pagination_prev: null
pagination_next: null
description: 'This guide explains how to set up Open WebUI with a ClickHouse MCP server using Docker.'
keywords: ['AI', 'Open WebUI', 'MCP']
show_related_blogs: true
doc_type: 'guide'
---

import {CardHorizontal} from '@clickhouse/click-ui/bundled'
import Link from '@docusaurus/Link';
import Image from '@theme/IdealImage';

import Endpoints from '@site/static/images/use-cases/AI_ML/MCP/0_endpoints.png';
import Settings from '@site/static/images/use-cases/AI_ML/MCP/1_settings.png';
import ToolsPage from '@site/static/images/use-cases/AI_ML/MCP/2_tools_page.png';
import AddTool from '@site/static/images/use-cases/AI_ML/MCP/3_add_tool.png';
import ToolsAvailable from '@site/static/images/use-cases/AI_ML/MCP/4_tools_available.png';
import ListOfTools from '@site/static/images/use-cases/AI_ML/MCP/5_list_of_tools.png';
import Connections from '@site/static/images/use-cases/AI_ML/MCP/6_connections.png';
import AddConnection from '@site/static/images/use-cases/AI_ML/MCP/7_add_connection.png';
import OpenAIModels from '@site/static/images/use-cases/AI_ML/MCP/8_openai_models_more.png';
import Conversation from '@site/static/images/use-cases/AI_ML/MCP/9_conversation.png';

# Using ClickHouse MCP server with Open WebUI

> This guide explains how to set up [Open WebUI](https://github.com/open-webui/open-webui) with a ClickHouse MCP server
> and connect it to the ClickHouse example datasets.

<VerticalStepper headerLevel="h2">

## Install uv

You will need to install [uv](https://docs.astral.sh/uv/) to follow the instructions in this guide.
If you don't want to use uv, you will need to update the MCP Server config to use an alternative package manager.

## Launch Open WebUI

To launch Open WebUI, you can run the following command:

```bash
uv run --with open-webui open-webui serve
```

Navigate to http://localhost:8080/ to see the UI.

## Configure ClickHouse MCP Server

To setup the ClickHouse MCP Server, we'll need to convert the MCP Server to Open API endpoints.
Let's first set environmental variables that will let us connect to the ClickHouse SQL Playground:

```bash
export CLICKHOUSE_HOST="sql-clickhouse.clickhouse.com"
export CLICKHOUSE_USER="demo"
export CLICKHOUSE_PASSWORD=""
```

And, then, we can run `mcpo` to create the Open API endpoints: 

```bash
uvx mcpo --port 8000 -- uv run --with mcp-clickhouse --python 3.10 mcp-clickhouse
```

You can see a list of the endpoints created by navigating to http://localhost:8000/docs

<Image img={Endpoints} alt="Open API endpoints" size="md"/>

To use these endpoints with Open WebUI, we need to navigate to settings:

<Image img={Settings} alt="Open WebUI settings" size="md"/>

Click on `Tools`:

<Image img={ToolsPage} alt="Open WebUI tools" size="md"/>

Add http://localhost:8000 as the tool URL:

<Image img={AddTool} alt="Open WebUI tool" size="md"/>

Once we've done this, we should see a `1` next to the tool icon on the chat bar:

<Image img={ToolsAvailable} alt="Open WebUI tools available" size="md"/>

If we click on the tool icon, we can then list the available tools:

<Image img={ListOfTools} alt="Open WebUI tool listing" size="md"/>

## Configure OpenAI

By default, Open WebUI works with Ollama models, but we can add OpenAI compatible endpoints as well.
These are configured via the settings menu, but this time we need to click on the `Connections` tab:

<Image img={Connections} alt="Open WebUI connections" size="md"/>

Let's add the endpoint and our OpenAI key:

<Image img={AddConnection} alt="Open WebUI - Add OpenAI as a connection" size="md"/>

The OpenAI models will then be available on the top menu:

<Image img={OpenAIModels} alt="Open WebUI - Models" size="md"/>

## Chat to ClickHouse MCP Server with Open WebUI

We can then have a conversation and Open WebUI will call the MCP Server if necessary:

<Image img={Conversation} alt="Open WebUI - Chat with ClickHouse MCP Server" size="md"/>

</VerticalStepper>
