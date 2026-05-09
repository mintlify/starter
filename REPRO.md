# Snippet self-import causes infinite recursion

## Summary

When a snippet imports itself (or two snippets import each other), Mintlify's
snippet loader recurses without detecting the cycle. The CLI hangs at
"preparing local preview…" and the Node process pins a CPU core at 100%.

## Repro

This repo is forked from https://github.com/mintlify/starter and adds:

- `snippets/self.mdx` — imports itself and renders `<Self />` inside its own body.
- `snippet-recursion-repro.mdx` — page that imports `snippets/self.mdx`.
- `docs.json` — the page added to the "Getting started" group.

### Steps

```bash
git clone <this repo>
cd mintlify-snippet-recursion-repro
mint dev
```

Then open `http://localhost:3939/snippet-recursion-repro`.

### Observed

- `mint dev` never reaches "✓ preview ready"; the underlying
  `@mintlify/cli` Node process sits at 100% CPU indefinitely.
- `mint broken-links` never completes.
- Production builds on Mintlify's hosted platform hang / fail.

### Expected

The loader should detect a snippet importing itself (or any cycle in the
snippet import graph) and either:

1. Surface a clear error pointing at the offending snippet, or
2. Stop recursion at the first level so the rest of the build can succeed.

## Minimal files

`snippets/self.mdx`:

```mdx
import Self from '/snippets/self.mdx';

This snippet imports itself on the line above and renders `<Self />` below.

<Self />
```

`snippet-recursion-repro.mdx`:

```mdx
---
title: "Snippet self-import recursion repro"
---

import Self from '/snippets/self.mdx';

<Self />
```

## Notes

- The same shape applies to mutual cycles: `A` imports `B`, `B` imports `A`.
- A linear chain (page → A → B, no cycle) renders correctly — the bug is
  specifically cycle detection in the snippet loader.
