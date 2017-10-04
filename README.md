# roc-eln-docker

This project installs the necessary services (dockers) to run a full electronic laboratory book. A deployed version can be found at www.c6h6.org.

## Install required system dependencies

```
$ yum update -y
$ yum install docker git wget -y
```

## Install docker-compose

See: https://github.com/docker/compose/releases

## Install Node.js

```
$ curl -sL https://rpm.nodesource.com/setup_8.x | bash -
$ yum install -y nodejs
```

## Permanently disable SELinux

https://www.rootusers.com/how-to-enable-or-disable-selinux-in-centos-rhel-7/

## If behind a corporate proxy

Follow the guide to configure Docker to use the proxy: https://docs.docker.com/engine/admin/systemd/#/http-proxy

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
- Set CouchDB admin credentials (three places)
- Set CouchDB data directory and create corresponding host directory
- Set rest-on-couch home directory (two places) and create corresponding host directory
- Change REST_ON_COUCH_SESSION_KEY name
- Optional: set a custom `flavor-config.json`

## Configure rest-on-couch

### General config

- Copy and modify [`roc-config.js`](./roc-config.js) in $REST_ON_COUCH_HOME_DIR/config.js

Take care of the final name !!! Not having any configuration file may yield to unexptected results, mainly at
the level of domain associated with cookies.

### Visualizer

Clone https://github.com/cheminfo/roc-visualizer-config.git to $REST_ON_COUCH_HOME_DIR/visualizer

```
$ cd /usr/local/docker/roc-eln-docker/rest-on-couch-home
$ git clone https://github.com/cheminfo/roc-visualizer-config.git visualizer
```

### ELN

Clone https://github.com/cheminfo/roc-eln-config.git to $REST_ON_COUCH_HOME_DIR/eln


```
$ cd /usr/local/docker/roc-eln-docker/rest-on-couch-home
$ git clone https://github.com/cheminfo/roc-eln-config.git eln
$ cd eln
$ npm i
```

### Printers

- Clone https://github.com/cheminfo/roc-printers-config.git to $REST_ON_COUCH_HOME_DIR/printers

```
$ cd /usr/local/docker/roc-eln-docker/rest-on-couch-home
$ git clone https://github.com/cheminfo/roc-printers-config.git printers
```


## Start application

```
docker-compose pull
docker-compose up -d --build
```

## Add systemd service to manage application

```
$ cp docker-eln-app.service /etc/systemd/system/
$ systemctl daemon-reload
$ systemctl enable docker-eln-app.service # start after system boot
```

### Now you can start and stop the app with systemctl

```
systemctl start docker-eln-app.service
systemctl stop docker-eln-app.service
```

## [FAQ](faq.md)
