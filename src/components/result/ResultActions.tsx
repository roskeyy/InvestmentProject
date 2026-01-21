'use client'

import { Button } from '@/components/ui/button'

export default function ResultActions() {
  return (
    <div className="flex gap-4 justify-center pt-6">
      <Button
        onClick={() => (window.location.href = '/')}
        variant="default"
        className="flex-1 h-14 text-lg font-semibold"
      >
        返回首页
      </Button>
    </div>
  )
}

