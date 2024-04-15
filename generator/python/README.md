# Populate sandbox values for a customer using openapi generator

1. Navigate to the teal docs root 
2. Runing the following to create a container that generates the python client and models from our `openapi.yml`

    `docker build -f generator/python/Dockerfile -t python-populate-sandbox .`

3. Run following command to put you on the docker container in the generated directory:

    `docker run -it python-populate-sandbox`

4. Change `client_api_key` and `client_name` in `populate_sandbox_for_client.py` using `vim`. Alter the host depending on needs.

5. Run `python3 populate_sandbox_for_client.py`. The created identifiers will be printed in the response.