import React from 'react'
import { Card } from '@/components/ui/card'
import { useTeamAssets } from '@/utils/queries/teamQueries'

export const TeamAssets: React.FC<{ teamId: string }> = ({ teamId }) => {
  const { data: assets = [], isLoading } = useTeamAssets(teamId)

  if (isLoading) return <p>Loading assets...</p>

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-2">Team Assets</h3>
      {assets.length === 0 ? (
        <p className="text-gray-500">No assets available.</p>
      ) : (
        <ul className="list-disc pl-4">
          {assets.map((asset: any) => (
            <li key={asset._id}>{asset.name}</li>
          ))}
        </ul>
      )}
    </Card>
  )
}
