import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  BOOK_TITLE,
  BOOK_SUBTITLE,
  appendices,
  caseLibrary,
  chapterImageSrc,
  chapters,
} from "./build_longform_book.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const docsRoot = join(root, "docs");
const wechatRoot = join(docsRoot, "wechat-course");
const wechatDataRoot = join(wechatRoot, "data");
const wechatScriptsRoot = join(wechatRoot, "scripts");
const wechatLessonsRoot = join(wechatRoot, "lessons");
const wechatLessonDataRoot = join(wechatLessonsRoot, "data");
const wechatLessonScriptsRoot = join(wechatLessonsRoot, "scripts");
const wechatLessonArticlesRoot = join(wechatLessonsRoot, "articles");
const wechatLessonArticleLeadRoot = join(wechatLessonArticlesRoot, "lead");
const wechatLessonArticleConversionRoot = join(
  wechatLessonArticlesRoot,
  "conversion"
);
const wechatLessonArticleCommunityRoot = join(
  wechatLessonArticlesRoot,
  "community"
);
const wechatLessonAudioRoot = join(wechatLessonsRoot, "audio");

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function plain(text) {
  return String(text).replace(/\s+/g, " ").trim();
}

function chapterSlug(number) {
  return `chapter-${String(number).padStart(2, "0")}`;
}

function lessonSlug(number) {
  return `lesson-${String(number).padStart(3, "0")}`;
}

function smartTrim(text, maxLength) {
  const normalized = plain(text);
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trim()}…`;
}

function getCaseUsageMap() {
  const usage = new Map();
  for (const chapter of chapters) {
    for (const section of chapter.sections) {
      for (const caseId of section.caseIds) {
        if (!usage.has(caseId)) usage.set(caseId, []);
        usage.get(caseId).push({
          chapterNumber: chapter.number,
          chapterTitle: chapter.title,
          sectionTitle: section.title,
        });
      }
    }
  }
  return usage;
}

function buildLessonBundle(chapter, section, lessonNumber, chapterLessonNumber) {
  const id = lessonSlug(lessonNumber);
  const leadCase = section.caseIds[0] ? caseLibrary[section.caseIds[0]] : null;
  const frameworkSummary = section.frameworkSteps
    .slice(0, 3)
    .map((step) => `${step.label}：${plain(step.detail)}`)
    .join("；");
  const videoScript = smartTrim(
    [
      `今天这节课，我们只处理一个问题：${plain(section.question)}`,
      `放到 OPC 项目里，这件事真正难的不是知道概念，而是你明明想推进，却总会卡在 ${plain(
        section.friction
      )}。`,
      `所以这一课只记住一个框架：${section.frameworkName}。最关键的三步是 ${frameworkSummary}。`,
      leadCase
        ? `案例上你可以看 ${leadCase.name}，重点不是它做得多大，而是它证明了 ${plain(
            leadCase.summary
          )}`
        : "",
      `这节课听完不要继续收藏，直接去做一件事：${plain(section.actions[0])}`,
    ]
      .filter(Boolean)
      .join(""),
    460
  );

  const articleSections = [
    {
      title: "开场问题",
      paragraphs: [
        plain(section.question),
        `如果把这节课放到微信平台，它的作用不是补充概念，而是把学员从“知道一点”推进到“愿意动手”。${plain(
          section.premise
        )}`,
      ],
    },
    {
      title: `核心框架：${section.frameworkName}`,
      paragraphs: [
        ...section.frameworkSteps.map(
          (step, index) =>
            `第${index + 1}步是 ${step.label}。${plain(step.detail)}`
        ),
      ],
    },
    {
      title: "关键思考",
      paragraphs: section.thinkingAngles.map((item) => plain(item)),
    },
    leadCase
      ? {
          title: `案例拆解：${leadCase.name}`,
          paragraphs: [
            plain(leadCase.summary),
            ...leadCase.details.map((item) => plain(item)),
            `这个案例最值得拿回自己项目里复用的，不是表面上的赛道选择，而是它如何把资产、分发和现金流接起来。`,
          ],
        }
      : null,
    {
      title: "行动清单",
      paragraphs: section.actions.map((item) => plain(item)),
    },
    {
      title: "复盘提问",
      paragraphs: section.reflection.map((item) => plain(item)),
    },
  ].filter(Boolean);

  const articleIntro = smartTrim(
    [
      `这篇文章对应《${chapter.title}》里的《${section.title}》。`,
      `如果你现在正在做 OPC 项目，这一节最适合解决“方向不清、动作太散、做了却没有资产沉淀”的问题。`,
      `读完之后，你至少应该能带走一个框架、一条案例启发和一份可以立刻执行的动作清单。`,
    ].join(""),
    220
  );

  return {
    id,
    lessonNumber,
    chapterNumber: chapter.number,
    chapterLessonNumber,
    chapterId: chapterSlug(chapter.number),
    chapterTitle: chapter.title,
    chapterSubtitle: chapter.subtitle,
    title: section.title,
    frameworkName: section.frameworkName,
    videoScript,
    articleTitle: `第${chapter.number}-${chapterLessonNumber}课｜${section.title}`,
    articleIntro,
    articleSections,
    case: leadCase
      ? {
          name: leadCase.name,
          summary: leadCase.summary,
          sourceUrl: leadCase.sourceUrl,
        }
      : null,
    action: section.actions[0],
    reflection: section.reflection[0],
    audioPath: `audio/${id}.mp3`,
  };
}

function buildArticleVariantPayloads(lesson) {
  const caseParagraph = lesson.case
    ? `你可以先用 ${lesson.case.name} 做一个低成本参照，它说明了 ${plain(
        lesson.case.summary
      )}`
    : `这一课没有单独依赖名人案例，重点在于你把框架落进自己的项目。`;

  return [
    {
      slug: "lead",
      label: "引流版",
      title: `${lesson.articleTitle}｜引流版`,
      intro: `这是一篇面向冷启动读者的引流文章，目标不是一次讲透，而是快速激发兴趣，让读者意识到自己正卡在这节课解决的问题上。`,
      cta: `文末动作建议：领取清单、进入章节页，继续看第${lesson.chapterNumber}章相关内容。`,
      sections: [
        {
          title: "先把问题说透",
          paragraphs: [
            `很多人不是不努力，而是没有先回答这节课里的核心问题：${lesson.articleSections[0].paragraphs[0]}`,
            `一旦这个问题没想清楚，后面的内容、工具、流量和变现都会变成局部努力。`,
          ],
        },
        {
          title: "为什么多数人会卡住",
          paragraphs: [
            lesson.articleSections[0].paragraphs[1],
            caseParagraph,
          ],
        },
        {
          title: `先带走一个框架：${lesson.frameworkName}`,
          paragraphs: lesson.articleSections[1].paragraphs.slice(0, 2),
        },
        {
          title: "轻量行动",
          paragraphs: [
            `如果你只愿意先做一步，就从这里开始：${lesson.action}`,
            `先动起来，比继续收藏更多内容更重要。`,
          ],
        },
      ],
    },
    {
      slug: "conversion",
      label: "转化版",
      title: `${lesson.articleTitle}｜转化版`,
      intro: `这是一篇面向已经有兴趣用户的转化文章，目标是把读者从“知道这件事重要”推进到“愿意进入系统课程或服务”。`,
      cta: `文末动作建议：引导进入整章课程、训练营、会员或诊断服务，而不是停留在单篇阅读。`,
      sections: [
        {
          title: "问题与代价",
          paragraphs: [
            `这节课处理的问题是：${lesson.articleSections[0].paragraphs[0]}`,
            `如果这个问题长期不解决，你会持续出现低效试错、产出分散和资产沉淀不足的代价。`,
          ],
        },
        {
          title: "为什么碎片方法不够",
          paragraphs: [
            `很多人会零散看教程、换工具、追新平台，但真正缺的其实是连续框架和外部反馈。`,
            lesson.articleSections[0].paragraphs[1],
          ],
        },
        {
          title: `课程能交付什么：${lesson.frameworkName}`,
          paragraphs: [
            ...lesson.articleSections[1].paragraphs,
            `你要的不是再多一个理论名词，而是一套可连续执行、可复盘、可被辅导的动作链。`,
          ],
        },
        {
          title: "现在适合行动的人",
          paragraphs: [
            `如果你已经在做内容、产品、咨询或个人IP，但总觉得推进不成系统，这节课和对应章节适合直接纳入你的训练计划。`,
            `下一步动作：${lesson.action}`,
          ],
        },
      ],
    },
    {
      slug: "community",
      label: "社群作业版",
      title: `${lesson.articleTitle}｜社群作业版`,
      intro: `这是一篇给已付费学员或社群成员的作业文章版，重点不在说服，而在组织输出、检查提交质量和引导群内互动。`,
      cta: `文末动作建议：提交作业、按要求回复、进入群内点评和下一步承诺。`,
      sections: [
        {
          title: "本课目标",
          paragraphs: [
            `本课要解决的问题是：${lesson.articleSections[0].paragraphs[0]}`,
            `学完之后，你至少要拿出一个真实项目动作，而不是只写感受。`,
          ],
        },
        {
          title: `执行框架：${lesson.frameworkName}`,
          paragraphs: lesson.articleSections[1].paragraphs,
        },
        {
          title: "提交要求",
          paragraphs: [
            `本课作业：${lesson.action}`,
            `提交时请同时回答这个复盘问题：${lesson.reflection}`,
            `如果你引用案例，请明确写出你复用了案例里的哪一个动作，而不是只写“很受启发”。`,
          ],
        },
        {
          title: "群内互动规则",
          paragraphs: [
            `发作业时请给出你的当前阶段、你最卡的一步、以及你承诺的下一步时间点。`,
            `点评别人时，优先指出可执行动作，不做空泛鼓励。`,
          ],
        },
      ],
    },
  ];
}

function buildPrintHtml() {
  const preface = `
    <section class="appendix" id="preface">
      <h2>前言</h2>
      <div class="container">
        <p>${BOOK_TITLE} 这一版不是为了网页浏览而写，而是为了进入 6×9 英寸 KDP 印刷流程而重新整理的长版书稿。页面样式被压缩，章节结构被显式化，案例、框架、思考题和行动清单都被保留。</p>
        <p>阅读时建议把它当成一份项目工作台，而不是一次性读物。你不需要一口气读完，但要在每章之后把至少一个动作带回自己的项目里，让这本书和你的真实工作发生连接。</p>
        <p>整本书的主线很简单：把个人能力变成资产，把资产变成现金流，再把现金流变成长期资产和平台结构。这也是 OPC 与传统单次接活最大的区别。</p>
      </div>
    </section>
  `;

  const toc = chapters
    .map(
      (chapter) =>
        `<li>${escapeHtml(`第${chapter.number}章 ${chapter.title}`)} · ${escapeHtml(
          chapter.subtitle
        )}</li>`
    )
    .join("");

  const chapterHtml = chapters
    .map((chapter) => {
      const sections = chapter.sections
        .map((section) => {
          const frameworkList = section.frameworkSteps
            .map(
              (step) =>
                `<li><strong>${escapeHtml(step.label)}</strong>：${escapeHtml(
                  step.detail
                )}</li>`
            )
            .join("");
          const caseBlocks = section.caseIds
            .map((caseId) => {
              const item = caseLibrary[caseId];
              const lines = [item.summary, ...item.details]
                .map((text) => `<p>${escapeHtml(text)}</p>`)
                .join("");
              return `<div class="highlight-box"><div class="label">案例 · ${escapeHtml(
                item.name
              )}</div>${lines}<p>来源：${escapeHtml(item.sourceUrl)}</p></div>`;
            })
            .join("");
          const reflections = section.reflection
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("");
          const actions = section.actions
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("");
          return `<div class="section">
            <h3>${escapeHtml(section.title)}</h3>
            <p>${escapeHtml(section.question)}</p>
            <p>${escapeHtml(section.premise)}</p>
            <p>${escapeHtml(section.friction)}</p>
            <div class="highlight-box">
              <div class="label">本节框架 · ${escapeHtml(section.frameworkName)}</div>
              <ol>${frameworkList}</ol>
            </div>
            ${section.thinkingAngles
              .map((text) => `<p>${escapeHtml(text)}</p>`)
              .join("")}
            ${caseBlocks}
            <div class="action-box">
              <div class="label">思考题</div>
              <ul>${reflections}</ul>
            </div>
            <div class="action-box">
              <div class="label">行动清单</div>
              <ul>${actions}</ul>
            </div>
          </div>`;
        })
        .join("");
      return `<article class="chapter">
        <span class="chapter-num">第${chapter.number}章</span>
        <span class="chapter-emoji"></span>
        <h2>${escapeHtml(chapter.title)}</h2>
        <p class="tagline">${escapeHtml(chapter.subtitle)}</p>
        <figure class="chapter-art"><img src="${chapterImageSrc(chapter.number)}" alt="${escapeHtml(
          chapter.title
        )}"></figure>
        <div class="section">
          <h3>本章导读</h3>
          <p>${escapeHtml(chapter.theme)}</p>
          <p>${escapeHtml(chapter.whyNow)}</p>
          <div class="highlight-box">
            <div class="label">本章容易误解的地方</div>
            <ul>${chapter.falseBeliefs
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}</ul>
          </div>
          <div class="action-box">
            <div class="label">本章导图摘要</div>
            <ul>${chapter.chapterMap
              .map((item) => `<li>${escapeHtml(item)}</li>`)
              .join("")}</ul>
          </div>
        </div>
        ${sections}
      </article>`;
    })
    .join("");

  const appendixIds = ["appendix-kdp", "appendix-30day", "appendix-cases"];
  const appendicesHtml = appendices
    .map((appendix, index) => {
      const bullets = appendix.bullets
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("");
      const paragraphs = appendix.paragraphs
        .map((item) => `<p>${escapeHtml(item)}</p>`)
        .join("");
      return `<section class="appendix" id="${appendixIds[index] || `appendix-${index + 1}`}">
        <h2>${escapeHtml(appendix.title)}</h2>
        <div class="container">
          ${paragraphs}
          <ul>${bullets}</ul>
        </div>
      </section>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(BOOK_TITLE)} · KDP印刷版</title>
<style>
body{font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f7f4ed;color:#1f2433;line-height:1.8;margin:0}
.page{max-width:920px;margin:0 auto;padding:40px 24px 80px}
.cover{text-align:center;padding:20px 0 32px}
.cover img{max-width:320px;width:100%;height:auto;display:block;margin:0 auto 20px}
.cover h1{font-size:2.2rem;margin:0 0 8px}
.cover p{color:#59627b}
.toc,.chapter,.appendix{background:#fffdf8;border:1px solid #ddd3c4;border-radius:18px;padding:24px;margin:0 0 22px}
.chapter-num{display:block;font-size:.8rem;font-weight:900;color:#cb8613;letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px}
.tagline{color:#59627b}
.chapter-art img{max-width:100%;display:block;margin:14px auto;border-radius:12px}
.section{margin-top:18px;padding-top:18px;border-top:1px solid #ece1cf}
.section:first-of-type{border-top:0;padding-top:0}
.highlight-box,.action-box{background:#f6efe2;border:1px solid #e7d8bf;border-radius:14px;padding:14px;margin:14px 0}
.label{font-size:.78rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase;color:#cb8613;margin-bottom:8px}
ul,ol{padding-left:20px}
</style>
</head>
<body>
  <div class="page">
    <div class="cover">
      <div class="cover-img"><img src="assets/cover/front-cover.png" alt="${escapeHtml(
        BOOK_TITLE
      )}"></div>
      <h1>${escapeHtml(BOOK_TITLE)}</h1>
      <p>${escapeHtml(BOOK_SUBTITLE)}</p>
      <p>KDP 6×9 印刷整理版 · 长版书专用排版输入</p>
    </div>
    ${preface}
    <section class="appendix" id="toc">
      <h2>目录</h2>
      <div class="container"><ul>${toc}</ul></div>
    </section>
    ${chapterHtml}
    ${appendicesHtml}
  </div>
</body>
</html>`;
}

function buildWechatChapter(chapter, lessonLookup) {
  const primaryCases = [];
  for (const section of chapter.sections) {
    for (const caseId of section.caseIds) {
      if (!primaryCases.includes(caseId)) primaryCases.push(caseId);
    }
  }

  const opening = [
    `这一章的主题是《${chapter.title}》。如果把它放进微信课程里，它不应该只是把书稿重新读一遍，而要像老师带着学员做项目推进。`,
    `${chapter.theme}`,
    `你要让学员在这一章里拿走三个东西：${chapter.chapterMap.join("；")}。`,
    `所以这章的讲法应该是“先拆问题，再给框架，再落动作，再回到微信平台里的作业和反馈”，而不是只做概念堆叠。`,
  ].join("");

  const segments = chapter.sections.map((section, index) => {
    const firstCase = caseLibrary[section.caseIds[0]];
    const lesson = lessonLookup.get(`${chapter.number}:${section.title}`);
    const frameworkSentence = section.frameworkSteps
      .map((step) => `${step.label}：${plain(step.detail)}`)
      .join("；");
    const sceneNarrative = [
      `第${index + 1}节讲《${section.title}》。开头先抛出问题：“${plain(
        section.question
      )}”`,
      `然后用两到三分钟把前提讲清楚：${plain(section.premise)}`,
      `接着要把卡点说透：${plain(section.friction)}`,
      `这一节的核心框架是「${section.frameworkName}」：${frameworkSentence}。讲的时候不要只念步骤，要不断把步骤拉回学员当前项目，问他们现在卡在哪一步。`,
      firstCase
        ? `案例部分优先讲 ${firstCase.name}。你不需要铺太多背景，只要讲清楚这个案例说明了什么：${plain(
            firstCase.summary
          )}`
        : "",
      `互动提问可以直接用：${plain(section.reflection[0])}`,
      `作业动作则用：${plain(section.actions[0])}`,
    ]
      .filter(Boolean)
      .join("");
    return {
      title: section.title,
      narration: sceneNarrative,
      frameworkName: section.frameworkName,
      interaction: section.reflection[0],
      action: section.actions[0],
      lessonPath: lesson ? `lessons/${lesson.id}.html` : "",
      lessonId: lesson ? lesson.id : "",
    };
  });

  const closing = [
    `这一章结束后，学员在微信小程序里应该至少提交一份阶段作业，并把结果写进复盘表。`,
    `微信端的课程页建议固定放四个模块：章节导入音频、主讲脚本图文、行动作业、AI反馈入口。`,
    `如果要接社群，这一章最适合的群内动作是“晒作业 + 点评 + 下一步承诺”，而不是单纯听完打卡。`,
    `最终目标不是让学员觉得懂了，而是让他们真的沿着 ${chapter.chapterMap[0]} 开始推进。`,
  ].join("");

  return {
    number: chapter.number,
    id: chapterSlug(chapter.number),
    title: chapter.title,
    subtitle: chapter.subtitle,
    opening,
    segments,
    closing,
    cases: primaryCases.map((caseId) => ({
      id: caseId,
      name: caseLibrary[caseId].name,
      summary: caseLibrary[caseId].summary,
      sourceUrl: caseLibrary[caseId].sourceUrl,
    })),
    homework: [
      chapter.sections[0].actions[0],
      chapter.sections[Math.floor(chapter.sections.length / 2)].actions[0],
      chapter.sections[chapter.sections.length - 1].actions[0],
    ],
    wechatModules: [
      "章节导入音频：500字以内自然开场，帮助学员迅速进入问题情境。",
      "正文图文脚本：按节拆开，每节都要有框架、案例、互动问题和行动指令。",
      "作业提交区：要求学员提交真实项目产物，而不是只做选择题。",
      "AI反馈与群内点评：把提交内容送到AI反馈入口，再配合微信群/企业微信点评。",
    ],
  };
}

function lessonArticleMarkdown(lesson) {
  const lines = [
    `# ${lesson.articleTitle}`,
    "",
    lesson.articleIntro,
    "",
    `- 章节：第${lesson.chapterNumber}章 ${lesson.chapterTitle}`,
    `- 课次：第${lesson.chapterNumber}-${lesson.chapterLessonNumber}课`,
    `- 核心框架：${lesson.frameworkName}`,
    "",
  ];

  for (const section of lesson.articleSections) {
    lines.push(`## ${section.title}`);
    lines.push("");
    for (const paragraph of section.paragraphs) {
      lines.push(paragraph);
      lines.push("");
    }
  }

  if (lesson.case) {
    lines.push("## 案例来源");
    lines.push("");
    lines.push(`- ${lesson.case.name}：${lesson.case.summary}`);
    lines.push(`- 来源：${lesson.case.sourceUrl}`);
    lines.push("");
  }

  lines.push("## 结尾动作");
  lines.push("");
  lines.push(`- 行动作业：${lesson.action}`);
  lines.push(`- 复盘提问：${lesson.reflection}`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function lessonArticleHtml(lesson) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(lesson.articleTitle)} · 公众号文章版</title>
<style>
body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f6f0e5;color:#1f2433;line-height:1.9}
.top{position:sticky;top:0;background:rgba(246,240,229,.94);border-bottom:1px solid #ddd0bb;backdrop-filter:blur(12px)}
.top-inner{max-width:920px;margin:0 auto;padding:14px 24px;display:flex;justify-content:space-between;gap:12px;align-items:center}
.top a{text-decoration:none;color:#5f677b}
.top .brand{font-weight:900;color:#1f2433}
.wrap{max-width:920px;margin:0 auto;padding:28px 24px 60px}
.hero,.section{background:#fffdf8;border:1px solid #ddd0bb;border-radius:22px;box-shadow:0 14px 34px rgba(31,36,51,.08);padding:24px}
.section{margin-top:18px}
.eyebrow{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f3e2c4;color:#c98412;font-size:.78rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase}
h1{margin:14px 0 8px;font-size:2.4rem;line-height:1.12}
h2{margin:0 0 12px}
.meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.chip{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f6efe2;color:#59627b;font-size:.8rem;font-weight:700}
</style>
</head>
<body>
<header class="top">
  <div class="top-inner">
    <a class="brand" href="../index.html">逐课内容库</a>
    <a href="../${lesson.id}.html">返回课程页</a>
  </div>
</header>
<main class="wrap">
  <section class="hero">
    <div class="eyebrow">Article Version</div>
    <h1>${escapeHtml(lesson.articleTitle)}</h1>
    <p>${escapeHtml(lesson.articleIntro)}</p>
    <div class="meta">
      <span class="chip">第${lesson.chapterNumber}章 ${escapeHtml(lesson.chapterTitle)}</span>
      <span class="chip">${escapeHtml(lesson.frameworkName)}</span>
    </div>
  </section>
  ${lesson.articleSections
    .map(
      (section) => `<section class="section">
        <div class="eyebrow">${escapeHtml(section.title)}</div>
        <h2>${escapeHtml(section.title)}</h2>
        ${section.paragraphs
          .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
          .join("")}
      </section>`
    )
    .join("")}
  ${
    lesson.case
      ? `<section class="section">
      <div class="eyebrow">Source Case</div>
      <h2>案例来源</h2>
      <p><strong>${escapeHtml(lesson.case.name)}</strong>：${escapeHtml(
          lesson.case.summary
        )}</p>
      <p><a href="${lesson.case.sourceUrl}">${escapeHtml(
          lesson.case.sourceUrl
        )}</a></p>
    </section>`
      : ""
  }
</main>
</body>
</html>`;
}

function lessonArticleVariantMarkdown(lesson, variant) {
  const lines = [
    `# ${variant.title}`,
    "",
    variant.intro,
    "",
    `- 来源课次：${lesson.articleTitle}`,
    `- 模板类型：${variant.label}`,
    `- 核心框架：${lesson.frameworkName}`,
    `- 建议动作：${variant.cta}`,
    "",
  ];

  for (const section of variant.sections) {
    lines.push(`## ${section.title}`);
    lines.push("");
    for (const paragraph of section.paragraphs) {
      lines.push(paragraph);
      lines.push("");
    }
  }

  if (lesson.case) {
    lines.push("## 案例锚点");
    lines.push("");
    lines.push(`- ${lesson.case.name}：${lesson.case.summary}`);
    lines.push(`- 来源：${lesson.case.sourceUrl}`);
    lines.push("");
  }

  lines.push("## 结尾指令");
  lines.push("");
  lines.push(`- ${variant.cta}`);
  lines.push(`- 当前课行动作业：${lesson.action}`);
  lines.push(`- 当前课复盘问题：${lesson.reflection}`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function lessonArticleVariantHtml(lesson, variant) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(variant.title)}</title>
<style>
body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f6f0e5;color:#1f2433;line-height:1.9}
.top{position:sticky;top:0;background:rgba(246,240,229,.94);border-bottom:1px solid #ddd0bb;backdrop-filter:blur(12px)}
.top-inner{max-width:920px;margin:0 auto;padding:14px 24px;display:flex;justify-content:space-between;gap:12px;align-items:center}
.top a{text-decoration:none;color:#5f677b}
.top .brand{font-weight:900;color:#1f2433}
.wrap{max-width:920px;margin:0 auto;padding:28px 24px 60px}
.hero,.section{background:#fffdf8;border:1px solid #ddd0bb;border-radius:22px;box-shadow:0 14px 34px rgba(31,36,51,.08);padding:24px}
.section{margin-top:18px}
.eyebrow{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f3e2c4;color:#c98412;font-size:.78rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase}
h1{margin:14px 0 8px;font-size:2.2rem;line-height:1.12}
h2{margin:0 0 12px}
.meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.chip{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f6efe2;color:#59627b;font-size:.8rem;font-weight:700}
</style>
</head>
<body>
<header class="top">
  <div class="top-inner">
    <a class="brand" href="../../index.html">逐课内容库</a>
    <a href="../${lesson.id}.html">返回课程页</a>
  </div>
</header>
<main class="wrap">
  <section class="hero">
    <div class="eyebrow">${escapeHtml(variant.label)}</div>
    <h1>${escapeHtml(variant.title)}</h1>
    <p>${escapeHtml(variant.intro)}</p>
    <div class="meta">
      <span class="chip">${escapeHtml(lesson.frameworkName)}</span>
      <span class="chip">${escapeHtml(lesson.articleTitle)}</span>
    </div>
  </section>
  ${variant.sections
    .map(
      (section) => `<section class="section">
        <div class="eyebrow">${escapeHtml(section.title)}</div>
        <h2>${escapeHtml(section.title)}</h2>
        ${section.paragraphs
          .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
          .join("")}
      </section>`
    )
    .join("")}
  <section class="section">
    <div class="eyebrow">Call To Action</div>
    <h2>结尾指令</h2>
    <p>${escapeHtml(variant.cta)}</p>
    <p><strong>本课作业：</strong>${escapeHtml(lesson.action)}</p>
    <p><strong>复盘问题：</strong>${escapeHtml(lesson.reflection)}</p>
  </section>
</main>
</body>
</html>`;
}

function lessonHubHtml(lesson) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(lesson.articleTitle)} · 逐课拆解</title>
<style>
body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f5efe4;color:#1f2433;line-height:1.8}
.top{position:sticky;top:0;background:rgba(245,239,228,.94);border-bottom:1px solid #dfd0b6;backdrop-filter:blur(12px)}
.top-inner{max-width:1080px;margin:0 auto;padding:14px 24px;display:flex;justify-content:space-between;gap:12px;align-items:center}
.top a{text-decoration:none;color:#5f677b}
.top .brand{font-weight:900;color:#1f2433}
.top nav{display:flex;gap:8px;flex-wrap:wrap}
.top nav a{padding:8px 12px;border-radius:999px}
.top nav a:hover{background:#efe0c6;color:#1f2433}
.wrap{max-width:1080px;margin:0 auto;padding:28px 24px 60px}
.hero,.card{background:#fffdf8;border:1px solid #dfd0b6;border-radius:20px;box-shadow:0 14px 34px rgba(31,36,51,.08);padding:24px}
.hero{margin-bottom:20px}
.eyebrow{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f4e2c4;color:#c98412;font-size:.78rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase}
h1{margin:14px 0 8px;font-size:2.3rem;line-height:1.08}
.subtitle{color:#59627b;margin-bottom:12px}
.actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}
.actions a{text-decoration:none;color:#1f2433;padding:10px 14px;border-radius:999px;background:#f3e5ca;font-weight:800}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
.card h2{margin:0 0 10px}
pre{white-space:pre-wrap;word-break:break-word;font:inherit;margin:0}
.audio-player{margin-top:16px;display:grid;gap:8px}
.audio-player audio{width:100%}
.link-list{display:grid;gap:10px}
.link-list a{text-decoration:none;color:#1f2433;padding:12px 14px;border-radius:14px;background:#f7efdf;border:1px solid #e8d7ba;font-weight:700}
@media(max-width:820px){.grid{grid-template-columns:1fr}.top-inner{flex-direction:column;align-items:flex-start}}
</style>
</head>
<body>
<header class="top">
  <div class="top-inner">
    <a class="brand" href="index.html">逐课内容库</a>
    <nav>
      <a href="../index.html">微信脚本首页</a>
      <a href="../${lesson.chapterId}.html">所属章节</a>
      <a href="../../book-200k.html">20万字长版</a>
      <a href="../../project.html">项目看板</a>
    </nav>
  </div>
</header>
<main class="wrap">
  <section class="hero">
    <div class="eyebrow">Lesson ${String(lesson.lessonNumber).padStart(3, "0")}</div>
    <h1>${escapeHtml(lesson.articleTitle)}</h1>
    <p class="subtitle">第${lesson.chapterNumber}章《${escapeHtml(
    lesson.chapterTitle
  )}》 · 短视频口播稿 + 公众号文章版</p>
    <p>${escapeHtml(lesson.articleIntro)}</p>
    <div class="actions">
      <a href="scripts/${lesson.id}-video.txt">短视频口播 TXT</a>
      <a href="articles/${lesson.id}.html">公众号文章页</a>
      <a href="articles/${lesson.id}.md">公众号 Markdown</a>
    </div>
    <div class="audio-player">
      <audio controls preload="none" src="${lesson.audioPath}"></audio>
      <div class="subtitle">音频规格：YunyangNeural / -7% / -2Hz / loudnorm / 24kHz / mono / MP3 64kbps</div>
    </div>
  </section>
  <div class="grid">
    <section class="card">
      <div class="eyebrow">Video Script</div>
      <h2>逐课短视频口播稿</h2>
      <pre>${escapeHtml(lesson.videoScript)}</pre>
    </section>
    <section class="card">
      <div class="eyebrow">Article Pack</div>
      <h2>文章模板包</h2>
      <div class="link-list">
        <a href="articles/${lesson.id}.html">基础公众号文章版</a>
        <a href="articles/lead/${lesson.id}.html">引流版</a>
        <a href="articles/conversion/${lesson.id}.html">转化版</a>
        <a href="articles/community/${lesson.id}.html">社群作业版</a>
      </div>
    </section>
    <section class="card">
      <div class="eyebrow">Article Outline</div>
      <h2>基础文章版结构</h2>
      ${lesson.articleSections
        .map(
          (section) => `<p><strong>${escapeHtml(section.title)}：</strong>${escapeHtml(
            section.paragraphs[0]
          )}</p>`
        )
        .join("")}
      <p><strong>行动作业：</strong>${escapeHtml(lesson.action)}</p>
      <p><strong>复盘提问：</strong>${escapeHtml(lesson.reflection)}</p>
    </section>
    <section class="card">
      <div class="eyebrow">Template Use</div>
      <h2>三种模板怎么用</h2>
      <p><strong>引流版：</strong>用于朋友圈、公众号首篇、短视频配文，把陌生用户先拉进问题场景。</p>
      <p><strong>转化版：</strong>用于课程页、报名页、私域成交，把兴趣转成系统学习或服务购买。</p>
      <p><strong>社群作业版：</strong>用于学员群、打卡营、训练营复盘，重点是提交作业和群内点评。</p>
    </section>
  </div>
</main>
</body>
</html>`;
}

function buildLessonIndex(lessons) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OPC 微信逐课内容库</title>
<style>
body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f5efe4;color:#1f2433;line-height:1.8}
.top{position:sticky;top:0;background:rgba(245,239,228,.94);border-bottom:1px solid #dfd0b6;backdrop-filter:blur(12px)}
.top-inner{max-width:1180px;margin:0 auto;padding:14px 24px;display:flex;justify-content:space-between;gap:12px;align-items:center}
.top a{text-decoration:none;color:#5f677b}
.top .brand{font-weight:900;color:#1f2433}
.top nav{display:flex;gap:8px;flex-wrap:wrap}
.top nav a{padding:8px 12px;border-radius:999px}
.top nav a:hover,.top nav a.active{background:#efe0c6;color:#1f2433}
.wrap{max-width:1180px;margin:0 auto;padding:28px 24px 60px}
.hero,.card{background:#fffdf8;border:1px solid #dfd0b6;border-radius:20px;box-shadow:0 14px 34px rgba(31,36,51,.08);padding:24px}
.hero{margin-bottom:20px}
.eyebrow{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f4e2c4;color:#c98412;font-size:.78rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase}
h1{margin:14px 0 8px;font-size:2.4rem;line-height:1.08}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.card h2{margin:10px 0 8px;font-size:1.28rem}
.meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.chip{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f6efe2;color:#59627b;font-size:.8rem;font-weight:700}
@media(max-width:820px){.grid{grid-template-columns:1fr}.top-inner{flex-direction:column;align-items:flex-start}}
</style>
</head>
<body>
<header class="top">
  <div class="top-inner">
    <a class="brand" href="../index.html">OPC 生存手册</a>
    <nav>
      <a href="../index.html">微信脚本首页</a>
      <a class="active" href="index.html">逐课内容库</a>
      <a href="../../book-200k.html">20万字长版</a>
      <a href="../../book-200k-assets-cases.html">配图/案例页</a>
      <a href="../../project.html">项目看板</a>
    </nav>
  </div>
</header>
<main class="wrap">
  <section class="hero">
    <div class="eyebrow">Lesson Library</div>
    <h1>OPC 微信逐课内容库</h1>
    <p>这里把长版书按节拆成可直接投放到微信生态的逐课资产。每课都包含短视频口播稿、音频、基础公众号文章版，以及引流版、转化版、社群作业版三套文章模板。</p>
    <div class="meta">
      <span class="chip">${lessons.length} 节逐课内容</span>
      <span class="chip">${lessons.length} 条逐课音频</span>
      <span class="chip">短视频口播稿</span>
      <span class="chip">4 套文章版本</span>
    </div>
  </section>
  <div class="grid">
    ${lessons
      .map(
        (lesson) => `<a class="card" href="${lesson.id}.html" style="text-decoration:none;color:inherit">
          <div class="eyebrow">第${lesson.chapterNumber}-${lesson.chapterLessonNumber}课</div>
          <h2>${escapeHtml(lesson.title)}</h2>
          <p>${escapeHtml(lesson.articleIntro)}</p>
          <div class="meta">
            <span class="chip">${escapeHtml(lesson.frameworkName)}</span>
            <span class="chip">${lesson.case ? escapeHtml(lesson.case.name) : "无案例"}</span>
            <span class="chip">音频</span>
          </div>
        </a>`
      )
      .join("")}
  </div>
</main>
</body>
</html>`;
}

function scriptText(chapterScript) {
  const lines = [
    `OPC研究院 · 微信课程章节脚本`,
    `第${chapterScript.number}章 ${chapterScript.title}`,
    "",
    `章节副标题：${chapterScript.subtitle}`,
    "",
    "一、开场口播",
    chapterScript.opening,
    "",
    "二、主讲脚本",
  ];

  for (const [index, segment] of chapterScript.segments.entries()) {
    lines.push("");
    lines.push(`第${index + 1}节 ${segment.title}`);
    lines.push(segment.narration);
    lines.push(`互动问题：${segment.interaction}`);
    lines.push(`行动作业：${segment.action}`);
  }

  lines.push("");
  lines.push("三、章节收束");
  lines.push(chapterScript.closing);
  lines.push("");
  lines.push("四、配套案例");
  for (const item of chapterScript.cases) {
    lines.push(`- ${item.name}：${item.summary}（${item.sourceUrl}）`);
  }
  lines.push("");
  lines.push("五、章节作业");
  for (const item of chapterScript.homework) lines.push(`- ${item}`);
  lines.push("");
  lines.push("六、微信平台模块");
  for (const item of chapterScript.wechatModules) lines.push(`- ${item}`);
  return `${lines.join("\n")}\n`;
}

function scriptHtml(chapterScript) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>微信课程脚本 · 第${chapterScript.number}章 ${escapeHtml(
    chapterScript.title
  )}</title>
<style>
body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f5efe4;color:#1f2433;line-height:1.8}
.top{position:sticky;top:0;background:rgba(245,239,228,.94);border-bottom:1px solid #dfd0b6;backdrop-filter:blur(12px)}
.top-inner{max-width:1080px;margin:0 auto;padding:14px 24px;display:flex;justify-content:space-between;gap:12px;align-items:center}
.top a{text-decoration:none;color:#5f677b}
.top .brand{font-weight:900;color:#1f2433}
.top nav{display:flex;gap:8px;flex-wrap:wrap}
.top nav a{padding:8px 12px;border-radius:999px}
.top nav a:hover{background:#efe0c6;color:#1f2433}
.wrap{max-width:1080px;margin:0 auto;padding:28px 24px 60px}
.hero,.card{background:#fffdf8;border:1px solid #dfd0b6;border-radius:20px;box-shadow:0 14px 34px rgba(31,36,51,.08);padding:24px}
.hero{margin-bottom:20px}
.eyebrow{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f4e2c4;color:#c98412;font-size:.78rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase}
h1{margin:14px 0 8px;font-size:2.4rem;line-height:1.08}
.subtitle{color:#59627b;margin-bottom:12px}
.grid{display:grid;gap:18px}
.segment h2,.card h2{margin:0 0 10px}
.chip{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f6efe2;color:#59627b;font-size:.8rem;font-weight:700;margin-right:8px}
ul{padding-left:20px}
</style>
</head>
<body>
<header class="top">
  <div class="top-inner">
    <a class="brand" href="index.html">微信课程脚本</a>
    <nav>
      <a href="../index.html">手册首页</a>
      <a href="../book-200k.html">20万字长版</a>
      <a href="index.html">脚本目录</a>
      <a href="lessons/index.html">逐课内容库</a>
      <a href="../book-200k-assets-cases.html">配图/案例页</a>
      <a href="../project.html">项目看板</a>
    </nav>
  </div>
</header>
<main class="wrap">
  <section class="hero">
    <div class="eyebrow">WeChat Chapter Script</div>
    <h1>第${chapterScript.number}章 ${escapeHtml(chapterScript.title)}</h1>
    <p class="subtitle">${escapeHtml(chapterScript.subtitle)}</p>
    <p>${escapeHtml(chapterScript.opening)}</p>
    <div><span class="chip">章节作业 ${chapterScript.homework.length}</span><span class="chip">案例 ${chapterScript.cases.length}</span><span class="chip">分节 ${chapterScript.segments.length}</span></div>
  </section>
  <div class="grid">
    ${chapterScript.segments
      .map(
        (segment, index) => `<section class="card segment">
          <div class="eyebrow">Segment ${index + 1}</div>
          <h2>${escapeHtml(segment.title)}</h2>
          <p>${escapeHtml(segment.narration)}</p>
          <p><strong>互动问题：</strong>${escapeHtml(segment.interaction)}</p>
          <p><strong>行动作业：</strong>${escapeHtml(segment.action)}</p>
          ${
            segment.lessonPath
              ? `<p><a href="${segment.lessonPath}">查看逐课短视频口播稿与公众号文章版</a></p>`
              : ""
          }
        </section>`
      )
      .join("")}
    <section class="card">
      <div class="eyebrow">Closing</div>
      <h2>章节收束</h2>
      <p>${escapeHtml(chapterScript.closing)}</p>
    </section>
    <section class="card">
      <div class="eyebrow">Cases</div>
      <h2>配套案例</h2>
      <ul>${chapterScript.cases
        .map(
          (item) =>
            `<li><strong>${escapeHtml(item.name)}</strong>：${escapeHtml(
              item.summary
            )} <a href="${item.sourceUrl}">${escapeHtml(item.sourceUrl)}</a></li>`
        )
        .join("")}</ul>
    </section>
    <section class="card">
      <div class="eyebrow">WeChat Modules</div>
      <h2>微信平台模块</h2>
      <ul>${chapterScript.wechatModules
        .map((item) => `<li>${escapeHtml(item)}</li>`)
        .join("")}</ul>
    </section>
  </div>
</main>
</body>
</html>`;
}

function buildWechatIndex(catalog, lessonCount) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OPC 微信课程章节脚本</title>
<style>
body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f5efe4;color:#1f2433;line-height:1.8}
.top{position:sticky;top:0;background:rgba(245,239,228,.94);border-bottom:1px solid #dfd0b6;backdrop-filter:blur(12px)}
.top-inner{max-width:1180px;margin:0 auto;padding:14px 24px;display:flex;justify-content:space-between;gap:12px;align-items:center}
.top a{text-decoration:none;color:#5f677b}
.top .brand{font-weight:900;color:#1f2433}
.top nav{display:flex;gap:8px;flex-wrap:wrap}
.top nav a{padding:8px 12px;border-radius:999px}
.top nav a:hover,.top nav a.active{background:#efe0c6;color:#1f2433}
.wrap{max-width:1180px;margin:0 auto;padding:28px 24px 60px}
.hero,.card{background:#fffdf8;border:1px solid #dfd0b6;border-radius:20px;box-shadow:0 14px 34px rgba(31,36,51,.08);padding:24px}
.hero{margin-bottom:20px}
.eyebrow{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f4e2c4;color:#c98412;font-size:.78rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase}
h1{margin:14px 0 8px;font-size:2.4rem;line-height:1.08}
.subtitle{color:#59627b}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.card h2{margin:10px 0 8px;font-size:1.35rem}
.meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.chip{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f6efe2;color:#59627b;font-size:.8rem;font-weight:700}
@media(max-width:820px){.grid{grid-template-columns:1fr}.top-inner{flex-direction:column;align-items:flex-start}}
</style>
</head>
<body>
<header class="top">
  <div class="top-inner">
    <a class="brand" href="../index.html">OPC 生存手册</a>
    <nav>
      <a href="../index.html">手册首页</a>
      <a href="../book-200k.html">20万字长版</a>
      <a class="active" href="index.html">微信脚本</a>
      <a href="lessons/index.html">逐课内容库</a>
      <a href="../book-200k-assets-cases.html">配图/案例页</a>
      <a href="../project.html">项目看板</a>
    </nav>
  </div>
</header>
<main class="wrap">
  <section class="hero">
    <div class="eyebrow">WeChat Script Pack</div>
    <h1>OPC 微信课程章节脚本</h1>
    <p class="subtitle">基于 20 万字长版书拆出的 10 章微信课程脚本包。每章包含开场口播、分节讲解、互动问题、行动作业、案例位和微信平台模块建议。</p>
    <div class="meta">
      <span class="chip">${lessonCount} 节逐课内容已拆分</span>
      <span class="chip"><a href="lessons/index.html" style="color:inherit;text-decoration:none">进入逐课内容库</a></span>
    </div>
  </section>
  <div class="grid">
    ${catalog
      .map(
        (item) => `<a class="card" href="${item.path}" style="text-decoration:none;color:inherit">
          <div class="eyebrow">第${item.number}章</div>
          <h2>${escapeHtml(item.title)}</h2>
          <p>${escapeHtml(item.subtitle)}</p>
          <div class="meta">
            <span class="chip">${item.segmentCount} 节讲解</span>
            <span class="chip">${item.caseCount} 个案例</span>
            <span class="chip"><a href="scripts/${item.txtName}" style="color:inherit;text-decoration:none">TXT 脚本</a></span>
          </div>
        </a>`
      )
      .join("")}
  </div>
</main>
</body>
</html>`;
}

function buildAssetsCasesHtml() {
  const usageMap = getCaseUsageMap();
  const illustrationCards = chapters
    .map(
      (chapter) => `<article class="card">
        <img src="${chapterImageSrc(chapter.number)}" alt="${escapeHtml(chapter.title)}">
        <h3>第${chapter.number}章 ${escapeHtml(chapter.title)}</h3>
        <p>${escapeHtml(chapter.subtitle)}</p>
        <ul>
          <li>KDP 用法：作为章节开篇整页图或小节过门图。</li>
          <li>微信用法：课程详情头图、公众号长文首图、阶段分享卡。</li>
          <li>讲解重点：围绕“${escapeHtml(chapter.chapterMap[0])}”做视觉锚点，不要只当装饰图。</li>
        </ul>
      </article>`
    )
    .join("");

  const infographicCards = [
    {
      src: "assets/infographics/monetization-roadmap.png",
      title: "变现路线图",
      use: "适合放在第7章、系统课销售页、会员权益页。",
    },
    {
      src: "assets/infographics/ai-tools-matrix.png",
      title: "AI工具矩阵",
      use: "适合放在第4章、工具箱页、入门诊断器结果页。",
    },
    {
      src: "assets/infographics/30-day-checklist.png",
      title: "30天启动清单",
      use: "适合放在附录、训练营打卡页、公众号转化文。",
    },
    {
      src: "assets/infographics/traditional-vs-opc.png",
      title: "传统创业 vs OPC",
      use: "适合放在第1章、第3章和对外宣讲页。",
    },
  ]
    .map(
      (item) => `<article class="card">
        <img src="${item.src}" alt="${escapeHtml(item.title)}">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.use)}</p>
      </article>`
    )
    .join("");

  const caseCards = Object.entries(caseLibrary)
    .map(([caseId, item]) => {
      const usage = usageMap.get(caseId) || [];
      return `<article class="card">
        <h3>${escapeHtml(item.name)}</h3>
        <p>${escapeHtml(item.summary)}</p>
        <p><strong>适合讲法：</strong>先讲问题，再讲动作，再讲启发，避免只堆结果。</p>
        <p><strong>推荐放置：</strong>KDP 侧可放章节案例框；微信侧可放课节中段的案例拆解模块。</p>
        <p><strong>引用章节：</strong>${usage
          .map((row) => `第${row.chapterNumber}章《${row.sectionTitle}》`)
          .join("、")}</p>
        <p><strong>来源：</strong><a href="${item.sourceUrl}">${escapeHtml(
        item.sourceUrl
      )}</a></p>
      </article>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OPC 长版书 · 配图与案例页</title>
<style>
body{margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;background:#f6f0e5;color:#1f2433;line-height:1.8}
.top{position:sticky;top:0;background:rgba(246,240,229,.94);border-bottom:1px solid #ddd0bb;backdrop-filter:blur(12px)}
.top-inner{max-width:1240px;margin:0 auto;padding:14px 24px;display:flex;justify-content:space-between;gap:12px;align-items:center}
.top a{text-decoration:none;color:#5f677b}
.top .brand{font-weight:900;color:#1f2433}
.top nav{display:flex;gap:8px;flex-wrap:wrap}
.top nav a{padding:8px 12px;border-radius:999px}
.top nav a:hover,.top nav a.active{background:#efe0c6;color:#1f2433}
.wrap{max-width:1240px;margin:0 auto;padding:28px 24px 60px}
.hero,.section{background:#fffdf8;border:1px solid #ddd0bb;border-radius:22px;box-shadow:0 14px 34px rgba(31,36,51,.08);padding:24px}
.hero{margin-bottom:20px}
.eyebrow{display:inline-flex;padding:6px 10px;border-radius:999px;background:#f3e2c4;color:#c98412;font-size:.78rem;font-weight:900;letter-spacing:.05em;text-transform:uppercase}
h1{margin:14px 0 8px;font-size:2.4rem;line-height:1.08}
.section{margin-top:18px}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.card{background:#fffaf2;border:1px solid #eadfcf;border-radius:18px;padding:18px}
.card img{width:100%;height:auto;border-radius:12px;display:block;margin-bottom:12px}
.card h3{margin:8px 0}
@media(max-width:860px){.grid{grid-template-columns:1fr}.top-inner{flex-direction:column;align-items:flex-start}}
</style>
</head>
<body>
<header class="top">
  <div class="top-inner">
    <a class="brand" href="index.html">OPC 生存手册</a>
    <nav>
      <a href="index.html">手册首页</a>
      <a href="book-200k.html">20万字长版</a>
      <a href="wechat-course/index.html">微信脚本</a>
      <a class="active" href="book-200k-assets-cases.html">配图/案例页</a>
      <a href="project.html">项目看板</a>
    </nav>
  </div>
</header>
<main class="wrap">
  <section class="hero">
    <div class="eyebrow">Assets And Cases</div>
    <h1>长版书配图与案例页</h1>
    <p>这页把 20 万字长版书的视觉资产和案例索引集中起来，方便你做 KDP 章节排版、微信课程封面、公众号长文和社群复盘时直接调用。</p>
  </section>
  <section class="section">
    <div class="eyebrow">Chapter Illustrations</div>
    <h2>章节配图</h2>
    <div class="grid">${illustrationCards}</div>
  </section>
  <section class="section">
    <div class="eyebrow">Infographics</div>
    <h2>信息图放置建议</h2>
    <div class="grid">${infographicCards}</div>
  </section>
  <section class="section">
    <div class="eyebrow">Case Index</div>
    <h2>案例索引</h2>
    <div class="grid">${caseCards}</div>
  </section>
</main>
</body>
</html>`;
}

async function main() {
  await mkdir(wechatRoot, { recursive: true });
  await mkdir(wechatDataRoot, { recursive: true });
  await mkdir(wechatScriptsRoot, { recursive: true });
  await mkdir(wechatLessonsRoot, { recursive: true });
  await mkdir(wechatLessonDataRoot, { recursive: true });
  await mkdir(wechatLessonScriptsRoot, { recursive: true });
  await mkdir(wechatLessonArticlesRoot, { recursive: true });
  await mkdir(wechatLessonArticleLeadRoot, { recursive: true });
  await mkdir(wechatLessonArticleConversionRoot, { recursive: true });
  await mkdir(wechatLessonArticleCommunityRoot, { recursive: true });
  await mkdir(wechatLessonAudioRoot, { recursive: true });

  const printHtml = buildPrintHtml();
  await writeFile(join(docsRoot, "book-200k-print.html"), printHtml, "utf8");

  const lessons = [];
  const lessonLookup = new Map();
  let lessonCounter = 0;
  for (const chapter of chapters) {
    for (const [index, section] of chapter.sections.entries()) {
      lessonCounter += 1;
      const lesson = buildLessonBundle(chapter, section, lessonCounter, index + 1);
      lesson.articleVariants = buildArticleVariantPayloads(lesson).map((variant) => ({
        ...variant,
        htmlPath: `articles/${variant.slug}/${lesson.id}.html`,
        markdownPath: `articles/${variant.slug}/${lesson.id}.md`,
      }));
      lessons.push(lesson);
      lessonLookup.set(`${chapter.number}:${section.title}`, lesson);
    }
  }

  for (const lesson of lessons) {
    await writeFile(
      join(wechatLessonsRoot, `${lesson.id}.html`),
      lessonHubHtml(lesson),
      "utf8"
    );
    await writeFile(
      join(wechatLessonScriptsRoot, `${lesson.id}-video.txt`),
      `${lesson.videoScript}\n`,
      "utf8"
    );
    await writeFile(
      join(wechatLessonArticlesRoot, `${lesson.id}.html`),
      lessonArticleHtml(lesson),
      "utf8"
    );
    await writeFile(
      join(wechatLessonArticlesRoot, `${lesson.id}.md`),
      lessonArticleMarkdown(lesson),
      "utf8"
    );
    for (const variant of lesson.articleVariants) {
      const targetRoot =
        variant.slug === "lead"
          ? wechatLessonArticleLeadRoot
          : variant.slug === "conversion"
          ? wechatLessonArticleConversionRoot
          : wechatLessonArticleCommunityRoot;
      await writeFile(
        join(targetRoot, `${lesson.id}.html`),
        lessonArticleVariantHtml(lesson, variant),
        "utf8"
      );
      await writeFile(
        join(targetRoot, `${lesson.id}.md`),
        lessonArticleVariantMarkdown(lesson, variant),
        "utf8"
      );
    }
    await writeFile(
      join(wechatLessonDataRoot, `${lesson.id}.json`),
      JSON.stringify(lesson, null, 2),
      "utf8"
    );
  }
  await writeFile(
    join(wechatLessonsRoot, "index.html"),
    buildLessonIndex(lessons),
    "utf8"
  );
  await writeFile(
    join(wechatLessonDataRoot, "catalog.json"),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        lessons: lessons.map((lesson) => ({
          id: lesson.id,
          lessonNumber: lesson.lessonNumber,
          chapterNumber: lesson.chapterNumber,
          chapterLessonNumber: lesson.chapterLessonNumber,
          title: lesson.title,
          chapterTitle: lesson.chapterTitle,
          frameworkName: lesson.frameworkName,
          articleTitle: lesson.articleTitle,
          audioPath: lesson.audioPath,
          articleVariants: lesson.articleVariants.map((variant) => ({
            slug: variant.slug,
            label: variant.label,
            htmlPath: variant.htmlPath,
            markdownPath: variant.markdownPath,
          })),
        })),
      },
      null,
      2
    ),
    "utf8"
  );

  const chapterScripts = chapters.map((chapter) =>
    buildWechatChapter(chapter, lessonLookup)
  );
  const catalog = [];
  for (const chapterScript of chapterScripts) {
    const txtName = `${chapterScript.id}.txt`;
    const htmlName = `${chapterScript.id}.html`;
    catalog.push({
      number: chapterScript.number,
      title: chapterScript.title,
      subtitle: chapterScript.subtitle,
      segmentCount: chapterScript.segments.length,
      caseCount: chapterScript.cases.length,
      path: htmlName,
      txtName,
    });
    await writeFile(
      join(wechatScriptsRoot, txtName),
      scriptText(chapterScript),
      "utf8"
    );
    await writeFile(
      join(wechatRoot, htmlName),
      scriptHtml(chapterScript),
      "utf8"
    );
    await writeFile(
      join(wechatDataRoot, `${chapterScript.id}.json`),
      JSON.stringify(chapterScript, null, 2),
      "utf8"
    );
  }
  await writeFile(
    join(wechatRoot, "index.html"),
    buildWechatIndex(catalog, lessons.length),
    "utf8"
  );
  await writeFile(
    join(wechatDataRoot, "catalog.json"),
    JSON.stringify({ generatedAt: new Date().toISOString(), chapters: catalog }, null, 2),
    "utf8"
  );

  await writeFile(
    join(docsRoot, "book-200k-assets-cases.html"),
    buildAssetsCasesHtml(),
    "utf8"
  );

  console.log("generated docs/book-200k-print.html");
  console.log("generated docs/wechat-course/*");
  console.log("generated docs/wechat-course/lessons/*");
  console.log("generated docs/book-200k-assets-cases.html");
}

await main();
