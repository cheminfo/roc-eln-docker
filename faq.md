## FAQ

### How to update a docker image ?

The docker-compose.yml file contains the list of all the docker images required by this project,
their version as well as their dependencies.
If you want to update the version of an image you should change the name in the docker-compose.yml. After changing
this file you should run: `docker-compose up -d --build` (-d allows to put the process in background).

### Don't use docker !

You should not use the `docker` instruction because it is not aware of dependencies and it could lead to unexpected results.
Please always use `docker-compose` instead.

In order to check all the running docker images: `docker-compose ps`
To restart a specific image: `docker-compose restart rest-on-couch`

### Apache configuration

```
yum install httpd -y
systemctl enable httpd
```

By default the docker nginx-proxy listen to port 4444. You should add in `/etc/httpd/conf.d` a proxy to this port.

NEVER put a ServerAlias !!!! Because the authentication is valid only from one domain.

`vi /etc/httpd/conf.d/eln.conf`

```
<VirtualHost *:80>
    ServerAdmin     a@b.com
    ServerName      eln.myinstitution.org

    SetEnvIf Origin "^(.*)$" AccessControlAllowOrigin=$0
    Header set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
    Header set Vary Origin
    Header set Access-Control-Expose-Headers "ETag, Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"

    AllowEncodedSlashes NoDecode
    ProxyPass / http://localhost:4444/ nocanon
    ProxyPassReverse / http://localhost:4444/
</VirtualHost>
```

You should then start httpd:

```
$ systemctl start httpd
```

If you have an error in your apache configuration file you can use `apachectl configtest` to determine the line with
the error.

Don't forget to check iptables if it is running ! By default only port 22 is allowed.

### Installing iptables

```
$ yum install iptables-services -y
$ systemctl start iptables
$ systemctl enable iptables
```

You should edit the file add add a rule to allow http.
`vi /etc/sysconfig/iptables`

`-A INPUT -p tcp --dport 80 -m state --state NEW,ESTABLISHED -j ACCEPT`

### ERROR: Failed to Setup IP tables

Docker will install new chains in iptables. This means you may not restart iptables once docker is started !
If you really have to restart iptables service then you will have also to restart docker and docker-compose.

```
$ systemctl restart docker
```

### Automatic importation of files (jcamp, etc.)

rest-on-couch allows to import automatically files based on a filter that is placed
in the corresponding folder.

In `roc-eln-docker` folder you will find `rest-on-couch` that contains a folder `eln`
that corresponds to the name of the couchDB database. In this folder you are
free to put any number of folders that will contain a file named `ìmport.js` describing
how to import files that are dropped in the folder.
So all the files that you would like to import of the kind nmr
for example could be placed in:
`/usr/local/docker/roc-eln-docker/rest-on-couch/eln/nmr/to_process` and once they are
processed they will be moved to
`/usr/local/docker/roc-eln-docker/rest-on-couch/eln/nmr/processed` or in case of error to
`/usr/local/docker/roc-eln-docker/rest-on-couch/eln/nmr/errored`.

In order to debug a file that is in errored and to edit the import.js file you may run the
importation in an interactive way.
For this you may go in the docker image. First find the id of the `rest-on-couch-import`image
using `docker ps` and then go in the image using `docker exec -it fe2acfbb9bba sh` (replace
the correct image ID).

To get the help of the import you can run:
`node bin/rest-on-couch-import.js --help`

You can test the importation of an errored file with an instruction like:
`node bin/rest-on-couch-import.js --dry-run /rest-on-couch/eln/nmr/errored/2017/08/28/abc.jdx eln nmr`

### Migrating from any previous version of couchdb to couchdb 2.1.0

you should have other installation of couchdb (can be local), then you execute
the following command (replacing the URL's):

```bash
curl -H 'Content-Type: application/json' -X POST http://localhost:5984/_replicate -d \
' { "source": "http://admin:admin_password@productionServerHostname:5984/eln", "target": "http://admin:admin_password@productionServerHostname:5984/eln", "create_target": true }'
```

do that for `eln`, `visualizer` and `printers` databases.

**note**: take care if you are running this command from the roc-eln-docker couchdb container
because the available port outside of the container is 4445 but inside is the 5984.

Then you do:

- `docker-compose down`.
- delete the `couchdb-data` folder.
- update the `docker-compose.yml` with the couchdb:2.1.0 image (docker.io/apache/couchdb:2.1.0)
- `docker-compose pull`
- `docker-compose up -d`
- execute the same bash command as before but changing the source and target.

**note**: even if you are on couchdb 2.0.0, you have to manually migrate all
data manually because there's no backward compatibility. [click here to see more](http://docs.couchdb.org/en/2.1.0/install/troubleshooting.html#upgrading)

You can also give a try to the new `couchup` utility explained [here](http://docs.couchdb.org/en/2.1.0/install/upgrading.html#manual-couchdb-1-x-migration)

### Login using google

You should edit the file: `rest-on-couch/home/config.js`

### Building docker flavor-builder

```bash
cd flavor-builder

docker build .
docker tag 4b0026ee3294 cheminfo/eln-flavor-builder
docker push cheminfo/eln-flavor-builder
```

### selinux

```bash
chcon -R -t container_file_t rock-eln-docker/
```

https://www.projectatomic.io/blog/2016/03/dwalsh_selinux_containers/

### How to edit homepage

When going to your website: http://localhost/on-tabs/ and login using the credentials specifield in the docker-compose.yml file you will be able to edit the home page view as well as to define custom local views.

You will see a view manager as shown below 

![view manager](static/viewmanager.png)

which allows you toggle between revisions. 

If you want to change for example the tiles that are shown on the home screen, you can right click and then select `switch to layer/Links` where you will be able to delete, move and add tiles. 

![right click](static/changelayer.png)

What you for example might want to do is to change the document to which the help button redirects to. 
For this, you can go to the `on-tabs` website, right click on and select `Global preferences`, then under `Action Scripting` you can edit the `Action Help`