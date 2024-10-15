import openapi_client
import random
from openapi_client.rest import ApiException
from pprint import pprint

from openapi_client.models import accounts_post_request, entries_connections_post_request, user_tokens_post_request
from openapi_client.models.accounts_post_request import AccountsPostRequest
from openapi_client.models.entries_connections_post_request import EntriesConnectionsPostRequest
from openapi_client.models.user_tokens_post_request import UserTokensPostRequest
from openapi_client.models.accounts import Accounts
from openapi_client.models.user import User


def create_api_client(api_key, api_host):
    # Defining the host is optional and defaults to https://api.sandbox.goteal.co
    # See configuration.py for a list of all supported configuration parameters.
    configuration = openapi_client.Configuration(
        host = api_host
    )

    # Configure API key authorization: ApiKeyAuth
    configuration.api_key['ApiKeyAuth'] = api_key

    # Enter a context with an instance of the API client
    with openapi_client.ApiClient(configuration) as api_client:
        # Create an instance of the API class
        return openapi_client.DefaultApi(api_client)

def create_bearer_client(api_host, token):
    configuration = openapi_client.Configuration(
        host = api_host,
        access_token=token
    )

    # Enter a context with an instance of the API client
    with openapi_client.ApiClient(configuration) as api_client:
        # Create an instance of the API class
        return openapi_client.DefaultApi(api_client)

def create_user(api_instance: openapi_client.DefaultApi, client_name, index):
    first_names=('John','Andy','Joe','Dave','Sam','Hannah','Charlotte')
    last_names=('Johnson','Smith','Williams','Brown','Church')

    name = random.choice(first_names)+" "+random.choice(last_names)
    email = f"{name.lower().replace(' ', '')}{index}@{client_name}.com"

    try:
        # Deletes an account for the user (e.g. a Xero account)
        api_response = api_instance.users_post(User(name=name, email=email))

        return api_response.user_id, email
    except ApiException as e:
        print("Exception when calling creater user: %s\n" % e)
        raise


def create_account(api_instance: openapi_client.DefaultApi, user_id, user_name):
    payroll_provider = "adp"
    try:
        request = AccountsPostRequest(user_id=user_id, 
                                      payroll_provider=payroll_provider, 
                                      user_name=user_name)
        api_response = api_instance.accounts_post(accounts_post_request=request)

        return api_response.account_id
    except ApiException as e:
        print("Exception when calling create account: %s\n" % e)
        raise


def create_entry_for_account(api_instance: openapi_client.DefaultApi, 
                             account_id, user_token):
    try:
        request = EntriesConnectionsPostRequest(account_id = account_id)
        api_response = api_instance.entries_connections_post(request)

        return api_response.entry_id
    except ApiException as e:
        print("Exception when calling create entry for a connection: %s\n" % e)
        raise
    

def create_user_token(api_instance: openapi_client.DefaultApi, user_id):
    try:
        request = UserTokensPostRequest(user_id=user_id)
        api_response = api_instance.user_tokens_post(request)
        return api_response.token
    except ApiException as e:
        print("Exception when creating user token: %s\n" % e)
        raise


host = "http://host.docker.internal:8080/api" # host machine
#host = "https://api.sandbox.goteal.co"
client_api_key = ""
client_name = ""

api_instance = create_api_client(client_api_key, host)

for x in range(15):
    print("User {}".format(x))
    user_id, user_name = create_user(api_instance, client_name, x)
    account_id = create_account(api_instance, user_id, user_name)

    user_token = create_user_token(api_instance, user_id)
    bearer_client = create_bearer_client(host, user_token)

    entry_one_id = create_entry_for_account(bearer_client, account_id, user_token)
    entry_two_id = create_entry_for_account(bearer_client, account_id, user_token)

    identifiers = f"""
    user_id = {user_id}
    account_id = {account_id}
    entry_one_id = {entry_one_id}
    entry_two_id = {entry_two_id}
    """
    print(identifiers)