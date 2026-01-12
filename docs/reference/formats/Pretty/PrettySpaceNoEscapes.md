---
alias: []
description: 'Documentation for the PrettySpaceNoEscapes format'
input_format: false
keywords: ['PrettySpaceNoEscapes']
output_format: true
slug: /interfaces/formats/PrettySpaceNoEscapes
title: 'PrettySpaceNoEscapes'
doc_type: 'reference'
---

<Badge intent="success">Output</Badge>

import CommonPrettyFormatSettings from '/snippets/products/reference/formats/Pretty/_snippets/common-pretty-format-settings.mdx';

## Description 

Differs from the [`PrettySpace`](./PrettySpace.md) format in that [ANSI-escape sequences](http://en.wikipedia.org/wiki/ANSI_escape_code) are not used. 
This is necessary for displaying this format in a browser, as well as for using the 'watch' command-line utility.

## Example usage 

## Format settings 

<PrettyFormatSettings/>