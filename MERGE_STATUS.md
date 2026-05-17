# OPC生存手册合并状态

更新时间：2026-05-17

## 当前工作树

当前可操作仓库：

`/Users/linzhang/Desktop/海外出书-OPC生存手册/opc-survival-handbook`

远端：

`https://github.com/MoKangMedical/opc-survival-handbook.git`

本机未找到用户摘要里的两个Linux路径：

- `/root/opc-platform-handoff-survival-handbook.md`
- `/root/opc-platform-handoff-korean-academy.md`

## 已合并内容

从远端最新提交合入：

- `docs/ch1.html` 到 `docs/ch10.html`：10个分章阅读页
- `docs/audio/ch1.mp3` 到 `docs/audio/ch10.mp3`：10段课程口播音频
- `scripts/gen_audio.py` 和 `scripts/narration_scripts.py`：音频生成流水线
- `DESIGN.md`：暗色Cyber-Craftsman视觉系统

从本地旧提交恢复并保留：

- `docs/assets/cover/`：封面与KDP封面视觉资产
- `docs/assets/illustrations/`：10张章节题图
- `docs/assets/infographics/`：4张信息图
- `docs/course.html`：OPC研究院课程平台原型页
- `docs/handbook.html`：完整单文件在线书稿
- `scripts/build_handbook_html.mjs`、`scripts/generate_visuals.mjs`、`scripts/kdp_builder.py`：完整书稿、视觉资产和KDP PDF工具链

## 入口约定

- `docs/index.html`：GitHub Pages首页，保留暗色分章+音频入口
- `docs/handbook.html`：完整书稿单文件版，供阅读、打印和KDP排版使用
- `docs/course.html`：课程平台策略原型
- `output/opc-handbook.pdf`：当前KDP PDF产物

## 尚未确认或缺失

- ComfyUI自动化文件：当前仓库只找到Midjourney/Canva/Stable Diffusion/ComfyUI相关提示词和说明，未找到可执行的ComfyUI workflow或脚本。
- Canva KDP排版：仓库已有KDP PDF自动排版脚本和PDF产物，但没有Canva工程文件。
- 出版上架：尚未执行KDP后台上传、版权/定价/最终提交等人工确认步骤。
