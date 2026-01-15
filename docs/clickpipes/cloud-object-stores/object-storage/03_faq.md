---
sidebarTitle: 'FAQ'
description: 'FAQ for object storage ClickPipes'
slug: /integrations/clickpipes/object-storage/faq
sidebar_position: 1
title: 'Frequently Asked Questions'
doc_type: 'reference'
integration:
  - support_level: 'core'
  - category: 'clickpipes'
---

## FAQ 

<AccordionGroup>
<Accordion title="Does ClickPipes support GCS buckets prefixed with `gs://`?">
No. For interoperability reasons we ask you to replace your `gs://` bucket prefix with `https://storage.googleapis.com/`.
</Accordion>
<Accordion title="What permissions does a GCS public bucket require?">
`allUsers` requires appropriate role assignment. The `roles/storage.objectViewer` role must be granted at the bucket level. This role provides the `storage.objects.list` permission, which allows ClickPipes to list all objects in the bucket which is required for onboarding and ingestion. This role also includes the `storage.objects.get` permission, which is required to read or download individual objects in the bucket. See: [Google Cloud Access Control](https://cloud.google.com/storage/docs/access-control/iam-roles) for further information.
</Accordion>
</AccordionGroup>