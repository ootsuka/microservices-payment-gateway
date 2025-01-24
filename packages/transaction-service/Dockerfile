FROM node:18
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
EXPOSE 5000
ENV CONSUL_HTTP_ADDR=consul:8500
CMD ["sh", "-c", "npm start & ./register_to_consul.sh && wait"]
