# roc-eln-docker

## Install required system dependencies

```
$ yum update -y
$ yum install docker git -y
```

## Install docker-compose

See: https://github.com/docker/compose/releases

## Start docker daemon

```
$ systemctl start docker
$ systemctl enable docker
```

## Clone this repo

```
$ mkdir /usr/local/docker
$ cd /usr/local/docker
$ git clone https://github.com/cheminfo/roc-eln-docker.git
$ cd roc-eln-docker
```

## Edit `docker-compose.yml`

- Bind local port to the application
- Set CouchDB admin credentials (two places)
- Set CouchDB data directory
- Set rest-on-couch home directory (two places)
- Optional: set a custom `flavor-config.json`

## Configure rest-on-couch

### General config

- Copy and modify [`roc-config.js`](./roc-config.js) in $REST_ON_COUCH_HOME_DIR/config.js

### Visualizer

- Clone https://github.com/cheminfo/roc-visualizer-config.git to $REST_ON_COUCH_HOME_DIR/visualizer

### ELN

- Clone https://github.com/cheminfo/roc-eln-config.git to $REST_ON_COUCH_HOME_DIR/eln

### Printers

- Clone https://github.com/cheminfo/roc-printers-config.git to $REST_ON_COUCH_HOME_DIR/printers

## Start application

```
docker-compose pull
docker-compose up -d
```
