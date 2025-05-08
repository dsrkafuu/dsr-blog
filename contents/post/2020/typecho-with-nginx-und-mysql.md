---
title: 'Ubuntu 20.04 基于 PHP 7.4 和 MySQL 搭建 Typecho'
date: 2020-05-30T22:14:51+08:00
keywords:
  - 'linux'
  - 'nginx'
  - 'php'
  - 'sql'
  - '教程'
  - '指南'
description: '计划私下里给亲友们发布一些东西，考虑到用 WP 有点小题大做，为了方便就搭 Typecho 了。'
---

计划私下里给亲友们发布一些东西，考虑到用 WP 有点小题大做，为了方便就搭 [Typecho](https://typecho.org/) 了。最初计划里是基于 SQLite 的，但是为了主题，还是回到了 MySQL。废话不多说，直接开始记录。

<!--more-->

## nginx

[官方文档](https://nginx.org/en/docs/install.html) 有详尽的安装教程，这里基于 Ubuntu 和官方源：

```bash
sudo apt install curl gnupg2 ca-certificates lsb-release
```

添加 stable 源：

```bash
echo "deb http://nginx.org/packages/ubuntu `lsb_release -cs` nginx" \
    | sudo tee /etc/apt/sources.list.d/nginx.list
```

导入 key 并验证：

```bash
curl -fsSL https://nginx.org/keys/nginx_signing.key | sudo apt-key add -
sudo apt-key fingerprint ABF5BD827BD9BF62
```

出现如下内容则正常：

```
pub   rsa2048 2011-08-19 [SC] [expires: 2024-06-14]
      573B FD6B 3D8F BC64 1079  A6AB ABF5 BD82 7BD9 BF62
uid           [ unknown] nginx signing key <signing-key@nginx.com>
```

安装 nginx：

```bash
sudo apt update
sudo apt install nginx
sudo nginx
```

## PHP 7.4

### 安装 PHP

为了偷懒，使用了 [deb.sury.org](https://deb.sury.org/) 提供的 PPA：

```bash
sudo add-apt-repository ppa:ondrej/php
sudo apt update
```

安装 PHP 以及将要使用的插件：

```bash
sudo apt install php7.4-cli php7.4-fpm php7.4-curl php7.4-mysql php7.4-gd php7.4-xml php7.4-mbstring php7.4-zip
```

其他途径安装亦可，记得需要安装所有 Typecho 所需的插件，具体见 [Typecho 文档](https://docs.typecho.org/install)。

### 设置 nginx 并检查 PHP 状态

编辑 `/etc/nginx/nginx.conf`：

```nginx
user  www-data;
worker_processes  auto;
```

编辑在 `/etc/nginx/nginx.conf` 中 include 的 `/etc/nginx/conf.d/default.conf`：

```nginx
server {
    listen       80;
    server_name  example.com;  # 你的域名
    root         /var/www/typecho;  # 晚点 Typecho 存放的目录
    index        index.html index.htm index.php;

    # 设置 rewrite 准备伪静态化
    if (!-e $request_filename) {
        rewrite ^(.*)$ /index.php$1 last;
    }

    # 注释掉原来的 location
    #location / {
    #    root   /usr/share/nginx/html;
    #    index  index.html index.htm;
    #}

    # 解除这部分注释并修改
    location ~ .*\.php(\/.*)*$ {
        fastcgi_pass   unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_param  SCRIPT_FILENAME  $document_root$fastcgi_script_name;
        include        fastcgi_params;
        fastcgi_intercept_errors  on;
    }
}
```

测试一下，在刚刚设置的 `/var/www/typecho` 里创建一个 `phpinfo.php`，存入以下内容：

```php
<?php echo phpinfo(); ?>
```

刷新 nginx：

```bash
sudo nginx -s reload
```

到 [http://example.com/phpinfo.php](http://example.com/phpinfo.php) 下就可以看到 PHP 的信息了，记得替换成刚刚设置的域名，DNS 解析要设置好，另外注意给防火墙开 80 端口：

![PHP 信息截图](20200530233816.webp)

## 数据库

### 安装 MySQL

```bash
sudo apt install mysql-server
```

### 修改 SQL root 密码

获取自动生成的默认密码：

```bash
sudo cat /etc/mysql/debian.cnf
```

登录 MySQL，输入刚刚查看到的密码：

```bash
sudo mysql -u debian-sys-maint -p
```

修改 root 密码，退出：

```sql
SET PASSWORD FOR 'root'@'localhost' = PASSWORD("examplerootpassword123");
exit;
```

重启 MySQL 并使用 root 登陆测试，输入设置的密码 `examplerootpassword123`：

```bash
sudo service mysql restart
sudo mysql -u root -p
```

### 创建数据库

这里将数据库名字设置为 typecho，亦可自定义：

```sql
create database typecho;
show databases;
exit;
```

## Typecho

### 安装 Typecho

至[官方网站](https://typecho.org/download)下载发布包，解压：

```bash
cd /var/www
sudo wget https://typecho.org/downloads/1.1-17.10.30-release.tar.gz
sudo tar -zxvf 1.1-17.10.30-release.tar.gz
```

删除之前用于测试 PHP 的文件，并将目录设置正确，设置权限准备安装：

```bash
cd /var/www
sudo rm -rf typecho
sudo mv build typecho
sudo chown -R www-data:www-data /var/www
```

### 网页安装

打开 [http://example.com/install.php](http://example.com/install.php) 就可以进行安装了，记得替换成刚刚设置的域名。

依照安装步骤指引输入刚刚设置的数据库密码、数据库名，建立管理员账户即可开始正式使用了：

![Typecho 截图](20200531005625.webp)

### 安装提示无法连接数据库

当使用 root 用户以及刚才设定的数据库密码时提示无法连接数据库，因此新建一个名为 typecho 的 MySQL 用户并设置密码：

```sql
CREATE USER 'typecho'@'localhost' IDENTIFIED BY 'exampletypechopasswd123';
```

给予新用户访问之前用 root 用户建立的数据库的权限：

```sql
GRANT ALL ON typecho.* TO 'typecho'@'localhost';
```

再次进入安装页面安装，数据库用户设置为新建立的 typecho，密码使用对应的 `exampletypechopasswd123`，正常安装完成。

除此之外其他方面也有可能导致本问题，但是只靠 Typecho 这一句话报错看不出来问题的时候可以修改 `install.php`：

```php
try {
    $installDb->query('SELECT 1=1');
} catch (Typecho_Db_Adapter_Exception $e) {
    $success = false;
    echo '<p class="message error">'
    . $e
    . _t('对不起，无法连接数据库，请先检查数据库配置再继续进行安装') . '</p>';
} catch (Typecho_Db_Exception $e) {
    $success = false;
    echo '<p class="message error">'
    . _t('安装程序捕捉到以下错误: " %s ". 程序被终止, 请检查您的配置信息.',$e->getMessage()) . '</p>';
}
```

添加 `. $e` 以打印具体错误，方便调试。

## 参考

- [SQLSTATE[HY000] [1698] Access denied for user 'root'@'localhost'](https://stackoverflow.com/questions/36864206/sqlstatehy000-1698-access-denied-for-user-rootlocalhost)
- [Typecho 部署踩坑 | 自学路漫漫](https://blog.fxcdev.com/archives/14.html)
