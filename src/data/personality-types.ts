export interface PersonalityType {
  id: string
  name: string
  emoji: string
  tagline: string
  description: string
  strengths: string[]
  weaknesses: string[]
  suitableStrategy: string
  frequency: string
  informationSource: string
  recordMethod: string
  commonMistakes: string[]
  advice: string
  color: string
  gradient: string
}

export const personalityTypes: Record<string, PersonalityType> = {
  lion: {
    id: 'lion',
    name: '稳健型投资者',
    emoji: '🦁',
    tagline: '稳扎稳打，长期制胜',
    description: '你是一个理性、稳健的投资者，注重风险控制和长期价值。你的投资决策基于深入研究和理性分析，不盲目追逐热点。',
    strengths: [
      '风险意识强，控制回撤能力好',
      '有长期视角，不受短期波动影响',
      '决策理性，情绪控制佳',
      '注重基本面分析能力',
    ],
    weaknesses: [
      '可能错过短期爆发机会',
      '过于保守时收益偏低',
      '对热点题材反应较慢',
      '可能因过度谨慎错过买入点',
    ],
    suitableStrategy: '长线价值投资，选择优质公司持有3年以上',
    frequency: '季度查看财报，年度回顾投资组合',
    informationSource: '公司年报、季报、招股说明书、行业研报',
    recordMethod: '记录买入理由和长期目标，定期复盘基本面变化',
    commonMistakes: [
      '在市场恐慌时过度悲观而卖出优质资产',
      '因为小幅波动而过早止损',
      '持仓过于集中导致波动大',
    ],
    advice: '保持定力，相信时间的力量。定期关注公司基本面变化，不要因为短期噪音而改变长期策略。适当分散持仓降低单一股票风险。',
    color: '#f59e0b',
    gradient: 'from-amber-500 to-orange-600',
  },
  fox: {
    id: 'fox',
    name: '技术分析派',
    emoji: '🦊',
    tagline: '图表为王，趋势致胜',
    description: '你擅长通过技术分析捕捉市场趋势，对K线图和技术指标有深入研究。你相信市场价格反映一切信息，通过图表能找到买卖点。',
    strengths: [
      '技术分析能力强，能识别趋势',
      '执行力强，严格按信号操作',
      '善于把握短线机会',
      '止损意识强',
    ],
    weaknesses: [
      '可能过度交易增加成本',
      '容易陷入技术指标迷信',
      '忽略基本面风险',
      '在震荡市中容易反复止损',
    ],
    suitableStrategy: '波段操作，持有周期1周到3个月，结合趋势和量能',
    frequency: '每日复盘，关注关键价位突破',
    informationSource: 'K线图、量能、技术指标（MACD、KDJ、RSI）',
    recordMethod: '详细记录每笔交易的买卖点、理由和结果，定期总结胜率',
    commonMistakes: [
      '逆势操作，抢反弹被套',
      '不止损，幻想反弹',
      '过度优化指标，错过最佳买卖点',
      '情绪化交易，偏离系统信号',
    ],
    advice: '建立完整的技术分析系统，包括趋势判断、买卖点、止损位。记录每笔交易，定期复盘总结。减少无谓的交易，只在明确信号出现时操作。',
    color: '#8b5cf6',
    gradient: 'from-violet-500 to-purple-600',
  },
  rabbit: {
    id: 'rabbit',
    name: '跟风小白',
    emoji: '🐰',
    tagline: '学习成长，稳步前行',
    description: '你是投资新手，容易受市场情绪和他人建议影响。虽然投资经验不足，但你有学习的意愿，需要建立正确的投资理念。',
    strengths: [
      '有学习意愿和成长空间',
      '风险意识逐渐增强',
      '愿意听取建议',
      '适合从简单策略开始',
    ],
    weaknesses: [
      '缺乏独立判断能力',
      '容易追涨杀跌',
      '情绪容易受市场波动影响',
      '缺乏系统的投资方法',
    ],
    suitableStrategy: '指数基金定投，每月固定金额投入，长期持有',
    frequency: '每月定投，每季度查看一次净值',
    informationSource: '基金季报、基金经理观点、基础理财知识',
    recordMethod: '记录定投日期和金额，跟踪长期收益',
    commonMistakes: [
      '追涨杀跌，高点买入低点卖出',
      '听信小道消息买入不熟悉的股票',
      '频繁操作导致高额手续费',
      '亏损后恐慌性清仓',
    ],
    advice: '从定投指数基金开始，简单有效。多学习投资基础知识，建立长期视角。不要听信小道消息，不要追求一夜暴富。时间是新投资者的朋友。',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-600',
  },
  owl: {
    id: 'owl',
    name: '价值发现者',
    emoji: '🦉',
    tagline: '深度研究，逆向思维',
    description: '你是一个深度思考者，善于通过研究发现被低估的优质公司。你有逆向思维，敢于在市场恐慌时买入被错杀的标的。',
    strengths: [
      '研究深度强，能发现价值洼地',
      '逆向思维，不随大流',
      '耐心强，敢于左侧布局',
      '基本面分析能力突出',
    ],
    weaknesses: [
      '可能过早买入陷入价值陷阱',
      '左侧交易时间成本高',
      '对市场情绪关注不够',
      '可能低估趋势延续时间',
    ],
    suitableStrategy: '低吸策略，寻找被错杀的优质公司，等待价值回归',
    frequency: '每日筛选标的机会，深度研究后决策',
    informationSource: '财报、公告、研报、行业分析、公司调研',
    recordMethod: '记录估值分析、安全边际计算，跟踪价值兑现进度',
    commonMistakes: [
      '低估问题公司的风险，陷入价值陷阱',
      '过早买入，资金长期被套',
      '忽视市场情绪的延续性',
      '过于相信自己的判断',
    ],
    advice: '建立严格的估值体系，设置多个安全边际。区分短期困境和永久性损伤。保留足够现金分批建仓。设置止损标准，避免深度套牢。',
    color: '#06b6d4',
    gradient: 'from-cyan-500 to-teal-600',
  },
  wolf: {
    id: 'wolf',
    name: '激进交易者',
    emoji: '🐺',
    tagline: '快进快出，捕捉热点',
    description: '你是一个高风险偏好的交易者，追求短期高收益。你善于捕捉市场热点和题材机会，能够承受较大波动。',
    strengths: [
      '敏锐的市场嗅觉',
      '执行力强，敢于出手',
      '能承受高风险',
      '善于把握题材机会',
    ],
    weaknesses: [
      '风险控制不足容易大亏',
      '频繁操作手续费高',
      '容易受情绪影响',
      '资金曲线波动大',
    ],
    suitableStrategy: '短线狙击，持有周期1-7天，聚焦市场热点题材',
    frequency: '盘中紧盯，快速决策',
    informationSource: '热点新闻、龙虎榜、资金流向、市场情绪',
    recordMethod: '记录每笔交易的盈亏、原因、情绪状态，每周总结',
    commonMistakes: [
      '不止损，小亏变大亏',
      '满仓操作没有资金管理',
      '情绪化交易，追涨杀跌',
      '过度自信导致重仓单只股票',
    ],
    advice: '必须建立严格的止损纪律，单笔亏损不超过总资金的2-3%。控制仓位，不要满仓操作。保持冷静，连续亏损后暂停交易。赚钱后及时止盈，落袋为安。',
    color: '#ef4444',
    gradient: 'from-red-500 to-rose-600',
  },
  bear: {
    id: 'bear',
    name: '数据量化派',
    emoji: '🐻',
    tagline: '数据驱动，系统化交易',
    description: '你相信数据和多因子模型，善于用系统化方法做投资决策。你有编程或数据分析背景，能够回测和优化策略。',
    strengths: [
      '数据分析能力强',
      '决策客观，不受情绪影响',
      '善于回测优化策略',
      '能同时处理多个标的',
    ],
    weaknesses: [
      '可能过度拟合历史数据',
      '对黑天鹅事件防范不足',
      '策略失效时反应慢',
      '可能忽视基本面变化',
    ],
    suitableStrategy: '多因子选股或程序化交易，持有周期根据信号调整',
    frequency: '系统每日扫描，根据信号自动或半自动交易',
    informationSource: '量价数据、财务指标、市场因子数据',
    recordMethod: '详细记录策略参数、回测结果、实盘表现，持续优化',
    commonMistakes: [
      '过度优化导致策略过拟合',
      '忽视交易成本和滑点',
      '策略失效后坚持不调整',
      '数据质量问题导致决策错误',
    ],
    advice: '保持策略简单有效，避免过度复杂化。定期进行样本外测试。设置策略熔断机制，实盘与回测差异过大时暂停。保留人工干预机制应对极端情况。',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-600',
  },
}
