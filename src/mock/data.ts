// Mock 数据统计
export const mockStats = {
  resumeOptimized: 128,
  jdAnalyzed: 86,
  interviewPrepared: 52,
  satisfaction: 94,
};

// Mock 简历数据 - 应届生-后端开发场景
export const mockResumeData = {
  originalScore: 58,
  optimizedScore: 85,
  issues: [
    '项目描述过于简略，缺乏量化数据',
    '技术栈罗列方式不利于阅读',
    '缺少关键词匹配优化',
    '缺乏个人优势亮点提炼',
  ],
  suggestions: [
    '增加项目成果数据，如"提升性能30%"',
    '重新组织技术栈，按熟练度分组',
    '添加JD关键词，如"微服务"、"高并发"',
    '提炼3-5个核心亮点放在简历顶部',
  ],
  userInfo: {
    name: '王小明',
    role: '应届生',
    target: '后端开发工程师',
  },
};

// Mock JD 分析数据
export const mockJDData = {
  matchScore: 72,
  matchingSkills: [
    'Java',
    'Spring Boot',
    'MySQL',
    'Redis',
    'Git',
    'Linux',
  ],
  missingSkills: [
    '微服务架构',
    'Docker/K8s',
    '消息队列(RabbitMQ/Kafka)',
    '分布式事务',
    '性能调优',
  ],
  suggestions: [
    '建议在简历中突出微服务相关经验',
    '补充容器化部署实践经验',
    '学习消息队列基础知识',
    '了解分布式系统设计原理',
  ],
  salaryRange: '15k-25k',
  userSalaryExpectation: '18k-22k',
  company: '某互联网公司',
  position: '高级Java开发工程师',
};

// Mock 面试准备数据
export const mockInterviewData = {
  companyInfo: {
    name: '字节跳动',
    industry: '互联网/科技',
    stage: '已上市',
    size: '10000人以上',
    culture: ['扁平化管理', '技术驱动', '快速成长', '结果导向'],
    highlights: ['全球化业务', '技术氛围好', '薪资竞争力强', '晋升空间大'],
  },
  difficulty: '中高难度',
  interviewCount: 128,
  predictedQuestions: [
    {
      id: '1',
      type: 'technical',
      question: '请介绍一下你做过的一个最有挑战性的项目？',
      suggestedAnswer: '采用STAR法则：背景(Situation)→任务(Task)→行动(Action)→结果(Result)。重点描述技术难点和解决方案，如"项目QPS从1k提升到10k，通过引入缓存和异步处理解决"。',
    },
    {
      id: '2',
      type: 'technical',
      question: 'Redis有哪些数据结构？分别用在什么场景？',
      suggestedAnswer: 'String(缓存)、Hash(对象存储)、List(消息队列)、Set(去重/交集)、ZSet(排行榜)。结合实际项目经验说明。',
    },
    {
      id: '3',
      type: 'behavioral',
      question: '请描述一次你与团队成员意见不合的经历，你是如何处理的？',
      suggestedAnswer: '选择一次具体的分歧，说明：1)分歧点是什么；2)你的沟通方式；3)最终如何达成共识；4)学到了什么。避免负面评价他人。',
    },
    {
      id: '4',
      type: 'situational',
      question: '如果项目 deadline 临近，但还有关键功能没完成，你会怎么做？',
      suggestedAnswer: '1)评估当前进度和风险；2)与团队沟通，确认是否可以延期或裁剪功能；3)如果必须按时交付，考虑MVP方案；4)向上级汇报真实情况。',
    },
    {
      id: '5',
      type: 'technical',
      question: '如何设计一个高并发的秒杀系统？',
      suggestedAnswer: '从多个维度回答：1)前端-验证码+防刷；2)网关-限流降级；3)服务层-异步处理+库存预扣；4)数据层-Redis缓存+消息队列削峰。',
    },
    {
      id: '6',
      type: 'behavioral',
      question: '你为什么想加入字节跳动？',
      suggestedAnswer: '结合个人职业规划：1)对字节产品的认可；2)技术成长机会；3)匹配的职业发展路径；4)公司文化契合度。避免只谈薪资待遇。',
    },
  ],
};

// Mock 看板数据
export const mockDashboardData = {
  totalApplications: 36,
  interviewRate: 42,
  offerCount: 3,
  skillRadar: [
    { skill: 'Java核心', score: 85, fullMark: 100 },
    { skill: '数据库', score: 78, fullMark: 100 },
    { skill: '框架(Spring)', score: 80, fullMark: 100 },
    { skill: '分布式系统', score: 55, fullMark: 100 },
    { skill: '系统设计', score: 60, fullMark: 100 },
    { skill: '项目经验', score: 72, fullMark: 100 },
  ],
  applicationTimeline: [
    { date: '05-01', applications: 3, interviews: 0 },
    { date: '05-02', applications: 5, interviews: 1 },
    { date: '05-03', applications: 2, interviews: 0 },
    { date: '05-04', applications: 7, interviews: 2 },
    { date: '05-05', applications: 4, interviews: 1 },
    { date: '05-06', applications: 8, interviews: 3 },
    { date: '05-07', applications: 6, interviews: 2 },
  ],
  recentApplications: [
    {
      company: '字节跳动',
      position: '后端开发工程师',
      date: '2026-05-07',
      status: 'interview',
      nextStep: '技术二面 05-10',
    },
    {
      company: '阿里巴巴',
      position: 'Java开发工程师',
      date: '2026-05-05',
      status: 'interview',
      nextStep: '等待HR面',
    },
    {
      company: '美团',
      position: '高级后端工程师',
      date: '2026-05-03',
      status: 'offer',
    },
    {
      company: '腾讯',
      position: '后端开发',
      date: '2026-05-01',
      status: 'rejected',
    },
    {
      company: '京东',
      position: 'Java工程师',
      date: '2026-04-28',
      status: 'applied',
    },
    {
      company: '拼多多',
      position: '后端开发',
      date: '2026-04-25',
      status: 'rejected',
    },
  ],
};
