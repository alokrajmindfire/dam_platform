import { BrowserRouter as Router } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import { Toaster } from '@/components/ui/sonner'
import { ErrorFallback } from '@/components/layout/ErrorFallBack'
import { AppProviders } from '@/providers/AppProviders'
import { AppRoutes } from '@/routes/AppRoutes'

function App() {
  return (
    <AppProviders>
      <Router>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <AppRoutes />
        </ErrorBoundary>
        <Toaster />
      </Router>
    </AppProviders>
  )
}

export default App
