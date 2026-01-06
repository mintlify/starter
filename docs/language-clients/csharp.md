---
sidebarTitle: 'C#'
sidebar_position: 6
keywords: ['clickhouse', 'cs', 'c#', '.net', 'dotnet', 'csharp', 'client', 'driver', 'connect', 'integrate']
slug: /integrations/csharp
description: 'The official C# client for connecting to ClickHouse.'
title: 'ClickHouse C# Driver'
doc_type: 'guide'
integration:
  - support_level: 'core'
  - category: 'language_client'
  - website: 'https://github.com/ClickHouse/clickhouse-cs'
---

The official C# client for connecting to ClickHouse. 
The client source code is available in the [GitHub repository](https://github.com/ClickHouse/clickhouse-cs).
Originally developed by [Oleg V. Kozlyuk](https://github.com/DarkWanderer).

## Migration guide [#migration-guide]
1. Update `.csproj` with `ClickHouse.Driver` name and [the latest version of the package](https://www.nuget.org/packages/ClickHouse.Driver).
2. Update your code to use the new `ClickHouse.Driver` namespace and classes.

## Supported .NET Versions [#supported-net-versions]

`ClickHouse.Driver` supports the following .NET versions:
* .NET Framework 4.6.2
* .NET Framework 4.8
* .NET Standard 2.1
* .NET 6.0
* .NET 8.0
* .NET 9.0

## Installation [#installation]

Install the package from NuGet:

```bash
dotnet add package ClickHouse.Driver
```

Or using the NuGet Package Manager:

```bash
Install-Package ClickHouse.Driver
```

## Usage [#usage]

### Creating a Connection [#creating-a-connection]

Create a connection using a connection string:

```csharp
using ClickHouse.Driver.ADO;

var connectionString = "Host=localhost;Protocol=http;Database=default;Username=default;Password=";

using (var connection = new ClickHouseConnection(connectionString))
{
    connection.Open();
}
```

### Creating a Table [#creating-a-table]

Create a table using standard SQL syntax:

```csharp
using ClickHouse.Driver.ADO;

using (var connection = new ClickHouseConnection(connectionString))
{
    connection.Open();

    using (var command = connection.CreateCommand())
    {
        command.CommandText = "CREATE TABLE IF NOT EXISTS default.my_table (id Int64, name String) ENGINE = Memory";
        command.ExecuteNonQuery();
    }
}
```

### Inserting Data [#inserting-data]

Insert data using parameterized queries:

```csharp
using ClickHouse.Driver.ADO;

using (var connection = new ClickHouseConnection(connectionString))
{
    connection.Open();

    using (var command = connection.CreateCommand())
    {
        command.AddParameter("id", "Int64", 1);
        command.AddParameter("name", "String", "test");
        command.CommandText = "INSERT INTO default.my_table (id, name) VALUES ({id:Int64}, {name:String})";
        command.ExecuteNonQuery();
    }
}
```

### Bulk Insert [#bulk-insert]

```csharp
using ClickHouse.Driver.ADO;
using ClickHouse.Driver.Copy;

using (var connection = new ClickHouseConnection(connectionString))
{
    connection.Open();

    using var bulkInsert = new ClickHouseBulkCopy(connection)
    {
        DestinationTableName = "default.my_table",
        MaxDegreeOfParallelism = 2,
        BatchSize = 100
    };
    
    var values = Enumerable.Range(0, 100).Select(i => new object[] { (long)i, "value" + i.ToString() });
    await bulkInsert.WriteToServerAsync(values);
    Console.WriteLine($"Rows written: {bulkInsert.RowsWritten}");
}
```

### Performing SELECT Queries [#performing-select-queries]

Execute SELECT queries and process results:

```csharp
using ClickHouse.Client.ADO;
using System.Data;

using (var connection = new ClickHouseConnection(connectionString))
{
    connection.Open();
    
    using (var command = connection.CreateCommand())
    {
        command.AddParameter("id", "Int64", 10);
        command.CommandText = "SELECT * FROM default.my_table WHERE id < {id:Int64}";
        using var reader = command.ExecuteReader();
        while (reader.Read())
        {
            Console.WriteLine($"select: Id: {reader.GetInt64(0)}, Name: {reader.GetString(1)}");
        }
    }
}
```
### Raw streaming [#raw-streaming]
```csharp
using var command = connection.CreateCommand();
command.Text = "SELECT * FROM default.my_table LIMIT 100 FORMAT JSONEachRow";
using var result = await command.ExecuteRawResultAsync(CancellationToken.None);
using var stream = await result.ReadAsStreamAsync();
using var reader = new StreamReader(stream);
var json = reader.ReadToEnd();
```

## Supported Data Types [#supported-data-types]

`ClickHouse.Driver` supports the following ClickHouse data types:
**Boolean Type**
* `Bool` (bool)

**Numeric Types**:
* `Int8` (sbyte)
* `Int16` (short)
* `Int32` (int)
* `Int64` (long)
* `Int128` (BigInteger)
* `Int256` (BigInteger)
* `UInt8` (byte)
* `UInt16` (ushort)
* `UInt32` (uint)
* `UInt64` (ulong)
* `UInt128` (BigInteger)
* `UInt256` (BigInteger)
* `Float32` (float)
* `Float64` (double)
* `Decimal` (decimal)
* `Decimal32` (decimal)
* `Decimal64` (decimal)
* `Decimal256` (BigDecimal)

**String Types**
* `String` (string)
* `FixedString` (string)

**Date and Time Types**
* `Date` (DateTime)
* `Date32` (DateTime)
* `DateTime` (DateTime)
* `DateTime32` (DateTime)
* `DateTime64` (DateTime)

**Network Types**
* `IPv4` (IPAddress)
* `IPv6` (IPAddress)

**Geo Types**
* `Point` (Tuple)
* `Ring` (Array of Points)
* `Polygon` (Array of Rings)

**Complex Types**
* `Array` (Array of any type)
* `Tuple` (Tuple of any types)
* `Nullable` (Nullable version of any type)

### DateTime handling [#datetime-handling]
`ClickHouse.Driver` tries to correctly handle timezones and `DateTime.Kind` property. Specifically:

`DateTime` values are returned as UTC. User can then convert them themselves or use `ToLocalTime()` method on `DateTime` instance.
When inserting, `DateTime` values are handled in following way:
- UTC `DateTime` are inserted as is, because ClickHouse stores them in UTC internally
- Local `DateTime` are converted to UTC according to user's local timezone settings
- Unspecified `DateTime` are considered to be in target column's timezone, and hence are converted to UTC according to that timezone
