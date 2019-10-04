# roc-eln-docker

This project installs the necessary services (dockers) to run a full electronic laboratory book. A deployed version can be found at www.c6h6.org.

## Install docker and docker-compose and some dependencies

```
$ yum update -y
$ yum install epel-release -y
$ yum install git docker docker-compose -y
```

## Install Node.js

```
$ curl -sL https://rpm.nodesource.com/setup_10.x | bash -
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

## Copy this repo

```
$ mkdir /usr/local/docker
$ cd /usr/local/docker
$ curl -L https://github.com/cheminfo/roc-eln-docker/archive/master.tar.gz | tar xz
$ mv roc-eln-docker-master roc-eln-docker
$ cd roc-eln-docker
```

## Edit configuration

### Setup options in `.env`

Mandatory configuration options have the value REPLACEME

### Optional: edit `flavor-builder-config.json` to configure home page

### Configure rest-on-couch

#### LDAP config

If LDAP configuration is needed, edit `rest-on-couch/home/ldap.js`.

#### Visualizer

Copy the visualizer config to `rest-on-couch/home/visualizer`:

```
$ cd rest-on-couch/home
$ curl -L https://github.com/cheminfo/roc-visualizer-config/archive/master.tar.gz | tar xz
$ mv roc-visualizer-config-master visualizer
```

### ELN

Copy the ELN config to `rest-on-couch/home/eln`:

```
$ cd rest-on-couch/home
$ curl -L https://github.com/cheminfo/roc-eln-config/archive/master.tar.gz | tar xz
$ mv roc-eln-config-master eln
$ cd eln
$ npm i
```

### Printers

Copy the printer config to `rest-on-couch/home/printers`:

```
$ cd rest-on-couch/home
$ curl -L https://github.com/cheminfo/roc-printers-config/archive/master.tar.gz | tar xz
$ mv roc-printers-config-master printers
```

## Start application

```
docker-compose pull
docker-compose up -d --build
```

## [FAQ](faq.md)
