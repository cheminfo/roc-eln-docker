# roc-eln-docker

## Install required system dependencies

```
$ yum update -y
$ yum install docker git wget -y
```

## Install docker-compose

See: https://github.com/docker/compose/releases

## Install Node.js and yarn

```
$ curl -sL https://rpm.nodesource.com/setup_7.x | bash -
$ yum install -y nodejs
$ wget https://dl.yarnpkg.com/rpm/yarn.repo -O /etc/yum.repos.d/yarn.repo
$ yum install -y yarn
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
- Set CouchDB admin credentials (two places)
- Set CouchDB data directory
- Set rest-on-couch home directory (two places)
- Optional: set a custom `flavor-config.json`

## Configure rest-on-couch

### General config

- Copy and modify [`roc-config.js`](./roc-config.js) in $REST_ON_COUCH_HOME_DIR/config.js

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
```

### Printers

- Clone https://github.com/cheminfo/roc-printers-config.git to $REST_ON_COUCH_HOME_DIR/printers

## Start application

```
docker-compose pull
docker-compose up -d
```

## Add systemd service to manage application

```
$ cp docker-eln-app.service /etc/systemd/system/
$ systemctl daemon-reload
$ systemctl enable docker-eln-app.service # start after system boot
```

### No you can start and stop the app with systemctl

```
systemctl start docker-eln-app.service
systemctl stop docker-eln-app.service
```


## FAQ

### How to update a docker image ?

The docker-compose.yml file contains the list of all the docker images required by this project, 
their version as well as their dependencies.
If you want to update the version of an image you should change the name in the docker-compose.yml. After changing
this file you should run: `docker-compose up -d` (-d allows to put the process in background).

### Don't use docker !

You should not use the `docker` instruction because it is not aware of dependencies and it could lead to unexpected results.
Please always use `docker-compose` instead.

In order to check all the running docker images: `docker-compose ps`
To restart a specific image: `docker-compose restart rest-on-couch`
