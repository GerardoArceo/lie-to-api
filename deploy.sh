# deploy.sh
#!/bin/bash
sudo npm run build:prod

git add .
git commit -m "commit"
git push -u origin master
echo 'OK'