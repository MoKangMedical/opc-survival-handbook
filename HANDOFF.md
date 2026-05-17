# OPC生存手册 — Codex 接手文档

> **两个仓库，需合并为一个**

---

## 一、仓库清单

### Repo A: `/root/opc-survival-handbook/`（工作主版本，非Git）

| 文件 | 说明 |
|------|------|
| `handbook.html` | **主文件** — 单页完整手册，10章+4张信息图(iframe)+10张插图占位+封面样式+暗色模式+打印CSS |
| `cover.html` | 独立封面页 — 深蓝星空+琥珀金螺旋+手势SVG动画 |
| `outline.md` | 10章大纲框架（目录） |
| `publishing-strategy.md` | 三线发布策略：KDP / 国内出版 / Gumroad数字产品 |
| `illustration-plan.md` | 10张章节插图+封面MJ提示词+4张信息图方案 |
| `midjourney-prompts-all.txt` | 11条MJ一键粘贴提示词（含`--ar 3:4 --v 6.1`参数） |
| `comfyui/` | **ComfyUI自动化方案** — batch_generate.py + prompts_config.json + SDXL/Flux工作流+README |
| `infographic/` | 4张信息图HTML（已嵌入handbook.html） |
| `scripts/kdp_builder.py` | KDP PDFBuilder（reportlab，6×9英寸） |
| `output/opc-handbook-v2.pdf` | 最新PDF（369KB，含信息图） |

### Repo B: `/root/opc-survival-handbook-repo/`（Git: `MoKangMedical/opc-survival-handbook`）

| 文件 | 说明 |
|------|------|
| `docs/index.html` | GitHub Pages首页 |
| `docs/ch1.html` ~ `docs/ch10.html` | **分章版本** — 每章独立HTML |
| `docs/audio/ch1.mp3` ~ `ch10.mp3` | 10章音频（DeepSeek口播+edge_tts+ffmpeg） |
| `scripts/gen_audio.py` | 音频生成脚本 |
| `scripts/narration_scripts.py` | 口播稿生成（DeepSeek） |
| `scripts/build_handbook_html.mjs` | Node.js构建脚本 |
| `scripts/generate_visuals.mjs` | Midjourney图片生成辅助 |
| `scripts/kdp_builder.py` | KDP PDF Builder |
| `illustration-plan.md` | 插图方案（与Repo A重复） |
| `course-platform-strategy.md` | OPC课程平台策略文档 |

**GitHub:** `git@github.com:MoKangMedical/opc-survival-handbook.git`
**Pages:** https://mokangmedical.github.io/opc-survival-handbook/（分章HTML+音频）

---

## 二、需要合并的内容

### Repo A → Repo B 需迁移：
1. `handbook.html` — 单文件完整版（替换docs/ch1-ch10.html的分章方式，或两者并存）
2. `comfyui/` 整个目录 — ComfyUI批量插图生成方案
3. `infographic/` 整个目录 — 4张信息图（传统vsOPC、AI工具矩阵、变现路线图、30天清单）
4. `cover.html` — 独立封面页
5. `midjourney-prompts-all.txt` — MJ提示词汇总
6. `publishing-strategy.md` — 发布策略（Repo B没有）
7. `outline.md` — 大纲（Repo B没有）
8. `output/opc-handbook-v2.pdf` — 最新PDF

### Repo B 独有（保留）：
- `docs/audio/` — 10章音频文件
- `scripts/gen_audio.py` + `narration_scripts.py` — 音频流水线
- `course-platform-strategy.md` — 策略文档

---

## 三、待完成工作

| 优先级 | 任务 | 阻塞原因 |
|:--:|------|------|
| 🔴 | **生成10张AI插图** | 需Midjourney v6.1或ComfyUI本地生成 |
| 🔴 | 生成封面AI图 | 同上 |
| 🟡 | 替换handbook.html中插图占位 | 依赖插图生成 |
| 🟡 | Canva KDP排版（6×9英寸） | 依赖插图完成 |
| 🟢 | Gumroad/小报童上架 | 依赖插图+排版 |
| 🟢 | KDP上架 | 依赖Canva排版+封面 |

### AI插图生成方案（2选1）：

**方案1 — ComfyUI本地生成：**
```bash
cd comfyui/
python3 batch_generate.py --dry-run   # 预览
python3 batch_generate.py              # 生成全部11张
# 前提：ComfyUI运行中 + SDXL模型已下载
```

**方案2 — Midjourney手动：**
`midjourney-prompts-all.txt` → 逐条粘贴到Discord

---

## 四、音频流水线（Repo B已实现）

三层叠加确保"好听"：
1. DeepSeek写口播稿（150-230字自然导入）
2. edge_tts: `zh-CN-YunyangNeural`, rate=-8%, pitch=-2Hz
3. ffmpeg: `loudnorm=I=-16:TP=-1.5:LRA=9`, 24000Hz, mono, 48kbps

脚本：`scripts/gen_audio.py` + `scripts/narration_scripts.py`

---

## 五、文件对照（合并后目标结构）

```
opc-survival-handbook/          ← 合并后的Repo B
├── docs/                       ← GitHub Pages部署目录
│   ├── index.html
│   ├── ch1.html ~ ch10.html   ← 分章版本（保留）
│   ├── audio/ch1.mp3~ch10.mp3 ← 音频（保留）
│   └── handbook.html           ← 新增：单文件完整版
├── comfyui/                    ← 新增：从Repo A迁移
├── infographic/                ← 新增：从Repo A迁移
├── scripts/
│   ├── kdp_builder.py
│   ├── gen_audio.py
│   ├── narration_scripts.py
│   ├── build_handbook_html.mjs
│   └── generate_visuals.mjs
├── cover.html                  ← 新增
├── handbook.html               ← 新增（根目录副本）
├── outline.md                  ← 新增
├── publishing-strategy.md      ← 新增
├── illustration-plan.md
├── midjourney-prompts-all.txt  ← 新增
└── course-platform-strategy.md
```
