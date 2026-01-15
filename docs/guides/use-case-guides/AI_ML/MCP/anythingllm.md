---
slug: /use-cases/AI/MCP/anythingllm
sidebar_label: 'Integrate AnythingLLM'
title: 'Set Up ClickHouse MCP Server with AnythingLLM and ClickHouse Cloud'
pagination_prev: null
pagination_next: null
description: 'This guide explains how to set up AnythingLLM with a ClickHouse MCP server using Docker.'
keywords: ['AI', 'AnythingLLM', 'MCP']
show_related_blogs: true
doc_type: 'guide'
---

import {CardHorizontal} from '@clickhouse/click-ui/bundled'
import Link from '@docusaurus/Link';
import Image from '@theme/IdealImage';

import Conversation from '@site/static/images/use-cases/AI_ML/MCP/allm_conversation.png';
import MCPServers from '@site/static/images/use-cases/AI_ML/MCP/allm_mcp-servers.png';
import ToolIcon from '@site/static/images/use-cases/AI_ML/MCP/alm_tool-icon.png';

# Using ClickHouse MCP server with AnythingLLM

> This guide explains how to set up [AnythingLLM](https://anythingllm.com/) with a ClickHouse MCP server using Docker
> and connect it to the ClickHouse example datasets.

<VerticalStepper headerLevel="h2">

## Install Docker

You will need Docker to run LibreChat and the MCP server. To get Docker:
1. Visit [docker.com](https://www.docker.com/products/docker-desktop)
2. Download Docker desktop for your operating system
3. Install Docker by following the instructions for your operating system
4. Open Docker Desktop and ensure it is running
<br/>
For more information, see the [Docker documentation](https://docs.docker.com/get-docker/).

## Pull AnythingLLM Docker image

Run the following command to pull the AnythingLLM Docker image to your machine:

```bash
docker pull anythingllm/anythingllm
```

## Setup storage location

Create a directory for storage and initialize the environment file:

```bash
export STORAGE_LOCATION=$PWD/anythingllm && \
mkdir -p $STORAGE_LOCATION && \
touch "$STORAGE_LOCATION/.env" 
```

## Configure MCP Server config file

Create the `plugins` directory:

```bash
mkdir -p "$STORAGE_LOCATION/plugins"
```

Create a file called `anythingllm_mcp_servers.json` in the `plugins` directory and add the following contents:

```json
{
  "mcpServers": {
    "mcp-clickhouse": {
      "command": "uv",
      "args": [
        "run",
        "--with",
        "mcp-clickhouse",
        "--python",
        "3.10",
        "mcp-clickhouse"
      ],
      "env": {
        "CLICKHOUSE_HOST": "sql-clickhouse.clickhouse.com",
        "CLICKHOUSE_USER": "demo",
        "CLICKHOUSE_PASSWORD": ""
      }
    }
  }
}
```

If you want to explore your own data, you can do so by
using the [host, username and password](https://clickhouse.com/docs/getting-started/quick-start/cloud#connect-with-your-app) 
of your own ClickHouse Cloud service.

## Start the AnythingLLM Docker container

Run the following command to start the AnythingLLM Docker container:

```bash
docker run -p 3001:3001 \
--cap-add SYS_ADMIN \
-v ${STORAGE_LOCATION}:/app/server/storage \
-v ${STORAGE_LOCATION}/.env:/app/server/.env \
-e STORAGE_DIR="/app/server/storage" \
mintplexlabs/anythingllm
```

Once that's started, navigate to `http://localhost:3001` in your browser.
Select the model that you want to use and provide your API key.

## Wait for MCP Servers to start up

Click on the tool icon in the bottom left-hand side of the UI:

<Image img={ToolIcon} alt="Tool icon" size="md"/>

Click on `Agent Skills` and look under the `MCP Servers` section. 
Wait until you see `Mcp ClickHouse` set to `On`

<Image img={MCPServers} alt="MCP servers ready" size="md"/>

## Chat with ClickHouse MCP Server with AnythingLLM

We're now ready to start a chat. 
To make MCP Servers available to a chat, you'll need to prefix the first message in the conversation with `@agent`.

<Image img={Conversation} alt="Conversation" size="md"/>

</VerticalStepper>
