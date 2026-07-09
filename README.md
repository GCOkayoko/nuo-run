# EatKano - 吃掉小鹿乃

新概念音游。基于 [arcxingye/EatKano](https://github.com/arcxingye/EatKano) 改编的纯静态版本，可直接部署到 GitHub Pages。

## 玩法

从最底部开始，跟随节奏点击对应列的高亮方块。

- **普通模式**：限时挑战，看你能得多少分
- **无尽模式**：刷 CPS（每秒点击数）
- **练习模式**：不会失败，适合熟悉节奏

默认按键：**D F J K**（可自定义）

## 部署

直接上传到 GitHub Pages 或任意静态服务器即可，无需 PHP / MySQL。

```
.
├── index.html
├── README.md
├── audio/
│   ├── tap.mp3
│   ├── err.mp3
│   └── end.mp3
├── css/
│   └── index.css
├── img/
│   ├── ClickBefore.png
│   └── ClickAfter.png
└── js/
    └── index.js
```

## 致谢

- 原作者 [arcxingye/EatKano](https://github.com/arcxingye/EatKano)
- 音效引擎 [createjs](https://createjs.com/)
- UI 框架 [Bootstrap](https://getbootstrap.com/)
