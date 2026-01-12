---
slug: /use-cases/observability/clickstack/deployment/helm
title: 'Helm'
pagination_prev: null
pagination_next: null
sidebar_position: 2
description: 'Deploying ClickStack with Helm - The ClickHouse Observability Stack'
doc_type: 'guide'
keywords: ['ClickStack Helm chart', 'Helm ClickHouse deployment', 'HyperDX Helm installation', 'Kubernetes observability stack', 'ClickStack Kubernetes deployment']
---

import {BetaBadge} from '/snippets/components/BetaBadge/BetaBadge.jsx'
import JsonSupport from '/snippets/_json_support.mdx';

The helm chart for HyperDX can be found [here](https://github.com/hyperdxio/helm-charts) and is the **recommended** method for production deployments.

By default, the Helm chart provisions all core components, including:

* **ClickHouse**
* **HyperDX**
* **OpenTelemetry (OTel) collector**
* **MongoDB** (for persistent application state)

However, it can be easily customized to integrate with an existing ClickHouse deployment - for example, one hosted in **ClickHouse Cloud**.

The chart supports standard Kubernetes best practices, including:

- Environment-specific configuration via `values.yaml`
- Resource limits and pod-level scaling
- TLS and ingress configuration
- Secrets management and authentication setup

### Suitable for 

* Proof of concepts
* Production

## Deployment steps 
<br/>

<Steps>

<Step>

### Prerequisites 

- [Helm](https://helm.sh/) v3+
- Kubernetes cluster (v1.20+ recommended)
- `kubectl` configured to interact with your cluster

</Step>

<Step>

### Add the HyperDX Helm repository 

Add the HyperDX Helm repository:

```shell
helm repo add hyperdx https://hyperdxio.github.io/helm-charts
helm repo update
```

</Step>

<Step>

### Installing HyperDX 

To install the HyperDX chart with default values:

```shell
helm install my-hyperdx hyperdx/hdx-oss-v2
```

</Step>

<Step>

### Verify the installation 

Verify the installation:

```shell
kubectl get pods -l "app.kubernetes.io/name=hdx-oss-v2"
```

When all pods are ready, proceed.

</Step>

<Step>

### Forward ports 

Port forwarding allows us to access and set up HyperDX. Users deploying to production should instead expose the service via an ingress or load balancer to ensure proper network access, TLS termination, and scalability. Port forwarding is best suited for local development or one-off administrative tasks, not long-term or high-availability environments.

```shell
kubectl port-forward \
  pod/$(kubectl get pod -l app.kubernetes.io/name=hdx-oss-v2 -o jsonpath='{.items[0].metadata.name}') \
  8080:3000
```

</Step>

<Step>

### Navigate to the UI 

Visit [http://localhost:8080](http://localhost:8080) to access the HyperDX UI.

Create a user, providing a username and password which means the requirements.

<img src="/images/use-cases/observability/hyperdx-login.png" alt="HyperDX UI"/>

On clicking `Create`, data sources will be created for the ClickHouse instance deployed with the Helm chart.

<Note title="Overriding default connection">
You can override the default connection to the integrated ClickHouse instance. For details, see ["Using ClickHouse Cloud"](#using-clickhouse-cloud).
</Note>

For an example of using an alternative ClickHouse instance, see ["Create a ClickHouse Cloud connection"](/use-cases/observability/clickstack/getting-started#create-a-cloud-connection).

</Step>

<Step>

### Customizing values (optional) 

You can customize settings by using `--set` flags. For example:

```shell
helm install my-hyperdx hyperdx/hdx-oss-v2 --set key=value
```

Alternatively, edit the `values.yaml`. To retrieve the default values:

```shell
helm show values hyperdx/hdx-oss-v2 > values.yaml
```

Example config:

```yaml
replicaCount: 2
resources:
  limits:
    cpu: 500m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi
ingress:
  enabled: true
  annotations:
    kubernetes.io/ingress.class: nginx
  hosts:
    - host: hyperdx.example.com
      paths:
        - path: /
          pathType: ImplementationSpecific
```

```shell
helm install my-hyperdx hyperdx/hdx-oss-v2 -f values.yaml
```

</Step>

<Step>

### Using secrets (optional) 

For handling sensitive data such as API keys or database credentials, use Kubernetes secrets. The HyperDX Helm charts provide default secret files that you can modify and apply to your cluster.

#### Using pre-configured secrets 

The Helm chart includes a default secret template located at [`charts/hdx-oss-v2/templates/secrets.yaml`](https://github.com/hyperdxio/helm-charts/blob/main/charts/hdx-oss-v2/templates/secrets.yaml). This file provides a base structure for managing secrets.

If you need to manually apply a secret, modify and apply the provided `secrets.yaml` template:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: hyperdx-secret
  annotations:
    "helm.sh/resource-policy": keep
type: Opaque
data:
  API_KEY: <base64-encoded-api-key>
```

Apply the secret to your cluster:

```shell
kubectl apply -f secrets.yaml
```

#### Creating a custom secret 

If you prefer, you can create a custom Kubernetes secret manually:

```shell
kubectl create secret generic hyperdx-secret \
  --from-literal=API_KEY=my-secret-api-key
```

#### Referencing a secret 

To reference a secret in `values.yaml`:

```yaml
hyperdx:
  apiKey:
    valueFrom:
      secretKeyRef:
        name: hyperdx-secret
        key: API_KEY
```

</Step>

</Steps>

## Using ClickHouse Cloud 

If using ClickHouse Cloud users disable the ClickHouse instance deployed by the Helm chart and specify the Cloud credentials:

```shell
# specify ClickHouse Cloud credentials
export CLICKHOUSE_URL=<CLICKHOUSE_CLOUD_URL> # full https url
export CLICKHOUSE_USER=<CLICKHOUSE_USER>
export CLICKHOUSE_PASSWORD=<CLICKHOUSE_PASSWORD>

# how to overwrite default connection
helm install myrelease hyperdx-helm --set clickhouse.enabled=false --set clickhouse.persistence.enabled=false --set otel.clickhouseEndpoint=${CLICKHOUSE_URL} --set clickhouse.config.users.otelUser=${CLICKHOUSE_USER} --set clickhouse.config.users.otelUserPassword=${CLICKHOUSE_PASSWORD}
```

Alternatively, use a `values.yaml` file:

```yaml
clickhouse:
  enabled: false
  persistence:
    enabled: false
  config:
    users:
      otelUser: ${CLICKHOUSE_USER}
      otelUserPassword: ${CLICKHOUSE_PASSWORD}

otel:
  clickhouseEndpoint: ${CLICKHOUSE_URL}

hyperdx:
  defaultConnections: |
    [
      {
        "name": "External ClickHouse",
        "host": "http://your-clickhouse-server:8123",
        "port": 8123,
        "username": "your-username",
        "password": "your-password"
      }
    ]
```

```shell
helm install my-hyperdx hyperdx/hdx-oss-v2 -f values.yaml
# or if installed...
# helm upgrade my-hyperdx hyperdx/hdx-oss-v2 -f values.yaml
```

## Production notes 

By default, this chart also installs ClickHouse and the OTel collector. However, for production, it is recommended that you manage ClickHouse and the OTel collector separately.

To disable ClickHouse and the OTel collector, set the following values:

```shell
helm install myrelease hyperdx-helm --set clickhouse.enabled=false --set clickhouse.persistence.enabled=false --set otel.enabled=false
```

## Task configuration 

By default, there is one task in the chart setup as a cronjob, responsible for checking whether alerts should fire. Here are its configuration options:

| Parameter | Description | Default |
|-----------|-------------|---------|
| `tasks.enabled` | Enable/Disable cron tasks in the cluster. By default, the HyperDX image will run cron tasks in the process. Change to true if you'd rather use a separate cron task in the cluster. | `false` |
| `tasks.checkAlerts.schedule` | Cron schedule for the check-alerts task | `*/1 * * * *` |
| `tasks.checkAlerts.resources` | Resource requests and limits for the check-alerts task | See `values.yaml` |

## Upgrading the chart 

To upgrade to a newer version:

```shell
helm upgrade my-hyperdx hyperdx/hdx-oss-v2 -f values.yaml
```

To check available chart versions:

```shell
helm search repo hyperdx
```

## Uninstalling HyperDX 

To remove the deployment:

```shell
helm uninstall my-hyperdx
```

This will remove all resources associated with the release, but persistent data (if any) may remain.

## Troubleshooting 

### Checking logs 

```shell
kubectl logs -l app.kubernetes.io/name=hdx-oss-v2
```

### Debugging a failed install 

```shell
helm install my-hyperdx hyperdx/hdx-oss-v2 --debug --dry-run
```

### Verifying deployment 

```shell
kubectl get pods -l app.kubernetes.io/name=hdx-oss-v2
```

<JsonSupport />

Users can set these environment variables via either parameters or the `values.yaml` e.g.

*values.yaml*

```yaml
hyperdx:
  ...
  env:
    - name: BETA_CH_OTEL_JSON_SCHEMA_ENABLED
      value: "true"

otel:
  ...
  env:
    - name: OTEL_AGENT_FEATURE_GATE_ARG
      value: "--feature-gates=clickhouse.json"
```

or via `--set`:

```shell
helm install myrelease hyperdx-helm --set "hyperdx.env[0].name=BETA_CH_OTEL_JSON_SCHEMA_ENABLED" \
  --set "hyperdx.env[0].value=true" \
  --set "otel.env[0].name=OTEL_AGENT_FEATURE_GATE_ARG" \
  --set "otel.env[0].value=--feature-gates=clickhouse.json"
```