FROM node:7-alpine

ENV VERSION d15be0102621652bcac2dd2045df816e7fbe6143

RUN apk add --no-cache curl && \
    curl -fSL https://github.com/cheminfo/stock-printer-proxy/archive/$VERSION.tar.gz -o $VERSION.tar.gz && \
    tar -xzf $VERSION.tar.gz && \
    mv stock-printer-proxy-${VERSION} stock-printer-proxy-source && \
    npm i -g pm2 && \
    cd /stock-printer-proxy-source && \
    npm i && \
    rm -rf /root/.npm /usr/local/share/.cache /root/.cache /${VERSION}.tar.gz

COPY pm2-proxy.yml /pm2-proxy.yml

WORKDIR /stock-printer-proxy-source
CMD ["npm", "start"]
