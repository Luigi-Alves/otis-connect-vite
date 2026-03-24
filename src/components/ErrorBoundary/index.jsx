// ErrorBoundary/index.jsx
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component } from "react";
import { Container, Card, Button } from "react-bootstrap";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="min-vh-100 d-flex align-items-center justify-content-center p-4">
          <Card className="w-100 shadow-lg" style={{ maxWidth: "600px" }}>
            <Card.Body className="p-5 text-center">
              <AlertTriangle
                size={48}
                className="text-danger mb-4 mx-auto"
              />

              <h2 className="h4 mb-3 text-dark">Ocorreu um erro inesperado.</h2>

              <div className="bg-light p-3 rounded text-start mb-4 overflow-auto" style={{ maxHeight: "200px" }}>
                <pre className="text-sm text-muted" style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
                  {this.state.error?.stack}
                </pre>
              </div>

              <Button
                variant="primary"
                onClick={() => window.location.reload()}
                className="d-flex align-items-center justify-content-center mx-auto"
              >
                <RotateCcw size={16} className="me-2" />
                Recarregar Página
              </Button>
            </Card.Body>
          </Card>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
