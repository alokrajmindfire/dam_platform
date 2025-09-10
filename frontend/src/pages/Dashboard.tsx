import { UploadZone } from '@/components/assets/UploadZone'
import React from 'react'

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <UploadZone />
    </div>
  )
}

export default Dashboard
