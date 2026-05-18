# OPC 生存手册

> **One Person Creator — AI时代一人创作者的生存实战指南**

一个人 + AI = 一个团队。本书从心态、选赛道、AI工具、内容工厂、流量分发、变现模式、财务法务、健康管理到终极进化，系统讲解如何在AI时代以一当十。

## 📖 在线阅读

👉 **[https://MoKangMedical.github.io/opc-survival-handbook/](https://MoKangMedical.github.io/opc-survival-handbook/)**

## 📘 关于本书

| 项目 | 说明 |
|------|------|
| 章节 | 10章 / 37节 / 10段手册口播音频 / 65节系统课 / 70节微信逐课内容与音频 |
| 配图 | 10张ComfyUI章节题图 + 4张信息图（附AI生成Prompt） |
| 格式 | GitHub Pages分章音频版 + 精简HTML书稿 + 20万字长版 + 思维导图页 + 印刷HTML + KDP PDF印刷版 + 微信课程脚本包 + 70节逐课内容库 + 70节逐课音频 + 4套文章版本 + 65节课程站 |
| 工具链 | 视觉资产生成、课程内容生成、神经TTS音频生成、KDP自动排版脚本 |

## 🚀 快速开始

```bash
# 安装本地视觉资产生成依赖
npm install

# 生成封面、章节插图、信息图、精简书稿、20万字长版、印刷HTML、微信脚本和65节课程
npm run build

# 预览分章音频版、精简书稿、20万字长版、微信脚本和课程站
浏览器打开 docs/index.html
浏览器打开 docs/handbook.html
浏览器打开 docs/book-200k.html
浏览器打开 docs/book-200k-mindmaps.html
浏览器打开 docs/book-200k-print.html
浏览器打开 docs/wechat-course/index.html
浏览器打开 docs/wechat-course/lessons/index.html
浏览器打开 docs/book-200k-assets-cases.html
浏览器打开 docs/course/index.html

# 生成65节课程口播音频
.venv/bin/python -m pip install edge-tts
.venv/bin/python scripts/generate_course_audio.py --force

# 生成70节微信逐课口播音频
.venv/bin/python scripts/generate_wechat_lesson_audio.py --force

# 生成长版书KDP就绪PDF
python3 -m pip install beautifulsoup4 reportlab
python3 scripts/kdp_builder.py --input docs/book-200k-print.html --output output/opc-handbook-200k.pdf --title "OPC生存手册·长版" --subtitle "AI时代一人创作者的系统生存与增长指南"
```

## 🧰 本地工具链

- `scripts/build_handbook_html.mjs`：生成完整在线书稿 `docs/handbook.html`
- `scripts/build_longform_book.mjs`：生成 20 万字长版 `docs/book-200k.html` 与导图页 `docs/book-200k-mindmaps.html`
- `scripts/build_longform_derivatives.mjs`：生成印刷版输入 `docs/book-200k-print.html`、`docs/wechat-course/` 章节脚本包、`docs/wechat-course/lessons/` 逐课内容库和 `docs/book-200k-assets-cases.html`
- `scripts/build_course_content.mjs`：生成65节系统课、课程JSON和每课500字以内口播稿
- `scripts/generate_visuals.mjs`：生成封面、4张信息图和SVG兜底图；章节PNG优先使用ComfyUI输出
- `scripts/gen_audio.py`：生成10章课程口播音频 `docs/audio/ch1~ch10.mp3`
- `scripts/generate_course_audio.py`：生成65节系统课口播音频 `docs/course/audio/lesson-01~lesson-65.mp3`
- `scripts/generate_wechat_lesson_audio.py`：生成70节微信逐课口播音频 `docs/wechat-course/lessons/audio/lesson-001~lesson-070.mp3`
- `scripts/narration_scripts.py`：10章课程口播稿
- `scripts/kdp_builder.py`：把完整书稿转成 6×9 英寸 KDP PDF，支持封面、插图和表格
- `course-platform-strategy.md`：OPC研究院微信课程平台方案
- `docs/course.html`：OPC课程平台原型页
- 视觉资产输出目录：`docs/assets/`
- KDP PDF 输出目录：`output/opc-handbook.pdf`、`output/opc-handbook-200k.pdf`

## 📂 项目结构

```
├── package.json           # Node构建脚本与sharp依赖
├── docs/                  # GitHub Pages 站点
│   ├── index.html         # 暗色分章首页（10章入口）
│   ├── ch1.html~ch10.html # 分章阅读页，内嵌课程口播音频
│   ├── handbook.html      # 完整手册（10章+目录+封面）
│   ├── book-200k.html     # 20万字长版（10章/70节/案例/思考/行动清单）
│   ├── book-200k-mindmaps.html # 长版书总导图 + 分章导图
│   ├── book-200k-print.html # 长版书KDP印刷输入HTML
│   ├── book-200k-assets-cases.html # 配图与案例索引页
│   ├── course.html        # OPC研究院课程平台原型
│   ├── course/            # 65节系统课、课程JSON、口播稿、MP3
│   ├── wechat-course/     # 10章微信课程脚本、TXT、JSON
│   │   └── lessons/       # 70节逐课内容：口播稿、MP3、基础文章版、引流版、转化版、社群作业版、Markdown、JSON
│   ├── audio/             # 10章MP3课程口播
│   └── assets/            # 封面、章节插图、信息图、ComfyUI原始输出
├── scripts/
│   ├── build_handbook_html.mjs
│   ├── build_longform_book.mjs
│   ├── build_longform_derivatives.mjs
│   ├── build_course_content.mjs
│   ├── generate_visuals.mjs
│   ├── generate_course_audio.py
│   ├── gen_audio.py
│   ├── narration_scripts.py
│   └── kdp_builder.py     # KDP自动排版脚本
├── infographic/           # 信息图生成Prompt
│   └── prompts/           # 4组完整AI生成提示词
├── illustration-plan.md   # 10张章节题图MJ Prompt
├── publishing-strategy.md # 三线发布策略
├── course-platform-strategy.md # 微信课程平台策略
└── outline.md             # 完整大纲
```

## 📊 内容覆盖

- 🌍 为什么OPC是未来的工作方式
- 🧗 独立创作者的心态建设
- 🎯 选赛道与快速验证
- 🧰 50+ AI工具实战配置
- 🏭 内容工厂化生产体系
- 📡 零预算流量获取策略
- 💰 6种变现模式 + $0→$10K路线图
- 🛡️ 财务法务风险控制
- 🧘 健康与精力管理
- 🚀 从OPC到OPC+的进化路径
- 📘 KDP长版印刷书输出
- 💬 微信课程章节脚本、逐课短视频口播稿、70节逐课音频、4套公众号文章版与配图/案例页

---

*本书由人类创作者与AI工具协作完成 · 2026*
