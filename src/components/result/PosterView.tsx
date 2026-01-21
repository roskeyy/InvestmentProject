'use client'

import { Card, CardContent } from '@/components/ui/card'
import PersonalityType from '@/components/result/PersonalityType'

interface PosterViewProps {
  personality: any
  scores: {
    risk: number
    style: number
    frequency: number
    information: number
  }
  testRecordId: string
}

export default function PosterView({ personality, scores }: PosterViewProps) {

  return (
    <div className="space-y-6">
      {/* 海报预览 */}
      <Card className="overflow-hidden shadow-xl">
        <CardContent className="p-0">
          <PersonalityType personality={personality} scores={scores} />
        </CardContent>
      </Card>
    </div>
  )
}
