// App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { Layout } from "./components/Layout";
import { ThemeProvider } from "styled-components";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LoginLocal from "./pages/LoginLocal";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import ClientFeedback from "./pages/Feedback";
import ClientProjects from "./pages/ClientProjects";
import CreateProject from "./pages/Projects/CreateProject";
import Projects from "./pages/Projects/Projects";
import ProjectDetail from "./pages/Projects/ProjectDetail";
import Inspections from "./pages/Inspections/Inspections";
import NewInspection from "./pages/Inspections/NewInspection";
import InspectionDetail from "./pages/Inspections/InspectionDetail";
import KPIs from "./pages/Kpis";
import Support from "./pages/Support";

const ProtectedRouteElement = ({ element, requiredRoles }) => (
  <ProtectedRoute requiredRoles={requiredRoles}>
    <Layout>{element}</Layout>
  </ProtectedRoute>
);

function AppRouter() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route path="/login" element={<LoginLocal />} />

      {/* Dashboard - Acessível para todos os roles autenticados */}
      <Route
        path="/dashboard"
        element={<ProtectedRouteElement element={<Dashboard />} />}
      />

      {/* Admin - Acessível apenas para admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRouteElement
            element={<Admin />}
            requiredRoles={['admin']}
          />
        }
      />

      <Route
        path="/client"
        element={
          <ProtectedRouteElement
            element={<ClientProjects />}
            requiredRoles={['client']}
          />
        }
      />

      <Route
        path="/client/feedback"
        element={
          <ProtectedRouteElement
            element={<ClientFeedback />}
            requiredRoles={['client']}
          />
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRouteElement
            element={<Projects />}
            requiredRoles={['sales', 'supervisor', 'admin', 'quality', 'field']}
          />
        }
      />

      <Route
        path="/projects/new"
        element={
          <ProtectedRouteElement
            element={<CreateProject />}
            requiredRoles={['sales', 'supervisor', 'admin']}
          />
        }
      />

      <Route
        path="/projects/:id"
        element={
          <ProtectedRouteElement
            element={<ProjectDetail />}
            requiredRoles={['sales', 'supervisor', 'admin', 'field', 'quality', 'client']}
          />
        }
      />

      <Route
        path="/inspections"
        element={
          <ProtectedRouteElement
            element={<Inspections />}
            requiredRoles={["quality", "admin", "supervisor"]}
          />
        }
      />

      <Route
        path="/inspections/:id"
        element={
          <ProtectedRouteElement
            element={<InspectionDetail />}
            requiredRoles={["quality", "admin", "supervisor"]}
          />
        }
      />

      <Route
        path="/inspections/new"
        element={
          <ProtectedRouteElement
            element={<NewInspection />}
            requiredRoles={["quality", "admin"]}
          />
        }
      />

      <Route
        path="/kpis"
        element={
          <ProtectedRouteElement
            element={<KPIs />}
            requiredRoles={["supervisor", "admin", "sales"]}
          />
        }
      />

      <Route
        path="/support"
        element={
          <ProtectedRouteElement
            element={<Support />}
          />
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider theme={{}}>
          <AuthProvider>
            <AppRouter />
          </AuthProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}