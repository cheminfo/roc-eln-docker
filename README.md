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
- Set CouchDB admin credentials (two places)
- Set CouchDB data directory
- Set rest-on-couch home directory (two places)
- Optional: set a custom `flavor-config.json`

## Start application

`docker-compose up -d`
