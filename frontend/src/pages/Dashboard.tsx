import UploadZone from '@/components/assets/UploadZone'
// import { useAuth } from '@/contexts/AuthContext'

export default function Dashboard() {
  // const { isAdmin } = useAuth()

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <div className="md:col-span-2">
          <UploadZone />
        </div>
      </div>
    </div>
  )
}
