// Layout/index.jsx
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap"; 
import { useAuth } from "../../contexts/AuthContext";
import { Link, useNavigate, Navigate, useLocation } from "react-router-dom"; 
import {
  LogOut,
  Home,
  FileText,
  BarChart3,
  Settings,
  MessageSquare, 
  TrendingUp,
  MessageCircle,
  HelpCircle,
  User, 
} from "lucide-react";
import Logo from "../Logo";

// Componente para os links de navegação dentro da Navbar
const TopNavigationLinks = ({ hasRole }) => {
  const location = useLocation(); 

  
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <Nav className="me-auto d-none d-lg-flex gap-2">
      
      {/* Dashboard - Sempre visível */}
      <Nav.Link
        as={Link}
        to="/dashboard"
        className={`d-flex align-items-center gap-1 ${isActive('/dashboard') ? 'text-primary fw-bold' : 'text-dark'}`}
        title="Dashboard"
      >
        <Home size={18} />
        <span className="d-none d-xl-inline">Dashboard</span>
      </Nav.Link>

      {/* Projetos (Internos) */}
      {hasRole(["sales", "supervisor", "admin", "field", "quality"]) && (
        <Nav.Link
          as={Link}
          to="/projects"
          className={`d-flex align-items-center gap-1 ${isActive('/projects') ? 'text-primary fw-bold' : 'text-dark'}`}
          title="Projetos"
        >
          <FileText size={18} />
           <span className="d-none d-xl-inline">Projetos</span>
        </Nav.Link>
      )}

      {/* Meus Projetos (Cliente) */}
      {hasRole(["client"]) && (
        <Nav.Link
          as={Link}
          to="/client"
          className={`d-flex align-items-center gap-1 ${isActive('/client') ? 'text-primary fw-bold' : 'text-dark'}`}
          title="Meus Projetos"
        >
          <BarChart3 size={18} />
           <span className="d-none d-xl-inline">Meus Projetos</span>
        </Nav.Link>
      )}

      {/* Feedback (Cliente) */}
      {hasRole(["client"]) && (
         <Nav.Link
            as={Link}
            to="/client/feedback"
            className={`d-flex align-items-center gap-1 ${isActive('/client/feedback') ? 'text-primary fw-bold' : 'text-dark'}`}
            title="Enviar Feedback"
          >
            <MessageCircle size={18} />
             <span className="d-none d-xl-inline">Feedback</span>
          </Nav.Link>
      )}

      {/* Inspeções */}
      {hasRole(["quality", "supervisor", "admin"]) && (
        <Nav.Link
          as={Link}
          to="/inspections"
          className={`d-flex align-items-center gap-1 ${isActive('/inspections') ? 'text-primary fw-bold' : 'text-dark'}`}
          title="Inspeções"
        >
          <MessageSquare size={18} />
           <span className="d-none d-xl-inline">Inspeções</span>
        </Nav.Link>
      )}

      {/* KPIs */}
       {hasRole(["supervisor", "admin", "sales"]) && (
        <Nav.Link
          as={Link}
          to="/kpis"
          className={`d-flex align-items-center gap-1 ${isActive('/kpis') ? 'text-primary fw-bold' : 'text-dark'}`}
          title="KPIs"
        >
          <TrendingUp size={18} />
           <span className="d-none d-xl-inline">KPIs</span>
        </Nav.Link>
      )}

      {/* Administração */}
      {hasRole(["admin"]) && (
        <Nav.Link
          as={Link}
          to="/admin"
          className={`d-flex align-items-center gap-1 ${isActive('/admin') ? 'text-primary fw-bold' : 'text-dark'}`}
          title="Administração"
        >
          <Settings size={18} />
           <span className="d-none d-xl-inline">Admin</span>
        </Nav.Link>
      )}

      {/* Suporte */}
      <Nav.Link
        as={Link}
        to="/support"
        className={`d-flex align-items-center gap-1 ${isActive('/support') ? 'text-primary fw-bold' : 'text-dark'}`}
        title="Suporte"
      >
        <HelpCircle size={18} />
         <span className="d-none d-xl-inline">Suporte</span>
      </Nav.Link>
    </Nav>
  );
};

export function Layout({ children }) {
  const { user, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar Principal */}
      <Navbar bg="light" expand="lg" sticky="top" className="shadow-sm border-bottom">
        <Container fluid>

          {/* Logo */}
          <Navbar.Brand as={Link} to="/dashboard" className="p-0 me-3">
            <Logo />
          </Navbar.Brand>

          {/* Links de Navegação */}
          <TopNavigationLinks hasRole={hasRole} />

          {/* Informações do Usuário e Logout */}
          <Nav className="ms-auto">
            <NavDropdown 
              title={
                <span className="d-flex align-items-center">
                  <User size={18} className="me-1" /> 
                  <span className="d-none d-md-inline">{user?.name} ({user?.role})</span>
                </span>
              } 
              id="user-nav-dropdown" 
              align="start"
            >
              <NavDropdown.Header className="d-md-none small">
                  {user?.name} ({user?.role})
              </NavDropdown.Header>
              <NavDropdown.Divider className="d-md-none" />
              
              <NavDropdown.Item onClick={handleLogout} className="text-danger">
                <LogOut size={16} className="me-2" /> Sair
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

        </Container>
      </Navbar>

      {/* Conteúdo Principal */}
      <main className="flex-grow-1 bg-light d-flex flex-column">
        <Container fluid className="py-4 flex-grow-1 d-flex flex-column">
          {children}
        </Container>
      </main>
    </div>
  );
}