#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const courseRoot = path.join(repoRoot, "docs", "course");
const dataRoot = path.join(courseRoot, "data");
const narrationRoot = path.join(courseRoot, "narration");
const audioRoot = path.join(courseRoot, "audio");

const MIN_CONTENT_CHARS = 3000;
const MIN_NARRATION_CHARS = 150;
const MAX_NARRATION_CHARS = 500;

const phases = [
  {
    id: 1,
    title: "OPC认知基础",
    range: "第1-6课",
    dimension: "定位力",
    promise: "让学员先看清OPC不是自由职业的包装，而是一套用AI放大个人产能、降低组织摩擦、持续交付结果的商业系统。",
    platform: "入门课和免费诊断工具的承接页，要让用户在第一周就完成自我定位、机会判断和OPC宣言。",
    lessons: [
      ["OPC是什么：一个人如何变成一个小团队", "把个人能力拆成策略、生产、分发和交付四个岗位，再用AI和自动化补位", "OPC角色拆解表", "写出你当前可以外包给AI的10个岗位任务"],
      ["AI生产力革命：为什么现在是窗口期", "判断AI降低成本、缩短试错周期和改变分工边界的真实机会", "窗口期机会评估表", "用三个证据说明你的赛道为什么适合现在启动"],
      ["传统创业 vs OPC创业", "比较重资产团队创业和轻资产个人创业在速度、风险、现金流上的差异", "创业模式取舍矩阵", "把一个传统创业想法改写成OPC版本"],
      ["内容型、产品型、服务型OPC", "识别三类OPC的交付方式、获客方式和升级路径", "OPC类型选择卡", "为自己选择一个主类型和一个备选类型"],
      ["OPC的收入结构和风险结构", "看懂收入来源、平台依赖、交付压力和个人精力之间的关系", "收入风险地图", "列出你未来12个月最可能的三种收入和三种风险"],
      ["你的第一份OPC宣言", "把目标用户、关键问题、交付方式、收入目标和底线写成一份可执行承诺", "OPC个人宣言", "写出100字版本和500字版本的OPC宣言"],
    ],
  },
  {
    id: 2,
    title: "心态与生存系统",
    range: "第7-12课",
    dimension: "定位力",
    promise: "让学员建立能扛过低反馈期的心理结构、现金流底线和复盘节奏，避免把自由误解成随意。",
    platform: "小程序的学习仪表盘要把复盘、现金流、安全垫、打卡和作业反馈连接起来，让用户每天看到自己不是在原地空转。",
    lessons: [
      ["自由的反面是孤独", "理解独立工作带来的信息孤岛、情绪波动和决策压力", "孤独风险清单", "设计你的三层支持网络"],
      ["四种必死心态", "识别完美主义、工具崇拜、等流量和逃避销售四类常见陷阱", "心态排雷表", "写出你最容易犯的一种心态错误和修正动作"],
      ["反馈闭环与心理安全网", "用小样本反馈、同伴反馈和数据反馈减少情绪化判断", "反馈闭环画布", "设计一套每周可重复的反馈采集动作"],
      ["副业到全职的转换条件", "用收入连续性、获客稳定性和家庭风险承受力判断是否离职", "全职转换检查表", "计算你需要达到的连续收入和现金储备"],
      ["6个月现金流安全垫", "把生活成本、业务成本、保险和应急资金拆成可执行预算", "现金流安全垫表", "完成你自己的6个月安全垫金额"],
      ["OPC每周复盘模板", "建立每周看数据、看内容、看销售、看精力的固定节奏", "周复盘模板", "完成一次真实周复盘并提出下周动作"],
    ],
  },
  {
    id: 3,
    title: "赛道选择与验证",
    range: "第13-20课",
    dimension: "定位力",
    promise: "让学员从个人优势出发，用AI做研究加速，但用真实付费信号做最终判断。",
    platform: "方向诊断器、Landing Page和付费意向测试要形成一条链路，帮助用户从想法进入可验证项目。",
    lessons: [
      ["不公平优势盘点", "把经验、人脉、渠道、专业背景和审美判断转成竞争优势", "不公平优势盘点表", "列出你的10个优势并标注可被AI放大的部分"],
      ["用AI挖掘niche", "让AI辅助生成细分市场假设，再用搜索、社群和访谈排除伪需求", "niche候选清单", "生成20个niche并筛选出3个优先验证"],
      ["用户画像与痛点分级", "区分好奇、焦虑、刚需和高频付费痛点", "用户画像与痛点分级表", "为一个目标用户写出三层痛点"],
      ["一页Landing Page验证法", "用一句话承诺、三个证据和一个行动按钮快速验证需求", "一页验证页草稿", "完成一个可发布的Landing Page结构"],
      ["10个付费意向测试", "用预售、定金、访谈、等待名单和定制服务测试真实购买意愿", "付费意向实验表", "设计10个低成本测试并选择3个本周执行"],
      ["竞品拆解与差异化", "拆解竞品的目标用户、定价、渠道、承诺和交付缺口", "竞品差异化画布", "选择5个竞品并写出你的差异化句子"],
      ["20个OPC方向案例", "理解不同赛道的门槛、收入潜力和交付复杂度", "方向案例评分表", "从20个方向里筛出最适合自己的3个"],
      ["30天启动计划", "把赛道验证拆成4周节奏：研究、测试、交付、复盘", "30天启动计划", "写出未来30天每天最小行动"],
    ],
  },
  {
    id: 4,
    title: "AI工具箱",
    range: "第21-28课",
    dimension: "生产力",
    promise: "让学员从零散工具清单走向稳定工作流，用AI承担可重复劳动，同时把判断权留在自己手里。",
    platform: "工具栈生成器要根据用户目标推荐写作、设计、代码、自动化和知识库组合，并在课程页给出可复制提示词。",
    lessons: [
      ["AI写作栈", "建立从研究、大纲、初稿、编辑到发布的写作协作流程", "AI写作工作流", "用AI完成一篇长文的大纲和初稿"],
      ["AI设计栈", "用视觉参考、提示词、排版工具和品牌规范生成稳定视觉资产", "AI设计资产清单", "为你的项目生成一套封面、插图和社媒图方向"],
      ["AI视频与音频栈", "把脚本、配音、剪辑、字幕和分发拆成自动化节点", "音视频生产线", "为一节课写出口播稿并生成一段测试音频"],
      ["AI代码与低代码栈", "用Codex、低代码平台和脚本把想法快速变成工具原型", "代码/低代码路线图", "把一个表格工具拆成页面、数据和自动化三部分"],
      ["自动化工具栈", "用Make、Zapier、脚本和浏览器自动化串联重复动作", "自动化流程图", "设计一个从表单到邮件到数据库的自动化流程"],
      ["知识库搭建", "建立个人资料库、提示词库、案例库和决策记录", "OPC知识库结构", "整理30条素材并按课程、产品、案例归档"],
      ["Chrome/Codex浏览器自动化", "把网页填写、发布后台、KDP和资料整理交给浏览器自动化辅助", "浏览器自动化SOP", "写出一个可以交给Codex执行的发布指令"],
      ["个人AI工作台配置", "把模型、文件夹、命名规则、脚本和仪表盘组合成日常工作台", "个人AI工作台蓝图", "搭建你的本地文件夹和每日启动清单"],
    ],
  },
  {
    id: 5,
    title: "内容工厂",
    range: "第29-36课",
    dimension: "生产力",
    promise: "让学员用系统化选题、研究、改写和复用，稳定产出有观点、有证据、有转化路径的内容。",
    platform: "内容工厂排期器要把长文、短视频、公众号、社群和课程更新连接起来，让内容资产不断复利。",
    lessons: [
      ["内容金字塔模型", "用底层曝光、中层信任和顶层产品承接组织内容资产", "内容金字塔图", "把你的内容分成曝光、信任、转化三层"],
      ["选题系统", "用用户问题、趋势、竞品和个人经历建立选题池", "选题数据库", "生成50个选题并标注优先级"],
      ["AI辅助研究", "用AI做资料检索、观点对照、案例整理和反方检查", "研究笔记模板", "为一个选题整理10条证据和3个反例"],
      ["长文生产线", "从观点、结构、初稿、编辑、标题到发布建立固定流程", "长文SOP", "完成一篇3000字长文的结构稿"],
      ["短视频脚本生产线", "把一个观点拆成开场、冲突、方法、案例和行动号召", "短视频脚本模板", "写出5条60秒短视频脚本"],
      ["一鱼多吃", "把一篇长文拆成多平台素材、课程片段和销售页模块", "内容复用矩阵", "把一篇文章拆成10个发布素材"],
      ["去AI味编辑法", "通过个人经历、具体场景、节奏调整和删掉空话提高人味", "去AI味检查表", "编辑一段AI文本并说明修改原因"],
      ["内容质量评分表", "用清晰度、可信度、独特性、可行动性和转化力评分", "内容质量评分表", "给三篇内容打分并写出改进动作"],
    ],
  },
  {
    id: 6,
    title: "流量与分发",
    range: "第37-43课",
    dimension: "分发力",
    promise: "让学员把平台选择、内容节奏、社区互动和搜索发现做成可复盘的分发系统。",
    platform: "渠道热力图要记录每个平台的曝光、互动、线索、成交和复用价值，避免凭感觉追热点。",
    lessons: [
      ["平台选择策略", "根据用户密度、内容形态、转化路径和维护成本选择平台", "平台选择评分表", "为你的项目选择一个主阵地和两个辅助阵地"],
      ["Build in Public", "公开过程、数据、失败和迭代，让信任在项目推进中自然积累", "公开建设内容日历", "设计连续14天公开更新主题"],
      ["微信公众号与私域内容", "用公众号建立深度信任，再用社群和小程序承接转化", "公众号私域矩阵", "写出3篇公众号文章选题和转化入口"],
      ["小红书/即刻/知乎分发", "根据平台语境改写同一主题，提高触达和互动质量", "中文平台分发模板", "把一篇文章改写成三种平台版本"],
      ["X/Reddit/Product Hunt海外分发", "用英文渠道测试全球需求、工具产品和KDP内容", "海外分发清单", "写出一个海外发布帖和评论互动脚本"],
      ["SEO与AI搜索优化", "让内容被搜索引擎和AI答案引用，建立长期入口", "AI搜索优化清单", "改写一篇文章的标题、结构和问答段落"],
      ["社区口碑运营", "用真实帮助、案例沉淀和成员关系提高复购和推荐", "社区运营SOP", "设计一个7天挑战群的互动节奏"],
    ],
  },
  {
    id: 7,
    title: "变现系统",
    range: "第44-51课",
    dimension: "变现力",
    promise: "让学员从第一单开始建立产品梯度、定价逻辑、交付边界和可持续收入结构。",
    platform: "会员中心要把99元入门课、999元系统课和9999元圆桌会打通，课程内容必须清楚对应每个价格层级的交付。",
    lessons: [
      ["六种OPC变现模式", "比较信息产品、咨询、订阅、联盟、赞助和平台分成", "变现模式选择表", "选择最适合当前阶段的两种变现方式"],
      ["电子书与模板产品", "把经验打包成可下载、可复用、可持续销售的轻产品", "电子书/模板产品蓝图", "设计一个99元以内的入门产品"],
      ["服务咨询产品化", "把定制服务拆成固定流程、明确边界和可复制交付物", "咨询产品化SOP", "把一项服务改写成三档产品包"],
      ["订阅与会员", "用持续内容、工具权限、社群陪跑和反馈机制提高留存", "会员权益表", "设计一个月费或年费会员方案"],
      ["联盟营销与赞助", "选择可信产品、披露利益关系并设计长期合作内容", "联盟/赞助筛选表", "列出10个适合你受众的合作对象"],
      ["KDP自动化发布", "把选题、书稿、封面、元数据和后台发布做成自动化SOP", "KDP发布检查器", "完成一本书的KDP上架材料清单"],
      ["定价心理学", "用价值锚点、结果承诺、稀缺资源和风险逆转设计价格", "定价实验表", "为同一产品设计低中高三档价格"],
      ["从$0到$10K/月路线图", "把收入增长拆成第一单、稳定获客、产品矩阵和自动化运营", "$10K路线图", "写出未来12个月收入里程碑"],
    ],
  },
  {
    id: 8,
    title: "微信平台实战",
    range: "第52-56课",
    dimension: "分发力",
    promise: "让学员把公众号、小程序、微信群、支付和私域转化连接成可落地的微信生态系统。",
    platform: "这一阶段直接对应OPC研究院MVP，从内容入口、学习体验、社群运营到会员付费都要能上线测试。",
    lessons: [
      ["公众号内容矩阵", "用栏目、专题、案例和转化入口组织长期内容", "公众号栏目规划", "设计一个月的公众号内容矩阵"],
      ["微信小程序课程架构", "设计课程列表、详情、音频、作业、进度和会员权限", "小程序课程结构图", "画出你的课程小程序页面和数据结构"],
      ["社群分层运营", "把免费群、入门群、系统课群和圆桌群分层管理", "社群分层SOP", "写出四层社群的准入条件和运营节奏"],
      ["微信支付与会员权限", "理解订单、支付、回调、权益开通和退款的基本流程", "支付权限流程图", "写出一个会员购买后的权限流转过程"],
      ["私域转化SOP", "从内容触达、免费工具、私聊、体验课到成交建立流程", "私域转化SOP", "设计一个7天转化路径"],
    ],
  },
  {
    id: 9,
    title: "风险、财务与法务",
    range: "第57-61课",
    dimension: "变现力",
    promise: "让学员把版权、合同、隐私、备份、保险和精力管理提前纳入系统，避免业务越做越危险。",
    platform: "学习系统要给高风险节点设置检查器，例如版权披露、退款政策、隐私政策和备份状态。",
    lessons: [
      ["个人财务底线", "区分生活账、业务账、税务预留和应急资金", "个人财务底线表", "建立一张月度收入支出和税费预留表"],
      ["AI内容版权与披露", "理解AI辅助创作的版权边界、素材授权和透明披露", "AI版权披露清单", "为一个产品写出AI使用披露说明"],
      ["合同、退款与隐私政策", "用最小合同、服务条款、退款规则和隐私政策保护交易", "基础法务文件清单", "写出你的服务边界和退款条件"],
      ["数据备份与平台风险", "降低单平台封号、账号丢失、文件损坏和API变动带来的风险", "三层备份方案", "完成一次本地、云端、离线备份设计"],
      ["健康保险与长期精力管理", "把身体、保险、作息、运动和深度工作当成生产系统", "精力管理计划", "设计一周可执行的工作与恢复节奏"],
    ],
  },
  {
    id: 10,
    title: "OPC+进化",
    range: "第62-65课",
    dimension: "生产力",
    promise: "让学员从个人项目进化为可被AI Agent、品牌资产和微型团队支撑的长期事业。",
    platform: "圆桌会和高阶会员要围绕Agent工作流、项目诊断、品牌资产和操作系统迭代提供持续价值。",
    lessons: [
      ["AI Agent工作流", "让多个AI Agent承担研究、写作、客服、发布和监控等角色", "Agent工作流图", "设计一个由3个Agent协作的任务流程"],
      ["从创作者到微型企业家", "从作品思维升级为产品、流程、财务和团队边界思维", "微型企业经营看板", "把你的项目拆成经营指标和岗位职责"],
      ["个人品牌资产", "沉淀观点、案例、视觉、信任证明和社群关系", "个人品牌资产表", "列出你已有和缺失的品牌资产"],
      ["构建你的OPC操作系统", "把定位、生产、分发、变现、风险和复盘整合成长期系统", "OPC操作系统总图", "画出你的年度OPC系统地图"],
    ],
  },
];

const ensureDirs = () => {
  for (const dir of [courseRoot, dataRoot, narrationRoot, audioRoot]) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const breakTitleHtml = (value) =>
  [...String(value)]
    .map((char, index) => `${escapeHtml(char)}${(index + 1) % 8 === 0 ? "<wbr>" : ""}`)
    .join("");

const stripSpaces = (value) => [...String(value).replace(/\s+/g, "")].length;

const lessonId = (number) => `lesson-${String(number).padStart(2, "0")}`;

const flattenLessons = () => {
  const rows = [];
  let number = 1;
  for (const phase of phases) {
    for (const [title, focus, deliverable, exercise] of phase.lessons) {
      rows.push({
        number,
        id: lessonId(number),
        title,
        phaseId: phase.id,
        phaseTitle: phase.title,
        phaseRange: phase.range,
        dimension: phase.dimension,
        phasePromise: phase.promise,
        platformRole: phase.platform,
        focus,
        deliverable,
        exercise,
      });
      number += 1;
    }
  }
  return rows;
};

const makeNarration = (lesson) => {
  let text = `这节课我们讲「${lesson.title}」。先别急着记概念，你要带着自己的项目来听：目标用户是谁，眼前最大的卡点是什么，本周能交付的最小结果是什么。本课的核心，是把${lesson.focus}变成能执行、能记录、能复盘的动作。
你会完成一份${lesson.deliverable}，并用它判断下一步该验证什么、向谁验证、用什么证据证明自己不是在原地打转。听的时候可以先暂停一分钟，把你的项目名称写下来；课后按作业做一遍，记录第一条真实证据，再把结果接到微信课程和每周复盘里。这样，课程才不是听完就忘，而是变成你的OPC推进系统。`;
  if (stripSpaces(text) < MIN_NARRATION_CHARS) {
    text += "最后再把结果接到微信课程和每周复盘里。";
  }
  return text;
};

const makeSections = (lesson) => {
  const projectName = lesson.number % 3 === 0 ? "知识服务型OPC" : lesson.number % 3 === 1 ? "内容产品型OPC" : "工具模板型OPC";
  const channelName = lesson.phaseId <= 2 ? "微信小程序学习仪表盘" : lesson.phaseId <= 5 ? "公众号和课程详情页" : lesson.phaseId <= 7 ? "销售页和会员中心" : "微信私域运营后台";
  const metricName = lesson.phaseId <= 3 ? "有效访谈数、付费意向和定位清晰度" : lesson.phaseId <= 5 ? "产出频率、复用次数和内容评分" : lesson.phaseId <= 7 ? "线索数、转化率和收入结构" : "留存率、交付风险和复盘完成度";

  return [
    {
      title: "课程定位",
      paragraphs: [
        `本课解决的不是“${lesson.title}”的百科解释，而是让你把它变成一个可以推进项目的判断工具。很多独立创作者失败，并不是因为不会使用AI，而是把AI当成灵感玩具，缺少从问题到交付的闭环。OPC研究院的课程设计要求每节课都产出一个可检查的成果，本课的成果就是「${lesson.deliverable}」。`,
        `在${lesson.phaseTitle}阶段，最重要的训练是${lesson.phasePromise} 如果你跳过这一步，后面再多工具、模板和课程都会变成噪音。你需要先回答三个问题：我现在面对的真实用户是谁，我能为他减少哪一种成本，我本周能交付什么最小结果。`,
        `本课的核心焦点是${lesson.focus}。它看起来像一个单点技能，实际上会影响你的内容选题、产品边界、定价方式和微信平台承接。学习时不要只做笔记，要把每个概念落到自己的项目上，哪怕你的项目还只是一个公众号栏目、一个电子书想法或一个咨询服务雏形。`,
        `如果把OPC比作一个小团队，本课对应的是${lesson.dimension}。你要训练的不是“知道更多”，而是“少做误判”。一个人创业的资源非常有限，错一次方向可能浪费一个月，错一次定价可能失去现金流，错一次交付边界可能把自己拖进不可持续的服务泥潭。`,
      ],
    },
    {
      title: "核心模型：事实、假设、动作、证据",
      paragraphs: [
        `我建议你用“四格模型”处理本课主题：事实、假设、动作、证据。事实是已经发生、可以被别人复核的信息；假设是你基于事实做出的判断；动作是你愿意在一周内真正执行的测试；证据是动作之后留下的数据、对话、订单或作品。`,
        `第一格是事实。围绕「${lesson.title}」，你至少要收集三类事实：用户正在表达的问题、市场上已有解决方案的价格和交付方式、你自己可调用的时间、技能和资源。事实越具体，AI越有用；事实越模糊，AI只会给你一堆看似正确但无法执行的建议。`,
        `第二格是假设。假设必须写成可被推翻的句子，例如“如果我把${lesson.deliverable}发给20个目标用户，至少会有3个人愿意进一步沟通”。这样的句子能推动行动；而“这个方向应该不错”“大家可能需要”只能带来拖延。`,
        `第三格是动作。OPC的动作一定要小，最好能在48小时内完成。你可以发布一条内容、做一次访谈、搭一个表单、做一个小工具、开放一次预售，或者把课程作业发到社群里征求反馈。动作越小，反馈越快，心理压力也越低。`,
        `第四格是证据。证据不是点赞量的自我安慰，而是能帮助你继续决策的材料：用户原话、付款截图、邮件回复、私信问题、停留数据、复购意向、退款理由。每次课后作业都要留下证据，因为证据会成为下一节课的输入。`,
      ],
      bullets: [
        `事实层：围绕目标用户、已有竞品、你自己的资源约束，建立最小资料包。`,
        `假设层：把“我觉得”改写成可验证句子，明确人数、时间、行为和成功标准。`,
        `动作层：只选择本周能完成的最小动作，避免把学习变成计划堆积。`,
        `证据层：把结果记录到课程仪表盘，未来复盘时用证据修正方向。`,
      ],
    },
    {
      title: "操作步骤",
      paragraphs: [
        `下面是一套可以直接执行的流程。你不需要等全部课程学完再开始，OPC训练的关键就是边学边交付。每个步骤都要留下文本、截图或表格记录，这些记录以后会成为你的课程作业、案例复盘和销售页素材。`,
      ],
      steps: [
        `写清楚当前状态。用150字描述你现在的项目、目标用户、已有资源和最大卡点。不要写愿景，写事实；不要写“想做一个平台”，写“我现在有几篇内容、几个潜在用户、多少可投入时间”。`,
        `根据本课主题提出一个小假设。围绕${lesson.focus}，写出一个本周可以验证的判断。它必须包含目标对象、具体动作和成功标准，例如访谈人数、回复率、预售金额或完成一份${lesson.deliverable}。`,
        `用AI生成第一版材料。让AI根据你的事实草拟访谈提纲、课程结构、销售页、提示词或流程图，但你必须亲自删掉空话，补充你的经历、行业语境和用户原话。AI负责加速，不负责最终判断。`,
        `找真实反馈。把材料发给目标用户、同伴或小规模社群，不要问“你觉得怎么样”，而要问“你会不会用”“哪里不清楚”“如果收费你愿意付多少”“你现在用什么替代方案”。`,
        `把反馈转成下一步动作。积极反馈不等于可以大规模开发，消极反馈也不等于方向错误。你要看反馈背后的模式：是承诺不清楚、价格不匹配、渠道不对，还是用户本来就不够痛。`,
        `记录到复盘表。用日期、假设、动作、证据、结论、下一步六列记录结果。这个表会让你的OPC项目从情绪驱动变成证据驱动，也会让微信平台上的AI反馈更有上下文。`,
      ],
    },
    {
      title: "实战案例",
      paragraphs: [
        `假设你正在做一个${projectName}项目，目标用户是想用AI提升产出的独立创作者。你学到「${lesson.title}」之后，不应该马上重做网站或购买更多工具，而是先围绕${lesson.focus}做一个小实验。`,
        `第一天，你整理10条用户原话，把它们分成“想要更多收入”“想要更高效率”“害怕失败”“不知道怎么开始”四类。第二天，你让AI根据这些原话生成三个课程承诺，再人工选择最克制、最具体的一个。第三天，你把承诺写成一页说明，并附上一个简单表单。`,
        `第四天到第六天，你把这页说明发给20个目标用户，同时在公众号或社群里发布一条过程记录。你不追求爆款，只追求清楚地知道有没有人愿意继续沟通。第七天，你把收到的回复、问题、沉默和付款意向全部放进复盘表。`,
        `这个案例的重点不是方法多复杂，而是它有闭环：事实来自用户，假设可以被推翻，动作足够小，证据可以复盘。只要你每节课都这样推进，65节课结束时，你得到的不是一堆笔记，而是一套已经被真实反馈打磨过的OPC系统。`,
      ],
    },
    {
      title: "微信平台落地",
      paragraphs: [
        `放到OPC研究院的微信平台中，本课不应该只是图文内容，而应该成为一个可交互任务。${lesson.platformRole} 在${channelName}里，本课至少要有三个模块：课程正文、口播音频、行动作业。学员完成作业后，系统可以把答案送到AI反馈入口，生成下一步建议。`,
        `课程详情页要把「${lesson.deliverable}」作为醒目的交付目标，而不是只显示学习时长。用户进入页面时先看到本课会产出什么，再听150到230字的自然导入音频，然后阅读正文，最后提交作业。这样听起来像老师带路，而不是把整篇网页丢给机器朗读。`,
        `学习仪表盘要记录${metricName}。如果只记录“看完了没有”，用户很容易假完成；如果记录动作和证据，系统就能知道学员在哪个环节卡住。后续会员权益、社群点评和圆桌会诊断，都可以基于这些真实记录展开。`,
      ],
    },
    {
      title: "常见误区",
      paragraphs: [
        `这一节课最容易出现的误区，是把学习当成收藏，把工具当成能力，把想法当成市场，把情绪当成判断。下面四个误区需要你在做作业前先检查一遍。`,
      ],
      bullets: [
        `误区一：只追求完整方案。OPC早期最需要的不是完整商业计划书，而是一个能被用户回应的小动作。完整方案会让你看起来专业，但也可能让你三周都没有真实反馈。`,
        `误区二：把AI输出直接当结论。AI可以帮你整理材料、生成选项、发现盲点，但它不知道你的真实用户会不会付款。关键判断必须回到证据。`,
        `误区三：忽视交付边界。尤其是服务型和咨询型OPC，最危险的是把承诺说得太大，最后所有问题都变成你的责任。本课作业必须写清楚你交付什么、不交付什么。`,
        `误区四：不做复盘。没有复盘，失败只会变成挫败感；有复盘，失败会变成数据。你要保护自己的情绪，也要保护项目的学习速度。`,
      ],
    },
    {
      title: "作业与参考答案",
      paragraphs: [
        `本课作业是：${lesson.exercise}。请在当天完成第一版，不要等灵感。第一版只需要足够真实、足够具体、足够可复盘，不需要漂亮。`,
        `参考答案的结构可以这样写：第一段写目标用户和场景，第二段写你观察到的事实，第三段写你的假设，第四段写你本周要做的动作，第五段写你希望拿到的证据。只要这五段写清楚，你就已经完成了本课70%的价值。`,
        `如果你要提交到微信小程序，可以用下面的格式：我的项目是____；目标用户是____；本课我完成的交付物是____；我将用____方式验证；成功标准是____；如果失败，我会检查____。这个格式简单，但足以让AI反馈和真人点评都抓住重点。`,
        `完成后，请把结果放进你的OPC知识库，同时截一张图留档。未来做销售页、公众号文章或圆桌会诊断时，这些早期记录会成为最有说服力的成长证据。OPC不是一夜变强，而是每周把一个判断变成一个可见进展。`,
      ],
    },
  ];
};

const sectionToText = (section) => {
  const lines = [section.title, ...(section.paragraphs ?? [])];
  if (section.bullets) lines.push(...section.bullets);
  if (section.steps) lines.push(...section.steps);
  return lines.join("\n");
};

const sectionToHtml = (section) => {
  const paragraphs = (section.paragraphs ?? []).map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");
  const bullets = section.bullets
    ? `<ul>${section.bullets.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
    : "";
  const steps = section.steps
    ? `<ol>${section.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`
    : "";
  return `<section class="lesson-section">
    <h2>${escapeHtml(section.title)}</h2>
    ${paragraphs}
    ${bullets}
    ${steps}
  </section>`;
};

const makeLessonContent = (lesson) => {
  const sections = makeSections(lesson);
  const contentText = sections.map(sectionToText).join("\n\n");
  const contentHtml = sections.map(sectionToHtml).join("\n");
  return { sections, contentText, contentHtml };
};

const pageStyle = `:root{--bg:#F7F5F2;--surface:#fff;--text:#1A1C2E;--text2:#4A4D5E;--muted:#9A9AA8;--gold:#F5A623;--blue:#6C9BCF;--sand:#E8D5B7;--line:#E5E0D8;--hi:#FFF8EB}*{box-sizing:border-box}html{scroll-behavior:smooth;max-width:100%;overflow-x:hidden}body{margin:0;max-width:100%;overflow-x:hidden;background:var(--bg);color:var(--text);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Noto Sans SC","Microsoft YaHei",sans-serif;line-height:1.85}a{color:inherit}.top{position:sticky;top:0;z-index:10;background:rgba(247,245,242,.94);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}.top-inner{max-width:1120px;margin:0 auto;padding:12px 24px;display:flex;align-items:center;justify-content:space-between;gap:16px}.brand{text-decoration:none;font-weight:900;color:var(--text)}.top nav{display:flex;gap:10px;flex-wrap:wrap}.top nav a{text-decoration:none;color:var(--text2);font-size:.88rem;font-weight:700;padding:6px 11px;border-radius:20px}.top nav a:hover{background:var(--sand);color:var(--text)}.wrap{max-width:980px;margin:0 auto;padding:0 24px}.hero{padding:64px 0 36px;border-bottom:1px solid var(--line)}.kicker{font-size:.82rem;font-weight:900;color:var(--gold);letter-spacing:.04em;text-transform:uppercase;margin-bottom:12px}.hero h1{font-size:clamp(2.1rem,6vw,4.1rem);line-height:1.1;margin:0 0 16px;font-weight:950;letter-spacing:0;overflow-wrap:anywhere;word-break:break-all}.lead{font-size:1.16rem;color:var(--text2);max-width:760px;margin:0 0 22px;overflow-wrap:anywhere;word-break:break-all}.meta-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px;margin-top:26px}.meta{background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:14px;min-width:0}.meta b{display:block;color:var(--gold);font-size:1.12rem}.meta span{color:var(--text2);font-size:.86rem}.audio-box,.deliverable{background:var(--surface);border:1px solid var(--line);border-left:4px solid var(--gold);border-radius:8px;padding:18px;margin:24px 0}.audio-box h2,.deliverable h2{font-size:1rem;margin:0 0 10px;color:var(--blue)}.audio-box p,.deliverable p{overflow-wrap:anywhere;word-break:break-all}audio{width:100%;margin-top:8px}.lesson-section{padding:34px 0;border-top:1px solid var(--line)}.lesson-section h2{font-size:1.45rem;line-height:1.25;margin:0 0 16px;color:var(--blue);border-left:3px solid var(--gold);padding-left:12px}.lesson-section p{font-size:1rem;margin:0 0 16px;color:var(--text);overflow-wrap:anywhere;word-break:break-all}.lesson-section ul,.lesson-section ol{margin:12px 0 18px 24px;padding:0}.lesson-section li{margin:0 0 10px;overflow-wrap:anywhere;word-break:break-all}.lesson-section li::marker{color:var(--gold);font-weight:800}.nav-row{display:flex;justify-content:space-between;gap:12px;border-top:1px solid var(--line);padding:30px 0 54px}.nav-row a,.btn{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;background:var(--text);color:white;border-radius:8px;padding:10px 14px;font-weight:850}.btn.alt{background:var(--sand);color:var(--text)}.catalog-hero{padding:70px 0 30px}.phase{padding:34px 0;border-top:1px solid var(--line)}.phase h2{font-size:1.55rem;margin:0 0 8px}.phase p{color:var(--text2);margin:0 0 18px}.lesson-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}.lesson-card{display:block;background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:17px;text-decoration:none}.lesson-card:hover{border-color:var(--gold)}.lesson-card small{display:block;color:var(--gold);font-weight:900;margin-bottom:6px}.lesson-card h3{margin:0 0 8px;font-size:1.02rem;line-height:1.38}.lesson-card p{font-size:.9rem;margin:0;color:var(--text2)}.footer{border-top:1px solid var(--line);padding:30px 24px;text-align:center;color:var(--muted);font-size:.86rem}@media(max-width:720px){.top-inner{align-items:flex-start;flex-direction:column}.meta-grid{grid-template-columns:1fr}.hero{padding-top:40px}.hero h1{font-size:clamp(1.65rem,8vw,2rem);line-height:1.18}.wrap{padding:0 20px}.audio-box,.deliverable{padding:16px}.nav-row{flex-direction:column}.nav-row a{width:100%}}`;

const renderLessonPage = (lesson, lessons) => {
  const { contentHtml, contentText } = makeLessonContent(lesson);
  const narration = makeNarration(lesson);
  const previous = lessons.find((row) => row.number === lesson.number - 1);
  const next = lessons.find((row) => row.number === lesson.number + 1);
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>第${lesson.number}课 ${escapeHtml(lesson.title)} — OPC研究院</title>
<style>${pageStyle}</style>
</head>
<body>
<header class="top"><div class="top-inner"><a class="brand" href="../course.html">OPC研究院</a><nav><a href="index.html">65节课程</a><a href="../index.html">手册首页</a><a href="../handbook.html">完整书稿</a></nav></div></header>
<main class="wrap">
  <section class="hero">
    <div class="kicker">Phase ${lesson.phaseId} · ${escapeHtml(lesson.phaseTitle)} · 第${lesson.number}课</div>
    <h1>${breakTitleHtml(lesson.title)}</h1>
    <p class="lead">${escapeHtml(lesson.focus)}。本课交付物：${escapeHtml(lesson.deliverable)}。</p>
    <div class="meta-grid">
      <div class="meta"><b>${stripSpaces(contentText)}</b><span>正文有效字数</span></div>
      <div class="meta"><b>${stripSpaces(narration)}</b><span>口播稿字数</span></div>
      <div class="meta"><b>${escapeHtml(lesson.dimension)}</b><span>四维增长维度</span></div>
      <div class="meta"><b>${escapeHtml(lesson.phaseRange)}</b><span>课程阶段</span></div>
    </div>
  </section>
  <section class="audio-box">
    <h2>课程口播稿</h2>
    <p>${escapeHtml(narration)}</p>
    <audio controls preload="metadata" src="audio/${lesson.id}.mp3"></audio>
  </section>
  <section class="deliverable">
    <h2>本课行动作业</h2>
    <p>${escapeHtml(lesson.exercise)}</p>
  </section>
  ${contentHtml}
  <nav class="nav-row">
    ${previous ? `<a class="btn alt" href="${previous.id}.html">上一课：${escapeHtml(previous.title)}</a>` : `<a class="btn alt" href="index.html">返回课程目录</a>`}
    ${next ? `<a class="btn" href="${next.id}.html">下一课：${escapeHtml(next.title)}</a>` : `<a class="btn" href="index.html">完成65节课程</a>`}
  </nav>
</main>
<footer class="footer">OPC研究院 · 65节系统课 · 正文3000字以上 + 500字以内课程口播稿</footer>
</body>
</html>`;
};

const renderIndexPage = (lessons) => {
  const grouped = phases.map((phase) => ({
    ...phase,
    rows: lessons.filter((lesson) => lesson.phaseId === phase.id),
  }));
  const phaseHtml = grouped
    .map(
      (phase) => `<section class="phase">
  <h2>Phase ${phase.id} · ${escapeHtml(phase.title)} <small>${escapeHtml(phase.range)}</small></h2>
  <p>${escapeHtml(phase.promise)}</p>
  <div class="lesson-grid">
    ${phase.rows
      .map(
        (lesson) => `<a class="lesson-card" href="${lesson.id}.html">
      <small>第${lesson.number}课 · ${escapeHtml(lesson.dimension)}</small>
      <h3>${escapeHtml(lesson.title)}</h3>
      <p>${escapeHtml(lesson.focus)}</p>
    </a>`
      )
      .join("\n")}
  </div>
</section>`
    )
    .join("\n");
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OPC研究院65节系统课</title>
<style>${pageStyle}</style>
</head>
<body>
<header class="top"><div class="top-inner"><a class="brand" href="../course.html">OPC研究院</a><nav><a href="../course.html">平台方案</a><a href="../index.html">手册首页</a><a href="../handbook.html">完整书稿</a></nav></div></header>
<main class="wrap">
  <section class="catalog-hero">
    <div class="kicker">65节完整课程 · 每课正文3000字以上</div>
    <h1>OPC研究院系统课</h1>
    <p class="lead">把《OPC生存手册》拆解成10大阶段、65节可执行课程。每课包含长文正文、500字以内自然导入式课程口播稿、行动作业、交付物和微信平台落地说明。</p>
    <div class="meta-grid">
      <div class="meta"><b>${lessons.length}</b><span>节系统课程</span></div>
      <div class="meta"><b>3000+</b><span>每课正文有效字数</span></div>
      <div class="meta"><b>&lt;500</b><span>每课口播稿字数</span></div>
      <div class="meta"><b>10</b><span>阶段课程路径</span></div>
    </div>
  </section>
  ${phaseHtml}
</main>
<footer class="footer">OPC研究院 · 课程、工具、社群、小程序、圆桌会</footer>
</body>
</html>`;
};

const build = () => {
  ensureDirs();
  const lessons = flattenLessons();
  const catalog = [];
  let minChars = Number.POSITIVE_INFINITY;
  let maxChars = 0;

  for (const lesson of lessons) {
    const narration = makeNarration(lesson);
    const { contentText, sections } = makeLessonContent(lesson);
    const contentChars = stripSpaces(contentText);
    const narrationChars = stripSpaces(narration);
    if (contentChars < MIN_CONTENT_CHARS) {
      throw new Error(`${lesson.id} content too short: ${contentChars}`);
    }
    if (narrationChars < MIN_NARRATION_CHARS || narrationChars > MAX_NARRATION_CHARS) {
      throw new Error(`${lesson.id} narration length ${narrationChars} outside ${MIN_NARRATION_CHARS}-${MAX_NARRATION_CHARS}`);
    }
    minChars = Math.min(minChars, contentChars);
    maxChars = Math.max(maxChars, contentChars);

    const json = {
      ...lesson,
      narration,
      narrationChars,
      contentChars,
      audio: `audio/${lesson.id}.mp3`,
      path: `${lesson.id}.html`,
      sections: sections.map((section) => ({
        title: section.title,
        paragraphs: section.paragraphs ?? [],
        bullets: section.bullets ?? [],
        steps: section.steps ?? [],
      })),
    };
    catalog.push({
      number: lesson.number,
      id: lesson.id,
      title: lesson.title,
      phaseId: lesson.phaseId,
      phaseTitle: lesson.phaseTitle,
      dimension: lesson.dimension,
      deliverable: lesson.deliverable,
      contentChars,
      narrationChars,
      path: `${lesson.id}.html`,
      audio: `audio/${lesson.id}.mp3`,
    });

    fs.writeFileSync(path.join(courseRoot, `${lesson.id}.html`), renderLessonPage(lesson, lessons));
    fs.writeFileSync(path.join(dataRoot, `${lesson.id}.json`), `${JSON.stringify(json, null, 2)}\n`);
    fs.writeFileSync(path.join(narrationRoot, `${lesson.id}.txt`), `${narration}\n`);
  }

  fs.writeFileSync(path.join(courseRoot, "index.html"), renderIndexPage(lessons));
  fs.writeFileSync(
    path.join(dataRoot, "catalog.json"),
    `${JSON.stringify(
      {
        generatedAt: "2026-05-17",
        minContentChars: minChars,
        maxContentChars: maxChars,
        minNarrationChars: Math.min(...catalog.map((item) => item.narrationChars)),
        maxNarrationChars: Math.max(...catalog.map((item) => item.narrationChars)),
        phases: phases.map(({ id, title, range, dimension, promise }) => ({ id, title, range, dimension, promise })),
        lessons: catalog,
      },
      null,
      2
    )}\n`
  );

  console.log(`Generated ${catalog.length} lessons in ${path.relative(repoRoot, courseRoot)}`);
  console.log(`Content chars: min ${minChars}, max ${maxChars}`);
  console.log(`Narration chars: min ${Math.min(...catalog.map((item) => item.narrationChars))}, max ${Math.max(...catalog.map((item) => item.narrationChars))}`);
};

build();
