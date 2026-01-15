---
slug: /use-cases/observability/clickstack/integrations/nginx-traces
title: 'Monitoring Nginx Traces with ClickStack'
sidebarTitle: 'Nginx Traces'
pagination_prev: null
pagination_next: null
description: 'Monitoring Nginx Traces with ClickStack'
doc_type: 'guide'
keywords: ['ClickStack', 'Nginx', 'traces', 'otel']
---

<Note title="TL;DR">
This guide shows you how to capture distributed traces from your existing Nginx installation and visualize them in ClickStack. You'll learn how to:

- Add the OpenTelemetry module to Nginx
- Configure Nginx to send traces to ClickStack's OTLP endpoint
- Verify traces are appearing in HyperDX
- Use a pre-built dashboard to visualize request performance (latency, errors, throughput)

A demo dataset with sample traces is available if you want to test the integration before configuring your production Nginx.

Time Required: 5-10 minutes
</Note>

## Integration with existing Nginx 

This section covers adding distributed tracing to your existing Nginx installation by installing the OpenTelemetry module and configuring it to send traces to ClickStack.
If you would like to test the integration before configuring your own existing setup, you can test with our preconfigured setup and sample data in the [following section](/use-cases/observability/clickstack/integrations/nginx-traces#demo-dataset).

##### Prerequisites 

- ClickStack instance running with OTLP endpoints accessible (ports 4317/4318)
- Existing Nginx installation (version 1.18 or higher)
- Root or sudo access to modify Nginx configuration
- ClickStack hostname or IP address

<Steps toc="false">

<Step title="Install OpenTelemetry Nginx module">

The easiest way to add tracing to Nginx is using the official Nginx image with OpenTelemetry support built-in.

</Step>

<Step title="Using the nginx:otel image">

Replace your current Nginx image with the OpenTelemetry-enabled version:

```yaml
# In your docker-compose.yml or Dockerfile
image: nginx:1.27-otel
```

This image includes the `ngx_otel_module.so` pre-installed and ready to use.

<Note>
If you're running Nginx outside of Docker, refer to the [OpenTelemetry Nginx documentation](https://github.com/open-telemetry/opentelemetry-cpp-contrib/tree/main/instrumentation/nginx) for manual installation instructions.
</Note>

</Step>

<Step title="Configure Nginx to send traces to ClickStack">

Add OpenTelemetry configuration to your `nginx.conf` file. The configuration loads the module and directs traces to ClickStack's OTLP endpoint.

First, get your API key:
1. Open HyperDX at your ClickStack URL
2. Navigate to Settings → API Keys  
3. Copy your **Ingestion API Key**
4. Set it as an environment variable: `export CLICKSTACK_API_KEY=your-api-key-here`

Add this to your `nginx.conf`:

```yaml
load_module modules/ngx_otel_module.so;

events {
    worker_connections 1024;
}

http {
    # OpenTelemetry exporter configuration
    otel_exporter {
        endpoint <clickstack-host>:4317;
        header authorization ${CLICKSTACK_API_KEY};
    }
    
    # Service name for identifying this nginx instance
    otel_service_name "nginx-proxy";
    
    # Enable tracing
    otel_trace on;
    
    server {
        listen 80;
        
        location / {
            # Enable tracing for this location
            otel_trace_context propagate;
            otel_span_name "$request_method $uri";
            
            # Add request details to traces
            otel_span_attr http.status_code $status;
            otel_span_attr http.request.method $request_method;
            otel_span_attr http.route $uri;
            
            # Your existing proxy or application configuration
            proxy_pass http://your-backend;
        }
    }
}
```

If running Nginx in Docker, pass the environment variable to the container:

```yaml
services:
  nginx:
    image: nginx:1.27-otel
    environment:
      - CLICKSTACK_API_KEY=${CLICKSTACK_API_KEY}
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
```

Replace `<clickstack-host>` with your ClickStack instance hostname or IP address.

<Note>
- **Port 4317** is the gRPC endpoint used by the Nginx module
- **otel_service_name** should be descriptive of your Nginx instance (e.g., "api-gateway", "frontend-proxy")
- Change **otel_service_name** to match your environment for easier identification in HyperDX
</Note>

</Step>

<Step title="Understanding the configuration">

**What gets traced:**
Each request to Nginx creates a trace span showing:
- Request method and path
- HTTP status code
- Request duration
- Timestamp

**Span attributes:**

The `otel_span_attr` directives add metadata to each trace, allowing you to filter and analyze requests in HyperDX by status code, method, route, etc.

After making these changes, test your Nginx configuration:

```bash
nginx -t
```

If the test passes, reload Nginx:

```bash
# For Docker
docker-compose restart nginx

# For systemd
sudo systemctl reload nginx
```

</Step>

<Step title="Verifying traces in HyperDX">

Once configured, log into HyperDX and verify traces are flowing, you should see something like this, if you don't see traces, try adjusting your time range:

<img src="/images/clickstack/nginx-traces-search-view.png" alt="View Traces"/>

</Step>
</Steps>

## Demo dataset 

For users who want to test the nginx trace integration before configuring their production systems, we provide a sample dataset of pre-generated Nginx Traces with realistic traffic patterns.

<Steps toc="false">

<Step title="Start ClickStack">

If you don't have ClickStack running yet, start it with:

```bash
docker run --name clickstack-demo \
  -p 8080:8080 -p 4317:4317 -p 4318:4318 \
  docker.hyperdx.io/hyperdx/hyperdx-all-in-one:latest
```

Wait about 30 seconds for ClickStack to fully initialize before proceeding.

- Port 8080: HyperDX web interface
- Port 4317: OTLP gRPC endpoint (used by nginx module)
- Port 4318: OTLP HTTP endpoint (used for demo traces)

</Step>

<Step title="Download the sample dataset">

Download the sample traces file and update timestamps to the current time:

```bash
# Download the traces
curl -O https://datasets-documentation.s3.eu-west-3.amazonaws.com/clickstack-integrations/nginx-traces-sample.json
```

The dataset includes:
- 1,000 trace spans with realistic timing
- 9 different endpoints with varied traffic patterns
- ~93% success rate (200), ~3% client errors (404), ~4% server errors (500)
- Latencies ranging from 10ms to 800ms
- Original traffic patterns preserved, shifted to current time

</Step>

<Step title="Send traces to ClickStack">

Set your API key as an environment variable (if not already set):

```bash
export CLICKSTACK_API_KEY=your-api-key-here
```

**Get your API key:**
1. Open HyperDX at your ClickStack URL
2. Navigate to Settings → API Keys
3. Copy your **Ingestion API Key**

Then send the traces to ClickStack:

```bash
curl -X POST http://localhost:4318/v1/traces \
  -H "Content-Type: application/json" \
  -H "Authorization: $CLICKSTACK_API_KEY" \
  -d @nginx-traces-sample.json
```

<Note title="[Running on localhost]">
This demo assumes ClickStack is running locally on `localhost:4318`. For remote instances, replace `localhost` with your ClickStack hostname.
</Note>

You should see a response like `{"partialSuccess":{}}` indicating the traces were successfully sent. All 1,000 traces will be ingested into ClickStack.

</Step>

<Step title="Verify traces in HyperDX">

1. Open [HyperDX with demo time range](http://localhost:8080/search?from=1761501600000&to=1761588000000&isLive=false&source=69023d1b4f1d41a964641b09&where=&select=Timestamp,ServiceName,StatusCode,round(Duration/1e6),SpanName&whereLanguage=lucene&orderBy=&filters=[])

Here's what you should see in your search view:

<Note>
If you don't see logs, ensure the time range is set to 2025-10-26 13:00:00 - 2025-10-27 13:00:00 and 'Logs' is selected as the source. Using the link is important to get the proper time range of results.
</Note>

<img src="/images/clickstack/nginx-traces-search-view.png" alt="View Traces"/>

</Step>
</Steps>

## Dashboards and visualization 

To help you get started monitoring traces with ClickStack, we provide essential visualizations for trace data.

<Steps toc="false">

<Step title="Download the dashboard configuration">

<Download src="">
  <Button intent="primary">Download</Button>
</Download>

</Step>

<Step title="Import the pre-built dashboard">

1. Open HyperDX and navigate to the Dashboards section.
2. Click "Import Dashboard" in the upper right corner under the ellipses.

<img src="/images/clickstack/import-dashboard.png" alt="Import Dashboard"/>

3. Upload the nginx-trace-dashboard.json file and click finish import.

<img src="/images/clickstack/finish-nginx-traces-dashboard.png" alt="Finish Import"/>

</Step>

<Step title="The dashboard will be created with all visualizations pre-configured">

<Note>
Ensure the time range is set to 2025-10-26 13:00:00 - 2025-10-27 13:00:00. The imported dashboard will not have a time range specified by default.
</Note>

<img src="/images/clickstack/nginx-traces-dashboard.png" alt="Example Dashboard"/>

</Step>
</Steps>

## Troubleshooting 

### No traces appearing in HyperDX 

**Verify nginx module is loaded:**

```bash
nginx -V 2>&1 | grep otel
```

You should see references to the OpenTelemetry module.

**Check network connectivity:**

```bash
telnet <clickstack-host> 4317
```

This should connect successfully to the OTLP gRPC endpoint.

**Verify API key is set:**
```bash
echo $CLICKSTACK_API_KEY
```

Should output your API key (not empty).

**Check nginx error logs:**
```bash
# For Docker
docker logs <nginx-container> 2>&1 | grep -i otel

# For systemd
sudo tail -f /var/log/nginx/error.log | grep -i otel
```

Look for OpenTelemetry-related errors.

**Verify nginx is receiving requests:**

```bash
# Check access logs to confirm traffic
tail -f /var/log/nginx/access.log
```

## Next steps 
If you want to explore further, here are some next steps to experiment with your dashboard

- Set up alerts for critical metrics (error rates, latency thresholds)
- Create additional dashboards for specific use cases (API monitoring, security events)
