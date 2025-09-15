/// <reference types="@testing-library/jest-dom" />

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AdminDashboard from '../src/components/admin/AdminDashboard'
import '@testing-library/jest-dom'

jest.mock('../src/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('../src/components/ui/skeleton', () => ({
  Skeleton: ({ className }: any) => <div className={className} />,
}))

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  BarChart: ({ children }: any) => <div>{children}</div>,
  Bar: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
}))

jest.mock('../src/utils/queries/dashboardQueries', () => ({
  useDashboardStash: jest.fn(),
}))

import { useDashboardStash } from '../src/utils/queries/dashboardQueries'
const mockedUseDashboardStash = useDashboardStash as jest.MockedFunction<typeof useDashboardStash>

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <BrowserRouter>
      <QueryClientProvider client={createTestQueryClient()}>{ui}</QueryClientProvider>
    </BrowserRouter>,
  )

describe('AdminDashboard', () => {
  beforeEach(() => {
    mockedUseDashboardStash.mockReturnValue({
      isLoading: false,
      data: {
        totalAssets: 10,
        totalDownloads: 50,
        uploadCounts: [
          { _id: 'Day1', count: 5 },
          { _id: 'Day2', count: 8 },
        ],
        latestAssets: [
          {
            _id: '1',
            originalName: 'File1.pdf',
            mimeType: 'application/pdf',
            createdAt: '2025-09-10',
          },
          {
            _id: '2',
            originalName: 'Image1.png',
            mimeType: 'image/png',
            createdAt: '2025-09-11',
          },
        ],
      },
    } as any)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders total assets and total downloads', async () => {
    renderWithProviders(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByText('10')).toBeInTheDocument()
      expect(screen.getByText('50')).toBeInTheDocument()
    })
  })

  test('renders latest assets list', async () => {
    renderWithProviders(<AdminDashboard />)
    await waitFor(() => {
      expect(screen.getByText('File1.pdf')).toBeInTheDocument()
      expect(screen.getByText('Image1.png')).toBeInTheDocument()
      expect(screen.getByText('application/pdf')).toBeInTheDocument()
      expect(screen.getByText('image/png')).toBeInTheDocument()
    })
  })
})
