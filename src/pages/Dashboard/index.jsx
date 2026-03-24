// Dashboard/index.jsx
import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Spinner, Alert, Table, ProgressBar, Button } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { BarChart3, TrendingUp, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  getAllProjects,
  getProjectsByUser,
  canUserEditProjectStatus,
  getAvailableNextStatuses,
  updateProjectStatus,
  getStatusLabel,
  getStatusColor,
  getProgressValue
} from "../../data/mockProjects";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadProjects();
  }, [user]);

  const loadProjects = () => {
    // Usa a função centralizada que busca do localStorage
    const allProjects = getAllProjects();
    // Filtra projetos baseado no usuário
    const userProjects = getProjectsByUser(user, allProjects);
    setProjects(userProjects);
    setLoading(false);
  };

  const handleStatusUpdate = (projectId, newStatusId) => {
    // Usa a função centralizada que atualiza no localStorage
    const updatedProject = updateProjectStatus(projectId, newStatusId, "Status atualizado via dashboard", user);
    
    if (updatedProject) {
      // Atualiza a lista local
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.projectId === projectId 
            ? { ...project, projectStatus: newStatusId }
            : project
        )
      );
      
      setSuccess(`Status do projeto atualizado para: ${getStatusLabel(newStatusId)}`);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  if (authLoading || loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  const totalProjects = projects.length;
  const completedProjects = projects.filter((p) => p.projectStatus === 10).length;
  const inProgressProjects = projects.filter((p) => p.projectStatus > 1 && p.projectStatus < 10).length;
  const reviewRequested = projects.filter((p) => p.projectStatus === 9).length;

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1 className="h3 fw-bold">Dashboard</h1>
          <p className="text-muted">Bem-vindo, {user?.name}</p>
        </Col>
      </Row>

      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}

      {/* KPIs */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-2">Total de Projetos</p>
                  <h3 className="fw-bold mb-0">{totalProjects}</h3>
                </div>
                <BarChart3 size={32} className="text-primary opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-2">Em Progresso</p>
                  <h3 className="fw-bold mb-0">{inProgressProjects}</h3>
                </div>
                <TrendingUp size={32} className="text-warning opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-2">Concluídos</p>
                  <h3 className="fw-bold mb-0">{completedProjects}</h3>
                </div>
                <CheckCircle size={32} className="text-success opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted mb-2">Revisão Solicitada</p>
                  <h3 className="fw-bold mb-0">{reviewRequested}</h3>
                </div>
                <AlertCircle size={32} className="text-danger opacity-50" />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabela */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light border-bottom">
              <Card.Title className="mb-0">Pipeline de Projetos</Card.Title>
            </Card.Header>
            <Card.Body>
              {projects.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  {user.role === 'client' 
                    ? "Você não possui projetos associados à sua conta."
                    : "Nenhum projeto encontrado."
                  }
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover className="mb-0">
                    <thead>
                      <tr>
                        <th>Projeto</th>
                        <th>Cliente</th>
                        <th>Status</th>
                        <th>Prazo</th>
                        <th>Progresso</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => {
                        const progressValue = getProgressValue(project.projectStatus);
                        const canEdit = canUserEditProjectStatus(user, project);
                        const nextStatuses = getAvailableNextStatuses(project.projectStatus, user.role);
                        
                        return (
                          <tr key={project.projectId}>
                            <td className="fw-bold">
                              <Link to={`/projects/${project.projectId}`} className="text-decoration-none">
                                {project.projectName}
                              </Link>
                            </td>
                            <td>{project.customerName}</td>
                            <td>
                              <Badge bg={getStatusColor(project.projectStatus)}>
                                {getStatusLabel(project.projectStatus)}
                              </Badge>
                            </td>
                            <td>{new Date(project.projectDtExpectedEndDate).toLocaleDateString("pt-BR")}</td>
                            <td>
                              <ProgressBar
                                now={progressValue}
                                label={`${Math.min(Math.round(progressValue), 100)}%`}
                                variant={
                                  progressValue < 30 ? "primary" :
                                  progressValue < 70 ? "warning" : "success"
                                }
                                style={{ height: "20px" }}
                              />
                            </td>
                            <td>
                              {canEdit && nextStatuses.length > 0 && (
                                <div className="d-flex gap-1">
                                  {nextStatuses.map(status => (
                                    <Button
                                      key={status.statusId}
                                      size="sm"
                                      variant="outline-primary"
                                      onClick={() => handleStatusUpdate(project.projectId, status.statusId)}
                                      title={`Avançar para: ${status.label}`}
                                      className="d-flex align-items-center"
                                    >
                                      <ArrowRight size={14} />
                                    </Button>
                                  ))}
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estatísticas Rápidas para outros roles */}
      {user.role !== 'client' && projects.length > 0 && (
        <Row className="mt-4">
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h4 className="fw-bold text-primary mb-1">
                  {projects.filter(p => new Date(p.projectDtExpectedEndDate) < new Date() && p.projectStatus !== 10).length}
                </h4>
                <small className="text-muted">Projetos com Prazo Vencido</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h4 className="fw-bold text-warning mb-1">
                  {projects.filter(p => p.projectStatus === 8).length}
                </h4>
                <small className="text-muted">Aguardando Inspeção</small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center">
                <h4 className="fw-bold text-info mb-1">
                  {Math.round(projects.reduce((sum, p) => sum + getProgressValue(p.projectStatus), 0) / projects.length)}%
                </h4>
                <small className="text-muted">Progresso Médio</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}