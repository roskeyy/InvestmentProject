export interface Answer {
  questionId: number
  optionIndex: number
}

export interface DimensionScores {
  risk: number // 风险偏好: 0-3
  style: number // 投资风格: 0-3
  frequency: number // 操作频率: 0-3
  information: number // 信息来源: 0-3
}

// 选项对应的分数映射
const optionScores: Record<number, number[]> = {
  1: [3, 2, 0, 1], // 风险：立即止损(3-低风险) < 观察补仓(2) < 持有不动(0-高风险)，恐慌(1)
  2: [0, 1, 3, 1], // 风格：短线(0) < 波段(1) < 长线(3)，跟风(1)
  3: [0, 1, 2, 3], // 频率：每半小时(0) < 每天(1) < 每周(2) < 不看(3)
  4: [0, 3, 1, 0], // 信息：技术(0) < 基本面(3) < 新闻(1) < 推荐(0)
  5: [3, 2, 0, 1], // 风险：经常杠杆(3-高风险) < 偶尔(2) < 从不(0-低风险)，不懂(1)
  6: [0, 2, 1, 3], // 风格：集中(0) < 分散(2) < 广泛(1)，基金(3)
  7: [3, 2, 1, 0], // 风格：详细记录(3) < 简单记录(2) < 凭记忆(1) < 不复盘(0)
  8: [3, 2, 0, 1], // 风险：兴奋(3-高风险) < 冷静(2) < 紧张(0-低风险)，焦虑(1)
  9: [3, 1, 0, 0], // 信息：研报(3) < 新闻(1) < 论坛(0) < 推荐(0)
  10: [3, 2, 0, 1], // 风险：5%(3-低风险) < 10-15%(2) < 20%+(0-高风险)，不止损(1)
  11: [0, 1, 2, 3], // 频率：几天(0) < 1-3月(1) < 半年-1年(2) < 1年+(3)
  12: [3, 2, 0, 1], // 风险：抄底(3-高风险) < 分批(2) < 观望(0-低风险)，清仓(1)
}

// 根据分数判断人格类型
export function calculatePersonality(
  answers: Answer[]
): { type: string; scores: DimensionScores } {
  const scores: DimensionScores = {
    risk: 0,
    style: 0,
    frequency: 0,
    information: 0,
  }

  // 获取题目信息
  const questions = [
    { id: 1, dimension: 'risk' as keyof DimensionScores },
    { id: 2, dimension: 'style' as keyof DimensionScores },
    { id: 3, dimension: 'frequency' as keyof DimensionScores },
    { id: 4, dimension: 'information' as keyof DimensionScores },
    { id: 5, dimension: 'risk' as keyof DimensionScores },
    { id: 6, dimension: 'style' as keyof DimensionScores },
    { id: 7, dimension: 'style' as keyof DimensionScores },
    { id: 8, dimension: 'risk' as keyof DimensionScores },
    { id: 9, dimension: 'information' as keyof DimensionScores },
    { id: 10, dimension: 'risk' as keyof DimensionScores },
    { id: 11, dimension: 'frequency' as keyof DimensionScores },
    { id: 12, dimension: 'risk' as keyof DimensionScores },
  ]

  // 计算各维度分数
  answers.forEach((answer) => {
    const question = questions.find((q) => q.id === answer.questionId)
    if (question) {
      scores[question.dimension] += optionScores[answer.questionId]?.[answer.optionIndex] || 0
    }
  })

  // 归一化到 0-10 范围
  const maxRisk = 4 * 3 // 4题，每题最高3分
  const maxStyle = 3 * 3 // 3题
  const maxFrequency = 2 * 3 // 2题
  const maxInformation = 2 * 3 // 2题

  const normalizedScores = {
    risk: Math.round((scores.risk / maxRisk) * 10),
    style: Math.round((scores.style / maxStyle) * 10),
    frequency: Math.round((scores.frequency / maxFrequency) * 10),
    information: Math.round((scores.information / maxInformation) * 10),
  }

  // 根据分数组合判断人格类型
  let personalityType = 'lion' // 默认

  const { risk, style, frequency, information } = normalizedScores

  // 🐺 激进交易者: 高风险偏好 + 短线操作
  if (risk >= 7 && frequency <= 4) {
    personalityType = 'wolf'
  }
  // 🦊 技术分析派: 中高风险 + 技术导向
  else if (risk >= 5 && information <= 4) {
    personalityType = 'fox'
  }
  // 🦁 稳健型投资者: 低风险偏好 + 长期持有
  else if (risk <= 4 && frequency >= 7) {
    personalityType = 'lion'
  }
  // 🦉 价值发现者: 中低风险 + 深度研究
  else if (risk <= 6 && information >= 7) {
    personalityType = 'owl'
  }
  // 🐻 数据量化派: 中性风险 + 数据驱动
  else if (risk >= 4 && risk <= 7 && style >= 7) {
    personalityType = 'bear'
  }
  // 🐰 跟风小白: 低系统化
  else if (style <= 4) {
    personalityType = 'rabbit'
  }

  return {
    type: personalityType,
    scores: normalizedScores,
  }
}

export function getPersonalityDescription(type: string): string {
  const descriptions: Record<string, string> = {
    lion: '稳健型投资者 - 长期价值投资',
    fox: '技术分析派 - 图表趋势交易',
    rabbit: '跟风小白 - 需要学习成长',
    owl: '价值发现者 - 深度研究逆向布局',
    wolf: '激进交易者 - 短线热点狙击',
    bear: '数据量化派 - 系统化量化交易',
  }
  return descriptions[type] || '未知类型'
}
