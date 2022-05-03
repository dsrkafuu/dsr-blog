---
title: '原神私服 Grasscutter 配置指南'
date: 2022-04-26T15:12:02+08:00
update: 2022-05-03T13:15:11+08:00
keywords:
  - '原神'
  - '私服'
  - '教程'
  - '指南'
description: '可以用来自己私下当单机随便玩玩的原神私服。'
---

> 注意：未经授权修改与使用游戏客户端及服务端是侵犯相关公司版权的行为

Grasscutter 于近期发布了 1.0.0 版本，虽然还有些不完善的地方，但目前已经可以作为一个完整的服务端进行使用了。在疫情和五一假期期间，想私下里玩玩的可以尝试一下。

在版本 2.3 至 2.6 中，已经支持的功能有：登录、战斗、生成野怪、装备养成、角色养成、抽卡、好友系统以及一部分的联机系统。

<!--more-->

**服务端可以正常运行于云服务器并支持多账户链接，作者本人不推荐这类行为。**

**此指南仅供技术交流使用，请于研究测试后 24 小时内删除，任何商业使用及商业利益冲突带来的法律纠纷与本人无关、概不负责。**

## 资源整合

本指南中的全部资源均可于此百度网盘分享找到，但可能存在资源更新不及时的问题，请自行检查并从官方/上游下载。本指南基于 Windows 11 (x64)，其他系统环境大同小异，请自行尝试，本指南不对软件下载安装、环境变量配置、MongoDB 使用等基础内容进行详细描述。

## 更新记录

- **2022-05-03** 更新游戏资源

## 运行环境

### MongoDB

请至[官网](https://www.mongodb.com/try/download/community)下载。版本需求为 4.0+，指南中所使用的版本为 5.0.6 Community。[MongoDB Compass](https://www.mongodb.com/try/download/compass) 可以一并安装便于管理数据库，如果本地有 Navicat 的也可以直接使用。

除此之外 [MongoDB Atlas](https://www.mongodb.com/atlas) 提供免费的 MongoDB 云实例，也可以直接进行使用。

### JDK

要求特定版本 8u202，其他版本未测试，请至 [Oracle 官网](https://www.oracle.com/java/technologies/javase/javase8-archive-downloads.html)下载并安装。

## 服务端

首先拉取 stable 分支的 Grasscutter 源码：

```powershell
git clone --recurse-submodules https://github.com/Grasscutters/Grasscutter.git
cd .\Grasscutter\
```

完成后，进行本地编译：

```powershell
.\gradlew.bat
.\gradlew.bat jar
```

![编译完成示意图](20220503143527.png)

编译完成后，在项目目录内即可找到 `grasscutter.jar` 服务器核心。

除了服务端本身以外，还需要游戏的相关资源放置到目录下。本指南基于游戏版本 2.6，资源来自 [Grasscutter Resources](https://github.com/Koko-boya/Grasscutter_Resources) (Commit `e7586e5`)，将 `Resources` 目录内的全部六个文件夹拷贝到 `resources` 目录内即可，其中包含了 2.6 版本的全部资源。

服务器默认数据库连接地址为 `mongodb://localhost:27017`，若需要修改则直接改动 `config.json`即可。最后，运行服务器：

```powershell
java -jar .\grasscutter.jar
```

![服务器运行示意图](20220503151038.png)

服务器默认使用端口 `8888`、`443`、`80` 和 `22102`，若出现端口绑定错误，请检查是否有相关端口被占用并检查相关进程：

```powershell
netstat -ano | findstr /r /c:":8888.*LISTENING"
netstat -ano | findstr /r /c:":443.*LISTENING"
netstat -ano | findstr /r /c:":80.*LISTENING"
netstat -ano | findstr /r /c:":22102.*LISTENING"
```

在服务端需要更新时，首先拉取最新的源码，然后重新进行本地编译，最后提供新的游戏资源即可。游戏资源的获取可以关注 [Genkit TG 群组](https://t.me/genkitCN)，频道中还有一些非官方的 Grasscutter 包可用，本指南仅关注 Grasscutter 官方源。

## 客户端

在运行客户端之前，首先需要将客户端请求代理至本地服务器 (同理可代理至运行服务端的云服务器)。使用类似 mitmproxy 和 Fiddler Classic 的软件均可，本指南使用 [mitmproxy](https://mitmproxy.org/) 8.0 版本。

安装完成后，以代理至端口 `12345` 为例运行项目目录内的 `proxy.py` 即可：

```powershell
mitmdump -s proxy.py --ssl-insecure --listen-port 12345
```

![代理运行示意图](20220503153153.png)

如果需要让外部主机连接 (如公共服务器) 需要设置参数 `--set block_global=false`。代理运行后，首先关闭现有的 Clash 等系统代理软件，前往系统网络设置，手动设置代理为 `127.0.0.1:12345`。

![代理配置示意图](20220503153658.png)

设置完成后，需要添加 mitmproxy 生成的证书才可以正常进行连接，使用浏览器访问 `http://mitm.it/`，下载对应平台的证书，并根据网页教程添加至 "受信任的根证书颁发机构" 即可。若为服务器运行，此处的证书需要保存并发送给所有需要连接服务器的人添加。

在进入游戏之前，首先要创建账户，在服务端控制台运行如下指令：

```powershell
account create [username] {playerid}
```

完成账户创建后，即可在 MongoDB 中看见新创建的账户。

![数据库账户示意图](20220503154531.png)

服务端的全部控制台指令可以通过 `help` 指令获取。最后，运行对应游戏资源版本的游戏客户端即可，本指南使用国际服 2.6 版本客户端。输入注册的用户名并随便设置一个密码即可进入游戏。进入游戏后代理可以关闭，推荐在连接公共服务器时尽快关闭代理以节约服务器流量。

![游戏运行示意图](20220503160930.jpg)

## 相关资源

### 指令列表

见开发分支的[中文 README](https://github.com/Grasscutters/Grasscutter/blob/development/README_zh-CN.md#命令列表)。

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
