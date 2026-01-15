---
slug: /cloud/marketplace/marketplace-billing
title: 'Marketplace Billing'
description: 'Subscribe to ClickHouse Cloud through the AWS, GCP, and Azure marketplace.'
keywords: ['aws', 'azure', 'gcp', 'google cloud', 'marketplace', 'billing']
doc_type: 'guide'
---

You can subscribe to ClickHouse Cloud through the AWS, GCP, and Azure marketplaces. This allows you to pay for ClickHouse Cloud through your existing cloud provider billing.

You can either use pay-as-you-go (PAYG) or commit to a contract with ClickHouse Cloud through the marketplace. The billing will be handled by the cloud provider, and you will receive a single invoice for all your cloud services.

- [AWS Marketplace PAYG](/cloud/billing/marketplace/aws-marketplace-payg)
- [AWS Marketplace Committed Contract](/cloud/billing/marketplace/aws-marketplace-committed-contract)
- [GCP Marketplace PAYG](/cloud/billing/marketplace/gcp-marketplace-payg)
- [GCP Marketplace Committed Contract](/cloud/billing/marketplace/gcp-marketplace-committed-contract)
- [Azure Marketplace PAYG](/cloud/billing/marketplace/azure-marketplace-payg)
- [Azure Marketplace Committed Contract](/cloud/billing/marketplace/azure-marketplace-committed-contract)

## FAQs 

### How can I verify that my organization is connected to marketplace billing?​ 

In the ClickHouse Cloud console, navigate to **Billing**. You should see the name of the marketplace and the link in the **Payment details** section.

### I am an existing ClickHouse Cloud user. What happens when I subscribe to ClickHouse Cloud via AWS / GCP / Azure marketplace?​ 

Signing up for ClickHouse Cloud from the cloud provider marketplace is a two step process:
1. You first "subscribe" to ClickHouse Cloud on the cloud providers' marketplace portal.  After you have finished subscribing, you click on "Pay Now" or "Manage on Provider" (depending on the marketplace). This redirects you to ClickHouse Cloud.
2. On Clickhouse Cloud you either register for a new account, or sign in with an existing account.  Either way, a new ClickHouse Cloud organization will be created for you which is tied to your marketplace billing.

NOTE: Your existing services and organizations from any prior ClickHouse Cloud signups will remain and they will not be connected to the marketplace billing.  ClickHouse Cloud allows you to use the same account to manage multiple organization, each with different billing.

You can switch between organizations from the bottom left menu of the ClickHouse Cloud console.

### I am an existing ClickHouse Cloud user. What should I do if I want my existing services to be billed via marketplace?​ 

You will need to subscribe to ClickHouse Cloud via the cloud provider marketplace. Once you finish subscribing on the marketplace, and redirect to ClickHouse Cloud you will have the option of linking an existing ClickHouse Cloud organization to marketplace billing. From that point on, your existing resources will now get billed via the marketplace. 

<img src="/images/cloud/manage/billing/marketplace/marketplace_signup_and_org_linking.png" alt="Marketplace signup and org linking"/>

You can confirm from the organization's billing page that billing is indeed now linked to the marketplace. Please contact [ClickHouse Cloud support](https://clickhouse.com/support/program) if you run into any issues.

<Note>
Your existing services and organizations from any prior ClickHouse Cloud signups will remain and not be connected to the marketplace billing.
</Note>

### I subscribed to ClickHouse Cloud as a marketplace user. How can I unsubscribe?​ 

Note that you can simply stop using ClickHouse Cloud and delete all existing ClickHouse Cloud services. Even though the subscription will still be active, you will not be paying anything as ClickHouse Cloud doesn't have any recurring fees.

If you want to unsubscribe, please navigate to the Cloud Provider console and cancel the subscription renewal there. Once the subscription ends, all existing services will be stopped and you will be prompted to add a credit card. If no card was added, after two weeks all existing services will be deleted.

### I subscribed to ClickHouse Cloud as a marketplace user, and then unsubscribed. Now I want to subscribe back, what is the process?​ 

In that case please subscribe to the ClickHouse Cloud as usual (see sections on subscribing to ClickHouse Cloud via the marketplace).

- For AWS marketplace a new ClickHouse Cloud organization will be created and connected to the marketplace.
- For the GCP marketplace your old organization will be reactivated.

If you have any trouble with reactivating your marketplace org, please contact [ClickHouse Cloud Support](https://clickhouse.com/support/program).

### How do I access my invoice for my marketplace subscription to the ClickHouse Cloud service?​ 

- [AWS billing Console](https://us-east-1.console.aws.amazon.com/billing/home)
- [GCP Marketplace orders](https://console.cloud.google.com/marketplace/orders) (select the billing account that you used for subscription)

### Why do the dates on the Usage statements not match my Marketplace Invoice?​ 

Marketplace billing follows the calendar month cycle. For example, for usage between December 1st and January 1st, an invoice will be generated between January 3rd and January 5th.

ClickHouse Cloud usage statements follow a different billing cycle where usage is metered and reported over 30 days starting from the day of sign up.

The usage and invoice dates will differ if these dates are not the same. Since usage statements track usage by day for a given service, users can rely on statements to see the breakdown of costs.

### Where can I find general billing information​? 

Please see the [Billing overview page](/cloud/manage/billing).

### Is there a difference in ClickHouse Cloud pricing, whether paying through the cloud provider marketplace or directly to ClickHouse? 

There is no difference in pricing between marketplace billing and signing up directly with ClickHouse. In either case, your usage of  ClickHouse Cloud is tracked in terms of ClickHouse Cloud Credits (CHCs), which are metered in the same way and billed accordingly.

### Can I set up multiple ClickHouse Organizations to bill to a single cloud marketplace billing account or sub account (AWS, GCP, or Azure)? 

A single ClickHouse organization can only be configured to bill to a single Cloud marketplace billing account or sub account.

### If my ClickHouse Organization is billed through a cloud marketplace committed spend agreement will I automatically move to PAYG billing when I run out of credits? 

If your marketplace committed spend contract is active and you run out of credits we will automatically move your organization to PAYG billing. However, when your existing contract expires, you will need to link a new marketplace contract to your organization or move your organization to direct billing via credit card. 
