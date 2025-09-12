import TeamForm from '@/components/teams/TeamForm'
import UploadZone from '@/components/assets/UploadZone'
import { useAuth } from '@/contexts/AuthContext'
import { ProjectForm } from '@/components/projects/ProjectForm'

export default function Dashboard() {
  const { isAdmin } = useAuth()

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        <div className="md:col-span-2">
          <UploadZone />
        </div>
        {isAdmin && (
          <div className="space-y-4 mt-3">
            <TeamForm />
            <ProjectForm />
          </div>
        )}
      </div>
    </div>
  )
}
