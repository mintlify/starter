---
slug: /cloud/billing/marketplace/aws-marketplace-committed-contract
title: 'AWS Marketplace Committed Contract'
description: 'Subscribe to ClickHouse Cloud through the AWS Marketplace (Committed Contract)'
keywords: ['aws', 'amazon', 'marketplace', 'billing', 'committed', 'committed contract']
doc_type: 'guide'
---

Get started with ClickHouse Cloud on the [AWS Marketplace](https://aws.amazon.com/marketplace) via a committed contract. A committed contract, also known as a a Private Offer, allows customers to commit to spending a certain amount on ClickHouse Cloud over a period of time.

## Prerequisites 

- A Private Offer from ClickHouse based on specific contract terms.
- To connect a ClickHouse organization to your committed spend offer, you must be an admin of that organization.

[Required permissions to view and accept your committed contract in AWS](https://docs.aws.amazon.com/marketplace/latest/buyerguide/private-offers-page.html#private-offers-page-permissions):
- If you use AWS managed policies it is required to have the following permissions: `AWSMarketplaceRead-only`, `AWSMarketplaceManageSubscriptions`, or `AWSMarketplaceFullAccess`.
- If you aren't using AWS managed policies it is required to have the following permissions: IAM action `aws-marketplace:ListPrivateListings` and `aws-marketplace:ViewSubscriptions`.

## Steps to sign up 

1. You should have received an email with a link to review and accept your private offer.

<br />

<img src="/images/cloud/manage/billing/marketplace/aws-marketplace-committed-1.png" alt="AWS Marketplace private offer email"/>

<br />

2. Click on the **Review Offer** link in the email. This should take you to your AWS Marketplace page with the private offer details. While accepting the private offer, choose a value of 1 for the number of units in the Contract Options picklist. 

3. Complete the steps to subscribe on the AWS portal and click on **Set up your account**.
It is critical to redirect to ClickHouse Cloud at this point and either register for a new account, or sign in with an existing account. Without completing this step, we will not be able to link your AWS Marketplace subscription to ClickHouse Cloud.

4. Once you redirect to ClickHouse Cloud, you can either login with an existing account, or register with a new account. This step is very important so we can bind your ClickHouse Cloud organization to the AWS Marketplace billing.

<br />

<img src="/images/cloud/manage/billing/marketplace/aws-marketplace-payg-6.png" alt="ClickHouse Cloud sign in page"/>

<br />

If you are a new ClickHouse Cloud user, click **Register** at the bottom of the page. You will be prompted to create a new user and verify the email. After verifying your email, you can leave the ClickHouse Cloud login page and login using the new username at the [https://console.clickhouse.cloud](https://console.clickhouse.cloud).

<br />

<img src="/images/cloud/manage/billing/marketplace/aws-marketplace-payg-7.png" alt="ClickHouse Cloud sign up page"/>

<br />

Note that if you are a new user, you will also need to provide some basic information about your business. See the screenshots below.

<br />

<img src="/images/cloud/manage/billing/marketplace/aws-marketplace-payg-8.png" alt="ClickHouse Cloud sign up info form"/>

<br />

<br />

<img src="/images/cloud/manage/billing/marketplace/aws-marketplace-payg-9.png" alt="ClickHouse Cloud sign up info form 2"/>

<br />

If you are an existing ClickHouse Cloud user, simply log in using your credentials.

5. After successfully logging in, a new ClickHouse Cloud organization will be created. This organization will be connected to your AWS billing account and all usage will be billed via your AWS account.

6. Once you login, you can confirm that your billing is in fact tied to the AWS Marketplace and start setting up your ClickHouse Cloud resources.

<br />

<img src="/images/cloud/manage/billing/marketplace/aws-marketplace-payg-10.png" alt="ClickHouse Cloud view AWS Marketplace billing"/>

<br />

<img src="/images/cloud/manage/billing/marketplace/aws-marketplace-payg-11.png" alt="ClickHouse Cloud new services page"/>

<br />

6. You should receive an email confirming the sign up:

<br />

<img src="/images/cloud/manage/billing/marketplace/aws-marketplace-payg-12.png" alt="AWS Marketplace confirmation email"/>

<br />

If you run into any issues, please do not hesitate to contact [our support team](https://clickhouse.com/support/program).
