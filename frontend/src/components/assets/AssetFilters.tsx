import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { useTeams } from '@/utils/queries/teamQueries'

interface AssetFiltersProps {
  searchTerm: string
  setSearchTerm: (val: string) => void
  filter: string
  changeFilter: (val: string) => void
  teamId: string
  changeTeam: (val: string) => void
  date: string
  changeDate: (val: string) => void
}

export function AssetFilters({
  searchTerm,
  setSearchTerm,
  filter,
  changeFilter,
  teamId,
  changeTeam,
  date,
  changeDate,
}: AssetFiltersProps) {
  const { data: teams, isLoading } = useTeams()

  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-4">
      <Input
        type="text"
        placeholder="Search assets..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full sm:w-1/2"
      />

      <Select value={filter} onValueChange={changeFilter}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="image">Images</SelectItem>
          <SelectItem value="video">Videos</SelectItem>
          <SelectItem value="document">Documents</SelectItem>
        </SelectContent>
      </Select>

      <Select value={teamId} onValueChange={changeTeam}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Filter by team" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0">All Teams</SelectItem>
          {!isLoading &&
            teams?.map((team: any) => (
              <SelectItem key={team._id} value={team._id}>
                {team.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={date}
        onChange={(e) => changeDate(e.target.value)}
        className="w-full sm:w-40"
      />
    </div>
  )
}
