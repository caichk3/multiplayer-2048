# 2048 联机竞速

这是一个房间制的多人 2048 对战版。每个玩家有自己的棋盘，加入同一个房间后，大家可以实时看到分数、最高方块和状态排行。

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
