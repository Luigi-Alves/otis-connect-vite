// Projects/index.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  Table,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Eye, Trash2, ArrowRight } from "lucide-react";
import { 
  getAllProjects,
  MOCKED_PROJECT_STATUSES,
  updateProjectStatus,
  deleteProject,
  getStatusLabel,
  getStatusColor,
  getProgressValue,
  canUserEditProjectStatus,
  getAvailableNextStatuses
} from "../../../data/mockProjects";
import ProtectedRoute from "../../../components/ProtectedRoute";

function ProjectsContent() {
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProjects(getAllProjects());
    setLoading(false);
  };

  const handleStatusChange = () => {
    if (selectedProject && newStatus) {
      updateProjectStatus(selectedProject.projectId, parseInt(newStatus), "", user);
      
      loadData(); 
      setSuccess(`Status do projeto atualizado para: ${getStatusLabel(parseInt(newStatus))}`);
      setShowModal(false);
      setSelectedProject(null);
      setNewStatus("");
      
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleQuickStatusUpdate = (project, newStatusId) => {
    updateProjectStatus(project.projectId, newStatusId, "Status atualizado via ação rápida", user);
    
    loadData();
    setSuccess(`Status atualizado para: ${getStatusLabel(newStatusId)}`);
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteProject = (projectId) => {
    if (window.confirm("Tem certeza que deseja excluir este projeto?")) {
      const deleted = deleteProject(projectId);
      if (deleted) {
        loadData();
        setSuccess("Projeto excluído com sucesso");
        setTimeout(() => setSuccess(""), 3000);
      }
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesStatus = filterStatus === "" || project.projectStatus === parseInt(filterStatus);
    const matchesSearch =
      project.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 fw-bold">Projetos</h1>
              <p className="text-muted">Gerencie todos os projetos da plataforma</p>
            </div>
            {hasRole(["sales", "supervisor", "admin"]) && (
              <Button variant="primary" onClick={() => navigate("/projects/new")}>
                <Plus size={18} className="me-2" />
                Novo Projeto
              </Button>
            )}
          </div>
        </Col>
      </Row>

      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}

      {/* Filtros */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Buscar</Form.Label>
            <Form.Control
              type="text"
              placeholder="Digite o nome do projeto ou cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label className="fw-bold">Filtrar por Status</Form.Label>
            <Form.Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Todos os Status</option>
              {MOCKED_PROJECT_STATUSES.map((status) => (
                <option key={status.statusId} value={status.statusId}>
                  {status.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Estatísticas Rápidas */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-3">
              <h4 className="fw-bold text-primary mb-1">{projects.length}</h4>
              <small className="text-muted">Total de Projetos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-3">
              <h4 className="fw-bold text-warning mb-1">
                {projects.filter(p => p.projectStatus > 1 && p.projectStatus < 10).length}
              </h4>
              <small className="text-muted">Em Andamento</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-3">
              <h4 className="fw-bold text-success mb-1">
                {projects.filter(p => p.projectStatus === 10).length}
              </h4>
              <small className="text-muted">Concluídos</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-3">
              <h4 className="fw-bold text-danger mb-1">
                {projects.filter(p => p.projectStatus === 9).length}
              </h4>
              <small className="text-muted">Em Revisão</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabela de Projetos */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Lista de Projetos</Card.Title>
            </Card.Header>
            <Card.Body>
              {filteredProjects.length === 0 ? (
                <div className="text-center py-5">
                  <p className="text-muted">Nenhum projeto encontrado</p>
                  {hasRole(["sales", "supervisor", "admin"]) && (
                    <Button 
                      variant="primary" 
                      onClick={() => navigate("/projects/new")}
                      className="mt-2"
                    >
                      Criar Primeiro Projeto
                    </Button>
                  )}
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Projeto</th>
                        <th>Cliente</th>
                        <th>Status</th>
                        <th>Início</th>
                        <th>Prazo</th>
                        <th>Progresso</th>
                        <th>Orçado</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProjects.map((project) => {
                        const canEdit = canUserEditProjectStatus(user, project);
                        const nextStatuses = getAvailableNextStatuses(project.projectStatus, user.role);
                        
                        return (
                          <tr key={project.projectId}>
                            <td className="fw-bold">{project.projectName}</td>
                            <td>{project.customerName}</td>
                            <td>
                              <Badge bg={getStatusColor(project.projectStatus)}>
                                {getStatusLabel(project.projectStatus)}
                              </Badge>
                            </td>
                            <td>{new Date(project.projectDtStartDate).toLocaleDateString("pt-BR")}</td>
                            <td>{new Date(project.projectDtExpectedEndDate).toLocaleDateString("pt-BR")}</td>
                            <td>
                              <div className="d-flex align-items-center gap-2">
                                <div style={{ width: "80px" }}>
                                  <div className="progress" style={{ height: "6px" }}>
                                    <div
                                      className="progress-bar"
                                      style={{ width: `${getProgressValue(project.projectStatus)}%` }}
                                    />
                                  </div>
                                </div>
                                <small className="text-muted">
                                  {getProgressValue(project.projectStatus)}%
                                </small>
                              </div>
                            </td>
                            <td>
                              R$ {project.contractBudget.toLocaleString("pt-BR", { 
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2 
                              })}
                            </td>
                            <td>
                              <div className="d-flex gap-1">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  onClick={() => navigate(`/projects/${project.projectId}`)}
                                  title="Ver detalhes"
                                >
                                  <Eye size={14} />
                                </Button>
                                
                                {canEdit && nextStatuses.length > 0 && (
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => {
                                      setSelectedProject(project);
                                      setNewStatus(nextStatuses[0].statusId.toString());
                                      setShowModal(true);
                                    }}
                                    title="Avançar status"
                                  >
                                    <ArrowRight size={14} />
                                  </Button>
                                )}

                                {hasRole(["admin"]) && (
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDeleteProject(project.projectId)}
                                    title="Excluir projeto"
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                )}
                              </div>
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

      {/* Modal de Alterar Status */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Alterar Status do Projeto</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProject && (
            <div className="mb-3">
              <p><strong>Projeto:</strong> {selectedProject.projectName}</p>
              <p><strong>Status Atual:</strong> {getStatusLabel(selectedProject.projectStatus)}</p>
            </div>
          )}
          <Form.Group>
            <Form.Label className="fw-bold">Novo Status</Form.Label>
            <Form.Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="">Selecione um status</option>
              {selectedProject && 
                getAvailableNextStatuses(selectedProject.projectStatus, user.role).map((status) => (
                  <option key={status.statusId} value={status.statusId}>
                    {status.label}
                  </option>
                ))
              }
            </Form.Select>
            <Form.Text className="text-muted">
              Você só pode avançar para os próximos status disponíveis para seu perfil
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleStatusChange}
            disabled={!newStatus}
          >
            Atualizar Status
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

// Componente principal com proteção de rota
export default function Projects() {
  return (
    <ProtectedRoute requiredRoles={['sales', 'supervisor', 'admin', 'field', 'quality']}>
      <ProjectsContent />
    </ProtectedRoute>
  );
}