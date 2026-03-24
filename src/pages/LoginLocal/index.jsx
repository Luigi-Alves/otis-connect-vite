// LoginLocal/index.jsx
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { User, Briefcase, Wrench, CheckCircle, Users, Lock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../components/Logo"

const PROFILES = [
  {
    role: "client",
    name: "Cliente",
    description: "Acompanhar projetos",
    icon: User,
    color: "bg-primary",
  },
  {
    role: "sales",
    name: "Vendas",
    description: "Gerencie contratos",
    icon: Briefcase,
    color: "bg-warning",
  },
  {
    role: "field",
    name: "Time de Campo",
    description: "Instalação",
    icon: Wrench,
    color: "bg-success",
  },
  {
    role: "quality",
    name: "Time de Qualidade",
    description: "Inspeção e aprovação",
    icon: CheckCircle,
    color: "bg-info",
  },
  {
    role: "supervisor",
    name: "Supervisor",
    description: "Visão gerencial",
    icon: Users,
    color: "bg-secondary",
  },
  {
    role: "admin",
    name: "Administrador",
    description: "Controle total",
    icon: Lock,
    color: "bg-danger",
  },
];

// Estilo para o hover dos icones

const hoverStyle = {

  transition: "all 0.3s ease",
  cursor: "pointer",

};

export default function LoginLocal() {
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSelectProfile = (role) => {
  
    login(role);
    navigate("/dashboard");
  
  };

  return (
    <div
      // Imagem de fundo
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=600&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Overlay escuro */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          zIndex: 0,
        }}
      />

      <Container style={{ position: "relative", zIndex: 1 }}>
        <Row className="justify-content-center">
          <Col lg={8} xl={7}>
            <Card className="border-0 shadow-lg">
              {/* Header com logo e título */}
              <div className="pt-5 px-5">
                <Logo
                  fontSize={2.5}
                  shadowBox={false}
                />
              </div>
              {/* Conteúdo */}
              <Card.Body className="p-5">
                <h3 className="text-center mb-4 fw-bold text-dark">Selecione seu perfil de acesso</h3>

                <Row className="g-3">
                  {PROFILES.map((profile) => {
                    const IconComponent = profile.icon;
                    return (
                      <Col md={6} key={profile.role}>
                        <Button
                          variant="light"
                          className="w-100 p-4 text-start border-2 border-light shadow-sm"
                          onClick={() => handleSelectProfile(profile.role)}
                          style={hoverStyle}
                        >
                          <div className="d-flex align-items-start gap-3">
                            <div
                              className={`${profile.color} text-white rounded-3 p-3 flex-shrink-0`}
                              style={{ width: "60px", height: "60px", display: "flex", alignItems: "center", justifyContent: "center" }}
                            >
                              <IconComponent size={28} />
                            </div>
                            <div className="flex-grow-1">
                              <h5 className="mb-1 fw-bold text-dark">{profile.name}</h5>
                              <p className="mb-0 text-muted small">{profile.description}</p>
                            </div>
                          </div>
                        </Button>
                      </Col>
                    );
                  })}
                </Row>

                {/* Rodapé informativo */}
                <div className="mt-5 pt-4 border-top">
                  <p className="text-center text-muted small mb-0">
                    💡 Selecione um perfil para acessar a plataforma com as funcionalidades correspondentes ao seu papel.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
