import { Component } from 'react';
import type { ReactNode, ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-pink-400 to-orange-400 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <span className="text-6xl block mb-4">🦉</span>
            <h1 className="font-display text-2xl font-bold text-gray-800 mb-2">
              Whoops!
            </h1>
            <p className="text-gray-600 font-display mb-6">
              Something went wrong. Don't worry — your progress is saved!
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="w-full py-3 rounded-2xl font-display font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-opacity"
            >
              Back to the Nest! 🏠
            </button>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left">
                <summary className="text-xs text-gray-400 cursor-pointer">Error details</summary>
                <pre className="text-xs text-red-500 mt-2 overflow-auto max-h-40 bg-red-50 p-2 rounded-lg">
                  {this.state.error.message}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
