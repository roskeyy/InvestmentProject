import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { personalityTypes } from '@/data/personality-types'
import PosterView from '@/components/result/PosterView'
import ResultActions from '@/components/result/ResultActions'

export const dynamic = 'force-dynamic'

interface ResultPageProps {
  params: {
    id: string
  }
}

async function getTestRecord(id: string) {
  const testRecord = await prisma.testRecord.findUnique({
    where: { id },
  })

  return testRecord
}

export default async function ResultPage({ params }: ResultPageProps) {
  const testRecord = await getTestRecord(params.id)

  if (!testRecord) {
    notFound()
  }

  const personality = personalityTypes[testRecord.personalityType]

  // 安全地转换 scores
  const scores = (testRecord.scores as any) || {}

  return (
    <main className="min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="space-y-8">
          {/* 标题 */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              你的炒股人格
            </h1>
            <p className="text-lg md:text-xl text-gray-700 font-medium">
              基于你的回答生成的个性化分析
            </p>
          </div>

          {/* 海报视图 */}
          <PosterView
            personality={personality}
            scores={scores}
            testRecordId={testRecord.id}
          />

          {/* 操作按钮 */}
          <ResultActions />

          <p className="text-sm text-center text-gray-600 pt-6 font-medium">
            结果仅供娱乐参考，不构成投资建议
          </p>
        </div>
      </div>
    </main>
  )
}
