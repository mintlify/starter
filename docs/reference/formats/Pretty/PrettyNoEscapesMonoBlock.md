---
alias: []
description: 'Documentation for the PrettyNoEscapesMonoBlock format'
input_format: false
keywords: ['PrettyNoEscapesMonoBlock']
output_format: true
slug: /interfaces/formats/PrettyNoEscapesMonoBlock
title: 'PrettyNoEscapesMonoBlock'
doc_type: 'reference'
---

<Badge intent="success">Output</Badge>

import CommonPrettyFormatSettings from '/snippets/products/reference/formats/Pretty/_snippets/common-pretty-format-settings.mdx';

## Description 

Differs from the [`PrettyNoEscapes`](./PrettyNoEscapes.md) format in that up to `10,000` rows are buffered, 
and then output as a single table, and not by blocks.

## Example usage 

## Format settings 

<PrettyFormatSettings/>