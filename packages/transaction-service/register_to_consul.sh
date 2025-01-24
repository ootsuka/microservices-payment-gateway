#!/bin/bash
CONSUL_HTTP_ADDR=${CONSUL_HTTP_ADDR:-"consul:8500"}
SERVICE_NAME="transaction-service"
SERVICE_PORT=5080
SERVICE_ID="${SERVICE_NAME}-${HOSTNAME}"

# 获取容器的内部 IP 地址（如果在 Docker 中运行）
CONTAINER_IP=$(hostname -i)

# 向 Consul 注册服务
curl -X PUT -d '{
  "ID": "'${SERVICE_ID}'",
  "Name": "'${SERVICE_NAME}'",
  "Address": "'${CONTAINER_IP}'",
  "Port": '${SERVICE_PORT}',
  "Check": {
    "HTTP": "https://localhost:${SERVICE_PORT}/health",  
    "Interval": "10s"
  }
}' http://${CONSUL_HTTP_ADDR}/v1/agent/service/register
