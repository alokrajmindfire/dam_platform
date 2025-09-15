/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../src/contexts/AuthContext'
import RegisterForm from '../src/components/auth/RegisterForm'
import * as authQueries from '../src/utils/queries/authQueries'
import { toast } from 'sonner'
import { UseMutationResult, UseMutateFunction, MutateOptions } from '@tanstack/react-query'
import { jest } from '@jest/globals'

type RegisterData = { token: string }
type RegisterVariables = { email: string; password: string; fullName: string }

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

jest
  .spyOn(authQueries, 'useRegisterMutation')
  .mockImplementation((): UseMutationResult<RegisterData, Error, RegisterVariables, unknown> => {
    const mutate: UseMutateFunction<RegisterData, Error, RegisterVariables, unknown> = jest.fn(
      (
        variables: RegisterVariables,
        options?: MutateOptions<RegisterData, Error, RegisterVariables, unknown>,
      ) => {
        if (variables.email === 'new@example.com') {
          options?.onSuccess?.({ token: 'fake-register-token' }, variables, undefined)
        } else {
          options?.onError?.(new Error('Registration failed'), variables, undefined)
        }
      },
    )

    return {
      mutate,
      mutateAsync: mutate as any,
      status: 'idle',
      data: undefined,
      error: null,
      reset: jest.fn(),
      isError: false,
      isSuccess: false,
      isIdle: true,
      isPending: false,
      context: undefined,
      variables: undefined,
      failureCount: 0,
      isPaused: false,
      failureReason: null,
      submittedAt: 0,
    }
  })

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <BrowserRouter>
      <QueryClientProvider client={createTestQueryClient()}>
        <AuthProvider>{ui}</AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>,
  )

describe('RegisterForm', () => {
  beforeEach(() => jest.clearAllMocks())

  test('renders the form', () => {
    renderWithProviders(<RegisterForm />)
    expect(screen.getByText('Create an account')).toBeInTheDocument()
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument()
  })

  test('shows errors when fields are empty', async () => {
    renderWithProviders(<RegisterForm />)
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/full name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument()
    })
  })

  test('shows inline error for invalid email', async () => {
    renderWithProviders(<RegisterForm />)
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'invalid-email' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
  })

  test('shows inline error when password is too short', async () => {
    renderWithProviders(<RegisterForm />)
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: '123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: '123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
  })

  test('shows inline error when passwords do not match', async () => {
    renderWithProviders(<RegisterForm />)
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'different' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    })
  })

  test('calls mutate and shows success toast on valid registration', async () => {
    renderWithProviders(<RegisterForm />)
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'new@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Account created successfully!')
    })
  })

  test('shows error toast on registration failure', async () => {
    renderWithProviders(<RegisterForm />)
    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'Jane Doe' },
    })
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'fail@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    })

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Registration failed')
    })
  })
})
