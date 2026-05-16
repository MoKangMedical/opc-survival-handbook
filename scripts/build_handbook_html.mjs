import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const chapters = [
  {
    id: "ch1",
    num: "第1章",
    emoji: "🌍",
    title: "一个人的时代来了",
    tagline: "为什么现在是一个人就能做成事的黄金时代",
    image: "assets/illustrations/chapter-01-one-person-era.png",
    sections: [
      {
        title: "1.1 什么是OPC（One Person Creator）",
        body: `
          <p>OPC，全称 One Person Creator，指的是一个人借助AI工具完成过去需要一个小团队才能完成的创作、产品、营销、交付和商业闭环。它不是“一个人硬扛所有工作”，而是把AI变成你的研究员、编辑、设计助理、代码搭档、运营助理和数据分析师。</p>
          <p>传统自由职业者通常只出售自己的时间：写一篇文章、做一张图、接一个项目。OPC的区别在于，它要把个人能力做成可重复售卖的资产：电子书、课程、模板、微型SaaS、自动化服务、付费社群、Newsletter、KDP书籍。你仍然是一个人，但你的产出不再只等于每天可工作的小时数。</p>
          <p>判断自己是否走在OPC路径上，可以看三个指标：第一，你有没有一个清晰的目标用户；第二，你有没有一个可以被反复销售或反复获客的产品化载体；第三，你有没有把AI放进稳定流程，而不是偶尔拿来写一段文案。</p>
          <div class="data-grid">
            <div class="data-card"><div class="number">1人</div><div class="desc">核心决策者</div></div>
            <div class="data-card"><div class="number">5-10个</div><div class="desc">AI与自动化角色</div></div>
            <div class="data-card"><div class="number">1个闭环</div><div class="desc">从获客到交付</div></div>
          </div>
          <p>OPC可以粗略分为三类。内容型OPC靠文章、视频、播客、Newsletter和书籍建立信任；产品型OPC把方法论、模板、软件、素材包和工具打包出售；服务型OPC仍然提供服务，但用AI把调研、草稿、交付和售后流程标准化。</p>
          <div class="action-box"><strong>本节输出：</strong>用一句话写下你的OPC定义：“我帮助[目标用户]用[方法/工具]解决[具体痛点]，并通过[产品形态]收费。”</div>
        `,
      },
      {
        title: "1.2 AI重构了“生产成本”",
        body: `
          <p>过去，一个人想做专业级产出，最大的障碍不是想法，而是生产成本。写作要编辑，设计要设计师，网站要工程师，视频要剪辑，营销要运营。每一个角色都意味着沟通成本、等待成本和现金成本。</p>
          <p>AI把许多中间环节压缩成了“提示词 + 人工判断 + 快速迭代”。这并不代表专业岗位不再重要，而是代表新手验证想法的门槛被大幅降低。你不必先凑齐一个团队，才能知道市场是否需要你的东西。</p>
          <div class="table-wrap"><table>
            <tr><th>环节</th><th>过去的门槛</th><th>现在的OPC做法</th><th>关键变化</th></tr>
            <tr><td>调研</td><td>问卷、访谈、行业报告</td><td>AI整理公开讨论、竞品评论、搜索词</td><td>更快发现需求语言</td></tr>
            <tr><td>写作</td><td>独立完成初稿与编辑</td><td>AI出结构和初稿，人做判断与案例</td><td>从“写不出来”变成“改得更好”</td></tr>
            <tr><td>设计</td><td>依赖设计师排期</td><td>AI生成方向，模板工具完成落地</td><td>验证阶段不再卡在视觉</td></tr>
            <tr><td>开发</td><td>需要完整工程团队</td><td>Cursor、v0、低代码工具做MVP</td><td>功能先验证，再决定是否重构</td></tr>
            <tr><td>分发</td><td>手工改写多平台内容</td><td>AI批量改写，但人工把关语气</td><td>一次创作，多次分发</td></tr>
          </table></div>
          <p>成本下降以后，创业的顺序也变了。旧顺序是“先投入、再发布、再等反馈”；OPC顺序是“先表达、先预售、先验证，再决定投入多少”。你不需要第一次就做完美版本，你需要第一次就让市场说话。</p>
        `,
      },
      {
        title: "1.3 传统创业 vs OPC创业",
        body: `
          <figure class="book-visual inline-visual"><img src="assets/infographics/traditional-vs-opc.png" alt="传统创业与OPC创业对比图"></figure>
          <p>OPC不是传统创业的低配版，而是另一种组织方式。传统创业追求的是“先组织资源，再扩大市场”；OPC追求的是“先验证需求，再逐步叠加资源”。一个更像公司，一个更像高杠杆个人工作台。</p>
          <div class="table-wrap"><table>
            <tr><th>维度</th><th>传统创业</th><th>OPC创业</th></tr>
            <tr><td>团队规模</td><td>多人协作，依赖管理</td><td>一人决策，AI辅助执行</td></tr>
            <tr><td>启动资金</td><td>办公室、工资、外包、市场预算</td><td>订阅工具、域名、少量广告测试</td></tr>
            <tr><td>试错速度</td><td>需要会议、排期、预算审批</td><td>当天写页面，当天收集反馈</td></tr>
            <tr><td>风险结构</td><td>资金链、团队、股权、合规</td><td>个人精力、孤独、平台依赖</td></tr>
            <tr><td>增长方式</td><td>招聘和资本驱动</td><td>内容资产、自动化和AI杠杆驱动</td></tr>
          </table></div>
          <p>OPC的优势是启动快、决策快、现金消耗低；它的劣势是上限容易被个人精力、认知和分发能力卡住。因此，本书不会鼓励你永远一个人做所有事，而是先让你掌握“一人闭环”的能力，再判断什么时候该引入外包、合作伙伴或真实团队。</p>
          <blockquote>你不是在逃离公司，而是在学习把自己变成一个更轻、更快、更接近用户的商业系统。</blockquote>
        `,
      },
    ],
  },
  {
    id: "ch2",
    num: "第2章",
    emoji: "🧗",
    title: "心态：OPC的第一道生死线",
    tagline: "80%的独立创作者不是输给能力，而是输给长期无人反馈的心理压力",
    image: "assets/illustrations/chapter-02-mindset.png",
    sections: [
      {
        title: "2.1 自由的反面是孤独",
        body: `
          <p>刚开始做OPC时，“没人管我”会让人兴奋。几周后，你会发现它也意味着没人替你定目标，没人提醒你优先级，没人判断你是否在逃避困难任务，也没人每月准时发工资。自由不是没有约束，而是你必须自己设计约束。</p>
          <p>孤独最容易在三个时刻出现：产品发出后没人反馈；连续几周没有收入；看到别人发布增长截图而自己原地踏步。这些时刻会让人怀疑方向、怀疑能力，甚至怀疑自己是否适合独立工作。</p>
          <p>解决孤独不能只靠意志力。你需要外部结构：固定的工作节奏、固定的复盘时间、固定的同行交流、固定的用户访谈。OPC要主动制造反馈，不然大脑会用焦虑填补空白。</p>
          <div class="action-box"><strong>最低心理配置：</strong>每周一次用户交流、一次同行交流、一次财务复盘、一次公开进展发布。四件事都很小，但能把你从“一个人胡思乱想”拉回现实。</div>
        `,
      },
      {
        title: "2.2 四种必死心态",
        body: `
          <p><strong>第一种：准备完美再出发。</strong>OPC最贵的不是工具订阅，而是你花三个月打磨一个没人要的东西。完美主义通常不是高标准，而是害怕被市场评价。</p>
          <p><strong>第二种：什么都想做。</strong>AI让你“看起来”可以同时做书、课程、SaaS、短视频和社群。但早期真正稀缺的是注意力。你可以用AI扩展产能，但不能用AI扩展判断力。</p>
          <p><strong>第三种：做出来就会有人买。</strong>产品只是入场券，分发才是让用户看见你的路。很多OPC失败不是因为产品差，而是从来没有认真设计获客路径。</p>
          <p><strong>第四种：AI会替我负责。</strong>AI可以生成内容，不能替你承担定位错误、用户误解、承诺过度和交付失败的后果。你可以把执行交给AI，但责任必须留在自己手里。</p>
          <div class="highlight-box"><div class="label">判断题</div><p>如果你连续两周都在“优化Logo、换工具、研究课程”，却没有和一个真实用户说话，你大概率不是在准备，而是在逃避。</p></div>
        `,
      },
      {
        title: "2.3 构建你的心理安全网",
        body: `
          <p>心理安全网由三部分组成：钱、关系和节奏。钱解决生存恐惧，关系解决信息孤岛，节奏解决自我消耗。缺任何一块，OPC都容易在低谷期崩盘。</p>
          <ul>
            <li><strong>现金安全网：</strong>至少准备6个月生活费。没存够之前，不建议全职做OPC。你可以从副业开始，把收入曲线跑出来再转身。</li>
            <li><strong>关系安全网：</strong>加入一个高质量创作者群或找两位同行作为复盘伙伴。你需要的是诚实反馈，不是互相安慰。</li>
            <li><strong>节奏安全网：</strong>每天有固定深度工作块，每周有固定发布动作，每月有固定收入复盘。节奏会在情绪不稳定时保护你。</li>
          </ul>
          <p>不要把“坚持”理解成一直做同一件事。真正的坚持是持续接触市场，持续修正判断，持续把能力转化为资产。</p>
        `,
      },
      {
        title: "2.4 OPC生存心法三原则",
        body: `
          <div class="highlight-box">
            <div class="label">三条铁律</div>
            <p><strong>先卖再做：</strong>在投入大块时间前，先拿到明确意向、等待名单、预售订单或付费咨询。</p>
            <p><strong>小步快跑：</strong>每周发布一个小版本，每月完成一次大复盘。不要把半年赌在一个未验证方向上。</p>
            <p><strong>用AI做杠杆：</strong>把AI用于研究、初稿、改写、制图、自动化；把自己用于判断、品味、共情和承诺。</p>
          </div>
          <p>这三条听起来简单，但它们会改变你的工作方式。你会从“我要做一个伟大产品”变成“我要用最小成本发现真实需求”；从“我今天有没有努力”变成“我今天有没有推进闭环”；从“我会不会被AI替代”变成“我能不能成为最会使用AI的人”。</p>
          <div class="action-box"><strong>今日练习：</strong>选择一个想法，用200字写出预售文案，发给5个可能需要它的人。不要解释太多，只问：“如果我做出来，你愿意付多少钱？”</div>
        `,
      },
    ],
  },
  {
    id: "ch3",
    num: "第3章",
    emoji: "🎯",
    title: "找到你的一人帝国",
    tagline: "选对赛道，你已经赢了80%；选错赛道，再努力也是白费",
    image: "assets/illustrations/chapter-03-niche.png",
    sections: [
      {
        title: "3.1 如何发现你的“不公平优势”",
        body: `
          <p>不公平优势不是“我比所有人都强”，而是你在某个具体场景里比目标用户更懂问题、比同行更接近用户、比新手更能交付结果。它可能来自职业经历、行业知识、语言能力、人脉、审美、失败经验，甚至来自你长期受困于某个问题。</p>
          <p>AI会放大这种优势，但不会凭空制造它。一个懂财务的人用AI做报表自动化，比一个完全不懂财务的人更有判断力；一个做过海外运营的人用AI写多语言内容，比只会翻译的人更懂渠道差异。</p>
          <p>寻找方向时，不要只问“什么赚钱”，要问四个问题：我能持续讲什么？我解决过什么痛点？谁愿意为这个结果付费？AI在哪个环节能把我的效率放大十倍？四个答案重叠的区域，就是你的早期赛道。</p>
          <div class="action-box"><strong>优势清单：</strong>列出3项技能、3段经历、3个你熟悉的圈层、3个你愿意长期研究的问题。然后让AI帮你组合出10个细分方向。</div>
        `,
      },
      {
        title: "3.2 用AI挖掘niche",
        body: `
          <p>AI最适合帮你做“发散”和“归纳”：发散出你没想到的细分人群，归纳出用户反复表达的痛点。但AI给出的方向不能直接照抄，你要用真实市场信号校验。</p>
          <blockquote>提示词：我擅长[技能A]和[技能B]，熟悉[行业/人群]。请找出10个竞争不充分但需求稳定的细分市场。每个方向说明：目标用户、紧急痛点、现有替代方案、用户愿意付费的理由、AI可放大的环节、首个MVP形态。</blockquote>
          <p>拿到列表后，做第二轮筛选。优先选择“痛点高频、结果可量化、交付可模板化、获客渠道明确”的方向。不要选择只让你兴奋、却找不到付费人群的方向。</p>
          <div class="table-wrap"><table>
            <tr><th>筛选维度</th><th>好方向</th><th>危险方向</th></tr>
            <tr><td>痛点</td><td>用户已经在花钱解决</td><td>用户只是觉得“有意思”</td></tr>
            <tr><td>交付</td><td>可以形成模板、流程、工具</td><td>每次都要从零定制</td></tr>
            <tr><td>获客</td><td>知道用户在哪些社区聚集</td><td>目标用户很模糊</td></tr>
            <tr><td>AI杠杆</td><td>研究、生成、交付可自动化</td><td>AI只能做表面包装</td></tr>
          </table></div>
        `,
      },
      {
        title: "3.3 快速验证三步法",
        body: `
          <p>验证不是问朋友“你觉得这个想法怎么样”。大多数朋友会礼貌支持，但不会掏钱。真正的验证必须让用户付出成本：留下邮箱、预约通话、预付定金、转发给同事、花时间试用。</p>
          <ol>
            <li><strong>一页落地页：</strong>写清楚目标用户、痛点、解决方案、交付物、价格和等待名单。页面不需要复杂，重点是让陌生人能在30秒内理解你卖什么。</li>
            <li><strong>50个精准曝光：</strong>把落地页发给目标用户聚集的社区、朋友圈、邮件列表或小额广告。不要追求大流量，先追求精准反馈。</li>
            <li><strong>10个强信号：</strong>10个等待名单、3个深聊用户、1个付费订单，都比100个点赞更有价值。</li>
          </ol>
          <p>验证失败也有价值。它告诉你文案不清楚、用户不急、价格不对，或者渠道不匹配。OPC的优势就是低成本试错，失败一次只损失几天，而不是几个月工资。</p>
        `,
      },
      {
        title: "3.4 20个已验证的OPC方向",
        body: `
          <p>下面的方向不是让你照单全收，而是作为“组合素材”。真正适合你的方向，往往是其中一个品类加上你的行业经验、语言能力、渠道资源或审美偏好。</p>
          <div class="table-wrap"><table>
            <tr><th>方向</th><th>首个产品形态</th><th>AI杠杆</th><th>难度</th></tr>
            <tr><td>AI写作服务</td><td>行业文章包、Newsletter代写</td><td>调研、初稿、改写</td><td>低</td></tr>
            <tr><td>KDP细分书籍</td><td>低内容书、指南书、双语书</td><td>大纲、正文、排版、元数据</td><td>低</td></tr>
            <tr><td>Notion模板</td><td>项目管理、学习、财务模板</td><td>结构设计、说明文案</td><td>低</td></tr>
            <tr><td>AI课程制作</td><td>微课、训练营、企业内训</td><td>课纲、讲稿、测验</td><td>中</td></tr>
            <tr><td>社媒代运营</td><td>月度内容包</td><td>选题、改写、多平台适配</td><td>中</td></tr>
            <tr><td>数据分析咨询</td><td>仪表盘、报告、自动化模板</td><td>清洗、分析、可视化</td><td>中</td></tr>
            <tr><td>AI应用定制</td><td>内部工具、客服助手、知识库</td><td>代码生成、测试、文档</td><td>高</td></tr>
            <tr><td>提示词产品</td><td>行业Prompt包、工作流库</td><td>生成、测试、整理</td><td>中</td></tr>
          </table></div>
          <div class="action-box"><strong>选择规则：</strong>优先选你能在7天内做出样品、30天内拿到第一单、90天内形成复购或订阅的方向。</div>
        `,
      },
    ],
  },
  {
    id: "ch4",
    num: "第4章",
    emoji: "🧰",
    title: "AI工具箱：搭建你的虚拟团队",
    tagline: "工具不是越多越好，而是每个岗位都有清晰职责",
    image: "assets/illustrations/chapter-04-ai-toolbox.png",
    sections: [
      {
        title: "4.1 内容创作栈",
        body: `
          <figure class="book-visual inline-visual"><img src="assets/infographics/ai-tools-matrix.png" alt="AI工具选择矩阵"></figure>
          <p>内容创作栈的目标不是让AI替你表达，而是让你把思考从“打字速度”中解放出来。AI负责收集资料、整理结构、生成多个角度，你负责判断哪个角度值得说、哪些案例真实、哪些观点足够锋利。</p>
          <div class="table-wrap"><table>
            <tr><th>角色</th><th>推荐工具</th><th>使用方式</th></tr>
            <tr><td>研究员</td><td>ChatGPT、Perplexity、Claude</td><td>整理资料、提炼争议、生成问题清单</td></tr>
            <tr><td>编辑</td><td>Claude、ChatGPT</td><td>扩写初稿、检查逻辑、统一语气</td></tr>
            <tr><td>设计助理</td><td>Canva、Midjourney、DALL-E</td><td>封面、配图、社媒卡片</td></tr>
            <tr><td>视频助理</td><td>CapCut、Runway、Descript</td><td>脚本、字幕、剪辑、复用</td></tr>
          </table></div>
          <p>新手最容易犯的错是频繁换工具。工具换得越多，越容易把进步误解成“学习新软件”。更好的做法是先固定一个写作模型、一个设计工具、一个知识库、一个分发流程，用30天跑完闭环再升级。</p>
        `,
      },
      {
        title: "4.2 效率自动化栈",
        body: `
          <p>自动化的价值不在于炫技，而在于减少重复动作。OPC每天都会遇到大量低价值任务：复制链接、整理评论、生成摘要、同步表格、改写平台文案、归档灵感。它们单次只要几分钟，但会持续打断深度工作。</p>
          <ul>
            <li><strong>知识流：</strong>浏览器收藏、阅读笔记、语音想法自动进入Notion或Obsidian，再由AI每周汇总。</li>
            <li><strong>内容流：</strong>一篇长文生成微博、小红书、X、Newsletter和短视频脚本版本。</li>
            <li><strong>销售流：</strong>用户购买后自动发送交付邮件、收集反馈、加入更新名单。</li>
            <li><strong>发布流：</strong>用Chrome中的Codex插件辅助填写KDP、Gumroad等后台信息，人工只确认定价、版权和最终提交。</li>
          </ul>
          <p>自动化优先处理“规则清楚、重复频繁、出错成本低”的任务。不要一开始就自动化复杂决策。先让流程稳定跑十次，再把其中最烦的步骤交给工具。</p>
        `,
      },
      {
        title: "4.3 产品开发栈",
        body: `
          <p>产品开发分三层：无代码、AI辅助代码、工程化代码。早期验证优先无代码，因为你需要的是速度而不是架构；当用户开始付费、反馈稳定，再逐步迁移到更可维护的实现。</p>
          <p><strong>无代码层：</strong>Carrd、Notion、Airtable、Glide、Tally足够完成落地页、表单、会员目录、轻量数据库和交付页面。它们适合验证需求，不适合承载复杂业务。</p>
          <p><strong>AI辅助代码层：</strong>Cursor、v0、Bolt、Replit可以帮你快速做MVP。你需要学会读懂生成代码、拆小需求、跑测试、回滚错误，而不是盲目复制。</p>
          <p><strong>工程化层：</strong>当产品开始产生稳定收入，才需要认真处理权限、支付、日志、备份、监控和安全。这个阶段可以找外包或合伙工程师，但你最好已经懂基本产品逻辑。</p>
        `,
      },
      {
        title: "4.4 三大AI工作流模板",
        body: `
          <div class="highlight-box"><div class="label">工作流1：日更内容</div><p>记录一个真实观察 → AI扩展成5个角度 → 选择最有张力的角度 → 生成平台版本 → 人工加入故事和判断 → 发布并记录反馈。</p></div>
          <div class="highlight-box"><div class="label">工作流2：周更Newsletter</div><p>收集一周资料 → AI聚类主题 → 生成大纲 → 你写核心观点 → AI补充例子和标题 → 发送前人工删掉空话。</p></div>
          <div class="highlight-box"><div class="label">工作流3：月产一本KDP书</div><p>选定细分读者 → AI生成大纲 → 逐章扩写 → 人工加入案例、观点和检查清单 → 脚本排版PDF → Codex插件辅助填写KDP后台。</p></div>
          <p>工作流的核心是“固定输入、固定步骤、固定输出”。只要流程稳定，你就可以优化其中每个环节；如果每次都重新发明流程，你永远会停留在忙乱状态。</p>
        `,
      },
    ],
  },
  {
    id: "ch5",
    num: "第5章",
    emoji: "🏭",
    title: "内容工厂：规模化输出体系",
    tagline: "不是写更多，而是系统化地写更聪明",
    image: "assets/illustrations/chapter-05-content-factory.png",
    sections: [
      {
        title: "5.1 内容金字塔模型",
        body: `
          <p>内容金字塔的底层是高频、低成本的短内容；中层是每周一次的深度内容；顶层是可收费的信息产品。一个健康的OPC内容系统，不是每天凭灵感发东西，而是让底层素材自然沉淀成上层资产。</p>
          <div class="highlight-box">
            <p><strong>每日：</strong>观察、短帖、截图、复盘、问题。目标是测试表达和积累素材。</p>
            <p><strong>每周：</strong>长文、视频、Newsletter、案例拆解。目标是建立信任和搜索入口。</p>
            <p><strong>每月：</strong>电子书、模板、课程、工具包。目标是把信任转化为收入。</p>
          </div>
          <p>不要把短内容看成“低级内容”。它是市场传感器。哪条短帖被收藏，哪句话引发评论，哪类问题被反复追问，都在告诉你下一篇长文和下一个产品应该做什么。</p>
        `,
      },
      {
        title: "5.2 AI辅助生产线",
        body: `
          <p>一条可复用的内容生产线通常包括六步：捕捉、筛选、研究、成稿、改写、分发。AI可以参与每一步，但每一步的人类职责不同。</p>
          <ol>
            <li><strong>捕捉：</strong>把灵感、用户问题、评论、读书摘录统一放进知识库。</li>
            <li><strong>筛选：</strong>让AI按“用户痛点、争议性、可操作性、商业价值”打分。</li>
            <li><strong>研究：</strong>让AI列出反方观点、案例类型和缺失数据。</li>
            <li><strong>成稿：</strong>AI生成结构，你补充真实经历和判断。</li>
            <li><strong>改写：</strong>AI把长文拆成不同平台版本。</li>
            <li><strong>分发：</strong>固定发布时间、标题模板、复盘表格。</li>
          </ol>
          <p>这条生产线越稳定，你越能把“写作”从情绪活动变成运营系统。灵感仍然重要，但不再是唯一燃料。</p>
        `,
      },
      {
        title: "5.3 一鱼多吃",
        body: `
          <p>一鱼多吃不是机械复制，而是根据不同平台的阅读场景重写同一个核心观点。Newsletter读者愿意看完整推理，短视频观众需要冲突开场，小红书读者需要步骤和结果，X读者更容易转发强观点。</p>
          <div class="table-wrap"><table>
            <tr><th>原始资产</th><th>可拆出的内容</th><th>注意点</th></tr>
            <tr><td>3000字长文</td><td>5条短帖、1个视频脚本、1张信息图、1封邮件</td><td>每个平台重写开头</td></tr>
            <tr><td>用户访谈</td><td>痛点清单、案例故事、FAQ、销售页文案</td><td>隐去隐私信息</td></tr>
            <tr><td>产品教程</td><td>短视频、帮助文档、课程片段、社群答疑</td><td>保持步骤一致</td></tr>
            <tr><td>月度复盘</td><td>Build in Public帖、Newsletter、下一版产品路线</td><td>说具体数据，不说空话</td></tr>
          </table></div>
          <p>当你开始按资产思维工作，每次创作都会留下复利。今天的一篇文章，可能三个月后变成一本书的一章、一门课的一节、一个销售页的核心段落。</p>
        `,
      },
      {
        title: "5.4 质量与效率的黄金比例",
        body: `
          <p>“80% AI + 20% 人工”不是固定公式，而是提醒你：AI负责速度，人负责密度。AI写出的内容通常结构完整但缺少真实细节，语气流畅但观点保守。你的任务是加入案例、取舍、反直觉判断和具体承诺。</p>
          <p>去掉AI味的四个方法：第一，加入你亲历的失败或犹豫；第二，用具体数字代替形容词；第三，写出你不同意什么；第四，删掉所有“在当今时代、至关重要、全面赋能”这类空话。</p>
          <div class="action-box"><strong>质量检查：</strong>每篇内容发布前问自己：有没有一个真实场景？有没有一个可执行动作？有没有一个清晰判断？有没有一句读者愿意划线保存的话？</div>
        `,
      },
    ],
  },
  {
    id: "ch6",
    num: "第6章",
    emoji: "📡",
    title: "流量和分发：让世界找到你",
    tagline: "最好的产品没人知道，就等于不存在",
    image: "assets/illustrations/chapter-06-distribution.png",
    sections: [
      {
        title: "6.1 平台选择策略",
        body: `
          <p>平台选择不要从“哪里流量大”开始，而要从“目标用户在哪里做决定”开始。娱乐内容可以追平台热度，专业产品必须追购买场景。用户在小红书被种草，在Google搜索解决方案，在Reddit问真实体验，在Newsletter里建立长期信任。</p>
          <div class="table-wrap"><table>
            <tr><th>目标</th><th>优先平台</th><th>内容形态</th></tr>
            <tr><td>建立专业信任</td><td>Newsletter、公众号、LinkedIn</td><td>长文、案例、观点</td></tr>
            <tr><td>快速测试选题</td><td>X、即刻、小红书</td><td>短帖、图文、复盘</td></tr>
            <tr><td>获取搜索流量</td><td>个人网站、Medium、知乎</td><td>教程、对比、清单</td></tr>
            <tr><td>产品发布</td><td>Product Hunt、社群、邮件列表</td><td>发布帖、演示、优惠</td></tr>
          </table></div>
          <p>早期只选两个主阵地：一个用于高频测试，一个用于长期沉淀。否则你会把时间浪费在适配格式上，而不是理解用户。</p>
        `,
      },
      {
        title: "6.2 Build in Public",
        body: `
          <p>Build in Public不是每天晒努力，而是公开你的判断过程、实验结果、失败原因和下一步计划。它的价值在于降低信任成本：读者不是突然看到一个销售页，而是一路看见你如何把问题做深。</p>
          <p>可公开的内容包括：为什么选择这个方向，今天学到什么，用户反馈了什么，哪个假设被推翻，收入和转化数据如何变化。不要只晒好消息，适度公开失败会让你更可信。</p>
          <div class="highlight-box"><div class="label">每周公开模板</div><p>本周目标是什么；实际完成了什么；最意外的用户反馈是什么；下周要验证哪个假设；需要读者帮忙什么。</p></div>
          <p>AI可以把工作日志整理成发布草稿，但最后必须由你加入真实语气。Build in Public最怕“运营感”，读者想看的是一个真实的人如何做决策。</p>
        `,
      },
      {
        title: "6.3 SEO和AI搜索优化",
        body: `
          <p>传统SEO关注关键词排名，AI搜索优化更关注“你的内容是否足够清晰、结构化、可信，能被模型摘要和引用”。这要求你的文章像答案库一样组织：明确问题、给出步骤、包含表格、更新日期、案例和边界条件。</p>
          <ul>
            <li><strong>标题像问题：</strong>“如何用AI做一本KDP书”比“我的创作心得”更容易被检索。</li>
            <li><strong>结构像手册：</strong>H2/H3、列表、表格、FAQ让搜索系统更容易理解。</li>
            <li><strong>内容像经验：</strong>加入具体流程、截图、失败记录和成本，避免泛泛而谈。</li>
            <li><strong>页面像资产：</strong>每篇长文都应该能长期带来搜索流量，而不是只在发布当天有效。</li>
          </ul>
          <p>OPC的长期护城河不是爆款，而是能被持续发现的内容资产库。</p>
        `,
      },
      {
        title: "6.4 社区和口碑",
        body: `
          <p>社区不是广告位，而是信任场。你不能一进群就卖东西，应该先回答问题、分享过程、给出资源、连接人。真正的口碑来自“这个人确实懂，而且愿意帮忙”。</p>
          <p>高质量社区参与有三个原则：少发链接，多发解决方案；少说自己产品，多说用户问题；少追求点赞，多追踪私信和深聊。一个精准私信可能比一千个泛流量点赞更接近收入。</p>
          <div class="action-box"><strong>社区动作：</strong>选择3个目标用户所在社区，连续30天每天回答一个问题。把被反复问到的问题整理成你的下一篇长文或产品FAQ。</div>
        `,
      },
    ],
  },
  {
    id: "ch7",
    num: "第7章",
    emoji: "💰",
    title: "变现：从第一块钱到稳定月入",
    tagline: "不赚钱的创作，是昂贵的爱好",
    image: "assets/illustrations/chapter-07-monetization.png",
    sections: [
      {
        title: "7.1 六种OPC变现模式",
        body: `
          <p>变现不是最后一步，而是从定位开始就要考虑的商业闭环。你不需要一开始就追求复杂商业模式，最稳妥的路线是先用服务或信息产品拿到第一笔钱，再逐步产品化、订阅化和自动化。</p>
          <div class="table-wrap"><table>
            <tr><th>模式</th><th>产品形态</th><th>适合阶段</th><th>优势</th></tr>
            <tr><td>信息产品</td><td>电子书、课程、模板、素材包</td><td>早期</td><td>交付简单、利润高</td></tr>
            <tr><td>服务咨询</td><td>1v1、顾问、代运营</td><td>早期</td><td>最快拿钱、最快理解用户</td></tr>
            <tr><td>订阅</td><td>Newsletter、会员、SaaS</td><td>中期</td><td>收入稳定、有复利</td></tr>
            <tr><td>联盟营销</td><td>工具推荐、资源清单</td><td>中期</td><td>低交付成本</td></tr>
            <tr><td>广告赞助</td><td>Newsletter、播客、视频广告位</td><td>有受众后</td><td>不影响主产品</td></tr>
            <tr><td>平台分成</td><td>KDP、YouTube、课程平台</td><td>长期</td><td>渠道自带搜索和推荐</td></tr>
          </table></div>
          <p>早期最推荐“服务 + 信息产品”组合。服务帮你理解真实需求，信息产品帮你沉淀方法论。不要一开始就做订阅，除非你已经能稳定提供持续价值。</p>
        `,
      },
      {
        title: "7.2 定价心理学",
        body: `
          <p>新手最常见的问题是低估价值。你会觉得自己只是整理了一套模板、写了一本电子书、录了几节课，但用户购买的不是文件本身，而是少走弯路、节省时间、降低不确定性。</p>
          <ul>
            <li><strong>结果定价：</strong>不要按你花了多少时间定价，要按用户能节省多少成本、获得多少结果定价。</li>
            <li><strong>分层定价：</strong>基础版卖文件，进阶版加案例和更新，高价版加咨询或社群。</li>
            <li><strong>锚定价格：</strong>先展示高价值方案，再给主力方案。用户需要参照物判断价格是否合理。</li>
            <li><strong>早鸟价格：</strong>早期可以低价换反馈，但要明确这是限时验证价，不要永久低价。</li>
          </ul>
          <p>定价不是一次性决定，而是持续实验。每卖出10单复盘一次：购买理由是什么，退款理由是什么，用户是否主动转介绍，是否有更高价需求。</p>
        `,
      },
      {
        title: "7.3 从$0到$10K/月的四阶段路线图",
        body: `
          <figure class="book-visual inline-visual"><img src="assets/infographics/monetization-roadmap.png" alt="OPC变现路线图"></figure>
          <p>月入$10K不是靠一个爆款突然实现，而是四个阶段逐步叠加：验证、优化、规模、多元。每个阶段的核心任务不同，提前做下一阶段的事，往往会让你分心。</p>
          <div class="phase-row">
            <div class="phase-card"><div class="p-title">Phase 1 · 验证</div><div class="p-meta">0-3个月 | $0-500</div><p>目标是第一单，不是完美产品。</p></div>
            <div class="phase-card"><div class="p-title">Phase 2 · 优化</div><div class="p-meta">3-6个月 | $500-1.5K</div><p>目标是稳定获客和产品迭代。</p></div>
            <div class="phase-card"><div class="p-title">Phase 3 · 规模</div><div class="p-meta">6-12个月 | $2K-5K</div><p>目标是内容工厂和渠道复利。</p></div>
            <div class="phase-card"><div class="p-title">Phase 4 · 多元</div><div class="p-meta">12-24个月 | $5K-10K+</div><p>目标是产品矩阵和自动化运营。</p></div>
          </div>
          <p>每个阶段只盯一个主指标。第一阶段盯付费意向，第二阶段盯转化率，第三阶段盯稳定流量，第四阶段盯系统收益。指标越少，行动越清楚。</p>
        `,
      },
      {
        title: "7.4 收款和税务基础",
        body: `
          <p>收款和税务不是等你赚到很多钱再处理的问题。只要你开始对外销售，就应该把个人消费、业务收入和业务支出分开。混在一起会让你无法判断真实利润，也会在报税时增加麻烦。</p>
          <p><strong>国内销售：</strong>可以从个体户、微信/支付宝商户、小报童等低门槛方式开始。收入增长后，再咨询会计是否需要公司主体、发票和更规范的账务。</p>
          <p><strong>海外销售：</strong>Gumroad、KDP、Stripe、Payoneer、Wise等工具能解决大部分收款问题，但不同国家和平台的税务表格、预扣税、版权声明要求不同。提交前要阅读平台后台最新说明。</p>
          <div class="action-box"><strong>财务习惯：</strong>每月底导出平台收入、广告支出、工具订阅、外包费用，用AI做一页利润表。你不能优化自己看不见的东西。</div>
        `,
      },
    ],
  },
  {
    id: "ch8",
    num: "第8章",
    emoji: "🛡️",
    title: "生存底线：财务、法务与风险控制",
    tagline: "OPC可以活得精彩，但不能活得危险",
    image: "assets/illustrations/chapter-08-risk.png",
    sections: [
      {
        title: "8.1 个人财务底线",
        body: `
          <p>OPC最大的财务风险不是亏损，而是现金流断裂导致你在错误时间做错误决定。钱不够时，你会接不合适的客户、低价出售产品、放弃长期内容资产，最后被短期压力牵着走。</p>
          <ul>
            <li><strong>6个月生活费：</strong>房租、食物、保险、交通、家庭责任全部算进去。没存够之前，把OPC当副业。</li>
            <li><strong>业务预算：</strong>工具订阅、域名、广告测试、外包设计都要有月度上限。不要为了“提升效率”无限买工具。</li>
            <li><strong>收入缓冲：</strong>好月份不要全部花掉，把超出平均值的部分存入税费和淡季账户。</li>
            <li><strong>退出条件：</strong>提前写清楚什么情况下暂停、转向或回到主业。情绪低谷时不要临时决定人生大事。</li>
          </ul>
          <p>财务安全不是保守，而是给你试错的自由。没有安全垫的自由职业，很容易变成更焦虑的打工。</p>
        `,
      },
      {
        title: "8.2 法务避坑清单",
        body: `
          <p>OPC常见法务风险集中在版权、合同、隐私和承诺边界。尤其使用AI后，你更要保留人工创作痕迹、素材来源、修改记录和授权文件。</p>
          <div class="table-wrap"><table>
            <tr><th>风险</th><th>常见错误</th><th>建议做法</th></tr>
            <tr><td>AI内容版权</td><td>直接出售纯AI生成内容</td><td>加入人工结构、案例、编辑记录，明确AI参与方式</td></tr>
            <tr><td>素材授权</td><td>随便使用网络图片和字体</td><td>使用可商用素材，保留授权链接或购买记录</td></tr>
            <tr><td>服务合同</td><td>只在聊天里约定交付</td><td>明确范围、次数、付款、版权、退款和延期条件</td></tr>
            <tr><td>隐私合规</td><td>收邮箱但没有隐私政策</td><td>写清收集内容、用途、退订和删除方式</td></tr>
            <tr><td>收益承诺</td><td>宣传“保证赚钱”</td><td>用案例说明，不承诺个体收益</td></tr>
          </table></div>
          <p>本书不是法律意见。只要涉及大额合同、海外公司、税务居民、商标和版权纠纷，就应该咨询专业人士。AI可以帮你准备问题清单，但不能替代律师和会计。</p>
        `,
      },
      {
        title: "8.3 风险和备份",
        body: `
          <p>OPC常常把所有东西放在一个平台、一个账号、一个工具、一个硬盘里。这很危险。真正的资产必须可迁移、可备份、可恢复。</p>
          <ul>
            <li><strong>渠道备份：</strong>平台账号之外，一定要有邮件列表或自有网站。平台流量是租来的，邮件列表才更接近你的资产。</li>
            <li><strong>数据备份：</strong>代码进GitHub，文档进云盘，本地硬盘定期备份。每季度做一次完整恢复测试。</li>
            <li><strong>工具备份：</strong>不要把所有流程绑死在一个AI工具。至少准备一个替代模型和一个离线导出方案。</li>
            <li><strong>声誉备份：</strong>不要为了短期销售夸大结果。个人品牌一旦透支，修复成本极高。</li>
          </ul>
          <div class="action-box"><strong>备份日：</strong>每月最后一天导出知识库、销售数据、用户列表和源文件，存到两个不同位置。</div>
        `,
      },
    ],
  },
  {
    id: "ch9",
    num: "第9章",
    emoji: "🧘",
    title: "肉身生存：健康与精力管理",
    tagline: "你的身体是唯一的固定资产，别把它折旧太快",
    image: "assets/illustrations/chapter-09-health.png",
    sections: [
      {
        title: "9.1 一个人工作的时间管理",
        body: `
          <p>OPC的时间看起来完全属于自己，但这恰恰是风险。没有会议、没有同事、没有上下班边界，你很容易在一天里同时做研究、写作、回消息、改网页、刷数据，最后感觉很忙但没有推进关键结果。</p>
          <p>最简单的时间结构是“三块制”：上午深度工作，下午浅度运营，晚上学习和恢复。深度工作只做影响收入和资产的事情：写核心内容、做产品、设计销售页、处理关键用户反馈。浅度运营处理邮件、社媒、排版、数据整理。</p>
          <div class="highlight-box"><div class="label">推荐日程</div><p>09:00-12:00 深度产出；14:00-16:00 分发和运营；16:30-17:30 复盘和学习。晚上不做重大决策。</p></div>
          <p>不要用“我今天工作了12小时”评价自己。OPC只看有效产出：是否发布，是否验证，是否收钱，是否沉淀资产。</p>
        `,
      },
      {
        title: "9.2 身体是1，其他是0",
        body: `
          <p>独立创作者最容易忽视身体，因为没人要求你休息。你可以连续熬夜赶项目，也可以一天不出门，但这些债会以注意力下降、情绪波动、判断失真和慢性疼痛的方式还回来。</p>
          <ul>
            <li><strong>运动：</strong>每天至少30分钟低强度活动。散步比完美健身计划更容易长期坚持。</li>
            <li><strong>睡眠：</strong>固定起床时间比偶尔早睡更重要。不要在睡前处理销售数据和争议评论。</li>
            <li><strong>饮食：</strong>用固定健康餐减少决策成本。OPC不需要每天研究吃什么。</li>
            <li><strong>屏幕：</strong>每45分钟站起5分钟，眼睛看远处。身体不是外设，是主机。</li>
          </ul>
          <p>你可以让AI规划训练和饮食，但执行必须足够简单。复杂计划通常无法坚持，能重复的计划才有价值。</p>
        `,
      },
      {
        title: "9.3 社交和情绪",
        body: `
          <p>AI可以陪你聊天，但不能替代真实关系。长期只和模型、数据、平台反馈互动，会让你对人的复杂性失去敏感度，而OPC最重要的能力之一恰恰是理解真实用户。</p>
          <p>每周至少安排一次面对面交流：和同行吃饭、参加线下活动、去联合办公空间、约用户访谈。它不只是社交，更是校准现实。很多困住你的问题，在和真人讲出来后会变得清楚。</p>
          <p>情绪低谷时，不要立刻做战略决策。先睡觉、运动、复盘数据、找同行聊，再决定是否转向。很多“我要放弃”的冲动，其实只是累了。</p>
          <div class="action-box"><strong>红线：</strong>如果连续两周睡眠明显变差、对所有反馈都防御、对收入极度焦虑，请暂停扩张，先恢复身体和节奏。</div>
        `,
      },
    ],
  },
  {
    id: "ch10",
    num: "第10章",
    emoji: "🚀",
    title: "进化：从OPC到OPC+",
    tagline: "你的终点不是一个人硬扛，而是一个人驾驭一组AI与资产",
    image: "assets/illustrations/chapter-10-opc-plus.png",
    sections: [
      {
        title: "10.1 什么时候该“雇佣”AI而非真人",
        body: `
          <p>当收入增长后，你会自然想到招人。但招人不是万能解法。一个新人会带来沟通、培训、管理、质量控制和现金流压力。很多时候，你真正需要的不是员工，而是更清晰的流程和更好的自动化。</p>
          <div class="table-wrap"><table>
            <tr><th>任务类型</th><th>优先AI</th><th>优先真人</th></tr>
            <tr><td>重复、规则清楚</td><td>是，例如改写、整理、归档</td><td>通常不需要</td></tr>
            <tr><td>需要审美判断</td><td>AI出方向</td><td>真人做最终选择</td></tr>
            <tr><td>复杂用户沟通</td><td>AI准备资料</td><td>真人处理关系和冲突</td></tr>
            <tr><td>战略决策</td><td>AI列选项和风险</td><td>你承担决定</td></tr>
            <tr><td>专业合规</td><td>AI准备问题</td><td>律师、会计等专业人士确认</td></tr>
          </table></div>
          <p>原则很简单：先把流程写清楚，再考虑自动化；先榨干AI能力，再考虑雇人；先让收入覆盖成本，再扩大固定开支。</p>
        `,
      },
      {
        title: "10.2 从创作者到微型企业家",
        body: `
          <p>创作者关注作品，企业家关注系统。OPC的进化，就是从“我今天产出了什么”转向“这个系统是否能持续产生价值”。你需要开始管理产品线、渠道、用户关系、现金流、品牌和数据。</p>
          <p>微型企业家的标志不是员工数量，而是你是否拥有可复用资产：一个能带来搜索流量的网站，一个能转化的邮件序列，一个能持续更新的产品，一个能自动交付的购买流程，一个能复盘的仪表盘。</p>
          <ul>
            <li>把重复交付写成SOP。</li>
            <li>把常见问题写成FAQ和帮助文档。</li>
            <li>把一次性服务提炼成模板或课程。</li>
            <li>把用户反馈沉淀到产品路线图。</li>
          </ul>
          <p>当你开始这样工作，收入增长不再完全依赖每天多工作几个小时，而依赖资产和流程的复利。</p>
        `,
      },
      {
        title: "10.3 打造个人品牌资产",
        body: `
          <p>个人品牌不是包装，而是稳定预期。读者看到你的名字，就知道你关注什么问题、用什么标准判断、能提供什么价值、不会做什么事。稳定预期会降低每次销售的解释成本。</p>
          <p>品牌资产由三件事构成：持续输出、明确立场、可靠交付。持续输出让人记住你，明确立场让人区分你，可靠交付让人信任你。三者缺一不可。</p>
          <p>AI可以帮你维护品牌声音。把你过去20篇内容喂给AI，让它总结你的常用句式、观点边界、禁用表达和读者画像，再把这份“品牌声音指南”用于之后的内容检查。</p>
          <div class="action-box"><strong>品牌句式：</strong>“我长期研究[领域]，帮助[人群]用[方法]获得[结果]。我相信[核心观点]，反对[常见误区]。”</div>
        `,
      },
      {
        title: "10.4 OPC的未来",
        body: `
          <p>未来的OPC不会只是“会用AI写文章的人”，而是能设计AI工作流、组合工具、管理数据、理解用户、做商业判断的人。AI越强，越会放大人的方向感和品味差异。</p>
          <p>真正不可替代的能力有三种。第一是品味：知道什么好，什么只是看起来完整。第二是共情：理解用户没有说出口的焦虑和限制。第三是勇气：在信息不完整时做选择，并承担后果。</p>
          <p>如果AI能让每个人都更快地产出内容，那么稀缺的就不是内容数量，而是可信度、真实经验、持续交付和清晰判断。OPC的护城河最终不是“我会用哪个工具”，而是“我能持续创造别人愿意信任和购买的结果”。</p>
          <div class="highlight-box"><div class="label">结语</div><p>你不是在和AI竞争，而是在和不会使用AI的人、不会理解用户的人、不会持续交付的人竞争。一个人并不意味着弱小。一个人，加上一套清晰流程、一组AI工具、一批真实用户和一份长期主义，可以成为非常锋利的商业形态。</p></div>
        `,
      },
    ],
  },
];

const appendices = `
<section class="appendix" id="appendix-kdp">
  <div class="container">
    <h2>附录A：Codex插件辅助KDP发布SOP</h2>
    <p>手工发布KDP书籍最消耗时间的不是上传文件，而是重复填写分类、描述、关键词、作者信息、版权声明、纸张规格、预览检查和定价。Codex插件适合处理低风险、重复性的浏览器操作，但最终提交前必须人工确认。</p>
    <div class="highlight-box">
      <div class="label">推荐指令</div>
      <p>Chrome，请帮我把当前我写完的书籍发布到亚马逊KDP。请读取项目中的KDP PDF、封面文件和书籍元数据，自动填写分类、描述、关键词和上传文件。定价、版权声明和最终提交前必须停下来让我确认。</p>
    </div>
    <ol>
      <li>准备内页PDF、封面图、书名、副标题、作者名、简介、关键词和分类候选。</li>
      <li>登录KDP后台，进入新建书籍页面。</li>
      <li>让Codex插件自动填写低风险字段：标题、描述、关键词、分类、上传文件。</li>
      <li>人工确认高风险字段：AI内容披露、版权声明、区域授权、定价、预览器检查、最终提交。</li>
      <li>提交后记录ASIN、审核状态、上线日期和后续优化项。</li>
    </ol>
  </div>
</section>
<section class="appendix" id="appendix-30day">
  <div class="container">
    <h2>附录B：OPC 30天启动清单</h2>
    <figure class="book-visual"><img src="assets/infographics/30-day-checklist.png" alt="OPC 30天启动清单"></figure>
    <p>不要试图一天完成所有事。OPC早期最重要的是连续性：每天一个可完成动作，30天后你至少会拥有方向、工具、样品、发布记录和第一批反馈。</p>
  </div>
</section>`;

function renderChapter(chapter) {
  return `
<div class="container">
<article class="chapter" id="${chapter.id}">
  <div class="chapter-header"><span class="chapter-num">${chapter.num}</span><span class="chapter-emoji">${chapter.emoji}</span></div>
  <h2>${chapter.title}</h2>
  <p class="tagline">${chapter.tagline}</p>
  <figure class="book-visual chapter-art"><img src="${chapter.image}" alt="${chapter.title} 章节题图"></figure>
  ${chapter.sections.map((section) => `
  <div class="section">
    <h3>${section.title}</h3>
    ${section.body}
  </div>`).join("\n")}
</article>
</div>`;
}

function css() {
  return `
:root{--bg:#F7F5F2;--card:#FFFFFF;--text:#1A1C2E;--text2:#4A4D5E;--gold:#F5A623;--blue:#6C9BCF;--sand:#E8D5B7;--accent:#1A1C2E;--divider:#E5E0D8;--tag-bg:#EDE8DF;--highlight:#FFF8EB}
.dark{--bg:#0F0F14;--card:#1A1C24;--text:#E8E6E0;--text2:#B4B4C4;--divider:#2A2A35;--tag-bg:#25252F;--highlight:#1A1A20;--accent:#F7F5F2}
*{margin:0;padding:0;box-sizing:border-box}
html,body{max-width:100%;overflow-x:hidden}
body{font-family:'Inter','Noto Sans SC','PingFang SC','Microsoft YaHei',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:var(--bg);color:var(--text);line-height:1.82;transition:background .25s,color .25s}
.container{max-width:880px;margin:0 auto;padding:0 26px}
.top-nav{position:fixed;top:0;left:0;right:0;background:color-mix(in srgb,var(--bg) 88%,transparent);z-index:100;border-bottom:1px solid var(--divider);padding:12px 24px;display:flex;justify-content:space-between;align-items:center;backdrop-filter:blur(10px)}
.top-nav .logo{font-weight:850;color:var(--accent);font-size:.95rem}
.top-nav button{background:var(--tag-bg);border:none;color:var(--text);padding:7px 14px;border-radius:18px;cursor:pointer;font-size:.85rem;margin-left:8px}
.top-nav button:hover{background:var(--gold);color:#fff}
.cover{min-height:100vh;display:grid;grid-template-columns:minmax(280px,440px) minmax(280px,1fr);gap:52px;align-items:center;padding:96px 7vw 64px;background:radial-gradient(circle at 70% 45%,rgba(108,155,207,.18),transparent 38%),linear-gradient(180deg,var(--bg),var(--highlight))}
.cover-text h1{font-size:clamp(2.4rem,5vw,4.8rem);font-weight:950;line-height:1.08;color:var(--accent);margin-bottom:18px}
.cover-text .subtitle{font-size:clamp(1.05rem,2vw,1.45rem);color:var(--text2);margin-bottom:28px;max-width:620px;overflow-wrap:anywhere}
.cover .badge{display:inline-flex;background:var(--gold);color:#fff;padding:7px 20px;border-radius:999px;font-size:.9rem;font-weight:750;margin-bottom:30px}
.cover .cta{font-size:.95rem;color:var(--text2);opacity:.82}
.cover-img{margin:0;filter:drop-shadow(0 26px 42px rgba(26,28,46,.22))}
.cover-img img{width:100%;max-height:76vh;object-fit:contain;border-radius:8px}
.toc{background:var(--card);border-radius:14px;padding:34px;margin:46px 0;border:1px solid var(--divider)}
.toc h2{font-size:1.45rem;margin-bottom:22px;color:var(--accent)}
.toc ol{list-style:none;counter-reset:toc}
.toc li{counter-increment:toc;margin-bottom:8px}
.toc a{color:var(--text);text-decoration:none;display:flex;align-items:baseline;gap:12px;padding:7px 0;border-bottom:1px solid transparent}
.toc a:hover{color:var(--gold);border-bottom-color:var(--gold)}
.toc a::before{content:counter(toc,decimal-leading-zero);font-size:.76rem;font-weight:850;color:var(--gold);min-width:30px}
.chapter{margin:68px 0;padding:54px 0;border-top:1px solid var(--divider)}
.chapter:first-of-type{border-top:none}
.chapter-header{display:flex;align-items:center;gap:16px;margin-bottom:10px}
.chapter-num{font-size:.85rem;font-weight:800;color:var(--gold);background:var(--tag-bg);padding:4px 14px;border-radius:999px}
.chapter-emoji{font-size:2rem}
.chapter h2,.appendix h2{font-size:clamp(1.75rem,3vw,2.2rem);font-weight:900;color:var(--accent);margin:12px 0 8px;line-height:1.25}
.chapter .tagline{font-size:1.08rem;color:var(--text2);margin-bottom:24px;font-style:italic}
.section{margin:36px 0}
.section h3{font-size:1.22rem;font-weight:820;color:var(--blue);margin-bottom:14px;padding-left:13px;border-left:4px solid var(--gold)}
.section p,.appendix p{margin-bottom:17px;color:var(--text)}
.section ul,.section ol,.appendix ol{margin:12px 0 21px 26px}
.section li,.appendix li{margin-bottom:8px;color:var(--text)}
.section li::marker,.appendix li::marker{color:var(--gold);font-weight:800}
.highlight-box,.action-box{background:var(--highlight);border:1px solid var(--divider);border-radius:10px;padding:20px 24px;margin:22px 0}
.highlight-box .label{font-size:.8rem;font-weight:850;color:var(--gold);text-transform:uppercase;letter-spacing:.05em;margin-bottom:8px}
.action-box{border-left:5px solid var(--gold)}
.book-visual{margin:26px 0;text-align:center}
.book-visual img{max-width:100%;border-radius:14px;border:1px solid var(--divider);background:var(--card);box-shadow:0 18px 38px rgba(26,28,46,.12)}
.chapter-art img{max-height:780px;object-fit:contain}
.inline-visual img{max-height:720px;object-fit:contain}
.data-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px;margin:22px 0}
.data-card{background:var(--card);border:1px solid var(--divider);border-radius:10px;padding:20px;text-align:center}
.data-card .number{font-size:1.85rem;font-weight:950;color:var(--gold)}
.data-card .desc{font-size:.88rem;color:var(--text2);margin-top:4px}
.table-wrap{overflow-x:auto;margin:22px 0}
table{width:100%;border-collapse:collapse;font-size:.92rem;background:var(--card);border:1px solid var(--divider)}
th{background:var(--tag-bg);color:var(--accent);font-weight:820;padding:12px;text-align:left;border-bottom:2px solid var(--gold)}
td{padding:10px 12px;border-bottom:1px solid var(--divider);vertical-align:top}
tr:hover td{background:var(--highlight)}
.phase-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:16px;margin:22px 0}
.phase-card{background:var(--card);border:1px solid var(--divider);border-radius:10px;padding:18px;border-top:4px solid var(--gold)}
.phase-card .p-title{font-weight:850;font-size:1rem;margin-bottom:6px}
.phase-card .p-meta{font-size:.82rem;color:var(--text2);margin-bottom:8px}
blockquote{border-left:4px solid var(--gold);padding:14px 20px;margin:22px 0;background:var(--highlight);border-radius:0 8px 8px 0;font-style:italic;color:var(--text2)}
.appendix{border-top:1px solid var(--divider);padding:58px 0}
.footer{text-align:center;padding:64px 24px;border-top:1px solid var(--divider);margin-top:60px;color:var(--text2);font-size:.88rem}
@media(max-width:760px){.cover{grid-template-columns:1fr;padding:40px 24px 48px;min-height:auto}.cover-text .subtitle{max-width:100%;word-break:break-all}.cover-img{order:-1;margin:46px auto 10px}.cover-img img{max-width:min(100%,320px);max-height:none}.top-nav{position:sticky;padding:10px 12px;width:100vw;overflow:hidden}.top-nav .logo{font-size:.88rem}.top-nav div{display:none}.container{padding:0 20px}.toc{padding:24px}.toc a{display:block}.chapter{margin:42px 0;padding:38px 0}}
@media print{.top-nav{display:none}.cover{min-height:auto;page-break-after:always}.chapter{page-break-before:always}.book-visual img{box-shadow:none}.appendix{page-break-before:always}}
`;
}

function render() {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>OPC生存手册 — AI时代一人创作者的生存实战指南</title>
<style>${css()}</style>
</head>
<body>
<nav class="top-nav">
  <span class="logo">OPC生存手册</span>
  <div>
    <button onclick="document.documentElement.classList.toggle('dark')">模式</button>
    <button onclick="window.print()">打印</button>
  </div>
</nav>
<section class="cover">
  <div class="cover-text">
    <div class="badge">2026 · 第一版 · 完整出版稿</div>
    <h1>OPC生存手册</h1>
    <p class="subtitle">AI时代一人创作者<br>从0到月入$10K的创作、分发与变现系统。</p>
    <p class="cta">一个人 + AI = 一个团队。向下滚动开始阅读。</p>
  </div>
  <figure class="cover-img"><img src="assets/cover/front-cover.png" alt="OPC生存手册封面"></figure>
</section>
<div class="container">
<nav class="toc">
  <h2>目录</h2>
  <ol>
    ${chapters.map((ch) => `<li><a href="#${ch.id}">${ch.title}</a></li>`).join("\n    ")}
    <li><a href="#appendix-kdp">附录A：Codex插件辅助KDP发布SOP</a></li>
    <li><a href="#appendix-30day">附录B：OPC 30天启动清单</a></li>
  </ol>
</nav>
</div>
<section class="appendix" id="preface">
  <div class="container">
    <h2>前言：这不是一本“AI神话”</h2>
    <p>AI确实降低了创作和创业门槛，但门槛降低不等于结果自动发生。真正的变化是：过去一个人无法承担的研究、写作、设计、开发和运营，现在可以通过工具链完成最小闭环。你仍然需要判断方向、理解用户、承担承诺、持续交付。</p>
    <p>这本书写给想把个人能力产品化的人。你可能是自由职业者、内容创作者、医生、设计师、工程师、老师、运营、咨询顾问，也可能只是一个想用AI做第一份数字收入的人。你不需要一开始就辞职，也不需要一开始就做大公司。你需要的是一套能从小处启动、持续验证、逐步积累资产的方法。</p>
    <p>阅读时，请把每章末尾的动作真正做一遍。OPC不是读出来的，而是在一次次发布、反馈、修改、收费和复盘中练出来的。</p>
  </div>
</section>
${chapters.map(renderChapter).join("\n")}
${appendices}
<div class="footer">
  <p><strong>OPC生存手册</strong> · 第一版 · 2026</p>
  <p>One Person Creator — AI时代一人创作者的生存实战指南</p>
  <p style="margin-top:8px;font-size:.82rem">本书由人类创作者与AI工具协作完成，所有关键判断、结构和交付责任由作者承担。</p>
</div>
</body>
</html>`;
}

const html = render().split("\n").map((line) => line.trimEnd()).join("\n");
await writeFile(join(root, "docs", "index.html"), html, "utf8");
console.log("generated docs/index.html");
