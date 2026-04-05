import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'

type Props = { children: ReactNode }
type State = { hasError: boolean; message?: string }

/** Catches render errors in the subtree and shows a friendly fallback UI. */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
          <h1 className="font-heading text-2xl font-semibold text-slate-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm text-slate-600 dark:text-slate-400">
            {this.state.message ?? 'An unexpected error occurred. Please try again or return home.'}
          </p>
          <Button asChild>
            <Link to="/">Back to Home</Link>
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
