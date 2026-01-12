---
sidebarTitle: 'Quick Start'
sidebar_position: 1
slug: /integrations/grafana
description: 'Introduction to using ClickHouse with Grafana'
title: 'ClickHouse data source plugin for Grafana'
show_related_blogs: true
doc_type: 'guide'
integration:
  - support_level: 'partner'
  - category: 'data_visualization'
  - website: 'https://grafana.com/grafana/plugins/grafana-clickhouse-datasource/'
keywords: ['Grafana', 'data visualization', 'dashboard', 'plugin', 'data source']
---

import ClickHouseSupportedBadge from '/snippets/components/ClickHouseSupported/ClickHouseSupported.jsx'

import GatherYourDetailsNative from '/snippets/_gather_your_details_native.mdx';

<ClickHouseSupportedBadge/>

With Grafana you can explore and share all of your data through dashboards.
Grafana requires a plugin to connect to ClickHouse, which is easily installed within their UI.

<Frame>
  <iframe src="//www.youtube.com/embed/bRce9xWiqQM"
    width="640"
    height="360"
    frameborder="0"
    allow="autoplay;
    fullscreen;
    picture-in-picture"
    allowfullscreen>
  </iframe>
</Frame>

## 1. Gather your connection details 

<GatherYourDetailsNative />

## 2. Making a read-only user 

When connecting ClickHouse to a data visualization tool like Grafana, it is recommended to make a read-only user to protect your data from unwanted modifications.

Grafana does not validate that queries are safe. Queries can contain any SQL statement, including `DELETE` and `INSERT`.

To configure a read-only user, follow these steps:
1. Create a `readonly` user profile following the [Creating Users and Roles in ClickHouse](/operations/access-rights) guide.
2. Ensure the `readonly` user has enough permission to modify the `max_execution_time` setting required by the underlying [clickhouse-go client](https://github.com/ClickHouse/clickhouse-go).
3. If you're using a public ClickHouse instance, it is not recommended to set `readonly=2` in the `readonly` profile. Instead, leave `readonly=1` and set the constraint type of `max_execution_time` to [changeable_in_readonly](/operations/settings/constraints-on-settings) to allow modification of this setting.

## 3.  Install the ClickHouse plugin for Grafana 

Before Grafana can connect to ClickHouse, you need to install the appropriate Grafana plugin. Assuming you are logged in to Grafana, follow these steps:

1. From the **Connections** page in the sidebar, select the **Add new connection** tab.

2. Search for **ClickHouse** and click on the signed plugin by Grafana Labs:

    <Image size="md" img={search} alt="Select the ClickHouse plugin on the connections page" border />

3. On the next screen, click the **Install** button:

    <Image size="md" img={install} alt="Install the ClickHouse plugin" border />

## 4. Define a ClickHouse data source 

1. Once the installation is complete, click the **Add new data source** button. (You can also add a data source from the **Data sources** tab on the **Connections** page.)

    <Image size="md" img={add_new_ds} alt="Create a ClickHouse data source" border />

2. Either scroll down and find the **ClickHouse** data source type, or you can search for it in the search bar of the **Add data source** page. Select the **ClickHouse** data source and the following page will appear:

  <Image size="md" img={quick_config} alt="Connection configuration page" border />

3. Enter your server settings and credentials. The key settings are:

- **Server host address:** the hostname of your ClickHouse service.
- **Server port:** the port for your ClickHouse service. Will be different depending on server configuration and protocol.
- **Protocol** the protocol used to connect to your ClickHouse service.
- **Secure connection** enable if your server requires a secure connection.
- **Username** and **Password**: enter your ClickHouse user credentials. If you have not configured any users, try `default` for the username. It is recommended to [configure a read-only user](#2-making-a-read-only-user).

For more settings, check the [plugin configuration](./config.md) documentation.

4. Click the **Save & test** button to verify that Grafana can connect to your ClickHouse service. If successful, you will see a **Data source is working** message:

    <Image size="md" img={valid_ds} alt="Select Save & test" border />

## 5. Next steps 

Your data source is now ready to use! Learn more about how to build queries with the [query builder](./query-builder.md).

For more details on configuration, check the [plugin configuration](./config.md) documentation.

If you're looking for more information that is not included in these docs, check the [plugin repository on GitHub](https://github.com/grafana/clickhouse-datasource).

## Upgrading plugin versions 

Starting with v4, configurations and queries are able to be upgraded as new versions are released.

Configurations and queries from v3 are migrated to v4 as they are opened. While the old configurations and dashboards will load in v4, the migration is not persisted until they are saved again in the new version. If you notice any issues when opening an old configuration/query, discard your changes and [report the issue on GitHub](https://github.com/grafana/clickhouse-datasource/issues).

The plugin cannot downgrade to previous versions if the configuration/query was created with a newer version.
