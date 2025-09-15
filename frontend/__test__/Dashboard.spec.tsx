/// <reference types="@testing-library/jest-dom" />

import { render, screen } from '@testing-library/react'
import { useAuth } from '../src/contexts/AuthContext'
import Dashboard from '../src/pages/Dashboard'

jest.mock('@/components/assets/UploadZone', () => () => (
  <div data-testid="upload-zone">UploadZone</div>
))
jest.mock('@/components/admin/AdminDashboard', () => () => (
  <div data-testid="admin-dashboard">AdminDashboard</div>
))

jest.mock('@/contexts/AuthContext')

const mockedUseAuth = useAuth as jest.Mock

describe('Dashboard page', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders UploadZone for all users', () => {
    mockedUseAuth.mockReturnValue({ isAdmin: false })

    render(<Dashboard />)

    expect(screen.getByTestId('upload-zone')).toBeInTheDocument()

    expect(screen.queryByTestId('admin-dashboard')).not.toBeInTheDocument()
  })

  test('renders AdminDashboard when user is admin', () => {
    mockedUseAuth.mockReturnValue({ isAdmin: true })

    render(<Dashboard />)

    expect(screen.getByTestId('upload-zone')).toBeInTheDocument()

    expect(screen.getByTestId('admin-dashboard')).toBeInTheDocument()
  })

  test('layout has correct structure and spacing classes', () => {
    mockedUseAuth.mockReturnValue({ isAdmin: false })

    const { container } = render(<Dashboard />)
    const root = container.firstChild as HTMLElement

    expect(root).toHaveClass('space-y-6', 'pb-20', 'md:pb-6')
  })
})
