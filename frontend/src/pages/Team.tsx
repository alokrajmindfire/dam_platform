import TeamForm from '@/components/teams/TeamForm'
import { useAuth } from '@/contexts/AuthContext'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { ManageMember } from '@/components/teams/ManageMember'

export default function Team() {
  const { isAdmin } = useAuth()

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        {isAdmin && (
          <div className="space-y-4 mt-4">
            <ManageMember />
            <TeamForm />
            <ProjectForm />
          </div>
        )}
      </div>
    </div>
  )
}
