# 同学小游戏厅

这是一个带账号和积分累计的小游戏平台。现在已经内置 `2048 联机竞速`，每个玩家有自己的棋盘，加入同一个房间后，大家可以实时看到房间排行；本局结束或重新开始时，会把成绩结算成平台积分。

## 当前功能

- 昵称 + 口令注册/登录
- 平台总积分、等级、2048 最高分统计
- 全站积分榜
- 2048 房间对战和实时排行
- 3D 扫雷单人积分模式，支持难度选择和随机 3D 形状
- 小游戏列表，后续可以继续加新游戏

## 积分规则

2048 每局结算时会根据这些数据给积分：

- 本局分数
- 本局最高方块
- 分数和步数的效率奖励
- 合成 2048 的额外奖励

当前账号数据保存在服务器本地的 `data/users.json`。本地开发够用，但 Render 免费服务重启或重新部署后，本地文件可能丢失；要长期保存账号和积分，建议后续接数据库，例如 PostgreSQL、Supabase、Neon 或 Render PostgreSQL。

## 3D 扫雷

3D 扫雷不是固定长方体棋盘。每局会按难度随机生成一个连通的 3D 形状，只有形状里的格子可以翻开，空洞位置不可点击。

难度会影响：

- 层数、行数、列数
- 随机形状的格子数量
- 雷的数量

数字按 3D 邻域计算：同层、上一层、下一层周围最多 26 个邻居都会被统计。

## 本地运行

先安装依赖：

```bash
npm install
```

启动服务器：

```bash
npm start
```

打开：

```text
http://localhost:3000
```

同一个 WiFi 下，同学可以访问：

```text
http://你的电脑局域网IP:3000
```

局域网 IP 可以在 Windows 终端里运行 `ipconfig` 查看，通常看 `IPv4 地址`。

## 上传 GitHub

如果你已经安装了 Git，可以在 `web2` 目录执行：

```bash
git init
git add .
git commit -m "Add multiplayer 2048"
git branch -M main
git remote add origin https://github.com/你的用户名/你的仓库名.git
git push -u origin main
```

如果电脑没有 Git，也可以在 GitHub 新建仓库后，点击 `Add file` -> `Upload files`，把 `web2` 里的文件上传上去。不要上传 `node_modules` 文件夹。

## 部署 Render

1. 打开 https://render.com 并登录。
2. 点击 `New`，选择 `Web Service`。
3. 连接你的 GitHub 仓库。
4. Root Directory 如果仓库里只放了 `web2`，就留空；如果整个 `web` 文件夹都上传了，就填写 `web2`。
5. Build Command 填：

```bash
npm install
```

6. Start Command 填：

```bash
npm start
```

7. 部署完成后，Render 会给你一个公网网址，把它发给同学即可。
