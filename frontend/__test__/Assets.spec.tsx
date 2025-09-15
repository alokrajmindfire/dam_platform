/// <reference types="@testing-library/jest-dom" />

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AssetCard } from '../src/components/assets/AssetCard'
import '@testing-library/jest-dom'

jest.mock('../src/contexts/AuthContext', () => ({
  useAuth: () => ({ user: { _id: 'user2' } }),
}))

jest.mock('../src/utils/queries/assetsQueries', () => ({
  useIncrementDownload: () => ({
    mutateAsync: jest.fn().mockResolvedValue({}),
  }),
  useDeleteMutation: () => ({
    mutate: jest.fn(),
  }),
}))

const createTestQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

const renderWithProviders = (ui: React.ReactNode) =>
  render(<QueryClientProvider client={createTestQueryClient()}>{ui}</QueryClientProvider>)

const asset = {
  _id: '1',
  originalName: 'File1.pdf',
  mimeType: 'application/pdf',
  url: 'http://example.com/file.pdf',
  userId: 'user1',
  size: 1048576,
  status: 'active',
  downloadCount: 0,
}

describe('AssetCard', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        blob: () => Promise.resolve(new Blob(['file content'])),
      } as any),
    ) as jest.Mock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('renders asset card button', () => {
    renderWithProviders(<AssetCard asset={asset} />)
    const button = screen.getByRole('button', { name: /Open asset File1.pdf/i })
    expect(button).toBeInTheDocument()
  })

  //   test("opens modal on click", async () => {
  //     renderWithProviders(<AssetCard asset={asset} />);
  //     const button = screen.getByRole("button", { name: /Open asset File1.pdf/i });
  //     fireEvent.click(button);

  //     await waitFor(() => {
  //       expect(screen.getByText("File1.pdf")).toBeInTheDocument();
  //       expect(screen.getByText(/Size:/i)).toBeInTheDocument();
  //       expect(screen.getByText(/Type:/i)).toBeInTheDocument();
  //     });
  //   });

  //   test("downloads file when download button is clicked", async () => {
  //     renderWithProviders(<AssetCard asset={{ ...asset, userId: "user2" }} />);
  //     fireEvent.click(screen.getByRole("button", { name: /Open asset File1.pdf/i }));

  //     const downloadButton = await screen.findByRole("button", { name: /Download/i });
  //     fireEvent.click(downloadButton);

  //     await waitFor(() => {
  //       expect(global.fetch).toHaveBeenCalledWith(asset.url);
  //     });
  //   });
})
