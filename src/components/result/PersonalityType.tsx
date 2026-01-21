import { personalityTypes } from '@/data/personality-types'

interface PersonalityTypeProps {
  personality: any
  scores: {
    risk: number
    style: number
    frequency: number
    information: number
  }
}

export default function PersonalityType({ personality, scores }: PersonalityTypeProps) {
  const scoreLabels = {
    risk: '风险偏好',
    style: '系统化',
    frequency: '耐心程度',
    information: '研究深度',
  }

  return (
    <div className="bg-white p-6 md:p-8">
      {/* 标题区域 */}
      <div className="text-center mb-8 pb-8 border-b">
        <div className="text-8xl md:text-9xl mb-6">{personality.emoji}</div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          {personality.name}
        </h2>
        <p className="text-xl md:text-2xl text-gray-900 font-bold leading-relaxed">
          {personality.tagline}
        </p>
        <div className="mt-6 inline-block px-6 py-3 rounded-full bg-gray-900 text-white text-lg md:text-xl font-bold">
          炒股人格测试结果
        </div>
      </div>

      {/* 维度得分 */}
      <div className="mb-8 p-6 bg-gray-50 rounded-xl border">
        <h3 className="font-bold text-2xl md:text-3xl text-gray-900 mb-6">📊 投资维度分析</h3>
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="mb-5 last:mb-0">
            <div className="flex justify-between text-lg md:text-xl font-bold mb-3 text-gray-900">
              <span>{scoreLabels[key as keyof typeof scoreLabels]}</span>
              <span className="px-4 py-2 rounded-full bg-gray-900 text-white text-lg md:text-xl font-bold">
                {value}/10
              </span>
            </div>
            <div className="h-4 bg-gray-400 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 transition-all duration-500"
                style={{ width: `${value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 优势 */}
      <div className="mb-8 p-6 md:p-8 bg-green-50 rounded-xl border-l-4 border-green-500">
        <h3 className="font-bold text-2xl md:text-3xl text-gray-900 mb-5">💪 核心优势</h3>
        <ul className="space-y-4 text-lg md:text-xl text-gray-900">
          {personality.strengths.map((strength: string, index: number) => (
            <li key={index} className="flex items-start leading-relaxed">
              <span className="mr-4 text-green-600 font-bold text-2xl flex-shrink-0">✓</span>
              <span className="flex-1 font-medium">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 策略建议 */}
      <div className="mb-8 p-6 md:p-8 bg-blue-50 rounded-xl border-l-4 border-blue-500">
        <h3 className="font-bold text-2xl md:text-3xl text-gray-900 mb-5">🎯 适合策略</h3>
        <p className="text-lg md:text-xl text-gray-900 mb-6 leading-relaxed font-bold">
          {personality.suitableStrategy}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-lg border-2">
            <div className="font-bold mb-2 text-lg md:text-xl text-gray-900">🔄 操作频率</div>
            <div className="text-gray-900 text-lg md:text-xl leading-relaxed font-medium">{personality.frequency}</div>
          </div>
          <div className="bg-white p-5 rounded-lg border-2">
            <div className="font-bold mb-2 text-lg md:text-xl text-gray-900">📚 信息来源</div>
            <div className="text-gray-900 text-lg md:text-xl leading-relaxed font-medium">{personality.informationSource}</div>
          </div>
          <div className="bg-white p-5 rounded-lg border-2">
            <div className="font-bold mb-2 text-lg md:text-xl text-gray-900">📝 记录方式</div>
            <div className="text-gray-900 text-lg md:text-xl leading-relaxed font-medium">{personality.recordMethod}</div>
          </div>
        </div>
      </div>

      {/* 常见错误 */}
      <div className="mb-8 p-6 md:p-8 bg-orange-50 rounded-xl border-l-4 border-orange-500">
        <h3 className="font-bold text-2xl md:text-3xl text-gray-900 mb-5">⚠️ 容易犯的错误</h3>
        <ul className="space-y-4 text-lg md:text-xl text-gray-900">
          {personality.commonMistakes.map((mistake: string, index: number) => (
            <li key={index} className="flex items-start leading-relaxed">
              <span className="mr-4 text-orange-600 font-bold text-2xl flex-shrink-0">•</span>
              <span className="flex-1 font-medium">{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 建议 */}
      <div className="p-6 md:p-8 bg-purple-50 rounded-xl border-l-4 border-purple-500">
        <h3 className="font-bold text-2xl md:text-3xl text-gray-900 mb-5">💡 自我约束建议</h3>
        <p className="text-lg md:text-xl text-gray-900 leading-relaxed font-semibold">
          {personality.advice}
        </p>
      </div>

      {/* 底部 */}
      <div className="mt-8 text-center text-base md:text-lg text-gray-900 pt-6 border-t">
        <p className="font-medium">炒股人格测试 · 揭秘你的投资风格</p>
      </div>
    </div>
  )
}
