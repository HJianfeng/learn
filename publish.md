
## 前言
这篇主要向大家介绍一个web应用从购买服务器到网站上线的步骤

## 域名的购买
如果想让我们的应用能够在浏览器上被大家使用，一个域名是必须要的，域名的购买有很多种途径，国内外都有很多的域名注册商在哪个注册商买都是一样的，域名一般是按年付费，我们这里选择阿里云的万网，因为在阿里云购买域名的话备案会比较方便。[万网](https://wanwang.aliyun.com/domain/?spm=5176.100251.111252.24.6bee4f15veEdUa)，购买很简单，按步骤来就可以了。

## 服务器的选择
这是云的时代，很多公司的服务器都是部署在云上。我们在选购服务器的时候主要需要考虑的就是配置和厂商，比较大的厂商有阿里云、亚马逊、腾讯云、百度云。当然我们最好是选择国内的厂商，因为我们用户一般也是在国内。这里我们选择阿里云的主机。阿里云主机有各种各样的配置。因为我们还是已学习为目的，我们选择便宜的就好了。

## 域名备案
如果我们的网站想要在国内可以访问的话，我们是必须进行备案，如果是在阿里云购买服务器的话我们在阿里云上就能很方便的进行备案。备案的话需要提供我们的个人资料，需要注意的是域名在备案期间我们必须得保证我们的域名是不能线上访问的，不然会不通过。

## 连接服务器
### FinalShell
连接服务器除了直接使用我们本地的终端外，还可以选择其他更加方便的shell工具，比如`FinalShell`。我们下载完`FinalShell`后，点击连接输入主机IP，用户名和密码。
默认的用户名是`root`，密码就是购买服务器时让你输入的密码，密码也可以在阿里云控制到进行修改。确认后就成功进入到服务器上。`FinalShell`会保存你的密码，第二次的时候我们就可以不输入密码。  

### 本地终端
虽然直接用`FinalShell`可以很方便的登录，但是我们还是得配置一下本地终端，方便以后部署应用。   
我们打开终端输入ip和默认用户名
```
 ssh 120.78.162.6@root
```
然后输入密码，本地终端登录的话是不会自动保存密码的，我们每次登录都需要重新输入密码，这点是很烦的，以后每次通过命令部署应用到服务器上的时候也需要输入很多次密码。为了解决这个问题我们需要在本地生成一个SSH公钥，然后通过本地的SSH公钥，让服务器识别我们的电脑，这样我们用这台电脑登录的时候就不需要在输入密码。  
首先我们先要查看本地是否已经有了公钥，首先找到`.ssh`文件，一般这个文件夹会在用户目录下，查看.ssh里是否有`id_rsa`和`id_rsa.pub`这两个文件，如果有说明你已经拥有公钥，不需要在生成，如果没有就需要运行下面这段命令生成。
```
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
这样在.ssh文件夹就有了公钥和私钥。  
然后打开你的服务器，同样生成公钥
```
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```
然后输入
进入root目录下的.ssh文件夹，通过vim创建`authorized_keys`文件，把我们本地的SSH公钥复制进去。通过`chmod 600 authorized_keys`获取权限，然后输入`sudo service ssh restart`重启ssh服务。这样我们再进行登录的时候就不需要输入密码。

## 安装Nodejs和MongoDb

#### Nodejs
首先我们把一些需要的依赖安装一下
```
sudo apt-get install vim openssl build-essential libssl-dev wget curl
```
然后安装nvm来管理node版本。
```
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
```
使用nvm安装最新版本的nodejs
```
nvm install v12.13.0
```
切换使用版本v12.13.0，如果想使用其他版本的node也可以通过这个命令切换。
```
nvm use v12.13.0
```
设置系统默认使用的node版本
```
nvm alias default v12.13.0
```
安装nodejs的方法很多，还可以直接下载nodejs的压缩包，然后解压安装。

#### MongoDB
第一步导入`public key`，这是用于包管理系统使用的公钥
```
wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | sudo apt-key add -
```
第二步，为MongoDB创建列表文件
```
echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.2.list
```
第三步，导入`public key`后需要更新系统
```
sudo apt-get update
```
第四步，使用app-get来安装mondodb
```
sudo apt-get install -y mongodb-org
```
这样就完成了mongodb的安装
最后使用service服务开启mongodb
```
sudo service mongod start
```
如果需要停止或重启的话使用命令
```
sudo service mongod stop
sudo service mongod restart
```

## 配置Nginx实现方向代理
#### 安装nginx
安装nginx很简单，直接使用 apt-get
```
sudo apt-get install nginx
```
进入`/etc/nginx/conf.d/`文件夹，这个文件夹就是用来放nginx的配置文件，我们新建一个文件`helloworld.conf`，文件名不重要只需要自己认得到就好，nginx会默认加载这个目录下的`.conf`配置文件。
```
# 负载均衡
upstream helloworld {
  server 127.0.0.1:3333;
 }
 
server {
    # 默认是
    listen 80;
    server_name 120.78.162.6;
    location / {
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $http_host;
        proxy_set_header X-Nginx-Proxy true;
        
        proxy_pass http://helloworld;
        proxy_redirect off;
    }
}
```
这个配置的意思是把120.78.162.6:3333 代理到120.78.162.6:80这个端口，80是默认端口，所以访问http://120.78.162.6:80时可以写成http://120.78.162.6 

保存退出后，输入下面的命令测试配置是否正确
```
nginx -t
```
如果弹出成功，则说明配置正确。重启nginx
```
sudo nginx -s reload
```
我们以后启动node应用使用3333端口的话就可以直接使用 http://120.78.162.6 来访问网站，这样我们域名解析时就可以使用120.78.162.6来解析域名

## 向服务器正式部署和发布上线项目
我们在服务器上使用pm2来部署上线项目，接下来我们把本地代码上传到服务器，但是如果每次上传和修改代码时都从本地一个一个字节上传的话是很低效的，所以我们需要使用git来管理项目。  

首先安装pm2 和 git
```
npm install -g pm2
sudo apt-get install git
```
首先在git上创建一个仓库，然后把之前生成的服务器公钥复制到github上。  
然后在根目录下创建`ecosystem.json`，这个是pm2的自动部署配置文件。
```javascript
{
  "apps" : [{
     "name" : "Test",
     "script" : "app.js",
     "env": {
       "COMMON_VARIABLE": "true"
     },
     "env_production": {
       "NODE_ENV": "production"
     }
  }],
  "deploy" : {
    "production" : {
      "user" : "root",
      "host" : ["120.78.162.6"], // 服务器IP
      "post" : "22",  // 登录服务器的端口
      "ref"  : "origin/master", // 需要部署的git分支
      "repo" : "git@github.com:HJianfeng/xingzhou.git", // git地址 
      "path" : "/www/xingzhou/production",  // 项目在服务器上的位置
      "ssh_options": "StrictHostKeyChecking=no",
      // 上传前运行的命令
      "post-deploy" : "npm install && npm run build && pm2 startOrRestart ecosystem.json --env production",
      "env": {
        "NODE_ENV": "production"
      }
     }
  }
}
```
第一次部署时需要现在服务端通过git clone把项目拷贝下来，然后在客户端执行发布命令
```
pm2 deploy ecosystem.json production
```
然后等待响应就可以了。  
通过配置文件最大的好处就是，当我们需要修改代码时，只需要上传的git，然后再执行发布命令就能更新我们的网站。

## 添加SSL证书
可以申请免费ssl证书的平台很多，有又拍云，腾讯云，阿里云等。因为我们服务器和域名都是阿里云的，所以我们就直接在阿里云上申请ssl证书，[阿里云SSL证书](https://yundun.console.aliyun.com/?spm=5176.12818093.my.dcas.488716d0uTUGmJ&p=cas#/overview/cn-hangzhou)。  

根据说明申请证书后，一般24小时会把证书颁发下来，颁发后下载nginx版本，上传到服务器上。然后把下面代码配置到你的.conf文件
```
listen 443;  # ssl证书访问的端口号
server_name www.jsclub.top;  # 证书绑定的域名
ssl on;  # 开启ssl
ssl_certificate /www/ssl/www.jsclub.top.pem; # 证书文件地址
ssl_certificate_key /www/ssl/www.jsclub.top.key; # key的路径
ssl_session_timeout 5m; 

# 配置的加密套件
ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
ssl_ciphers ALL:!ADH:!EXPORT56:RC4+RSA:+HIGH:+MEDIUM:+LOW:+SSLv2:+EXP;
ssl_prefer_server_ciphers on;

if($ssl_protocol = '') {
    rewrite ^(.*) https://$host$1 permanent;
}
```
然后把http的请求转成https
```
server {
    listen 80;
    server_name www.jsclub.top;
    return 301 https://www.jsclub.top$request_uri;
}
```
最后记得检查阿里云控制台的安全组有没有增加443端口的访问权限。