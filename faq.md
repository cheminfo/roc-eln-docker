
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

### Apache configuration

```
yum install httpd -y
systemctl enable httpd
```

By default the docker nginx-proxy listen to port 4444. You should add in `/etc/httpd/conf.d` a proxy to this port.

`vi /etc/httpd/conf.d/eln.conf`

```
<VirtualHost *:80>
    ServerAdmin     a@b.com
    ServerName      eln.myinstitution.org
    ServerAlias     eln

    SetEnvIf Origin "^(.*)$" AccessControlAllowOrigin=$0
    Header set Access-Control-Allow-Origin %{AccessControlAllowOrigin}e env=AccessControlAllowOrigin
    Header set Vary Origin

	ProxyPass / http://localhost:4444/
	ProxyPassReverse / http://localhost:4444/
</VirtualHost>

```

You should then start httpd:
```
systemctl start httpd
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
systemctl docker restart
docker-compose restart
`
