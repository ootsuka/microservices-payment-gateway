# microservices-payment-gateway

## How to start this project by using docker compose

1. Clone repo to local
2. Add the Certificate to Your Local Trust Store
- On macOS: Add the .crt file to the Keychain Access.
- On Linux: Add the .crt file to /usr/local/share/ca-certificates/ and run sudo update-ca-certificates.
- On Windows: Import the .crt into the Trusted Root Certification Authorities.
3. Make sure to use the project name "microservices-payment-gateway" during start and stop and down
`docker compose -p "microservices-payment-gateway" up -d`

diagram
 gateway
 db-replication, slave for read, index
 message broker-performance
 实线虚线
Postman Collection