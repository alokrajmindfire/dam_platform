import TeamForm from '@/components/teams/TeamForm'
import UploadZone from '@/components/assets/UploadZone'
import { useAuth } from '@/contexts/AuthContext'
import { ProjectForm } from '@/components/projects/ProjectForm'
import { ManageMember } from '@/components/teams/ManageMember'
import { TeamAssets } from '@/components/teams/TeamAssets'

export default function Team() {
  const { isAdmin } = useAuth()

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      <div>
        {isAdmin && (
          <div className="space-y-4 mt-4">
            <TeamForm />
            <ProjectForm />
            <ManageMember />
            <TeamAssets teamId={'68c3a937ac022644f77a76b1'} />
          </div>
        )}
      </div>
    </div>
  )
}
