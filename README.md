# OPC 生存手册

> **One Person Creator — AI时代一人创作者的生存实战指南**

一个人 + AI = 一个团队。本书从心态、选赛道、AI工具、内容工厂、流量分发、变现模式、财务法务、健康管理到终极进化，系统讲解如何在AI时代以一当十。

## 📖 在线阅读

👉 **[https://MoKangMedical.github.io/opc-survival-handbook/](https://MoKangMedical.github.io/opc-survival-handbook/)**

## 📘 关于本书

| 项目 | 说明 |
|------|------|
| 章节 | 10章 / 37节 |
| 配图 | 10张章节题图 + 4张信息图（附AI生成Prompt） |
| 格式 | HTML在线版 + KDP PDF印刷版 |
| 工具链 | KDP自动排版脚本（HTML→PDF，516行Python） |

## 🚀 快速开始

```bash
# 安装本地视觉资产生成依赖
npm install

# 生成封面、章节插图、信息图和在线HTML
npm run build

# 预览在线版
浏览器打开 docs/index.html

# 生成KDP就绪PDF
pip install beautifulsoup4 reportlab
python3 scripts/kdp_builder.py
```

## 🧰 本地工具链

- `scripts/build_handbook_html.mjs`：生成完整在线书稿 `docs/index.html`
- `scripts/generate_visuals.mjs`：生成封面、10张章节题图、4张信息图（SVG + PNG）
- `scripts/kdp_builder.py`：把在线书稿转成 6×9 英寸 KDP PDF，支持封面、插图和表格
- `course-platform-strategy.md`：OPC研究院微信课程平台方案
- `docs/course.html`：OPC课程平台原型页
- 视觉资产输出目录：`docs/assets/`
- KDP PDF 输出目录：`output/opc-handbook.pdf`

## 📂 项目结构

```
├── package.json           # Node构建脚本与sharp依赖
├── docs/                  # GitHub Pages 站点
│   ├── index.html         # 完整手册（10章+目录+封面）
│   ├── course.html        # OPC研究院课程平台原型
│   └── assets/            # 封面、章节插图、信息图
├── scripts/
│   ├── build_handbook_html.mjs
│   ├── generate_visuals.mjs
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

---

*本书由人类创作者与AI工具协作完成 · 2026*
