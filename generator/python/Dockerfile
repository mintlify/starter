FROM nikolaik/python-nodejs:latest

WORKDIR /usr/src/app

# Install java (needed for openapi gen cli)
RUN apt-get update && \
    DEBIAN_FRONTEND=noninteractive \
    apt-get -y install default-jre-headless && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Vim
RUN apt-get update && \
    apt-get install -y vim && \
    rm -rf /var/lib/apt/lists/*

# Install OpenAPI Generator
RUN npm install @openapitools/openapi-generator-cli -g

# Copy the OpenAPI definition
COPY api-reference/openapi.yml /usr/src/app/api-reference/

# Generate Python client code
RUN openapi-generator-cli generate -i api-reference/openapi.yml -g python -o /tmp/generator/python

# Setup Python virtual environment
RUN python3 -m venv /tmp/generator/python/venv && \
    . /tmp/generator/python/venv/bin/activate && \
    pip3 install --upgrade pip && \
    pip3 install -r /tmp/generator/python/requirements.txt

# Copy your Python script to the container
COPY generator/python/populate_sandbox_for_client.py /tmp/generator/python

# Set the default command to open a bash shell in the directory /tmp/generator/python
CMD ["bash", "-c", "cd /tmp/generator/python && . venv/bin/activate && exec bash"]