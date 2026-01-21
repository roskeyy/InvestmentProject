import { prisma } from '@/lib/db'
import { personalityTypes } from '@/data/personality-types'
import { notFound } from 'next/navigation'

interface PosterPreviewPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: PosterPreviewPageProps) {
  const testRecord = await prisma.testRecord.findUnique({
    where: { id: params.id },
  })

  if (!testRecord) return { title: 'Not Found' }

  const personality = personalityTypes[testRecord.personalityType]
  return {
    title: `${personality.emoji} ${personality.name} - 炒股人格测试`,
  }
}

async function PosterPreviewPage({ params }: PosterPreviewPageProps) {
  const testRecord = await prisma.testRecord.findUnique({
    where: { id: params.id },
  })

  if (!testRecord) {
    notFound()
  }

  const personality = personalityTypes[testRecord.personalityType]
  const scores = testRecord.scores as {
    risk: number
    style: number
    frequency: number
    information: number
  }

  const scoreLabels = {
    risk: '风险偏好',
    style: '系统化',
    frequency: '耐心程度',
    information: '研究深度',
  }

  return (
    <div className="w-[540px] bg-white p-8 min-h-[960px]">
      {/* 标题区域 - 带渐变背景 */}
      <div className={`bg-gradient-to-br ${personality.gradient} p-8 text-center rounded-xl mb-6`}>
        <div className="text-7xl mb-4">{personality.emoji}</div>
        <h2 className="text-4xl font-bold mb-3 text-gray-900">{personality.name}</h2>
        <p className="text-xl text-gray-900 font-semibold">{personality.tagline}</p>
      </div>

      {/* 维度得分 */}
      <div className="mb-6 p-5 bg-gray-100 rounded-xl border">
        <h3 className="font-bold text-2xl text-gray-900 mb-5">📊 投资维度分析</h3>
        {Object.entries(scores).map(([key, value]) => (
          <div key={key} className="mb-4 last:mb-0">
            <div className="flex justify-between text-base font-bold mb-2 text-gray-900">
              <span>{scoreLabels[key as keyof typeof scoreLabels]}</span>
              <span className="px-3 py-1 rounded-full bg-gray-900 text-white text-base font-bold">
                {value}/10
              </span>
            </div>
            <div className="h-3 bg-gray-400 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-900 transition-all duration-500"
                style={{ width: `${value * 10}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 优势 */}
      <div className="mb-6 p-6 bg-green-50 rounded-xl border-l-4 border-green-500">
        <h3 className="font-bold text-2xl text-gray-900 mb-4">💪 核心优势</h3>
        <ul className="space-y-3 text-base text-gray-900">
          {personality.strengths.map((strength: string, index: number) => (
            <li key={index} className="flex items-start leading-relaxed">
              <span className="mr-3 text-green-600 font-bold text-xl flex-shrink-0">✓</span>
              <span className="flex-1 font-medium">{strength}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 策略建议 */}
      <div className="mb-6 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
        <h3 className="font-bold text-2xl text-gray-900 mb-4">🎯 适合策略</h3>
        <p className="text-base text-gray-900 mb-4 leading-relaxed font-semibold">
          {personality.suitableStrategy}
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white p-4 rounded-lg border-2">
            <div className="font-bold mb-2 text-sm text-gray-900">🔄 操作频率</div>
            <div className="text-gray-900 text-sm leading-relaxed font-medium">{personality.frequency}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border-2">
            <div className="font-bold mb-2 text-sm text-gray-900">📚 信息来源</div>
            <div className="text-gray-900 text-sm leading-relaxed font-medium">{personality.informationSource}</div>
          </div>
          <div className="bg-white p-4 rounded-lg border-2">
            <div className="font-bold mb-2 text-sm text-gray-900">📝 记录方式</div>
            <div className="text-gray-900 text-sm leading-relaxed font-medium">{personality.recordMethod}</div>
          </div>
        </div>
      </div>

      {/* 常见错误 */}
      <div className="mb-6 p-6 bg-orange-50 rounded-xl border-l-4 border-orange-500">
        <h3 className="font-bold text-2xl text-gray-900 mb-4">⚠️ 容易犯的错误</h3>
        <ul className="space-y-3 text-base text-gray-900">
          {personality.commonMistakes.map((mistake: string, index: number) => (
            <li key={index} className="flex items-start leading-relaxed">
              <span className="mr-3 text-orange-600 font-bold text-xl flex-shrink-0">•</span>
              <span className="flex-1 font-medium">{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 建议 */}
      <div className="p-6 bg-purple-50 rounded-xl border-l-4 border-purple-500">
        <h3 className="font-bold text-2xl text-gray-900 mb-4">💡 自我约束建议</h3>
        <p className="text-base text-gray-900 leading-relaxed font-semibold">
          {personality.advice}
        </p>
      </div>

      {/* 底部 */}
      <div className="mt-6 text-center text-base text-gray-900 pt-4 border-t">
        <p className="font-medium">炒股人格测试 · 揭秘你的投资风格</p>
      </div>
    </div>
  )
}

export default PosterPreviewPage
