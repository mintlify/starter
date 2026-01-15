---
slug: /use-cases/AI/MCP/claude-desktop
sidebar_label: 'Integrate Claude Desktop'
title: 'Set Up ClickHouse MCP Server with Claude Desktop'
pagination_prev: null
pagination_next: null
description: 'This guide explains how to set up Claude Desktop with a ClickHouse MCP server.'
keywords: ['AI', 'Librechat', 'MCP']
show_related_blogs: true
doc_type: 'guide'
---

import {CardHorizontal} from '@clickhouse/click-ui/bundled'
import Link from '@docusaurus/Link';
import Image from '@theme/IdealImage';
import ClaudeDesktopConfig from '@site/static/images/use-cases/AI_ML/MCP/claude-desktop-config.png';
import FindMCPServers from '@site/static/images/use-cases/AI_ML/MCP/find-mcp-servers.gif';
import MCPPermission from '@site/static/images/use-cases/AI_ML/MCP/mcp-permission.png';
import ClaudeConversation from '@site/static/images/use-cases/AI_ML/MCP/claude-conversation.png';

# Using ClickHouse MCP server with Claude Desktop

> This guide explains how to set up Claude Desktop with a ClickHouse MCP server using uv
> and connect it to the ClickHouse example datasets.

<iframe width="768" height="432" src="https://www.youtube.com/embed/y9biAm_Fkqw?si=9PP3-1Y1fvX8xy7q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

<VerticalStepper headerLevel="h2">

## Install uv

You will need to install [uv](https://docs.astral.sh/uv/) to follow the instructions in this guide.
If you don't want to use uv, you will need to update the MCP Server config to use an alternative package manager.

## Download Claude Desktop

You'll also need to install the Claude Desktop app, which you can download from the [Claude Desktop website](https://claude.ai/desktop).

## Configuring ClickHouse MCP server

Once you've got Claude Desktop installed, it's time to configure the [ClickHouse MCP server](https://github.com/ClickHouse/mcp-clickhouse).
We can do this via the [Claude Desktop configuration file](https://claude.ai/docs/configuration).

To find this file, first go to the settings page (`Cmd+,` on a Mac) and then click on the `Developer` tab on the left menu.
You'll then see the following screen, on which you'll need to click on the `Edit config` button:

<Image img={ClaudeDesktopConfig} alt="Claude Desktop configuration" size="md" />

This will take you to a directory containing the configuration file (`claude_desktop_config.json`).
The first time you open that file, it will likely contain the following content:

```json
{
  "mcpServers": {}
}
```

The `mcpServers` dictionary takes in the name of an MCP Server as a key, and a dictionary of configuration options as a value.  
For example, the ClickHouse MCP server configuration connecting to the ClickHouse Playground would look like this:

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
        "CLICKHOUSE_PORT": "8443",
        "CLICKHOUSE_USER": "demo",
        "CLICKHOUSE_PASSWORD": "",
        "CLICKHOUSE_SECURE": "true",
        "CLICKHOUSE_VERIFY": "true",
        "CLICKHOUSE_CONNECT_TIMEOUT": "30",
        "CLICKHOUSE_SEND_RECEIVE_TIMEOUT": "30"
      }
    }
  }
}
```

Once you've updated the config, you'll need to restart Claude Desktop for the changes to take effect. 

:::warning
Depending on how you installed `uv`, you might receive the following error when restarting Claude Desktop:

```text
MCP mcp-clickhouse: spawn uv ENOENT
```

If that happens, you'll need to update the `command` to have the full path to `uv`. e.g. if you've installed via Cargo, it will be `/Users/<username>/.cargo/bin/uv`
:::

## Using ClickHouse MCP server

Once you've restarted Claude Desktop, you can find the ClickHouse MCP server by clicking on the `Search and tools` icon:

<Image img={FindMCPServers} alt="Find MCP servers" size="md" />
<br/>

You can then choose whether to disable all or some of the tools.

Now we're ready to ask Claude some questions that will result in it using the ClickHouse MCP server.
For example, we could ask it `What's the most interesting dataset in the SQL playground?`.

Claude will ask us to confirm the use of each tool in the MCP Server the first time that it's called:

<Image img={MCPPermission} alt="Give permission to use the list_databases tool" size="md" />

Below you can see part of a conversation that includes some tool calls to the ClickHouse MCP Server:

<Image img={ClaudeConversation} alt="Claude conversation" size="md" />

</VerticalStepper>
