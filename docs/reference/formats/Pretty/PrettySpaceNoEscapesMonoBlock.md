---
alias: []
description: 'Documentation for the PrettySpaceNoEscapesMonoBlock format'
input_format: false
keywords: ['PrettySpaceNoEscapesMonoBlock']
output_format: true
slug: /interfaces/formats/PrettySpaceNoEscapesMonoBlock
title: 'PrettySpaceNoEscapesMonoBlock'
doc_type: 'reference'
---

<Badge intent="success">Output</Badge>

import CommonPrettyFormatSettings from '/snippets/products/reference/formats/Pretty/_snippets/common-pretty-format-settings.mdx';

## Description 

Differs from the [`PrettySpaceNoEscapes`](./PrettySpaceNoEscapes.md) format in that up to `10,000` rows are buffered, 
and then output as a single table, and not by [blocks](/development/architecture#block).

## Example usage 

## Format settings 

<PrettyFormatSettings/>