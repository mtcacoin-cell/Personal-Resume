# 素材替换说明

把你的文件放进 `assets/` 目录即可。首页精选场景作品会按照文件名规则解析；新增文件后，需要同步把文件名加入根目录的 `assets-data.js`。

## 主视觉（LEI YONG 主图后面的场景）
- `hero.mp4`        —— 背景视频（建议横版 1920×1080，时长 8–15 秒，做成无缝循环；鼠标移入主视觉区域播放，移开暂停）
- `hero-poster.png` —— 视频封面/加载占位（视频未加载完时先显示这张）

## 首页精选场景作品命名规则
格式：`scene-作品序号-作品名称轮播序号(标签.标签.标签).jpg/png/mp4`

示例：
- `scene-1-午夜书房(UE.二次元.PBR).jpg` —— 第 1 个场景作品，作品名为「午夜书房」，标签为 UE / 二次元 / PBR。
- `scene-2-星河舞台01（UE.二次元.PBR).jpg`
- `scene-2-星河舞台02（UE.二次元.PBR).jpg`
- `scene-2-星河舞台03（UE.二次元.PBR).jpg`
- `scene-2-星河舞台04（UE.二次元.PBR).jpg`

说明：
- `scene-1`、`scene-2` 代表第几个场景作品。
- 作品名后面的 `01`、`02`、`03`、`04` 代表同一个作品里的轮播图。
- 括号内用 `.` 分隔标签，页面会自动拆成标签显示。
- 新增或删除文件后，请同步维护根目录 `assets-data.js` 里的文件名清单。
- 如果场景作品需要关联 B 站视频链接，在 `assets-data.js` 里的 `window.SCENE_BILIBILI_LINKS` 按作品序号配置，例如：
  `1: 'https://www.bilibili.com/video/BVxxxxxxxxxx/'`。
- 配置 B 站链接后，点击该场景作品会在弹窗中嵌入 B 站播放器；卡片上会显示 `B站视频` 标签。
- 如果需要补充场景作品标题、标签和说明文案，在 `assets-data.js` 里的 `window.SCENE_DETAILS` 按作品序号配置；没有本地图片时，也可以只配置 B 站链接和文案作为一个视频场景案例展示。

## 场景作品二级页
- `scene-banner.jpg` —— 顶部横幅背景
- `pbr-1.jpg`、`pbr-2.jpg`、`pbr-3.jpg` —— PBR-3D场景模型
- `world-1.jpg`、`world-2.jpg`、`world-3.jpg` —— Unity大世界
- `ue-1.jpg`、`ue-2.jpg`、`ue-3.jpg` —— UE地编
- `mini-1.jpg`、`mini-2.jpg`、`mini-3.jpg` —— Unity小程序

## AI 解决案例命名规则
AI 解决案例资源放在 `assets/AI/` 目录。

格式：`ai-案例序号-案例名称轮播序号(标签.标签.标签).jpg/png/mp4`

示例：
- `assets/AI/ai-1-动态智能生成01(AI.流程方案.视频).mp4`
- `assets/AI/ai-2-企划视觉解决案例01(AI.概念探索.生成流程).jpg`

说明：
- `ai-1`、`ai-2` 代表第几个 AI 解决案例。
- 同一个案例可以放多张图片或视频；视频支持鼠标悬停自动播放，移开暂停。
- 点击视频案例会弹出视频弹窗，弹窗内提供播放按钮。

## 关于我
- `avatar.jpg` —— 头像（正方形，建议 400×400）

## 简历
- `resume.pdf` —— “下载简历 PDF”按钮指向这个文件

> 文字内容（标题、标签、简介等）直接在 `index.html` 里改。
> 邮箱、微信在 index.html 的「联系我」一节里替换。
