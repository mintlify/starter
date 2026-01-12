---
slug: /cloud/billing/marketplace/gcp-marketplace-payg
title: 'GCP Marketplace PAYG'
description: 'Subscribe to ClickHouse Cloud through the GCP Marketplace (PAYG).'
keywords: ['gcp', 'marketplace', 'billing', 'PAYG']
doc_type: 'guide'
---

Get started with ClickHouse Cloud on the [GCP Marketplace](https://console.cloud.google.com/marketplace) via a PAYG (Pay-as-you-go) Public Offer.

## Prerequisites 

- A GCP project that is enabled with purchasing rights by your billing administrator.
- To subscribe to ClickHouse Cloud on the GCP Marketplace, you must be logged in with an account that has purchasing rights and choose the appropriate project.

## Steps to sign up 

1. Go to the [GCP Marketplace](https://cloud.google.com/marketplace) and search for ClickHouse Cloud. Make sure you have the correct project chosen.

<img src="/images/cloud/manage/billing/marketplace/gcp-marketplace-payg-1.png" alt="GCP Marketplace home page"/>

2. Click on the [listing](https://console.cloud.google.com/marketplace/product/clickhouse-public/clickhouse-cloud) and then on **Subscribe**.

<img src="/images/cloud/manage/billing/marketplace/gcp-marketplace-payg-2.png" alt="ClickHouse Cloud in GCP Marketplace"/>

3. On the next screen, configure the subscription:

- The plan will default to "ClickHouse Cloud"
- Subscription time frame is "Monthly"
- Choose the appropriate billing account
- Accept the terms and click **Subscribe**

<br />

<img src="/images/cloud/manage/billing/marketplace/gcp-marketplace-payg-3.png" alt="Configure subscription in GCP Marketplace"/>

<br />

4. Once you click **Subscribe**, you will see a modal **Sign up with ClickHouse**.

<br />

<img src="/images/cloud/manage/billing/marketplace/gcp-marketplace-payg-4.png" alt="GCP Marketplace sign up modal"/>

<br />

5. Note that at this point, the setup is not complete yet. You will need to redirect to ClickHouse Cloud by clicking on **Set up your account** and signing up on ClickHouse Cloud.

6. Once you redirect to ClickHouse Cloud, you can either login with an existing account, or register with a new account. This step is very important so we can bind your ClickHouse Cloud organization to the GCP Marketplace billing.

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

<img src="/images/cloud/manage/billing/marketplace/aws-marketplace-payg-9.png" alt="ClickHouse Cloud sign up info form 2"/>

<br />

If you are an existing ClickHouse Cloud user, simply log in using your credentials.

7. After successfully logging in, a new ClickHouse Cloud organization will be created. This organization will be connected to your GCP billing account and all usage will be billed via your GCP account.

8. Once you login, you can confirm that your billing is in fact tied to the GCP Marketplace and start setting up your ClickHouse Cloud resources.

<br />

<img src="/images/cloud/manage/billing/marketplace/gcp-marketplace-payg-5.png" alt="ClickHouse Cloud sign in page"/>

<br />

<img src="/images/cloud/manage/billing/marketplace/aws-marketplace-payg-11.png" alt="ClickHouse Cloud new services page"/>

<br />

9. You should receive an email confirming the sign up:

<br />
<br />

<img src="/images/cloud/manage/billing/marketplace/gcp-marketplace-payg-6.png" alt="GCP Marketplace confirmation email"/>

<br />

<br />

If you run into any issues, please do not hesitate to contact [our support team](https://clickhouse.com/support/program).
