---
description: 'Documentation for Functions for Working with UUIDs'
sidebarTitle: 'UUIDs'
slug: /sql-reference/functions/uuid-functions
title: 'Functions for Working with UUIDs'
doc_type: 'reference'
---

import {DeprecatedBadge} from '/snippets/components/DeprecatedBadge/DeprecatedBadge.jsx'

## UUIDv7 generation 

The generated UUID contains a 48-bit timestamp in Unix milliseconds, followed by version "7" (4 bits), a counter (42 bits) to distinguish UUIDs within a millisecond (including a variant field "2", 2 bits), and a random field (32 bits).
For any given timestamp (`unix_ts_ms`), the counter starts at a random value and is incremented by 1 for each new UUID until the timestamp changes. In case the counter overflows, the timestamp field is incremented by 1 and the counter is reset to a random new start value.
The UUID generation functions guarantee that the counter field within a timestamp increments monotonically across all function invocations in concurrently running threads and queries.

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤
|                           unix_ts_ms                          |
├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤
|          unix_ts_ms           |  ver  |   counter_high_bits   |
├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤
|var|                   counter_low_bits                        |
├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤
|                            rand_b                             |
└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘
```

## Snowflake ID generation 

The generated Snowflake ID contains the current Unix timestamp in milliseconds (41 + 1 top zero bits), followed by a machine id (10 bits), and a counter (12 bits) to distinguish IDs within a millisecond. For any given timestamp (`unix_ts_ms`), the counter starts at 0 and is incremented by 1 for each new Snowflake ID until the timestamp changes. In case the counter overflows, the timestamp field is incremented by 1 and the counter is reset to 0.

<Note>
The generated Snowflake IDs are based on the UNIX epoch 1970-01-01. While no standard or recommendation exists for the epoch of Snowflake IDs, implementations in other systems may use a different epoch, e.g. Twitter/X (2010-11-04) or Mastodon (2015-01-01).
</Note>

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
├─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤
|0|                         timestamp                           |
├─┼                 ┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┼─┤
|                   |     machine_id    |    machine_seq_num    |
└─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘
```


## generateUUIDv4 

Generates a [version 4](https://tools.ietf.org/html/rfc4122#section-4.4) [UUID](../data-types/uuid.md).

**Syntax**

```sql
generateUUIDv4([expr])
```

**Arguments**

- `expr` — An arbitrary [expression](/sql-reference/syntax#expressions) used to bypass [common subexpression elimination](/sql-reference/functions/overview#common-subexpression-elimination) if the function is called multiple times in a query. The value of the expression has no effect on the returned UUID. Optional.

**Returned value**

A value of type UUIDv4.

**Example**

First, create a table with a column of type UUID, then insert a generated UUIDv4 into the table.

```sql
CREATE TABLE tab (uuid UUID) ENGINE = Memory;

INSERT INTO tab SELECT generateUUIDv4();

SELECT * FROM tab;
```

Result:

```response
┌─────────────────────────────────uuid─┐
│ f4bf890f-f9dc-4332-ad5c-0c18e73f28e9 │
└──────────────────────────────────────┘
```

**Example with multiple UUIDs generated per row**

```sql
SELECT generateUUIDv4(1), generateUUIDv4(2);

┌─generateUUIDv4(1)────────────────────┬─generateUUIDv4(2)────────────────────┐
│ 2d49dc6e-ddce-4cd0-afb8-790956df54c1 │ 8abf8c13-7dea-4fdf-af3e-0e18767770e6 │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

## generateUUIDv7 

Generates a [version 7](https://datatracker.ietf.org/doc/html/draft-peabody-dispatch-new-uuid-format-04) [UUID](../data-types/uuid.md).

See section ["UUIDv7 generation"](#uuidv7-generation) for details on UUID structure, counter management, and concurrency guarantees.
 
<Note>
As of April 2024, version 7 UUIDs are in draft status and their layout may change in future.
</Note>

**Syntax**

```sql
generateUUIDv7([expr])
```

**Arguments**

- `expr` — An arbitrary [expression](/sql-reference/syntax#expressions) used to bypass [common subexpression elimination](/sql-reference/functions/overview#common-subexpression-elimination) if the function is called multiple times in a query. The value of the expression has no effect on the returned UUID. Optional.

**Returned value**

A value of type UUIDv7.

**Example**

First, create a table with a column of type UUID, then insert a generated UUIDv7 into the table.

```sql
CREATE TABLE tab (uuid UUID) ENGINE = Memory;

INSERT INTO tab SELECT generateUUIDv7();

SELECT * FROM tab;
```

Result:

```response
┌─────────────────────────────────uuid─┐
│ 018f05af-f4a8-778f-beee-1bedbc95c93b │
└──────────────────────────────────────┘
```

**Example with multiple UUIDs generated per row**

```sql
SELECT generateUUIDv7(1), generateUUIDv7(2);

┌─generateUUIDv7(1)────────────────────┬─generateUUIDv7(2)────────────────────┐
│ 018f05c9-4ab8-7b86-b64e-c9f03fbd45d1 │ 018f05c9-4ab8-7b86-b64e-c9f12efb7e16 │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

## dateTimeToUUIDv7 

Converts a [DateTime](../data-types/datetime.md) value to a [UUIDv7](https://en.wikipedia.org/wiki/UUID#Version_7) at the given time.

See section ["UUIDv7 generation"](#uuidv7-generation) for details on UUID structure, counter management, and concurrency guarantees.

<Note>
As of April 2024, version 7 UUIDs are in draft status and their layout may change in future.
</Note>

**Syntax**

```sql
dateTimeToUUIDv7(value)
```

**Arguments**

- `value` — Date with time. [DateTime](../data-types/datetime.md).

**Returned value**

A value of type UUIDv7.

**Example**

```sql
SELECT dateTimeToUUIDv7(toDateTime('2021-08-15 18:57:56', 'Asia/Shanghai'));
```

Result:

```response
┌─dateTimeToUUIDv7(toDateTime('2021-08-15 18:57:56', 'Asia/Shanghai'))─┐
│ 018f05af-f4a8-778f-beee-1bedbc95c93b                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Example with multiple UUIDs for the same timestamp**

```sql
SELECT dateTimeToUUIDv7(toDateTime('2021-08-15 18:57:56'));
SELECT dateTimeToUUIDv7(toDateTime('2021-08-15 18:57:56'));
```

**Result**

```response
   ┌─dateTimeToUUIDv7(t⋯08-15 18:57:56'))─┐
1. │ 017b4b2d-7720-76ed-ae44-bbcc23a8c550 │
   └──────────────────────────────────────┘

   ┌─dateTimeToUUIDv7(t⋯08-15 18:57:56'))─┐
1. │ 017b4b2d-7720-76ed-ae44-bbcf71ed0fd3 │
   └──────────────────────────────────────┘
```

The function ensures that multiple calls with the same timestamp generate unique, monotonically increasing UUIDs.

## empty 

Checks whether the input UUID is empty.

**Syntax**

```sql
empty(UUID)
```

The UUID is considered empty if it contains all zeros (zero UUID).

The function also works for Arrays and Strings.

**Arguments**

- `x` — A UUID. [UUID](../data-types/uuid.md).

**Returned value**

- Returns `1` for an empty UUID or `0` for a non-empty UUID. [UInt8](../data-types/int-uint.md).

**Example**

To generate the UUID value, ClickHouse provides the [generateUUIDv4](#generateuuidv4) function.

Query:

```sql
SELECT empty(generateUUIDv4());
```

Result:

```response
┌─empty(generateUUIDv4())─┐
│                       0 │
└─────────────────────────┘
```

## notEmpty 

Checks whether the input UUID is non-empty.

**Syntax**

```sql
notEmpty(UUID)
```

The UUID is considered empty if it contains all zeros (zero UUID).

The function also works for Arrays and Strings.

**Arguments**

- `x` — A UUID. [UUID](../data-types/uuid.md).

**Returned value**

- Returns `1` for a non-empty UUID or `0` for an empty UUID. [UInt8](../data-types/int-uint.md).

**Example**

To generate the UUID value, ClickHouse provides the [generateUUIDv4](#generateuuidv4) function.

Query:

```sql
SELECT notEmpty(generateUUIDv4());
```

Result:

```response
┌─notEmpty(generateUUIDv4())─┐
│                          1 │
└────────────────────────────┘
```

## toUUID 

Converts a value of type String to a UUID.

```sql
toUUID(string)
```

**Returned value**

The UUID type value.

**Usage example**

```sql
SELECT toUUID('61f0c404-5cb3-11e7-907b-a6006ad3dba0') AS uuid
```

Result:

```response
┌─────────────────────────────────uuid─┐
│ 61f0c404-5cb3-11e7-907b-a6006ad3dba0 │
└──────────────────────────────────────┘
```

## toUUIDOrDefault 

**Arguments**

- `string` — String of 36 characters or FixedString(36). [String](../syntax.md#string).
- `default` — UUID to be used as the default if the first argument cannot be converted to a UUID type. [UUID](../data-types/uuid.md).

**Returned value**

UUID

```sql
toUUIDOrDefault(string, default)
```

**Returned value**

The UUID type value.

**Usage examples**

This first example returns the first argument converted to a UUID type as it can be converted:

```sql
SELECT toUUIDOrDefault('61f0c404-5cb3-11e7-907b-a6006ad3dba0', cast('59f0c404-5cb3-11e7-907b-a6006ad3dba0' AS UUID));
```

Result:

```response
┌─toUUIDOrDefault('61f0c404-5cb3-11e7-907b-a6006ad3dba0', CAST('59f0c404-5cb3-11e7-907b-a6006ad3dba0', 'UUID'))─┐
│ 61f0c404-5cb3-11e7-907b-a6006ad3dba0                                                                          │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

This second example returns the second argument (the provided default UUID) as the first argument cannot be converted to a UUID type:

```sql
SELECT toUUIDOrDefault('-----61f0c404-5cb3-11e7-907b-a6006ad3dba0', cast('59f0c404-5cb3-11e7-907b-a6006ad3dba0' AS UUID));
```

Result:

```response
┌─toUUIDOrDefault('-----61f0c404-5cb3-11e7-907b-a6006ad3dba0', CAST('59f0c404-5cb3-11e7-907b-a6006ad3dba0', 'UUID'))─┐
│ 59f0c404-5cb3-11e7-907b-a6006ad3dba0                                                                               │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## toUUIDOrNull 

Takes an argument of type String and tries to parse it into UUID. If failed, returns NULL.

```sql
toUUIDOrNull(string)
```

**Returned value**

The Nullable(UUID) type value.

**Usage example**

```sql
SELECT toUUIDOrNull('61f0c404-5cb3-11e7-907b-a6006ad3dba0T') AS uuid
```

Result:

```response
┌─uuid─┐
│ ᴺᵁᴸᴸ │
└──────┘
```

## toUUIDOrZero 

It takes an argument of type String and tries to parse it into UUID. If failed, returns zero UUID.

```sql
toUUIDOrZero(string)
```

**Returned value**

The UUID type value.

**Usage example**

```sql
SELECT toUUIDOrZero('61f0c404-5cb3-11e7-907b-a6006ad3dba0T') AS uuid
```

Result:

```response
┌─────────────────────────────────uuid─┐
│ 00000000-0000-0000-0000-000000000000 │
└──────────────────────────────────────┘
```

## UUIDStringToNum 

Accepts `string` containing 36 characters in the format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, and returns a [FixedString(16)](../data-types/fixedstring.md) as its binary representation, with its format optionally specified by `variant` (`Big-endian` by default).

**Syntax**

```sql
UUIDStringToNum(string[, variant = 1])
```

**Arguments**

- `string` — A [String](/sql-reference/data-types/string) of 36 characters or [FixedString](/sql-reference/data-types/string)
- `variant` — Integer, representing a variant as specified by [RFC4122](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.1). 1 = `Big-endian` (default), 2 = `Microsoft`.

**Returned value**

FixedString(16)

**Usage examples**

```sql
SELECT
    '612f3c40-5d3b-217e-707b-6a546a3d7b29' AS uuid,
    UUIDStringToNum(uuid) AS bytes
```

Result:

```response
┌─uuid─────────────────────────────────┬─bytes────────────┐
│ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │ a/<@];!~p{jTj={) │
└──────────────────────────────────────┴──────────────────┘
```

```sql
SELECT
    '612f3c40-5d3b-217e-707b-6a546a3d7b29' AS uuid,
    UUIDStringToNum(uuid, 2) AS bytes
```

Result:

```response
┌─uuid─────────────────────────────────┬─bytes────────────┐
│ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │ @</a;]~!p{jTj={) │
└──────────────────────────────────────┴──────────────────┘
```

## UUIDNumToString 

Accepts `binary` containing a binary representation of a UUID, with its format optionally specified by `variant` (`Big-endian` by default), and returns a string containing 36 characters in text format.

**Syntax**

```sql
UUIDNumToString(binary[, variant = 1])
```

**Arguments**

- `binary` — [FixedString(16)](../data-types/fixedstring.md) as a binary representation of a UUID.
- `variant` — Integer, representing a variant as specified by [RFC4122](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.1). 1 = `Big-endian` (default), 2 = `Microsoft`.

**Returned value**

String.

**Usage example**

```sql
SELECT
    'a/<@];!~p{jTj={)' AS bytes,
    UUIDNumToString(toFixedString(bytes, 16)) AS uuid
```

Result:

```response
┌─bytes────────────┬─uuid─────────────────────────────────┐
│ a/<@];!~p{jTj={) │ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │
└──────────────────┴──────────────────────────────────────┘
```

```sql
SELECT
    '@</a;]~!p{jTj={)' AS bytes,
    UUIDNumToString(toFixedString(bytes, 16), 2) AS uuid
```

Result:

```response
┌─bytes────────────┬─uuid─────────────────────────────────┐
│ @</a;]~!p{jTj={) │ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │
└──────────────────┴──────────────────────────────────────┘
```

## UUIDToNum 

Accepts a [UUID](../data-types/uuid.md) and returns its binary representation as a [FixedString(16)](../data-types/fixedstring.md), with its format optionally specified by `variant` (`Big-endian` by default). This function replaces calls to two separate functions `UUIDStringToNum(toString(uuid))` so no intermediate conversion from UUID to string is required to extract bytes from a UUID.

**Syntax**

```sql
UUIDToNum(uuid[, variant = 1])
```

**Arguments**

- `uuid` — [UUID](../data-types/uuid.md).
- `variant` — Integer, representing a variant as specified by [RFC4122](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.1). 1 = `Big-endian` (default), 2 = `Microsoft`.

**Returned value**

The binary representation of the UUID.

**Usage examples**

```sql
SELECT
    toUUID('612f3c40-5d3b-217e-707b-6a546a3d7b29') AS uuid,
    UUIDToNum(uuid) AS bytes
```

Result:

```response
┌─uuid─────────────────────────────────┬─bytes────────────┐
│ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │ a/<@];!~p{jTj={) │
└──────────────────────────────────────┴──────────────────┘
```

```sql
SELECT
    toUUID('612f3c40-5d3b-217e-707b-6a546a3d7b29') AS uuid,
    UUIDToNum(uuid, 2) AS bytes
```

Result:

```response
┌─uuid─────────────────────────────────┬─bytes────────────┐
│ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │ @</a;]~!p{jTj={) │
└──────────────────────────────────────┴──────────────────┘
```

## UUIDv7ToDateTime 

Returns the timestamp component of a UUID version 7.

**Syntax**

```sql
UUIDv7ToDateTime(uuid[, timezone])
```

**Arguments**

- `uuid` — [UUID](../data-types/uuid.md) of version 7.
- `timezone` — [Timezone name](../../operations/server-configuration-parameters/settings.md#timezone) for the returned value (optional). [String](../data-types/string.md).

**Returned value**

- Timestamp with milliseconds precision. If the UUID is not a valid version 7 UUID, it returns 1970-01-01 00:00:00.000. [DateTime64(3)](../data-types/datetime64.md).

**Usage examples**

```sql
SELECT UUIDv7ToDateTime(toUUID('018f05c9-4ab8-7b86-b64e-c9f03fbd45d1'))
```

Result:

```response
┌─UUIDv7ToDateTime(toUUID('018f05c9-4ab8-7b86-b64e-c9f03fbd45d1'))─┐
│                                          2024-04-22 15:30:29.048 │
└──────────────────────────────────────────────────────────────────┘
```

```sql
SELECT UUIDv7ToDateTime(toUUID('018f05c9-4ab8-7b86-b64e-c9f03fbd45d1'), 'America/New_York')
```

Result:

```response
┌─UUIDv7ToDateTime(toUUID('018f05c9-4ab8-7b86-b64e-c9f03fbd45d1'), 'America/New_York')─┐
│                                                              2024-04-22 08:30:29.048 │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

## serverUUID 

Returns the random UUID generated during the first start of the ClickHouse server. The UUID is stored in file `uuid` in the ClickHouse server directory (e.g. `/var/lib/clickhouse/`) and retained between server restarts.

**Syntax**

```sql
serverUUID()
```

**Returned value**

- The UUID of the server. [UUID](../data-types/uuid.md).

## generateSnowflakeID 

Generates a [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID).
This function guarantees that the counter field within a timestamp increments monotonically across all function invocations in concurrently running threads and queries.

See section ["Snowflake ID generation"](#snowflake-id-generation) for implementation details.

**Syntax**

```sql
generateSnowflakeID([expr, [machine_id]])
```

**Arguments**

- `expr` — An arbitrary [expression](/sql-reference/syntax#expressions) used to bypass [common subexpression elimination](/sql-reference/functions/overview#common-subexpression-elimination) if the function is called multiple times in a query. The value of the expression has no effect on the returned Snowflake ID. Optional.
- `machine_id` — A machine ID, the lowest 10 bits are used. [Int64](../data-types/int-uint.md). Optional.

**Returned value**

A value of type UInt64.

**Example**

First, create a table with a column of type UInt64, then insert a generated Snowflake ID into the table.

```sql
CREATE TABLE tab (id UInt64) ENGINE = Memory;

INSERT INTO tab SELECT generateSnowflakeID();

SELECT * FROM tab;
```

Result:

```response
┌──────────────────id─┐
│ 7199081390080409600 │
└─────────────────────┘
```

**Example with multiple Snowflake IDs generated per row**

```sql
SELECT generateSnowflakeID(1), generateSnowflakeID(2);

┌─generateSnowflakeID(1)─┬─generateSnowflakeID(2)─┐
│    7199081609652224000 │    7199081609652224001 │
└────────────────────────┴────────────────────────┘
```

**Example with expression and a machine ID**

```sql
SELECT generateSnowflakeID('expr', 1);

┌─generateSnowflakeID('expr', 1)─┐
│            7201148511606784002 │
└────────────────────────────────┘
```

## snowflakeToDateTime 

<DeprecatedBadge/>

<Warning>
This function is deprecated and can only be used if setting [allow_deprecated_snowflake_conversion_functions](../../operations/settings/settings.md#allow_deprecated_snowflake_conversion_functions) is enabled.
The function will be removed at some point in future.

Please use function [snowflakeIDToDateTime](#snowflakeidtodatetime) instead.
</Warning>

Extracts the timestamp component of a [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) in [DateTime](../data-types/datetime.md) format.

**Syntax**

```sql
snowflakeToDateTime(value[, time_zone])
```

**Arguments**

- `value` — Snowflake ID. [Int64](../data-types/int-uint.md).
- `time_zone` — [Timezone](/operations/server-configuration-parameters/settings.md#timezone). The function parses `time_string` according to the timezone. Optional. [String](../data-types/string.md).

**Returned value**

- The timestamp component of `value` as a [DateTime](../data-types/datetime.md) value.

**Example**

Query:

```sql
SELECT snowflakeToDateTime(CAST('1426860702823350272', 'Int64'), 'UTC');
```

Result:

```response

┌─snowflakeToDateTime(CAST('1426860702823350272', 'Int64'), 'UTC')─┐
│                                              2021-08-15 10:57:56 │
└──────────────────────────────────────────────────────────────────┘
```

## snowflakeToDateTime64 

<DeprecatedBadge/>

<Warning>
This function is deprecated and can only be used if setting [allow_deprecated_snowflake_conversion_functions](../../operations/settings/settings.md#allow_deprecated_snowflake_conversion_functions) is enabled.
The function will be removed at some point in future.

Please use function [snowflakeIDToDateTime64](#snowflakeidtodatetime64) instead.
</Warning>

Extracts the timestamp component of a [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) in [DateTime64](../data-types/datetime64.md) format.

**Syntax**

```sql
snowflakeToDateTime64(value[, time_zone])
```

**Arguments**

- `value` — Snowflake ID. [Int64](../data-types/int-uint.md).
- `time_zone` — [Timezone](/operations/server-configuration-parameters/settings.md#timezone). The function parses `time_string` according to the timezone. Optional. [String](../data-types/string.md).

**Returned value**

- The timestamp component of `value` as a [DateTime64](../data-types/datetime64.md) with scale = 3, i.e. millisecond precision.

**Example**

Query:

```sql
SELECT snowflakeToDateTime64(CAST('1426860802823350272', 'Int64'), 'UTC');
```

Result:

```response

┌─snowflakeToDateTime64(CAST('1426860802823350272', 'Int64'), 'UTC')─┐
│                                            2021-08-15 10:58:19.841 │
└────────────────────────────────────────────────────────────────────┘
```

## dateTimeToSnowflake 

<DeprecatedBadge/>

<Warning>
This function is deprecated and can only be used if setting [allow_deprecated_snowflake_conversion_functions](../../operations/settings/settings.md#allow_deprecated_snowflake_conversion_functions) is enabled.
The function will be removed at some point in future.

Please use function [dateTimeToSnowflakeID](#datetimetosnowflakeid) instead.
</Warning>

Converts a [DateTime](../data-types/datetime.md) value to the first [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) at the giving time.

**Syntax**

```sql
dateTimeToSnowflake(value)
```

**Arguments**

- `value` — Date with time. [DateTime](../data-types/datetime.md).

**Returned value**

- Input value converted to the [Int64](../data-types/int-uint.md) data type as the first Snowflake ID at that time.

**Example**

Query:

```sql
WITH toDateTime('2021-08-15 18:57:56', 'Asia/Shanghai') AS dt SELECT dateTimeToSnowflake(dt);
```

Result:

```response
┌─dateTimeToSnowflake(dt)─┐
│     1426860702823350272 │
└─────────────────────────┘
```

## dateTime64ToSnowflake 

<DeprecatedBadge/>

<Warning>
This function is deprecated and can only be used if setting [allow_deprecated_snowflake_conversion_functions](../../operations/settings/settings.md#allow_deprecated_snowflake_conversion_functions) is enabled.
The function will be removed at some point in future.

Please use function [dateTime64ToSnowflakeID](#datetime64tosnowflakeid) instead.
</Warning>

Converts a [DateTime64](../data-types/datetime64.md) to the first [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) at the giving time.

**Syntax**

```sql
dateTime64ToSnowflake(value)
```

**Arguments**

- `value` — Date with time. [DateTime64](../data-types/datetime64.md).

**Returned value**

- Input value converted to the [Int64](../data-types/int-uint.md) data type as the first Snowflake ID at that time.

**Example**

Query:

```sql
WITH toDateTime64('2021-08-15 18:57:56.492', 3, 'Asia/Shanghai') AS dt64 SELECT dateTime64ToSnowflake(dt64);
```

Result:

```response
┌─dateTime64ToSnowflake(dt64)─┐
│         1426860704886947840 │
└─────────────────────────────┘
```

## snowflakeIDToDateTime 

Returns the timestamp component of a [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) as a value of type [DateTime](../data-types/datetime.md).

**Syntax**

```sql
snowflakeIDToDateTime(value[, epoch[, time_zone]])
```

**Arguments**

- `value` — Snowflake ID. [UInt64](../data-types/int-uint.md).
- `epoch` - Epoch of the Snowflake ID in milliseconds since 1970-01-01. Defaults to 0 (1970-01-01). For the Twitter/X epoch (2015-01-01), provide 1288834974657. Optional. [UInt*](../data-types/int-uint.md).
- `time_zone` — [Timezone](/operations/server-configuration-parameters/settings.md#timezone). The function parses `time_string` according to the timezone. Optional. [String](../data-types/string.md).

**Returned value**

- The timestamp component of `value` as a [DateTime](../data-types/datetime.md) value.

**Example**

Query:

```sql
SELECT snowflakeIDToDateTime(7204436857747984384) AS res
```

Result:

```response
┌─────────────────res─┐
│ 2024-06-06 10:59:58 │
└─────────────────────┘
```

## snowflakeIDToDateTime64 

Returns the timestamp component of a [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) as a value of type [DateTime64](../data-types/datetime64.md).

**Syntax**

```sql
snowflakeIDToDateTime64(value[, epoch[, time_zone]])
```

**Arguments**

- `value` — Snowflake ID. [UInt64](../data-types/int-uint.md).
- `epoch` - Epoch of the Snowflake ID in milliseconds since 1970-01-01. Defaults to 0 (1970-01-01). For the Twitter/X epoch (2015-01-01), provide 1288834974657. Optional. [UInt*](../data-types/int-uint.md).
- `time_zone` — [Timezone](/operations/server-configuration-parameters/settings.md#timezone). The function parses `time_string` according to the timezone. Optional. [String](../data-types/string.md).

**Returned value**

- The timestamp component of `value` as a [DateTime64](../data-types/datetime64.md) with scale = 3, i.e. millisecond precision.

**Example**

Query:

```sql
SELECT snowflakeIDToDateTime64(7204436857747984384) AS res
```

Result:

```response
┌─────────────────res─┐
│ 2024-06-06 10:59:58 │
└─────────────────────┘
```

## dateTimeToSnowflakeID 

Converts a [DateTime](../data-types/datetime.md) value to the first [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) at the giving time.

**Syntax**

```sql
dateTimeToSnowflakeID(value[, epoch])
```

**Arguments**

- `value` — Date with time. [DateTime](../data-types/datetime.md).
- `epoch` - Epoch of the Snowflake ID in milliseconds since 1970-01-01. Defaults to 0 (1970-01-01). For the Twitter/X epoch (2015-01-01), provide 1288834974657. Optional. [UInt*](../data-types/int-uint.md).

**Returned value**

- Input value converted to [UInt64](../data-types/int-uint.md) as the first Snowflake ID at that time.

**Example**

Query:

```sql
SELECT toDateTime('2021-08-15 18:57:56', 'Asia/Shanghai') AS dt, dateTimeToSnowflakeID(dt) AS res;
```

Result:

```response
┌──────────────────dt─┬─────────────────res─┐
│ 2021-08-15 18:57:56 │ 6832626392367104000 │
└─────────────────────┴─────────────────────┘
```

## dateTime64ToSnowflakeID 

Convert a [DateTime64](../data-types/datetime64.md) to the first [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) at the giving time.

**Syntax**

```sql
dateTime64ToSnowflakeID(value[, epoch])
```

**Arguments**

- `value` — Date with time. [DateTime64](../data-types/datetime64.md).
- `epoch` - Epoch of the Snowflake ID in milliseconds since 1970-01-01. Defaults to 0 (1970-01-01). For the Twitter/X epoch (2015-01-01), provide 1288834974657. Optional. [UInt*](../data-types/int-uint.md).

**Returned value**

- Input value converted to [UInt64](../data-types/int-uint.md) as the first Snowflake ID at that time.

**Example**

Query:

```sql
SELECT toDateTime('2021-08-15 18:57:56.493', 3, 'Asia/Shanghai') AS dt, dateTime64ToSnowflakeID(dt) AS res;
```

Result:

```yaml
┌──────────────────────dt─┬─────────────────res─┐
│ 2021-08-15 18:57:56.493 │ 6832626394434895872 │
└─────────────────────────┴─────────────────────┘
```

## See also 

- [dictGetUUID](/sql-reference/functions/ext-dict-functions#other-functions)

{/* <!--
The inner content of the tags below are replaced at doc framework build time with
docs generated from system.functions. Please do not modify or remove the tags.
See: https://github.com/ClickHouse/clickhouse-docs/blob/main/contribute/autogenerated-documentation-from-source.md
--> */}

{/* <!--AUTOGENERATED_START--> */}
## UUIDNumToString <Badge intent="info" className="version-badge">v1.1+</Badge> 


Takes a binary representation of a UUID, with its format optionally specified by `variant` (`Big-endian` by default), and returns a string containing 36 characters in text format.
    

**Syntax**

```sql
UUIDNumToString(binary[, variant])
```

**Arguments**

- `binary` — Binary representation of a UUID. [`FixedString(16)`](/sql-reference/data-types/fixedstring)
- `variant` — Variant as specified by [RFC4122](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.1). 1 = `Big-endian` (default), 2 = `Microsoft`. [`(U)Int*`](/sql-reference/data-types/int-uint)


**Returned value**

Returns the UUID as a string. [`String`](/sql-reference/data-types/string)

**Examples**

**Usage example**

```sql title=Query
SELECT
    'a/<@];!~p{jTj={)' AS bytes,
    UUIDNumToString(toFixedString(bytes, 16)) AS uuid
```

```response title=Response
┌─bytes────────────┬─uuid─────────────────────────────────┐
│ a/<@];!~p{jTj={) │ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │
└──────────────────┴──────────────────────────────────────┘
```

**Microsoft variant**

```sql title=Query
SELECT
    '@</a;]~!p{jTj={)' AS bytes,
    UUIDNumToString(toFixedString(bytes, 16), 2) AS uuid
```

```response title=Response
┌─bytes────────────┬─uuid─────────────────────────────────┐
│ @</a;]~!p{jTj={) │ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │
└──────────────────┴──────────────────────────────────────┘
```



## UUIDStringToNum <Badge intent="info" className="version-badge">v1.1+</Badge> 


Accepts a string containing 36 characters in the format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`, and returns a [FixedString(16)](../data-types/fixedstring.md) as its binary representation, with its format optionally specified by `variant` (`Big-endian` by default).
    

**Syntax**

```sql
UUIDStringToNum(string[, variant = 1])
```

**Arguments**

- `string` — A string or fixed-string of 36 characters) [`String`](/sql-reference/data-types/string) or [`FixedString(36)`](/sql-reference/data-types/fixedstring)
- `variant` — Variant as specified by [RFC4122](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.1). 1 = `Big-endian` (default), 2 = `Microsoft`. [`(U)Int*`](/sql-reference/data-types/int-uint)


**Returned value**

Returns the binary representation of `string`. [`FixedString(16)`](/sql-reference/data-types/fixedstring)

**Examples**

**Usage example**

```sql title=Query
SELECT
    '612f3c40-5d3b-217e-707b-6a546a3d7b29' AS uuid,
    UUIDStringToNum(uuid) AS bytes
```

```response title=Response
┌─uuid─────────────────────────────────┬─bytes────────────┐
│ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │ a/<@];!~p{jTj={) │
└──────────────────────────────────────┴──────────────────┘
```

**Microsoft variant**

```sql title=Query
SELECT
    '612f3c40-5d3b-217e-707b-6a546a3d7b29' AS uuid,
    UUIDStringToNum(uuid, 2) AS bytes
```

```response title=Response
┌─uuid─────────────────────────────────┬─bytes────────────┐
│ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │ @</a;]~!p{jTj={) │
└──────────────────────────────────────┴──────────────────┘
```



## UUIDToNum <Badge intent="info" className="version-badge">v24.5+</Badge> 


Accepts a [UUID](../data-types/uuid.md) and returns its binary representation as a [FixedString(16)](../data-types/fixedstring.md), with its format optionally specified by `variant` (`Big-endian` by default).
This function replaces calls to two separate functions `UUIDStringToNum(toString(uuid))` so no intermediate conversion from UUID to string is required to extract bytes from a UUID.
    

**Syntax**

```sql
UUIDToNum(uuid[, variant = 1])
```

**Arguments**

- `uuid` — UUID. [`String`](/sql-reference/data-types/string) or [`FixedString`](/sql-reference/data-types/fixedstring)
- `variant` — Variant as specified by [RFC4122](https://datatracker.ietf.org/doc/html/rfc4122#section-4.1.1). 1 = `Big-endian` (default), 2 = `Microsoft`. [`(U)Int*`](/sql-reference/data-types/int-uint)


**Returned value**

Returns a binary representation of the UUID. [`FixedString(16)`](/sql-reference/data-types/fixedstring)

**Examples**

**Usage example**

```sql title=Query
SELECT
    toUUID('612f3c40-5d3b-217e-707b-6a546a3d7b29') AS uuid,
    UUIDToNum(uuid) AS bytes
```

```response title=Response
┌─uuid─────────────────────────────────┬─bytes────────────┐
│ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │ a/<@];!~p{jTj={) │
└──────────────────────────────────────┴──────────────────┘
```

**Microsoft variant**

```sql title=Query
SELECT
    toUUID('612f3c40-5d3b-217e-707b-6a546a3d7b29') AS uuid,
    UUIDToNum(uuid, 2) AS bytes
```

```response title=Response
┌─uuid─────────────────────────────────┬─bytes────────────┐
│ 612f3c40-5d3b-217e-707b-6a546a3d7b29 │ @</a;]~!p{jTj={) │
└──────────────────────────────────────┴──────────────────┘
```



## UUIDv7ToDateTime <Badge intent="info" className="version-badge">v24.5+</Badge> 


Returns the timestamp component of a UUID version 7.
    

**Syntax**

```sql
UUIDv7ToDateTime(uuid[, timezone])
```

**Arguments**

- `uuid` — A UUID version 7. [`String`](/sql-reference/data-types/string)
- `timezone` — Optional. [Timezone name](../../operations/server-configuration-parameters/settings.md#timezone) for the returned value. [`String`](/sql-reference/data-types/string)


**Returned value**

Returns a timestamp with milliseconds precision. If the UUID is not a valid version 7 UUID, it returns `1970-01-01 00:00:00.000`. [`DateTime64(3)`](/sql-reference/data-types/datetime64)

**Examples**

**Usage example**

```sql title=Query
SELECT UUIDv7ToDateTime(toUUID('018f05c9-4ab8-7b86-b64e-c9f03fbd45d1'))
```

```response title=Response
┌─UUIDv7ToDateTime(toUUID('018f05c9-4ab8-7b86-b64e-c9f03fbd45d1'))─┐
│                                          2024-04-22 15:30:29.048 │
└──────────────────────────────────────────────────────────────────┘
```

**With timezone**

```sql title=Query
SELECT UUIDv7ToDateTime(toUUID('018f05c9-4ab8-7b86-b64e-c9f03fbd45d1'), 'America/New_York')
```

```response title=Response
┌─UUIDv7ToDateTime(toUUID('018f05c9-4ab8-7b86-b64e-c9f03fbd45d1'), 'America/New_York')─┐
│                                                             2024-04-22 11:30:29.048 │
└─────────────────────────────────────────────────────────────────────────────────────┘
```



## dateTime64ToSnowflake <Badge intent="info" className="version-badge">v21.10+</Badge> 


<DeprecatedBadge/>

:::warning
This function is deprecated and can only be used if setting [`allow_deprecated_snowflake_conversion_functions`](../../operations/settings/settings.md#allow_deprecated_snowflake_conversion_functions) is enabled.
The function will be removed at some point in future.

Please use function [dateTime64ToSnowflakeID](#dateTime64ToSnowflakeID) instead.
:::

Converts a [DateTime64](../data-types/datetime64.md) to the first [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) at the giving time.
    

**Syntax**

```sql
dateTime64ToSnowflake(value)
```

**Arguments**

- `value` — Date with time. [`DateTime64`](/sql-reference/data-types/datetime64)


**Returned value**

Returns the input value converted as the first Snowflake ID at that time. [`Int64`](/sql-reference/data-types/int-uint)

**Examples**

**Usage example**

```sql title=Query
WITH toDateTime64('2021-08-15 18:57:56.492', 3, 'Asia/Shanghai') AS dt64 SELECT dateTime64ToSnowflake(dt64);
```

```response title=Response
┌─dateTime64ToSnowflake(dt64)─┐
│         1426860704886947840 │
└─────────────────────────────┘
```



## dateTime64ToSnowflakeID <Badge intent="info" className="version-badge">v24.6+</Badge> 


Converts a [`DateTime64`](../data-types/datetime64.md) to the first [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) at the giving time.

See section ["Snowflake ID generation"](#snowflake-id-generation) for implementation details.
    

**Syntax**

```sql
dateTime64ToSnowflakeID(value[, epoch])
```

**Arguments**

- `value` — Date with time. [`DateTime`](/sql-reference/data-types/datetime) or [`DateTime64`](/sql-reference/data-types/datetime64)
- `epoch` — Epoch of the Snowflake ID in milliseconds since 1970-01-01. Defaults to 0 (1970-01-01). For the Twitter/X epoch (2015-01-01), provide 1288834974657. [`UInt*`](/sql-reference/data-types/int-uint)


**Returned value**

Returns the input value as the first Snowflake ID at that time. [`UInt64`](/sql-reference/data-types/int-uint)

**Examples**

**Usage example**

```sql title=Query
SELECT toDateTime64('2025-08-15 18:57:56.493', 3, 'Asia/Shanghai') AS dt, dateTime64ToSnowflakeID(dt) AS res;
```

```response title=Response
┌──────────────────────dt─┬─────────────────res─┐
│ 2025-08-15 18:57:56.493 │ 7362075066076495872 │
└─────────────────────────┴─────────────────────┘
```



## dateTimeToSnowflake <Badge intent="info" className="version-badge">v21.10+</Badge> 



<DeprecatedBadge/>

:::warning
This function is deprecated and can only be used if setting [`allow_deprecated_snowflake_conversion_functions`](../../operations/settings/settings.md#allow_deprecated_snowflake_conversion_functions) is enabled.
The function will be removed at some point in future.

Please use function [dateTimeToSnowflakeID](#dateTimeToSnowflakeID) instead.
:::

Converts a [DateTime](../data-types/datetime.md) value to the first [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) at the giving time.
    

**Syntax**

```sql
dateTimeToSnowflake(value)
```

**Arguments**

- `value` — Date with time. [`DateTime`](/sql-reference/data-types/datetime)


**Returned value**

Returns the input value as the first Snowflake ID at that time. [`Int64`](/sql-reference/data-types/int-uint)

**Examples**

**Usage example**

```sql title=Query
WITH toDateTime('2021-08-15 18:57:56', 'Asia/Shanghai') AS dt SELECT dateTimeToSnowflake(dt);
```

```response title=Response
┌─dateTimeToSnowflake(dt)─┐
│     1426860702823350272 │
└─────────────────────────┘
```



## dateTimeToSnowflakeID <Badge intent="info" className="version-badge">v24.6+</Badge> 


Converts a [DateTime](../data-types/datetime.md) value to the first [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) at the giving time.
    

**Syntax**

```sql
dateTimeToSnowflakeID(value[, epoch])
```

**Arguments**

- `value` — Date with time. [`DateTime`](/sql-reference/data-types/datetime) or [`DateTime64`](/sql-reference/data-types/datetime64)
- `epoch` — Optional. Epoch of the Snowflake ID in milliseconds since 1970-01-01. Defaults to 0 (1970-01-01). For the Twitter/X epoch (2015-01-01), provide 1288834974657. [`UInt*`](/sql-reference/data-types/int-uint)


**Returned value**

Returns the input value as the first Snowflake ID at that time. [`UInt64`](/sql-reference/data-types/int-uint)

**Examples**

**Usage example**

```sql title=Query
SELECT toDateTime('2021-08-15 18:57:56', 'Asia/Shanghai') AS dt, dateTimeToSnowflakeID(dt) AS res;
```

```response title=Response
┌──────────────────dt─┬─────────────────res─┐
│ 2021-08-15 18:57:56 │ 6832626392367104000 │
└─────────────────────┴─────────────────────┘
```



## dateTimeToUUIDv7 <Badge intent="info" className="version-badge">v25.9+</Badge> 


Converts a [DateTime](../data-types/datetime.md) value to a [UUIDv7](https://en.wikipedia.org/wiki/UUID#Version_7) at the given time.

See section ["UUIDv7 generation"](#uuidv7-generation) for details on UUID structure, counter management, and concurrency guarantees.

<Note>
As of September 2025, version 7 UUIDs are in draft status and their layout may change in future.
</Note>
    

**Syntax**

```sql
dateTimeToUUIDv7(value)
```

**Arguments**

- `value` — Date with time. [`DateTime`](/sql-reference/data-types/datetime)


**Returned value**

Returns a UUIDv7. [`UUID`](/sql-reference/data-types/uuid)

**Examples**

**Usage example**

```sql title=Query
SELECT dateTimeToUUIDv7(toDateTime('2021-08-15 18:57:56', 'Asia/Shanghai'));
```

```response title=Response
┌─dateTimeToUUIDv7(toDateTime('2021-08-15 18:57:56', 'Asia/Shanghai'))─┐
│ 018f05af-f4a8-778f-beee-1bedbc95c93b                                   │
└─────────────────────────────────────────────────────────────────────────┘
```

**multiple UUIDs for the same timestamp**

```sql title=Query
SELECT dateTimeToUUIDv7(toDateTime('2021-08-15 18:57:56'));
SELECT dateTimeToUUIDv7(toDateTime('2021-08-15 18:57:56'));
```

```response title=Response
┌─dateTimeToUUIDv7(t⋯08-15 18:57:56'))─┐
│ 017b4b2d-7720-76ed-ae44-bbcc23a8c550 │
└──────────────────────────────────────┘
┌─dateTimeToUUIDv7(t⋯08-15 18:57:56'))─┐
│ 017b4b2d-7720-76ed-ae44-bbcf71ed0fd3 │
└──────────────────────────────────────┘
```



## generateSnowflakeID <Badge intent="info" className="version-badge">v24.6+</Badge> 


Generates a [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID).

Function `generateSnowflakeID` guarantees that the counter field within a timestamp increments monotonically across all function invocations in concurrently running threads and queries.

See section ["Snowflake ID generation"](#snowflake-id-generation) for implementation details.
    

**Syntax**

```sql
generateSnowflakeID([expr, [machine_id]])
```

**Arguments**

- `expr` — An arbitrary [expression](/sql-reference/syntax#expressions) used to bypass [common subexpression elimination](/sql-reference/functions/overview#common-subexpression-elimination) if the function is called multiple times in a query. The value of the expression has no effect on the returned Snowflake ID. Optional. - `machine_id` — A machine ID, the lowest 10 bits are used. [Int64](../data-types/int-uint.md). Optional. 

**Returned value**

Returns the Snowflake ID. [`UInt64`](/sql-reference/data-types/int-uint)

**Examples**

**Usage example**

```sql title=Query
CREATE TABLE tab (id UInt64)
ENGINE = MergeTree()
ORDER BY tuple();

INSERT INTO tab SELECT generateSnowflakeID();

SELECT * FROM tab;
```

```response title=Response
┌──────────────────id─┐
│ 7199081390080409600 │
└─────────────────────┘
```

**Multiple Snowflake IDs generated per row**

```sql title=Query
SELECT generateSnowflakeID(1), generateSnowflakeID(2);
```

```response title=Response
┌─generateSnowflakeID(1)─┬─generateSnowflakeID(2)─┐
│    7199081609652224000 │    7199081609652224001 │
└────────────────────────┴────────────────────────┘
```

**With expression and a machine ID**

```sql title=Query
SELECT generateSnowflakeID('expr', 1);
```

```response title=Response
┌─generateSnowflakeID('expr', 1)─┐
│            7201148511606784002 │
└────────────────────────────────┘
```



## generateUUIDv4 <Badge intent="info" className="version-badge">v1.1+</Badge> 

Generates a [version 4](https://tools.ietf.org/html/rfc4122#section-4.4) [UUID](../data-types/uuid.md).

**Syntax**

```sql
generateUUIDv4([expr])
```

**Arguments**

- `expr` — Optional. An arbitrary expression used to bypass [common subexpression elimination](/sql-reference/functions/overview#common-subexpression-elimination) if the function is called multiple times in a query. The value of the expression has no effect on the returned UUID. 

**Returned value**

Returns a UUIDv4. [`UUID`](/sql-reference/data-types/uuid)

**Examples**

**Usage example**

```sql title=Query
SELECT generateUUIDv4(number) FROM numbers(3);
```

```response title=Response
┌─generateUUIDv4(number)───────────────┐
│ fcf19b77-a610-42c5-b3f5-a13c122f65b6 │
│ 07700d36-cb6b-4189-af1d-0972f23dc3bc │
│ 68838947-1583-48b0-b9b7-cf8268dd343d │
└──────────────────────────────────────┘
```

**Common subexpression elimination**

```sql title=Query
SELECT generateUUIDv4(1), generateUUIDv4(1);
```

```response title=Response
┌─generateUUIDv4(1)────────────────────┬─generateUUIDv4(2)────────────────────┐
│ 2d49dc6e-ddce-4cd0-afb8-790956df54c1 │ 2d49dc6e-ddce-4cd0-afb8-790956df54c1 │
└──────────────────────────────────────┴──────────────────────────────────────┘
```



## generateUUIDv7 <Badge intent="info" className="version-badge">v24.5+</Badge> 


Generates a [version 7](https://datatracker.ietf.org/doc/html/draft-peabody-dispatch-new-uuid-format-04) [UUID](../data-types/uuid.md).

See section ["UUIDv7 generation"](#uuidv7-generation) for details on UUID structure, counter management, and concurrency guarantees.

<Note>
As of September 2025, version 7 UUIDs are in draft status and their layout may change in future.
</Note>
    

**Syntax**

```sql
generateUUIDv7([expr])
```

**Arguments**

- `expr` — Optional. An arbitrary expression used to bypass [common subexpression elimination](/sql-reference/functions/overview#common-subexpression-elimination) if the function is called multiple times in a query. The value of the expression has no effect on the returned UUID. [`Any`](/sql-reference/data-types)


**Returned value**

Returns a UUIDv7. [`UUID`](/sql-reference/data-types/uuid)

**Examples**

**Usage example**

```sql title=Query
SELECT generateUUIDv7(number) FROM numbers(3);
```

```response title=Response
┌─generateUUIDv7(number)───────────────┐
│ 019947fb-5766-7ed0-b021-d906f8f7cebb │
│ 019947fb-5766-7ed0-b021-d9072d0d1e07 │
│ 019947fb-5766-7ed0-b021-d908dca2cf63 │
└──────────────────────────────────────┘
```

**Common subexpression elimination**

```sql title=Query
SELECT generateUUIDv7(1), generateUUIDv7(1);
```

```response title=Response
┌─generateUUIDv7(1)────────────────────┬─generateUUIDv7(1)────────────────────┐
│ 019947ff-0f87-7d88-ace0-8b5b3a66e0c1 │ 019947ff-0f87-7d88-ace0-8b5b3a66e0c1 │
└──────────────────────────────────────┴──────────────────────────────────────┘
```



## readWKTLineString <Badge intent="info" className="version-badge">v+</Badge> 


Parses a Well-Known Text (WKT) representation of a LineString geometry and returns it in the internal ClickHouse format.


**Syntax**

```sql
readWKTLineString(wkt_string)
```

**Arguments**

- `wkt_string` — The input WKT string representing a LineString geometry. [`String`](/sql-reference/data-types/string)


**Returned value**

The function returns a ClickHouse internal representation of the linestring geometry.

**Examples**

**first call**

```sql title=Query
SELECT readWKTLineString('LINESTRING (1 1, 2 2, 3 3, 1 1)');
```

```response title=Response
┌─readWKTLineString('LINESTRING (1 1, 2 2, 3 3, 1 1)')─┐
│ [(1,1),(2,2),(3,3),(1,1)]                            │
└──────────────────────────────────────────────────────┘
```

**second call**

```sql title=Query
SELECT toTypeName(readWKTLineString('LINESTRING (1 1, 2 2, 3 3, 1 1)'));
```

```response title=Response
┌─toTypeName(readWKTLineString('LINESTRING (1 1, 2 2, 3 3, 1 1)'))─┐
│ LineString                                                       │
└──────────────────────────────────────────────────────────────────┘
```



## snowflakeIDToDateTime <Badge intent="info" className="version-badge">v24.6+</Badge> 


Returns the timestamp component of a [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) as a value of type [DateTime](../data-types/datetime.md).
    

**Syntax**

```sql
snowflakeIDToDateTime(value[, epoch[, time_zone]])
```

**Arguments**

- `value` — Snowflake ID. [`UInt64`](/sql-reference/data-types/int-uint)
- `epoch` — Optional. Epoch of the Snowflake ID in milliseconds since 1970-01-01. Defaults to 0 (1970-01-01). For the Twitter/X epoch (2015-01-01), provide 1288834974657. [`UInt*`](/sql-reference/data-types/int-uint)
- `time_zone` — Optional. [Timezone](/operations/server-configuration-parameters/settings.md#timezone). The function parses `time_string` according to the timezone. [`String`](/sql-reference/data-types/string)


**Returned value**

Returns the timestamp component of `value`. [`DateTime`](/sql-reference/data-types/datetime)

**Examples**

**Usage example**

```sql title=Query
SELECT snowflakeIDToDateTime(7204436857747984384) AS res
```

```response title=Response
┌─────────────────res─┐
│ 2024-06-06 10:59:58 │
└─────────────────────┘
```



## snowflakeIDToDateTime64 <Badge intent="info" className="version-badge">v24.6+</Badge> 


Returns the timestamp component of a [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) as a value of type [DateTime64](../data-types/datetime64.md).
    

**Syntax**

```sql
snowflakeIDToDateTime64(value[, epoch[, time_zone]])
```

**Arguments**

- `value` — Snowflake ID. [`UInt64`](/sql-reference/data-types/int-uint)
- `epoch` — Optional. Epoch of the Snowflake ID in milliseconds since 1970-01-01. Defaults to 0 (1970-01-01). For the Twitter/X epoch (2015-01-01), provide 1288834974657. [`UInt*`](/sql-reference/data-types/int-uint)
- `time_zone` — Optional. [Timezone](/operations/server-configuration-parameters/settings.md#timezone). The function parses `time_string` according to the timezone. [`String`](/sql-reference/data-types/string)


**Returned value**

Returns the timestamp component of `value` as a `DateTime64` with scale = 3, i.e. millisecond precision. [`DateTime64`](/sql-reference/data-types/datetime64)

**Examples**

**Usage example**

```sql title=Query
SELECT snowflakeIDToDateTime64(7204436857747984384) AS res
```

```response title=Response
┌─────────────────res─┐
│ 2024-06-06 10:59:58 │
└─────────────────────┘
```



## snowflakeToDateTime <Badge intent="info" className="version-badge">v21.10+</Badge> 


<DeprecatedBadge/>

:::warning
This function is deprecated and can only be used if setting [`allow_deprecated_snowflake_conversion_functions`](../../operations/settings/settings.md#allow_deprecated_snowflake_conversion_functions) is enabled.
The function will be removed at some point in future.

Please use function [`snowflakeIDToDateTime`](#snowflakeIDToDateTime) instead.
:::

Extracts the timestamp component of a [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) in [DateTime](../data-types/datetime.md) format.
    

**Syntax**

```sql
snowflakeToDateTime(value[, time_zone])
```

**Arguments**

- `value` — Snowflake ID. [`Int64`](/sql-reference/data-types/int-uint)
- `time_zone` — Optional. [Timezone](/operations/server-configuration-parameters/settings.md#timezone). The function parses `time_string` according to the timezone. [`String`](/sql-reference/data-types/string)


**Returned value**

Returns the timestamp component of `value`. [`DateTime`](/sql-reference/data-types/datetime)

**Examples**

**Usage example**

```sql title=Query
SELECT snowflakeToDateTime(CAST('1426860702823350272', 'Int64'), 'UTC');
```

```response title=Response
┌─snowflakeToDateTime(CAST('1426860702823350272', 'Int64'), 'UTC')─┐
│                                              2021-08-15 10:57:56 │
└──────────────────────────────────────────────────────────────────┘
```



## snowflakeToDateTime64 <Badge intent="info" className="version-badge">v21.10+</Badge> 


<DeprecatedBadge/>

:::warning
This function is deprecated and can only be used if setting [`allow_deprecated_snowflake_conversion_functions`](../../operations/settings/settings.md#allow_deprecated_snowflake_conversion_functions) is enabled.
The function will be removed at some point in future.

Please use function [`snowflakeIDToDateTime64`](#snowflakeIDToDateTime64) instead.
:::

Extracts the timestamp component of a [Snowflake ID](https://en.wikipedia.org/wiki/Snowflake_ID) in [DateTime64](../data-types/datetime64.md) format.

    

**Syntax**

```sql
snowflakeToDateTime64(value[, time_zone])
```

**Arguments**

- `value` — Snowflake ID. [`Int64`](/sql-reference/data-types/int-uint)
- `time_zone` — Optional. [Timezone](/operations/server-configuration-parameters/settings.md#timezone). The function parses `time_string` according to the timezone. [`String`](/sql-reference/data-types/string)


**Returned value**

Returns the timestamp component of `value`. [`DateTime64(3)`](/sql-reference/data-types/datetime64)

**Examples**

**Usage example**

```sql title=Query
SELECT snowflakeToDateTime64(CAST('1426860802823350272', 'Int64'), 'UTC');
```

```response title=Response
┌─snowflakeToDateTime64(CAST('1426860802823350272', 'Int64'), 'UTC')─┐
│                                            2021-08-15 10:58:19.841 │
└────────────────────────────────────────────────────────────────────┘
```



## toUUIDOrDefault <Badge intent="info" className="version-badge">v21.1+</Badge> 


Converts a String value to UUID type. If the conversion fails, returns a default UUID value instead of throwing an error.

This function attempts to parse a string of 36 characters in the standard UUID format (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
If the string cannot be converted to a valid UUID, the function returns the provided default UUID value.
    

**Syntax**

```sql
toUUIDOrDefault(string, default)
```

**Arguments**

- `string` — String of 36 characters or FixedString(36) to be converted to UUID. - `default` — UUID value to be returned if the first argument cannot be converted to UUID type. 

**Returned value**

Returns the converted UUID if successful, or the default UUID if conversion fails. [`UUID`](/sql-reference/data-types/uuid)

**Examples**

**Successful conversion returns the parsed UUID**

```sql title=Query
SELECT toUUIDOrDefault('61f0c404-5cb3-11e7-907b-a6006ad3dba0', toUUID('59f0c404-5cb3-11e7-907b-a6006ad3dba0'));
```

```response title=Response
┌─toUUIDOrDefault('61f0c404-5cb3-11e7-907b-a6006ad3dba0', toUUID('59f0c404-5cb3-11e7-907b-a6006ad3dba0'))─┐
│ 61f0c404-5cb3-11e7-907b-a6006ad3dba0                                                                     │
└──────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

**Failed conversion returns the default UUID**

```sql title=Query
SELECT toUUIDOrDefault('-----61f0c404-5cb3-11e7-907b-a6006ad3dba0', toUUID('59f0c404-5cb3-11e7-907b-a6006ad3dba0'));
```

```response title=Response
┌─toUUIDOrDefault('-----61f0c404-5cb3-11e7-907b-a6006ad3dba0', toUUID('59f0c404-5cb3-11e7-907b-a6006ad3dba0'))─┐
│ 59f0c404-5cb3-11e7-907b-a6006ad3dba0                                                                          │
└───────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```



## toUUIDOrNull <Badge intent="info" className="version-badge">v20.12+</Badge> 


Converts an input value to a value of type `UUID` but returns `NULL` in case of an error.
Like [`toUUID`](#touuid) but returns `NULL` instead of throwing an exception on conversion errors.

Supported arguments:
- String representations of UUID in standard format (8-4-4-4-12 hexadecimal digits).
- String representations of UUID without hyphens (32 hexadecimal digits).

Unsupported arguments (return `NULL`):
- Invalid string formats.
- Non-string types.
- Malformed UUIDs.
    

**Syntax**

```sql
toUUIDOrNull(x)
```

**Arguments**

- `x` — A string representation of a UUID. [`String`](/sql-reference/data-types/string)


**Returned value**

Returns a UUID value if successful, otherwise `NULL`. [`UUID`](/sql-reference/data-types/uuid) or [`NULL`](/sql-reference/syntax#null)

**Examples**

**Usage examples**

```sql title=Query
SELECT
    toUUIDOrNull('550e8400-e29b-41d4-a716-446655440000') AS valid_uuid,
    toUUIDOrNull('invalid-uuid') AS invalid_uuid
```

```response title=Response
┌─valid_uuid───────────────────────────┬─invalid_uuid─┐
│ 550e8400-e29b-41d4-a716-446655440000 │         ᴺᵁᴸᴸ │
└──────────────────────────────────────┴──────────────┘
```



{/* <!--AUTOGENERATED_END--> */}
