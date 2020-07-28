#!/bin/bash

cd /tmp

echo '#!/bin/bash
# set -e
sudo yum update -y
sudo yum install -y awslogs
sudo service awslogs start
sudo systemctl enable awslogsd.service
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
source ~/.bashrc
nvm i 13.13.0
curl -o- -L https://yarnpkg.com/install.sh | bash
sudo yum install -y wget ruby
cd ~
wget https://aws-codedeploy-eu-central-1.s3.eu-central-1.amazonaws.com/latest/install
chmod +x ./install
sudo ./install auto
sudo ln -s ~/.nvm/versions/node/v13.13.0/bin/node /usr/bin
sudo ln -s ~/.nvm/versions/node/v13.13.0/bin/npm /usr/bin
sudo ln -s ~/.yarn/bin/yarn /usr/bin
sudo yarn global add pm2
sudo ln -s /usr/local/bin/pm2 /usr/bin' >> init.sh

chmod +x init.sh
/bin/su -c "/tmp/init.sh" - ec2-user
rm init.sh
