# 小炫 · 设计作品集 2026

独立站点版本。基于原 Figma 目录页搭建，深空蓝 + 紫青渐变风格。
**首页素材全部采用 Figma/用户提供的真实图片**（标题、标签、数字水印都烧进了卡图）。

## 文件结构

```
portfolio/
├── index.html              # 首页（4 张作品卡片目录 · 真实素材版）
├── project-01.html         # 项目详情：活动玩法设计
├── project-02.html         # 项目详情：产品体验设计
├── project-03.html         # 项目详情：AI 设计工作流
├── project-04.html         # 项目详情：精选视觉作品
├── styles.css              # 全站样式（背景图 + 卡片 hover 放大+外发光）
├── project.css             # 项目详情页样式
├── script.js               # 交互：平滑滚动 / 键盘可达
└── media/                  # 素材目录
    ├── bg.jpg              # 整页背景（深空蓝 + logo）    ← 用户提供
    ├── card-01.png         # 02 产品体验设计卡片          ← 用户提供
    ├── card-02.png         # 01 活动玩法设计卡片          ← 用户提供
    ├── card-03.png         # 03 AI 设计工作流卡片         ← 用户提供
    └── card-04.png         # 04 精选视觉作品卡片          ← 用户提供
```

## 首页卡片交互

- **默认状态**：60% 不透明 + 轻微错落倾斜（low / high 配 left / right）
- **hover 状态**：100% 不透明 + 放大 1.04 + 外发光 + 抬升 + 复位倾斜
- **键盘可达**：Tab 聚焦 / Enter 跳转，focus 状态与 hover 一致

## 替换卡片素材

把 `media/card-01.png ~ card-04.png` 替换为同名 png/jpg 即可，无需改 HTML。
建议保持原始宽高比（约 4:5 竖图）以获得最佳排版。

## 部署

项目为纯静态站，可部署到任何静态托管：

- **本地预览**：`cd portfolio && python3 -m http.server 8080`
- **在线部署**：将 `portfolio/` 整个目录上传到：
  - Vercel / Netlify（拖拽即可）
  - 腾讯 EdgeOne Pages / CloudBase 静态托管
  - GitHub Pages

需要我帮你部署或调整细节，随时说一声。