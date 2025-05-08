---
title: '使用 umami 搭建自己的私人数据收集分析工具'
date: 2020-10-24T14:37:01+08:00
keywords:
  - 'postgresql'
  - 'ubuntu'
description: 'umami 是一个基本数据收集工具，虽然不及 Google Analytics 那样有完善的数据分析工具和整合功能，但是对于我这种日常博客使用还是完全足够了。'
---

[Google Analytics](https://analytics.google.com/) 于近期推出了新版，将数据收集方式改为了向 `analytics.google.com/g/collect` 发送 POST 请求，在中国大陆自然就无法直接访问了，具体见 [V2EX](https://www.v2ex.com/t/716280) 相关讨论。考虑到本身对数据收集的需求不高，因此实验性的切换到了近期正在快速迭代更新的 [umami](https://github.com/mikecao/umami)。

<!--more-->

umami 是一个基本数据收集工具，虽然不及 Google Analytics 那样有完善的数据分析工具和整合功能，但是对于我这种日常博客使用还是完全足够了。为了方便维护和减少服务器相关的配置、支出，因此这里采用数据库与应用分离的方案，使用 [Vercel](https://vercel.com/) 部署 umami 管理面板，并使用 [PostgreSQL](https://www.postgresql.org/) 搭建远程数据库。

## 安装并配置 PostgreSQL

目前我运行 PostgreSQL 的机器是一台阿里云的廉价学生机，当前系统是 Ubuntu 20.04。由于没有特定的版本要求，因此直接用包管理器完成安装：

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

默认情况下，PostgreSQL 使用一个 "roles" 的概念来处理认证和授权。在安装时，默认情况下，PostgreSQL 自动创建了一个名为 `postgres` 的用户账户。我们可以直接以这个用户的身份切换至 PostgreSQL CLI：

```bash
sudo passwd -d postgres
sudo -u postgres passwd
sudo -i -u postgres
psql
# ALTER USER postgres WITH PASSWORD 'new postgres password';
```

使用 `\q` 退出 CLI，回到 bash，以 `postgres` 的身份创建一个名为 `umami` 的 role 来提供给 umami 使用：

```bash
createuser --interactive umami
```

![创建 PostgreSQL 用户示意图](20201024124907.webp)

创建完用户后，还需要创建一个相对应的 Linux 用户，随后切换到这个用户并创建一个名为 umami 的数据库备用：

```bash
# 先切换回 root 用户
sudo adduser umami
sudo -i -u umami
createdb umami
psql # 以 umami 身份进入 CLI
# ALTER USER umami WITH PASSWORD 'new umami password';
```

完成后，我们需要导入数据库表：

```bash
# 这里直接以 umami 用户的身份将模板下载到了 /home/umami
wget https://raw.githubusercontent.com/mikecao/umami/master/sql/schema.postgresql.sql # 获取数据表模板
psql -U umami -d umami -f ./schema.postgresql.sql
```

随后我们还需要开启公网对 PostgreSQL 的访问，编辑 `/etc/postgresql/12/main/postgresql.conf` 修改：

```
listen_addresses = '*'
```

编辑 `/etc/postgresql/12/main/pg_hba.conf` 添加以下行以允许远程访问 `umami` 数据库和 `umami` 用户：

```
# Remote access
# TYPE   DATABASE   USER   CIDR-ADDRESS   METHOD
  host   umami      umami  0.0.0.0/0      md5
```

重启 PostgreSQL 并开放 5432 端口，至此完成了数据库的安装以及初始化。同时在下文的示例中，我还将服务器 IP 绑定了域名，这里以 `pgsql-shanghai.example.org` 代替。

## 部署 umami 面板

对 umami 的仓库进行 fork 并导入 Vercel 部署即可，具体请参考[官方教程](https://umami.is/docs/running-on-vercel)，以下为 env 设置：

```
DATABASE_URL=postgresql://umami:password@pgsql-shanghai.example.org:5432/umami
HASH_SALT=[自选任何字符串]
```

同样的，在 Vercel 中我绑定了域名 `analytics.example.org`。

一切设置完成后，打开 umami 面板，修改密码，添加网址，一切操作就都和 Google Analytics 无异了。

![umami 面板示意图](20201024142720.webp)
