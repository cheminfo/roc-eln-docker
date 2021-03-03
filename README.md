# roc-eln-docker

This project installs the necessary services (dockers) to run a full electronic laboratory book. A deployed version that can be used with a Google Account can be found at [www.c6h6.org](http://www.c6h6.org).

For common questions, please have a look at the [FAQ](faq.md). For some background information about the ELN [you can have a look at our website](https://cheminfo.github.io/eln.epfl.ch/).

## Installing dependencies

### 1. Install docker and docker-compose and some dependencies

On Red Hat Linux/CentOS you need to run the following commands:

```bash
yum update -y
yum install epel-release -y
yum install git docker docker-compose -y
```

You can use [similar commands](https://docs.docker.com/compose/install/) on other operating systems.

### 2. Install Node.js

On Red Hat Linux/CentOS you need to run the following commands:

```bash
curl -sL https://rpm.nodesource.com/setup_10.x | bash -
yum install -y nodejs
```

You can use [similar commands or installers](https://nodejs.org/en/download/) on other operating systems.

### 3. Optional configurations

- [On CentOS/Red Hat Linux you might want to permanently disable SE Linux](https://www.rootusers.com/how-to-enable-or-disable-selinux-in-centos-rhel-7/)
- If you are behind a corporate proxy you can follow [the guide to configure Docker to use the proxy](https://docs.docker.com/engine/admin/systemd/#/http-proxy)

## Getting the ELN code and running it

### 1. Start docker daemon

```bash
systemctl start docker
systemctl enable docker
```

### 2. Clone this repo

We recommend that you run it from `/usr/local/docker` but this is not crucial for this system.

```bash
mkdir /usr/local/docker
cd /usr/local/docker
curl -L https://github.com/cheminfo/roc-eln-docker/archive/master.tar.gz | tar xz
mv roc-eln-docker-master roc-eln-docker
cd roc-eln-docker
```

### 3. Edit configuration

1. Adjust the options in `.env`. Mandatory configuration options have the value `REPLACEME`
2. Optional: edit `flavor-builder-config.json` to configure home page
3. If LDAP configuration is needed, edit `rest-on-couch/home/ldap.js`.

If you want a default configuration you might just follow the continuos integration instead of the next steps in this section (Visualizer, ELN, Printers). That is, run the `ci/install.sh` script followed by `docker-compose up -d`.

#### Visualizer

Copy the [visualizer](https://github.com/NPellet/visualizer) config to `rest-on-couch/home/visualizer`:

```bash
cd rest-on-couch/home
curl -L https://github.com/cheminfo/roc-visualizer-config/archive/master.tar.gz | tar xz
mv roc-visualizer-config-master visualizer
```

#### ELN

Copy the ELN config to `rest-on-couch/home/eln`:

```bash
cd rest-on-couch/home
curl -L https://github.com/cheminfo/roc-eln-config/archive/master.tar.gz | tar xz
mv roc-eln-config-master eln
cd eln
npm i
```

#### Printers

Copy the printer config to `rest-on-couch/home/printers`:

```bash
cd rest-on-couch/home
curl -L https://github.com/cheminfo/roc-printers-config/archive/master.tar.gz | tar xz
mv roc-printers-config-master printers
```

### 4. Start the application

```bash
cd /usr/local/docker/roc-eln-docker
docker-compose pull
docker-compose up -d --build
```
