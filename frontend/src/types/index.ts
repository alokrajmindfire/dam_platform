export interface User {
  _id: string
  email: string
  fullName: string
  role: string
  profileVisibility: 'public' | 'private'
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
