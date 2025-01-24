#!/bin/bash

# Default Consul address
CONSUL_HTTP_ADDR=${CONSUL_HTTP_ADDR:-"consul:8500"}

# Service details
SERVICE_NAME="auth-service"
SERVICE_PORT=4080
SERVICE_ID="${SERVICE_NAME}-${HOSTNAME}"

# Get the container's internal IP address (assuming Docker is used)
CONTAINER_IP=$(hostname -i)

#!/bin/bash

# Default Consul address
CONSUL_HTTP_ADDR=${CONSUL_HTTP_ADDR:-"consul:8500"}

# Service details
SERVICE_NAME="auth-service"
SERVICE_PORT=4080
SERVICE_ID="${SERVICE_NAME}-${HOSTNAME}"

# Get the container's internal IP address (assuming Docker is used)
CONTAINER_IP=$(hostname -i)

# Register the service with Consul
curl -X PUT -d '{
    "ID": "'${SERVICE_ID}'",
    "Name": "'${SERVICE_NAME}'",
    "Address": "'${CONTAINER_IP}'",
    "Port": '${SERVICE_PORT}',
    "Check": {
    "HTTP": "https://'localhost':${SERVICE_PORT}/health", 
    "Interval": "10s"
    }
}' http://${CONSUL_HTTP_ADDR}/v1/agent/service/register
