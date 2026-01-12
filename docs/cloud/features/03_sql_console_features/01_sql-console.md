---
sidebar_title: 'SQL console'
slug: /cloud/get-started/sql-console
description: 'Run queries and create visualizations using the SQL Console.'
keywords: ['sql console', 'sql client', 'cloud console', 'console']
title: 'SQL console'
doc_type: 'guide'
---

SQL console is the fastest and easiest way to explore and query your databases in ClickHouse Cloud. You can use the SQL console to:

- Connect to your ClickHouse Cloud Services
- View, filter, and sort table data
- Execute queries and visualize result data in just a few clicks
- Share queries with team members and collaborate more effectively.

### Exploring tables 

### Viewing table list and schema info 

An overview of tables contained in your ClickHouse instance can be found in the left sidebar area. Use the database selector at the top of the left bar to view the tables in a specific database

<img src="/images/cloud/sqlconsole/table-list-and-schema.png" alt="table list and schema"/>
Tables in the list can also be expanded to view columns and types

<img src="/images/cloud/sqlconsole/view-columns.png" alt="view columns"/>

### Exploring table data 

Click on a table in the list to open it in a new tab. In the Table View, data can be easily viewed, selected, and copied. Note that structure and formatting are preserved when copy-pasting to spreadsheet applications such as Microsoft Excel and Google Sheets. You can flip between pages of table data (paginated in 30-row increments) using the navigation in the footer.

<img src="/images/cloud/sqlconsole/abc.png" alt="abc"/>

### Inspecting cell data 

The Cell Inspector tool can be used to view large amounts of data contained within a single cell. To open it, right-click on a cell and select 'Inspect Cell'. The contents of the cell inspector can be copied by clicking the copy icon in the top right corner of the inspector contents.

<img src="/images/cloud/sqlconsole/inspecting-cell-content.png" alt="inspecting cell content"/>

## Filtering and sorting tables 

### Sorting a table 

To sort a table in the SQL console, open a table and select the 'Sort' button in the toolbar. This button will open a menu that will allow you to configure your sort. You can choose a column by which you want to sort and configure the ordering of the sort (ascending or descending). Select 'Apply' or press Enter to sort your table

<img src="/images/cloud/sqlconsole/sort-descending-on-column.png" alt="sort descending on a column"/>

The SQL console also allows you to add multiple sorts to a table. Click the 'Sort' button again to add another sort. 

<Note>
Sorts are applied in the order that they appear in the sort pane (top to bottom). To remove a sort, simply click the 'x' button next to the sort.
</Note>

### Filtering a table 

To filter a table in the SQL console, open a table and select the 'Filter' button. Just like sorting, this button will open a menu that will allow you to configure your filter. You can choose a column by which to filter and select the necessary criteria. The SQL console intelligently displays filter options that correspond to the type of data contained in the column.

<img src="/images/cloud/sqlconsole/filter-on-radio-column-equal-gsm.png" alt="filter on the radio column equal to GSM"/>

When you're happy with your filter, you can select 'Apply' to filter your data. You can also add additional filters as shown below.

<img src="/images/cloud/sqlconsole/add-more-filters.png" alt="Add a filter on range greater than 2000"/>

Similar to the sort functionality, click the 'x' button next to a filter to remove it.

### Filtering and sorting together 

The SQL console allows you to filter and sort a table at the same time. To do this, add all desired filters and sorts using the steps described above and click the 'Apply' button.

<img src="/images/cloud/sqlconsole/filtering-and-sorting-together.png" alt="Add a filter on range greater than 2000"/>

### Creating a query from filters and sorts 

The SQL console can convert your sorts and filters directly into queries with one click. Simply select the 'Create Query' button from the toolbar with the sort and filter parameters of your choosing. After clicking 'Create query', a new query tab will open pre-populated with the SQL command corresponding to the data contained in your table view.

<img src="/images/cloud/sqlconsole/create-a-query-from-sorts-and-filters.png" alt="Create a query from sorts and filters"/>

<Note>
Filters and sorts are not mandatory when using the 'Create Query' feature.
</Note>

You can learn more about querying in the SQL console by reading the (link) query documentation.

## Creating and running a query 

### Creating a query 

There are two ways to create a new query in the SQL console.

- Click the '+' button in the tab bar
- Select the 'New Query' button from the left sidebar query list

<img src="/images/cloud/sqlconsole/creating-a-query.png" alt="Creating a query"/>

### Running a query 

To run a query, type your SQL command(s) into the SQL Editor and click the 'Run' button or use the shortcut `cmd / ctrl + enter`. To write and run multiple commands sequentially, make sure to add a semicolon after each command.

Query Execution Options
By default, clicking the run button will run all commands contained in the SQL Editor. The SQL console supports two other query execution options:

- Run selected command(s)
- Run command at the cursor

To run selected command(s), highlight the desired command or sequence of commands and click the 'Run' button (or use the `cmd / ctrl + enter` shortcut). You can also select 'Run selected' from the SQL Editor context menu (opened by right-clicking anywhere within the editor) when a selection is present.

<img src="/images/cloud/sqlconsole/run-selected-query.png" alt="run selected query"/>

Running the command at the current cursor position can be achieved in two ways:

- Select 'At Cursor' from the extended run options menu (or use the corresponding `cmd / ctrl + shift + enter` keyboard shortcut

<img src="/images/cloud/sqlconsole/run-at-cursor-2.png" alt="run at cursor"/>

- Selecting 'Run at cursor' from the SQL Editor context menu

<img src="/images/cloud/sqlconsole/run-at-cursor.png" alt="run at cursor"/>

<Note>
The command present at the cursor position will flash yellow on execution.
</Note>

### Canceling a query 

While a query is running, the 'Run' button in the Query Editor toolbar will be replaced with a 'Cancel' button. Simply click this button or press `Esc` to cancel the query. Note: Any results that have already been returned will persist after cancellation.

<img src="/images/cloud/sqlconsole/cancel-a-query.png" alt="Cancel a query"/>

### Saving a query 

Saving queries allows you to easily find them later and share them with your teammates. The SQL console also allows you to organize your queries into folders.

To save a query, simply click the "Save" button immediately next to the "Run" button in the toolbar. Input the desired name and click "Save Query".

<Note>
Using the shortcut `cmd / ctrl` + s will also save any work in the current query tab.
</Note>

<img src="/images/cloud/sqlconsole/sql-console-save-query.png" alt="Save query"/>

Alternatively, you can simultaneously name and save a query by clicking on "Untitled Query" in the toolbar, adjusting the name, and hitting Enter:

<img src="/images/cloud/sqlconsole/sql-console-rename.png" alt="Rename query"/>

### Query sharing 

The SQL console allows you to easily share queries with your team members. The SQL console supports four levels of access that can be adjusted both globally and on a per-user basis:

- Owner (can adjust sharing options)
- Write access
- Read-only access
- No access

After saving a query, click the "Share" button in the toolbar. A modal with sharing options will appear:

<img src="/images/cloud/sqlconsole/sql-console-share.png" alt="Share query"/>

To adjust query access for all organization members with access to the service, simply adjust the access level selector in the top line:

<img src="/images/cloud/sqlconsole/sql-console-edit-access.png" alt="Edit access"/>

After applying the above, the query can now be viewed (and executed) by all team members with access to the SQL console for the service.

To adjust query access for specific members, select the desired team member from the "Add a team member" selector:

<img src="/images/cloud/sqlconsole/sql-console-add-team.png" alt="Add team member"/>

After selecting a team member, a new line item should appear with an access level selector:

<img src="/images/cloud/sqlconsole/sql-console-edit-member.png" alt="Edit team member access"/>

### Accessing shared queries 

If a query has been shared with you, it will be displayed in the "Queries" tab of the SQL console left sidebar:

<img src="/images/cloud/sqlconsole/sql-console-access-queries.png" alt="Access queries"/>

### Linking to a query (permalinks) 

Saved queries are also permalinked, meaning that you can send and receive links to shared queries and open them directly.

Values for any parameters that may exist in a query are automatically added to the saved query URL as query parameters. For example, if a query contains `{start_date: Date}` and `{end_date: Date}` parameters, the permalink can look like: `https://console.clickhouse.cloud/services/:serviceId/console/query/:queryId?param_start_date=2015-01-01&param_end_date=2016-01-01`.

## Advanced querying features 

### Searching query results 

After a query is executed, you can quickly search through the returned result set using the search input in the result pane. This feature assists in previewing the results of an additional `WHERE` clause or simply checking to ensure that specific data is included in the result set. After inputting a value into the search input, the result pane will update and return records containing an entry that matches the inputted value. In this example, we'll look for all instances of `breakfast` in the `hackernews` table for comments that contain `ClickHouse` (case-insensitive):

<img src="/images/cloud/sqlconsole/search-hn.png" alt="Search Hacker News Data"/>

Note: Any field matching the inputted value will be returned. For example, the third record in the above screenshot does not match 'breakfast' in the `by` field, but the `text` field does:

<img src="/images/cloud/sqlconsole/match-in-body.png" alt="Match in body"/>

### Adjusting pagination settings 

By default, the query result pane will display every result record on a single page. For larger result sets, it may be preferable to paginate results for easier viewing. This can be accomplished using the pagination selector in the bottom right corner of the result pane:

<img src="/images/cloud/sqlconsole/pagination.png" alt="Pagination options"/>

Selecting a page size will immediately apply pagination to the result set and navigation options will appear in the middle of the result pane footer

<img src="/images/cloud/sqlconsole/pagination-nav.png" alt="Pagination navigation"/>

### Exporting query result data 

Query result sets can be easily exported to CSV format directly from the SQL console. To do so, open the `•••` menu on the right side of the result pane toolbar and select 'Download as CSV'.

<img src="/images/cloud/sqlconsole/download-as-csv.png" alt="Download as CSV"/>

## Visualizing query data 

Some data can be more easily interpreted in chart form. You can quickly create visualizations from query result data directly from the SQL console in just a few clicks. As an example, we'll use a query that calculates weekly statistics for NYC taxi trips:

```sql
SELECT
   toStartOfWeek(pickup_datetime) AS week,
   sum(total_amount) AS fare_total,
   sum(trip_distance) AS distance_total,
   count(*) AS trip_total
FROM
   nyc_taxi
GROUP BY
   1
ORDER BY
   1 ASC
```

<img src="/images/cloud/sqlconsole/tabular-query-results.png" alt="Tabular query results"/>

Without visualization, these results are difficult to interpret. Let's turn them into a chart.

### Creating charts 

To begin building your visualization, select the 'Chart' option from the query result pane toolbar. A chart configuration pane will appear:

<img src="/images/cloud/sqlconsole/switch-from-query-to-chart.png" alt="Switch from query to chart"/>

We'll start by creating a simple bar chart tracking `trip_total` by `week`. To accomplish this, we'll drag the `week` field to the x-axis and the `trip_total` field to the y-axis:

<img src="/images/cloud/sqlconsole/trip-total-by-week.png" alt="Trip total by week"/>

Most chart types support multiple fields on numeric axes. To demonstrate, we'll drag the fare_total field onto the y-axis:

<img src="/images/cloud/sqlconsole/bar-chart.png" alt="Bar chart"/>

### Customizing charts 

The SQL console supports ten chart types that can be selected from the chart type selector in the chart configuration pane. For example, we can easily change the previous chart type from Bar to an Area:

<img src="/images/cloud/sqlconsole/change-from-bar-to-area.png" alt="Change from Bar chart to Area"/>

Chart titles match the name of the query supplying the data. Updating the name of the query will cause the Chart title to update as well:

<img src="/images/cloud/sqlconsole/update-query-name.png" alt="Update query name"/>

A number of more advanced chart characteristics can also be adjusted in the 'Advanced' section of the chart configuration pane. To begin, we'll adjust the following settings:

- Subtitle
- Axis titles
- Label orientation for the x-axis

Our chart will be updated accordingly:

<img src="/images/cloud/sqlconsole/update-subtitle-etc.png" alt="Update subtitle etc."/>

In some scenarios, it may be necessary to adjust the axis scales for each field independently. This can also be accomplished in the 'Advanced' section of the chart configuration pane by specifying min and max values for an axis range. As an example, the above chart looks good, but in order to demonstrate the correlation between our `trip_total` and `fare_total` fields, the axis ranges need some adjustment:

<img src="/images/cloud/sqlconsole/adjust-axis-scale.png" alt="Adjust axis scale"/>
