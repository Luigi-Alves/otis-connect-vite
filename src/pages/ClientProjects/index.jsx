// ClientProjects/index.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Alert, Button, ProgressBar } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { 
  getAllProjects,
  getProjectsByUser,
  getStatusLabel,
  getStatusColor,
  getProgressValue
} from "../../data/mockProjects";
import { MessageCircle, ArrowRight, Eye } from "lucide-react";

export default function ClientProjects() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [user.id]);

  const loadProjects = () => {
    const allProjects = getAllProjects();
    const clientProjects = getProjectsByUser(user, allProjects);
    setProjects(clientProjects);
    setLoading(false);
  };

  // Estatísticas
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.projectStatus === 10).length;
  const inProgressProjects = projects.filter(p => p.projectStatus > 1 && p.projectStatus < 10).length;
  const reviewRequested = projects.filter(p => p.projectStatus === 9).length;

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid>
      {/* Header com botão de feedback */}
      <Row className="mb-4">
        <Col>
          <h1 className="h3 fw-bold">Meus Projetos</h1>
          <p className="text-muted">Acompanhe o status de seus projetos</p>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary" 
            onClick={() => navigate('/client/feedback')}
            className="d-flex align-items-center gap-2"
          >
            <MessageCircle size={18} />
            Enviar Feedback
          </Button>
        </Col>
      </Row>

      {/* KPIs do Cliente */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <p className="text-muted small mb-1">Total de Projetos</p>
              <h3 className="fw-bold mb-0 text-primary">{totalProjects}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <p className="text-muted small mb-1">Em Andamento</p>
              <h3 className="fw-bold mb-0 text-warning">{inProgressProjects}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <p className="text-muted small mb-1">Concluídos</p>
              <h3 className="fw-bold mb-0 text-success">{completedProjects}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <p className="text-muted small mb-1">Em Revisão</p>
              <h3 className="fw-bold mb-0 text-danger">{reviewRequested}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lista de Projetos */}
      {projects.length === 0 ? (
        <Alert variant="info">
          <strong>Nenhum projeto encontrado.</strong><br />
          Você não possui projetos associados à sua conta no momento.
        </Alert>
      ) : (
        <Row>
          {projects.map((project) => {
            const progressValue = getProgressValue(project.projectStatus);
            const isCompleted = project.projectStatus === 10;
            const isOverdue = new Date(project.projectDtExpectedEndDate) < new Date() && !isCompleted;
            
            return (
              <Col md={6} lg={4} key={project.projectId} className="mb-4">
                <Card className={`border-0 shadow-sm h-100 ${isOverdue ? 'border-warning' : ''}`}>
                  <Card.Body className="d-flex flex-column">
                    {/* Header do Card */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <Link 
                          to={`/projects/${project.projectId}`} 
                          className="text-decoration-none"
                        >
                          <h6 className="fw-bold mb-0 text-truncate text-dark" title={project.projectName}>
                            {project.projectName}
                          </h6>
                        </Link>
                        <Badge bg={getStatusColor(project.projectStatus)} className="flex-shrink-0">
                          {getStatusLabel(project.projectStatus)}
                        </Badge>
                      </div>
                      <p className="text-muted small mb-0">
                        {project.projectOtisBranch}
                      </p>
                    </div>

                    {/* Descrição */}
                    <p className="small text-muted mb-3 flex-grow-1">
                      {project.projectDescription}
                    </p>

                    {/* Progresso */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <span className="small text-muted">Progresso</span>
                        <span className="small fw-bold">{progressValue}%</span>
                      </div>
                      <ProgressBar 
                        now={progressValue} 
                        variant={
                          progressValue < 30 ? "primary" :
                          progressValue < 70 ? "warning" : "success"
                        }
                        style={{ height: "6px" }}
                      />
                    </div>

                    {/* Datas */}
                    <div className="mb-3">
                      <div className="row small text-muted">
                        <div className="col-6">
                          <strong>Início:</strong><br />
                          {new Date(project.projectDtStartDate).toLocaleDateString("pt-BR")}
                        </div>
                        <div className="col-6 text-end">
                          <div>
                            <strong>Prazo:</strong><br />
                            <span className={isOverdue ? "text-danger fw-bold" : ""}>
                              {new Date(project.projectDtExpectedEndDate).toLocaleDateString("pt-BR")}
                              {isOverdue && " ⚠️"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ações */}
                    <div className="mt-auto">
                      <div className="d-flex gap-2">
                        <Button 
                          variant="outline-primary"
                          size="sm"
                          as={Link}
                          to={`/projects/${project.projectId}`}
                          className="d-flex align-items-center gap-1 flex-grow-1"
                        >
                          <Eye size={14} />
                          Ver Detalhes
                        </Button>
                        
                        {isCompleted && (
                          <Button 
                            variant="outline-success" 
                            size="sm"
                            onClick={() => navigate('/client/feedback', { state: { projectId: project.projectId } })}
                            className="d-flex align-items-center gap-1"
                            title="Avaliar projeto concluído"
                          >
                            <MessageCircle size={14} />
                          </Button>
                        )}
                      </div>
                      
                      {!isCompleted && (
                        <div className="text-center mt-2">
                          <small className="text-muted">
                            Disponível para feedback após conclusão
                          </small>
                        </div>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Informações para o Cliente */}
      {projects.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <Card.Title className="mb-0">💡 Como Acompanhar Seus Projetos</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <h6 className="fw-bold mb-3">📊 Status dos Projetos</h6>
                    <div className="small text-muted">
                      <div className="mb-2">
                        <Badge bg="primary" className="me-2">Contrato Fechado</Badge>
                        <span>Projeto iniciado, aguardando planejamento</span>
                      </div>
                      <div className="mb-2">
                        <Badge bg="warning" className="me-2">Em Andamento</Badge>
                        <span>Equipe OTIS trabalhando no projeto</span>
                      </div>
                      <div className="mb-2">
                        <Badge bg="info" className="me-2">Aguardando Inspeção</Badge>
                        <span>Projeto aguardando verificação de qualidade</span>
                      </div>
                      <div className="mb-2">
                        <Badge bg="success" className="me-2">Concluído</Badge>
                        <span>Projeto finalizado e aprovado</span>
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <h6 className="fw-bold mb-3">🔍 Ações Disponíveis</h6>
                    <ul className="small text-muted">
                      <li><strong>Clique em "Ver Detalhes"</strong> para acompanhar o progresso completo</li>
                      <li><strong>Projetos concluídos</strong> podem receber seu feedback</li>
                      <li><strong>Prazos em vermelho</strong> indicam projetos com atraso</li>
                      <li><strong>Dúvidas?</strong> Entre em contato com nosso suporte</li>
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}