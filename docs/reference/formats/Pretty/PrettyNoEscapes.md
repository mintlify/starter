---
alias: []
description: 'Documentation for the PrettyNoEscapes format'
input_format: false
keywords: ['PrettyNoEscapes']
output_format: true
slug: /interfaces/formats/PrettyNoEscapes
title: 'PrettyNoEscapes'
doc_type: 'reference'
---

<Badge intent="success">Output</Badge>

import CommonPrettyFormatSettings from '/snippets/products/reference/formats/Pretty/_snippets/common-pretty-format-settings.mdx';

## Description 

Differs from [Pretty](/interfaces/formats/Pretty) in that [ANSI-escape sequences](http://en.wikipedia.org/wiki/ANSI_escape_code) aren't used. 
This is necessary for displaying the format in a browser, as well as for using the 'watch' command-line utility.

## Example usage 

Example:

```bash
$ watch -n1 "clickhouse-client --query='SELECT event, value FROM system.events FORMAT PrettyCompactNoEscapes'"
```

<Note>
The [HTTP interface](../../../interfaces/http.md) can be used for displaying this format in the browser.
</Note>

## Format settings 

<PrettyFormatSettings/>