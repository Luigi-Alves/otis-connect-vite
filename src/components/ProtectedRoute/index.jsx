import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext"
import { Container, Alert, Spinner } from "react-bootstrap";

export default function ProtectedRoute({ children, requiredRoles }) {
  const { user, isAuthenticated, loading, hasRole } = useAuth();

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0 && !hasRole(requiredRoles)) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          <Alert.Heading>Acesso Negado</Alert.Heading>
          <p>Você não possui permissão para acessar esta página.</p>
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
