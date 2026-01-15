---
slug: /cloud/manage/postman
sidebarTitle: 'Programmatic API access with Postman'
title: 'Programmatic API access with Postman'
description: 'This guide will help you test the ClickHouse Cloud API using Postman'
doc_type: 'guide'
keywords: ['api', 'postman', 'rest api', 'cloud management', 'integration']
---

This guide will help you test the ClickHouse Cloud API using [Postman](https://www.postman.com/product/what-is-postman/). 
The Postman Application is available for use within a web browser or can be downloaded to a desktop.

### Create an account 

* Free accounts are available at [https://www.postman.com](https://www.postman.com).

<img src="/images/cloud/manage/postman/postman1.png" alt="Postman site"/>

### Create a workspace 

* Name your workspace and set the visibility level. 

<img src="/images/cloud/manage/postman/postman2.png" alt="Create workspace"/>

### Create a collection 

* Below "Explore" on the top left Menu click "Import": 

<img src="/images/cloud/manage/postman/postman3.png"/> Import" border/>

* A modal will appear:

<img src="/images/cloud/manage/postman/postman4.png" alt="API URL entry"/>

* Enter the API address: "https://api.clickhouse.cloud/v1" and press 'Enter':

<img src="/images/cloud/manage/postman/postman5.png" alt="Import"/>

* Select "Postman Collection" by clicking on the "Import" button:

<img src="/images/cloud/manage/postman/postman6.png"/> Import" border/>

### Interface with the ClickHouse Cloud API spec 
* The "API spec for ClickHouse Cloud" will now appear within "Collections" (Left Navigation).

<img src="/images/cloud/manage/postman/postman7.png" alt="Import your API"/>

* Click on "API spec for ClickHouse Cloud." From the middle pain select the 'Authorization' tab:

<img src="/images/cloud/manage/postman/postman8.png" alt="Import complete"/>

### Set authorization 
* Toggle the dropdown menu to select "Basic Auth":

<img src="/images/cloud/manage/postman/postman9.png" alt="Basic auth"/>

* Enter the Username and Password received when you set up your ClickHouse Cloud API keys:

<img src="/images/cloud/manage/postman/postman10.png" alt="credentials"/>

### Enable variables 

* [Variables](https://learning.postman.com/docs/sending-requests/variables/) enable the storage and reuse of values in Postman allowing for easier API testing.

#### Set the organization ID and Service ID 

* Within the "Collection", click the "Variable" tab in the middle pane (The Base URL will have been set by the earlier API import):
* Below `baseURL` click the open field "Add new value", and Substitute your organization ID and service ID:

<img src="/images/cloud/manage/postman/postman11.png" alt="Organization ID and Service ID"/>

## Test the ClickHouse Cloud API functionalities 

### Test "GET list of available organizations" 

* Under the "OpenAPI spec for ClickHouse Cloud", expand the folder > V1 > organizations
* Click "GET list of available organizations" and press the blue "Send" button on the right:

<img src="/images/cloud/manage/postman/postman12.png" alt="Test retrieval of organizations"/>

* The returned results should deliver your organization details with "status": 200. (If you receive a "status" 400 with no organization information your configuration is not correct).

<img src="/images/cloud/manage/postman/postman13.png" alt="Status"/>

### Test "GET organizational details" 

* Under the `organizationid` folder, navigate to "GET organizational details":
* In the middle frame menu under Params an `organizationid` is required.

<img src="/images/cloud/manage/postman/postman14.png" alt="Test retrieval of organization details"/>

* Edit this value with `orgid` in curly braces `{{orgid}}` (From setting this value earlier a menu will appear with the value):

<img src="/images/cloud/manage/postman/postman15.png" alt="Submit test"/>

* After pressing the "Save" button, press the blue "Send" button at the top right of the screen.

<img src="/images/cloud/manage/postman/postman16.png" alt="Return value"/>

* The returned results should deliver your organization details with "status": 200. (If you receive a "status" 400 with no organization information your configuration is not correct).

### Test "GET service details" 

* Click "GET service details"
* Edit the Values for `organizationid` and `serviceid` with `{{orgid}}` and `{{serviceid}}` respectively.
* Press "Save" and then the blue "Send" button on the right.

<img src="/images/cloud/manage/postman/postman17.png" alt="List of services"/>

* The returned results should deliver a list of your services and their details with "status": 200. (If you receive a "status" 400 with no service(s) information your configuration is not correct).
