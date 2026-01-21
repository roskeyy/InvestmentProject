'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { personalityTypes } from '@/data/personality-types'
import { getAuthToken } from '@/lib/auth'

interface TestRecord {
  id: string
  personalityType: string
  completedAt: string
  ipAddress: string
  inviteCode: { code: string }
}

export default function TestRecordList() {
  const [records, setRecords] = useState<TestRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRecords()
  }, [])

  const fetchRecords = async () => {
    try {
      const token = getAuthToken()
      if (!token) {
        return
      }

      const response = await fetch('/api/test-records', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setRecords(data)
      }
    } catch (error) {
      console.error('Fetch records error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <div>加载中...</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>测试记录 (最近100条)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {records.map((record) => {
            const personality = personalityTypes[record.personalityType]
            return (
              <div
                key={record.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{personality.emoji}</span>
                  <div>
                    <div className="font-medium">{personality.name}</div>
                    <div className="text-sm text-muted-foreground">
                      邀请码: {record.inviteCode.code} ·{' '}
                      {new Date(record.completedAt).toLocaleString()}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`/result/${record.id}`, '_blank')}
                >
                  查看详情
                </Button>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
