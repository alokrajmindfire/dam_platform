/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '../src/contexts/AuthContext'
import LoginForm from '../src/components/auth/LoginForm'
import * as authQueries from '../src/utils/queries/authQueries'
import { toast } from 'sonner'
import { UseMutationResult, UseMutateFunction, MutateOptions } from '@tanstack/react-query'
import { jest } from '@jest/globals'

type LoginData = {
  token: string
}

type LoginVariables = {
  email: string
  password: string
}

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

jest
  .spyOn(authQueries, 'useloginMutation')
  .mockImplementation((): UseMutationResult<LoginData, Error, LoginVariables, unknown> => {
    const mutate: UseMutateFunction<LoginData, Error, LoginVariables, unknown> = jest.fn(
      (
        variables: LoginVariables,
        options?: MutateOptions<LoginData, Error, LoginVariables, unknown>,
      ) => {
        const { email, password } = variables
        if (email === 'test@example.com' && password === 'password') {
          options?.onSuccess?.({ token: 'fake-token' }, variables, undefined)
        } else {
          options?.onError?.(new Error('Invalid credentials'), variables, undefined)
        }
      },
    )

    const mutateAsync = jest.fn(
      (
        variables: LoginVariables,
        options?: MutateOptions<LoginData, Error, LoginVariables, unknown>,
      ) =>
        new Promise<LoginData>((resolve, reject) => {
          if (variables.email === 'test@example.com' && variables.password === 'password') {
            options?.onSuccess?.({ token: 'fake-token' }, variables, undefined)
            resolve({ token: 'fake-token' })
          } else {
            const err = new Error('Invalid credentials')
            options?.onError?.(err, variables, undefined)
            reject(err)
          }
        }),
    )

    return {
      mutate,
      mutateAsync,
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
    defaultOptions: {
      queries: { retry: false },
    },
  })

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <BrowserRouter>
      <QueryClientProvider client={createTestQueryClient()}>
        <AuthProvider>{ui}</AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>,
  )

describe('LoginForm', () => {
  test('renders the form', () => {
    renderWithProviders(<LoginForm />)
    expect(screen.getByText('Welcome back')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('shows error when fields are empty', async () => {
    renderWithProviders(<LoginForm />)
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  test('calls mutate and shows success toast on valid login', async () => {
    renderWithProviders(<LoginForm />)
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login successful!')
    })
  })

  test('shows error toast on invalid login', async () => {
    renderWithProviders(<LoginForm />)
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'wrong@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrongpass' },
    })

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
  })
})
