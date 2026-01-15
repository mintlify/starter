---
sidebarTitle: 'Overview'
sidebar_position: 1
title: 'ClickHouse Cloud API'
slug: /cloud/manage/api/api-overview
description: 'Learn about ClickHouse Cloud API'
doc_type: 'reference'
keywords: ['ClickHouse Cloud', 'API overview', 'cloud API', 'REST API', 'programmatic access']
---

## Overview 

The ClickHouse Cloud API is a REST API designed for developers to easily manage 
organizations and services on ClickHouse Cloud. Using our Cloud API, you can 
create and manage services, provision API keys, add or remove members in your 
organization, and more.

[Learn how to create your first API key and start using the ClickHouse Cloud API.](/cloud/manage/openapi)

## Swagger (OpenAPI) Endpoint and UI 

The ClickHouse Cloud API is built on the open-source [OpenAPI specification](https://www.openapis.org/)
to allow for predictable client-side consumption. If you need to programmatically
consume the ClickHouse Cloud API docs, we offer a JSON-based Swagger endpoint
via https://api.clickhouse.cloud/v1. You can also find the API docs via
the [Swagger UI](https://clickhouse.com/docs/cloud/manage/api/swagger).

<Note>
If your organization has been migrated to one of the [new pricing plans](https://clickhouse.com/pricing?plan=scale&provider=aws&region=us-east-1&hours=8&storageCompressed=false), and you use OpenAPI you will be required to remove the `tier` field in the service creation `POST` request.

The `tier` field has been removed from the service object as we no longer have service tiers.  
This will affect the objects returned by the `POST`, `GET`, and `PATCH` service requests. Therefore, any code that consumes these APIs may need to be adjusted to handle these changes.
</Note>

## Rate limits 

Developers are limited to 100 API keys per organization. Each API key has a 
limit of 10 requests over a 10-second window. If you'd like to increase the 
number of API keys or requests per 10-second window for your organization, 
please contact support@clickhouse.com

## Terraform provider 

The official ClickHouse Terraform Provider lets you use [Infrastructure as Code](https://www.redhat.com/en/topics/automation/what-is-infrastructure-as-code-iac)
to create predictable, version-controlled configurations to make deployments much
less error-prone.

You can view the Terraform provider docs in the [Terraform registry](https://registry.terraform.io/providers/ClickHouse/clickhouse/latest/docs).

If you'd like to contribute to the ClickHouse Terraform Provider, you can view 
the source [in the GitHub repo](https://github.com/ClickHouse/terraform-provider-clickhouse).

<Note>
If your organization has been migrated to one of the [new pricing plans](https://clickhouse.com/pricing?plan=scale&provider=aws&region=us-east-1&hours=8&storageCompressed=false), you will be required to use our [ClickHouse Terraform provider](https://registry.terraform.io/providers/ClickHouse/clickhouse/latest/docs) version 2.0.0 or above. This upgrade is required to handle changes in the `tier` attribute of the service since, after pricing migration, the `tier` field is no longer accepted and references to it should be removed.

You will now also be able to specify the `num_replicas` field as a property of the service resource.
</Note>

## Terraform and OpenAPI New Pricing: Replica Settings Explained 

The number of replicas each service will be created with defaults to 3 for the Scale and Enterprise tiers, while it defaults to 1 for the Basic tier.
For the Scale and the Enterprise tiers it is possible to adjust it by passing a `numReplicas` field in the service creation request. 
The value of the `numReplicas` field must be between 2 and 20 for the first service in a warehouse. Services that are created in an existing warehouse can have a number of replicas as low as 1.

## Support 

We recommend visiting [our Slack channel](https://clickhouse.com/slack) first to get quick support. If 
you'd like additional help or more info about our API and its capabilities, 
please contact ClickHouse Support at https://console.clickhouse.cloud/support
