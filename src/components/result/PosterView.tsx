'use client'

import { useState, useEffect } from 'react'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Download, Share2, Loader2 } from 'lucide-react'
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

export default function PosterView({ personality, scores, testRecordId }: PosterViewProps) {
  const [posterUrl, setPosterUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPoster = useCallback(async () => {
    try {
      const response = await fetch(`/api/poster/${testRecordId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.posterUrl) {
          setPosterUrl(data.posterUrl)
        }
      }
    } catch (err) {
      console.error('Fetch poster error:', err)
    }
  }, [testRecordId])

  useEffect(() => {
    fetchPoster()
  }, [fetchPoster])

  const generatePoster = async () => {
    setIsGenerating(true)
    setError(null)
    try {
      const response = await fetch(`/api/poster/${testRecordId}`, {
        method: 'POST',
      })
      if (!response.ok) throw new Error('生成失败')
      const data = await response.json()
      setPosterUrl(data.posterUrl)
    } catch (err) {
      setError('海报生成失败，请稍后重试')
      console.error('Generate poster error:', err)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadPoster = () => {
    if (!posterUrl) return
    const link = document.createElement('a')
    link.href = posterUrl
    link.download = `炒股人格-${personality.name}.png`
    link.click()
  }

  const sharePoster = async () => {
    if (navigator.share && posterUrl) {
      try {
        const response = await fetch(posterUrl)
        const blob = await response.blob()
        const file = new File([blob], `炒股人格-${personality.name}.png`, { type: 'image/png' })
        await navigator.share({
          title: '我的炒股人格测试结果',
          text: `我是${personality.emoji} ${personality.name}！测测你的炒股人格`,
          files: [file],
        })
      } catch (error) {
        console.log('Share error:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* 海报预览 */}
      <Card className="overflow-hidden shadow-xl">
        <CardContent className="p-0">
          <PersonalityType personality={personality} scores={scores} />
        </CardContent>
      </Card>

      {/* 错误提示 */}
      {error && (
        <div className="bg-destructive/15 text-destructive px-6 py-4 rounded-lg text-lg font-medium text-center">
          {error}
        </div>
      )}

      {/* 操作按钮 */}
      <div className="flex gap-4">
        {!posterUrl ? (
          <Button
            onClick={generatePoster}
            disabled={isGenerating}
            className="flex-1 h-14 text-lg"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                生成中...
              </>
            ) : (
              '生成海报图片'
            )}
          </Button>
        ) : (
          <>
            <Button onClick={downloadPoster} className="flex-1 h-14 text-lg" size="lg">
              <Download className="w-5 h-5 mr-2" />
              下载图片
            </Button>
            {typeof navigator.share !== 'undefined' && (
              <Button onClick={sharePoster} variant="outline" size="lg" className="h-14 px-6">
                <Share2 className="w-5 h-5" />
              </Button>
            )}
          </>
        )}
      </div>

      {posterUrl && (
        <div className="mt-6">
          <img
            src={posterUrl}
            alt="炒股人格海报"
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  )
}
