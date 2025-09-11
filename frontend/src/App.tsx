import { BrowserRouter as Router } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from '@/components/ui/sonner'
import { ErrorFallback } from '@/components/layout/ErrorFallBack'
import { AppProviders } from '@/providers/AppProviders'
import { AppRoutes } from '@/routes/AppRoutes'
import { memo } from 'react'

const App = memo(() => {
  return (
    <AppProviders>
      <Router>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AppRoutes />
        </ErrorBoundary>
        <Toaster richColors position="top-right" />
      </Router>
    </AppProviders>
  )
})

App.displayName = 'App'
export default App
