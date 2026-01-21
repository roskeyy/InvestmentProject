export interface QuizQuestion {
  id: number
  question: string
  options: string[]
  dimension: 'risk' | 'style' | 'frequency' | 'information'
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: '当你的股票突然下跌10%时，你会？',
    options: [
      '立即止损卖出',
      '观察走势，考虑补仓',
      '持有不动，相信长期价值',
      '恐慌，不知所措',
    ],
    dimension: 'risk',
  },
  {
    id: 2,
    question: '你更倾向于哪种投资方式？',
    options: [
      '短线交易，快进快出',
      '波段操作，把握趋势',
      '长期持有，价值投资',
      '跟着感觉走',
    ],
    dimension: 'style',
  },
  {
    id: 3,
    question: '你平时看盘的频率是？',
    options: ['每半小时看一次', '每天看几次', '每周看一次', '基本不看'],
    dimension: 'frequency',
  },
  {
    id: 4,
    question: '做投资决策时，你最看重什么？',
    options: [
      '技术指标和K线图',
      '公司基本面和财报',
      '热点新闻和市场情绪',
      '朋友推荐',
    ],
    dimension: 'information',
  },
  {
    id: 5,
    question: '你会使用杠杆或融资吗？',
    options: [
      '经常使用，追求高收益',
      '偶尔使用，适度放大',
      '从不使用，风险太大',
      '不太了解是什么',
    ],
    dimension: 'risk',
  },
  {
    id: 6,
    question: '你的投资组合中通常有几只股票？',
    options: ['1-3只集中持股', '4-8只分散配置', '8只以上广泛分散', '只有基金'],
    dimension: 'style',
  },
  {
    id: 7,
    question: '你如何记录和分析你的交易？',
    options: [
      '详细的Excel表格记录',
      '在交易软件里简单看看',
      '凭记忆，不专门记录',
      '从不复盘',
    ],
    dimension: 'style',
  },
  {
    id: 8,
    question: '遇到市场剧烈波动时，你的心态是？',
    options: [
      '兴奋，寻找机会',
      '冷静，按计划执行',
      '紧张，减少操作',
      '焦虑，想要离场',
    ],
    dimension: 'risk',
  },
  {
    id: 9,
    question: '你获取投资信息的主要渠道是？',
    options: [
      '专业研报和财报',
      '财经新闻和社交媒体',
      '股吧论坛讨论',
      '朋友和专家推荐',
    ],
    dimension: 'information',
  },
  {
    id: 10,
    question: '一只股票亏损多少时你会考虑止损？',
    options: ['5%以内', '10-15%', '20%以上', '不止损，越跌越买'],
    dimension: 'risk',
  },
  {
    id: 11,
    question: '你平均持有一只股票的时间是？',
    options: ['几天到几周', '1-3个月', '半年到一年', '一年以上'],
    dimension: 'frequency',
  },
  {
    id: 12,
    question: '如果市场连续大跌，你会？',
    options: [
      '抄底买入，认为机会来了',
      '分批建仓，逐步布局',
      '观望等待，企稳再说',
      '清仓离场，保住本金',
    ],
    dimension: 'risk',
  },
]
