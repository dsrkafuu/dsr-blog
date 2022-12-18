---
title: '原神私服 Grasscutter 搭建指南 - 2.7 更新'
date: 2022-05-31T13:48:11+08:00
pubdate: 2022-04-26T15:12:02+08:00
keywords:
  - '原神'
  - '私服'
  - '教程'
  - '指南'
description: '原神私服 Grasscutter 搭建指南，可以用来自己私下当单机随便玩玩的原神私服。'
---

> 注意：未经授权修改与使用游戏客户端及服务端是侵犯相关公司版权的行为

**此指南仅供技术交流使用，请于研究测试后 24 小时内删除，任何商业使用及商业利益冲突带来的法律纠纷与本人无关、概不负责。**

<!--more-->

在一段时间的开发后，社区开发者构建了很多 Grasscutter 相关的辅助工具，这些工具都很好用，有兴趣的可以自行探索。

⚠️ 但是，作者依旧**不推荐使用任何的一键整合包**，也**不推荐游玩任何公共私服**，原因如下：如果你拥有基本的计算机知识，就应该理解服务器的部署是一件多简单的事情，以及——在这基础上的二次开发和劫持是多简单的事情，你的**数据安全**没有保障。

⚠️ 我相信大部分提供服务器的人都是希望能够为自行部署存在困难的人提供帮助，但中文互联网的情况大家都了解，还请多长个心眼。如果你希望和朋友们一起游玩，找个廉价 Linux 服务器自行部署是很好的选择。无论如何，一切的核心是**不要在任何私服内以任何形式投入资金**，避免上当受骗。

ℹ 有关于这方面的私人问题可以直接 DM 联系[我的 Twitter](https://twitter.com/dsrkafuu)。

## 资源整合

~~本指南中的全部资源均可于此[百度网盘分享](https://pan.baidu.com/s/1Lfd2bjlOqzo1E2bh9GUFQQ?pwd=5iev) (解压密码：`@dsrkafuu`) 找到，但可能存在资源更新不及时的问题，请自行检查并从官方/上游下载。本指南基于 Windows 11 (x64)，其他系统环境大同小异，请自行尝试。~~

本指南不对软件下载安装、环境变量配置、MongoDB 使用等基础内容进行详细描述。也不会对相关资源进行整合再发布，请自行独立下载并使用。

## 更新记录

- **2022-05-30** 更新 2.7 版本
- **2022-05-11** 更新新版指南和游戏资源
- **2022-05-08** 添加一些实用工具的链接
- **2022-05-03** 更新游戏资源

## 运行环境

### MongoDB

请至[官网](https://www.mongodb.com/try/download/community)下载。版本需求为 4.0+，指南中所使用的版本为 5.0.6 Community。[MongoDB Compass](https://www.mongodb.com/try/download/compass) 可以一并安装便于管理数据库，如果本地有 Navicat 的也可以直接使用。

除此之外 [MongoDB Atlas](https://www.mongodb.com/atlas) 提供免费的 MongoDB 云实例，也可以直接进行使用。

### JDK

~~要求特定版本 8u202，其他版本未测试，请至 [Oracle 官网](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html)下载并安装。~~

稳定版 v1.1.0 之后要求使用 Java 17+，请至 [Oracle 官网](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)下载并安装，或使用[微软编译的 OpenJDK](https://www.microsoft.com/openjdk) 版本。

![JDK 示意图](20220511194321.webp)

## 服务端

### 预编译核心

预编译的核心可以直接在[项目仓库的 Actions](https://github.com/Grasscutters/Grasscutter/actions) 内找到。上文[资源整合](#资源整合)的百度网盘内有作者自行编译的核心。

若使用预编译核心，则需要将以下三项资源放置于目录内：

- [keys](https://github.com/Grasscutters/Grasscutter/tree/stable/keys)
- [data](https://github.com/Grasscutters/Grasscutter/tree/stable/data)
- [keystore.p12](https://github.com/Grasscutters/Grasscutter/blob/stable/keystore.p12)

### 自行编译核心

首先拉取所需分支的 Grasscutter 源码，以开发分支为例：

```powershell
git clone -b development https://github.com/Grasscutters/Grasscutter.git
cd .\Grasscutter\
```

完成后，进行本地编译：

```powershell
.\gradlew.bat
.\gradlew.bat jar
```

![编译完成示意图](20220511200107.webp)

编译完成后，在项目目录内即可找到名为 `grasscutter-<version>.jar` 的服务器核心。

### 游戏资源

除了服务端本身以外，还需要游戏的相关资源放置于目录内。本指南基于游戏版本 2.7，资源来自 [Grasscutter Resources](https://github.com/Koko-boya/Grasscutter_Resources) (Commit `20ced72`)，将 `Resources` 目录内的全部文件夹拷贝到 `resources` 目录内即可，其中包含了 2.7 版本的全部资源。

### 运行服务器

```powershell
java -jar .\grasscutter-<version>.jar.jar
```

首次运行时需要选择语言，输入 `chs` 即可。

![语言选择示意图](20220511202056.webp)

服务器默认数据库连接地址为 `mongodb://localhost:27017`，若需要修改则直接改动 `config.json`即可。

![服务器运行示意图](20220511202443.webp)

服务器默认使用端口 `8888`、`443`、`80` 和 `22102`，若出现端口绑定错误，请检查是否有相关端口被占用并检查相关进程：

```powershell
netstat -ano | findstr /r /c:":8888.*LISTENING"
netstat -ano | findstr /r /c:":443.*LISTENING"
netstat -ano | findstr /r /c:":80.*LISTENING"
netstat -ano | findstr /r /c:":22102.*LISTENING"
```

在服务端需要更新时，直接替换新核心或者拉取最新的源码重新进行本地编译，最后提供新的游戏资源即可。游戏资源的获取可以关注 [Genkit TG 群组](https://t.me/genkitCN)，频道中还有一些非官方的 Grasscutter 包可用，本指南仅关注 Grasscutter 官方源。

## 客户端

在运行客户端之前，首先需要将客户端请求代理至本地服务器 (同理可代理至运行服务端的云服务器)。使用类似 mitmproxy 和 Fiddler Classic 的软件均可，本指南使用 [mitmproxy](https://mitmproxy.org/) 8.0 版本。

安装完成后，以代理至端口 `12345` 为例运行项目目录内的 `proxy.py` 即可：

```powershell
mitmdump -s proxy.py --ssl-insecure --listen-port 12345
```

若为直接使用预编译的服务器核心，该文件[见仓库](https://github.com/Grasscutters/Grasscutter/blob/stable/proxy.py)。

![代理运行示意图](20220503153153.webp)

如果需要让外部主机连接 (如公共服务器) 需要设置参数 `--set block_global=false`。代理运行后，首先关闭现有的 Clash 等系统代理软件，前往系统网络设置，手动设置代理为 `127.0.0.1:12345`。

![代理配置示意图](20220503153658.webp)

设置完成后，需要添加 mitmproxy 生成的证书才可以正常进行连接，使用浏览器访问 `http://mitm.it/`，下载对应平台的证书，并根据网页教程添加至 "受信任的根证书颁发机构" 即可。若为服务器运行，此处的证书需要保存并发送给所有需要连接服务器的人添加。

在进入游戏之前，首先要创建账户，在服务端控制台运行如下指令：

```powershell
account create [username] {playerid}
```

完成账户创建后，即可在 MongoDB 中看见新创建的账户。

![数据库账户示意图](20220503154531.webp)

服务端的全部控制台指令可以通过 `help` 指令获取。

最后，运行对应游戏资源版本的游戏客户端即可，本指南使用国际服 2.7 版本客户端。输入注册的用户名并随便设置一个密码即可进入游戏。进入游戏后代理可以关闭，推荐在连接公共服务器时尽快关闭代理以节约服务器流量。

![游戏运行示意图](20220503160930.webp)

## 相关资源

### 指令列表

见开发分支的[中文 README](https://github.com/Grasscutters/Grasscutter/blob/development/README_zh-CN.md#命令列表)。

### 工具箱

见项目 [Grasscutter Tools](https://github.com/jie65535/GrasscutterCommandGenerator)，支持指令生成、卡池编辑等功能。

### 圣遗物生成

见 [GenKit Wiki 文档](https://genkit.mhysb.xyz/artifact)。

### 网页控制面板

见项目 [Grasscutters Web Dashboard](https://github.com/liujiaqi7998/GrasscuttersWebDashboard)。

### ID 列表

角色、武器、物品、NPC、场景等均有对应的 ID，示例：

```
10000037: 甘雨
11502: 天空之刃
393137: 重型餐馆专用炉灶
```

通过服务端核心可以如下生成列表：

```powershell
java -jar grasscutter.jar -handbook
```

中文列表见 [资源整合](#资源整合) 中的 `Handbook_CHS.txt` 文件。

### 卡池列表

卡池 ID 于上面的 ID 不同，示例：

```
A080 武器 雾切/无工
A079 角色1 神里绫华
```

详细列表见 [资源整合](#资源整合) 中的 `卡池顺序.xlsx` 文件。

### 卡池修改

卡池配置文件为 `data\Banners.json`，内容为一个对象数组，其中包括：

- 常驻池：`gachaType = 200, scheduleId = 893`
- 角色限定池一：`gachaType = 301, scheduleId = 903`
- 角色限定池二：`gachaType = 400, scheduleId = 913`
- 武器池：`gachaType = 302, scheduleId = 903`

若需要添加更多卡池，新增更多的 `gachaType` 即可。

数组中的对象属性如下：

- `rateUpItems1`：当前 UP 五星
- `rateUpItems2`：当前 UP 四星
- `prefabPath`：卡尺大图
- `previewPrefabPath`：卡池预览图
- `titlePath`：卡池标题
- `costItem`：抽卡消耗的道具
- `softPity`：最少抽数
- `hardPity`：保底最多抽数
- `eventChance`：非 UP 的概率

角色 ID 可见 [ID 列表](#id-列表)，卡车图片、标题路径见 [卡池列表](#卡池列表)。

## 参考资料

- [GenshinTJ - 荼蘼博客](https://blog.tomys.top/2022-04/GenshinTJ/)
- [原神 2.6 私服启动教程 2.2 - 虚之亚克洛 OTOOBLOG](https://blog.otoo.top/Blog/Genshin2-6-Grasscutters/)
- [Genkit TG 群组](https://t.me/genkitCN)
