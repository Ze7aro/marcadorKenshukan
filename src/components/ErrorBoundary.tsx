import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@heroui/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary Component
 * Captura errores de React y muestra una UI de fallback
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(): Partial<State> {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log del error
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // Aquí podrías enviar el error a un servicio de logging como Sentry
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // UI personalizada de fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-red-50 to-red-100 dark:from-gray-900 dark:to-gray-800 p-4">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 dark:bg-red-900 rounded-full">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>

            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                ¡Algo salió mal!
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Lo sentimos, ocurrió un error inesperado. Por favor, intenta
                recargar la página.
              </p>
            </div>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="bg-gray-100 dark:bg-gray-700 rounded p-4 text-sm">
                <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Detalles del error (solo en desarrollo)
                </summary>
                <div className="mt-2 space-y-2">
                  <div>
                    <strong className="text-red-600 dark:text-red-400">
                      Error:
                    </strong>
                    <pre className="mt-1 text-xs overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong className="text-red-600 dark:text-red-400">
                        Stack trace:
                      </strong>
                      <pre className="mt-1 text-xs overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            <div className="flex gap-2">
              <Button
                className="flex-1"
                color="primary"
                onPress={this.handleReset}
              >
                Intentar de nuevo
              </Button>
              <Button
                className="flex-1"
                color="default"
                variant="bordered"
                onPress={() => window.location.reload()}
              >
                Recargar página
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
