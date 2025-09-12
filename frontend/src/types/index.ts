export interface User {
  id: string
  email: string
  fullName: string
  role: string
}
export type Team = {
  _id: string
  name: string
  description?: string
  members?: string[]
}
export type Project = {
  _id: string
  name: string
  teamId: string
  description?: string
}
