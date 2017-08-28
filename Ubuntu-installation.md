# Ubuntu LTS 16.04.2
## Install docker

Install some dependencies. It could be they are already installed.
```bash
sudo apt-get install \
    apt-transport-https \
    ca-certificates \
    curl \
    software-properties-common
```

Get docker's official GPG key
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

Set up stable docker repository
```bash
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"
```

Update package index
```bash
sudo apt-get update
```
Get fixed docker version to install
```bash
apt-cache madison docker-ce
```

Install fixed docker version (adapt version to output of previous command)
```bash
sudo apt-get install docker-ce=17.03.1~ce-0~ubuntu-xenial
```

Install latest stable docker community edition
```bash
sudo apt-get install docker-ce
```

Check docker is working
```bash
sudo docker run hello-world
```

## Install docker-compose
Download the binary from github (adapt the version number to latest stable release), and allow it to be executed. If you are not root run `sudo -i` before and `exit` after.
```bash
curl -L https://github.com/docker/compose/releases/download/1.13.0/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose
```

Test the installation
```bash
docker-compose --version
```

## Install Node.js and yarn
Install recent stable node.js version
```bash
curl -sL https://deb.nodesource.com/setup_7.x | bash -
apt-get install nodejs
```

Install stable yarn release
```bash
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
apt-get install yarn
```

## Configure
Follow instruction in the [main readme](https://github.com/cheminfo/roc-eln-docker/blob/master/README.md)

:warning: The part on SELinux is different. SELinux is disabled by default on Ubuntu.

## Install nginx
```bash
sudo apt-get install nginx
```

Edit default configuration file and change the server context
```bash
vim /etc/nginx/sites-enabled/default
```

```nginx
server {
        listen 80 default_server;
        listen [::]:80 default_server;

        root /var/www/html;
        server_name _;
        
        location / {
                proxy_pass http://localhost:4444;
        }
}
```

Start the nginx server
```bash
sudo systemctl restart nginx
```
