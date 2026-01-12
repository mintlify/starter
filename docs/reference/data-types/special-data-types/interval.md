---
description: 'Documentation for the Interval special data type'
sidebarTitle: 'Interval'
sidebar_position: 61
slug: /sql-reference/data-types/special-data-types/interval
title: 'Interval'
doc_type: 'reference'
---

The family of data types representing time and date intervals. The resulting types of the [INTERVAL](/sql-reference/operators#interval) operator.

Structure:

- Time interval as an unsigned integer value.
- Type of an interval.

Supported interval types:

- `NANOSECOND`
- `MICROSECOND`
- `MILLISECOND`
- `SECOND`
- `MINUTE`
- `HOUR`
- `DAY`
- `WEEK`
- `MONTH`
- `QUARTER`
- `YEAR`

For each interval type, there is a separate data type. For example, the `DAY` interval corresponds to the `IntervalDay` data type:

```sql
SELECT toTypeName(INTERVAL 4 DAY)
```

```text
┌─toTypeName(toIntervalDay(4))─┐
│ IntervalDay                  │
└──────────────────────────────┘
```

## Usage Remarks 

You can use `Interval`-type values in arithmetical operations with [Date](../../../sql-reference/data-types/date.md) and [DateTime](../../../sql-reference/data-types/datetime.md)-type values. For example, you can add 4 days to the current time:

```sql
SELECT now() AS current_date_time, current_date_time + INTERVAL 4 DAY
```

```text
┌───current_date_time─┬─plus(now(), toIntervalDay(4))─┐
│ 2019-10-23 10:58:45 │           2019-10-27 10:58:45 │
└─────────────────────┴───────────────────────────────┘
```

Also it is possible to use multiple intervals simultaneously:

```sql
SELECT now() AS current_date_time, current_date_time + (INTERVAL 4 DAY + INTERVAL 3 HOUR)
```

```text
┌───current_date_time─┬─plus(current_date_time, plus(toIntervalDay(4), toIntervalHour(3)))─┐
│ 2024-08-08 18:31:39 │                                                2024-08-12 21:31:39 │
└─────────────────────┴────────────────────────────────────────────────────────────────────┘
```

And to compare values with different intervals:

```sql
SELECT toIntervalMicrosecond(3600000000) = toIntervalHour(1);
```

```text
┌─less(toIntervalMicrosecond(179999999), toIntervalMinute(3))─┐
│                                                           1 │
└─────────────────────────────────────────────────────────────┘
```

## See Also 

- [INTERVAL](/sql-reference/operators#interval) operator
- [toInterval](/sql-reference/functions/type-conversion-functions#tointervalyear) type conversion functions
