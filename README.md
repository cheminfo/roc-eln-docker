# roc-eln-docker

## Install docker

```
$ yum update -y
$ yum install docker -y
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
$ git clone https://github.com/cheminfo/roc-eln-docker.git
```

## Edit `docker-compose.yml`

- Bind local port to the application
- Set CouchDB admin credentials
- Set CouchDB data directory
- Set rest-on-couch and rest-on-couch-import home directory
- Optional: set a custom `flavor-config.json`

## Start application

`docker-compose up -d`
