import UploadZone from '@/components/assets/UploadZone'
import { useAuth } from '@/contexts/AuthContext'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function Dashboard() {
  const { isAdmin } = useAuth()

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <div className="md:col-span-2">
          <UploadZone />
        </div>
        {isAdmin && (
          <div className="space-y-4 mt-4">
            <AdminDashboard />
          </div>
        )}
      </div>
    </div>
  )
}
