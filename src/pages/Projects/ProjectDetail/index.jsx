// ProjectDetail/index.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Button,
  Form,
  Modal,
  Alert,
  Spinner,
  ProgressBar,
} from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Edit2, ArrowRight, Users, Shield, MessageSquare } from "lucide-react"; 
import { 
  getProjectById,
  getProjectTimeline,
  getProjectInspections,
  updateProjectStatus,
  getStatusLabel,
  getStatusColor,
  getProgressValue,
  canUserEditProjectStatus,
  getAvailableNextStatuses,
  getProjectTasks,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  getAvailableFieldStaff,
  updateProjectFieldTeam,
  getAvailableQualityStaff,
  updateProjectQualityTeam
} from "../../../data/mockProjects";
import ProtectedRoute from "../../../components/ProtectedRoute";
import TaskList from "../../../components/TaskList";
import TaskForm from "../../../components/TaskForm";

function ProjectDetailContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasRole } = useAuth(); // hasRole já estava sendo importado
  const [project, setProject] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState("");

  // Estados dos Modais
  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showQualityModal, setShowQualityModal] = useState(false);

  // Estados de Forms
  const [editingTask, setEditingTask] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [notes, setNotes] = useState("");
  
  // Estados de Gerenciamento de Equipe
  const [availableStaff, setAvailableStaff] = useState([]);
  const [selectedTeamIds, setSelectedTeamIds] = useState([]);
  
  // Estados de Gerenciamento de Qualidade
  const [availableQualityStaff, setAvailableQualityStaff] = useState([]);
  const [selectedQualityIds, setSelectedQualityIds] = useState([]);


  const projectId = parseInt(id);

  useEffect(() => {
    if (isNaN(projectId)) {
      setLoading(false);
      return;
    }
    loadData(projectId);
    setAvailableStaff(getAvailableFieldStaff());
    setAvailableQualityStaff(getAvailableQualityStaff());
  }, [id]);

  const loadData = (id) => {
    const proj = getProjectById(id);
    setProject(proj);

    if (proj) {
      setTimeline(getProjectTimeline(id));
      setInspections(getProjectInspections(id));
      setTasks(getProjectTasks(id));
      setNewStatus(proj.projectStatus.toString());
    }
    setLoading(false);
  };

  const handleStatusChange = () => {
    if (project && newStatus) {
      const newStatusId = parseInt(newStatus);
      const updatedProject = updateProjectStatus(project.projectId, newStatusId, notes, user);
      
      if (updatedProject) {
        setProject(updatedProject);
        setTimeline(getProjectTimeline(project.projectId));
        setSuccess(`Status atualizado para: ${getStatusLabel(newStatusId)}`);
        setShowModal(false);
        setNotes("");
        setTimeout(() => setSuccess(""), 3000);
      }
    }
  };

  const handleQuickStatusUpdate = (newStatusId) => {
    if (project) {
      const updatedProject = updateProjectStatus(project.projectId, newStatusId, "Status atualizado via ação rápida", user);
      
      if (updatedProject) {
        setProject(updatedProject);
        setTimeline(getProjectTimeline(project.projectId));
        setSuccess(`Status atualizado para: ${getStatusLabel(newStatusId)}`);
        setTimeout(() => setSuccess(""), 3000);
      }
    }
  };

  // Funções de Tasks
  const handleNewTask = () => {
    setEditingTask(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      const updated = updateTask(editingTask.taskId, taskData);
      if (updated) {
        setTasks(getProjectTasks(projectId));
        setSuccess("Tarefa atualizada com sucesso!");
        setShowTaskModal(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    } else {
      const newTask = createTask({
        ...taskData,
        projectId,
        createdBy: { id: user.id, name: user.name }
      });
      if (newTask) {
        setTasks(getProjectTasks(projectId));
        setSuccess("Tarefa criada com sucesso!");
        setShowTaskModal(false);
        setTimeout(() => setSuccess(""), 3000);
      }
    }
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm("Tem certeza que deseja excluir esta tarefa?")) {
      const deleted = deleteTask(taskId);
      if (deleted) {
        setTasks(getProjectTasks(projectId));
        setSuccess("Tarefa excluída com sucesso!");
        setTimeout(() => setSuccess(""), 3000);
      }
    }
  };

  const handleCompleteTask = (taskId) => {
    const completed = completeTask(taskId);
    if (completed) {
      setTasks(getProjectTasks(projectId));
      setSuccess("Tarefa marcada como concluída!");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Funções de Gerenciamento de Equipe de CAMPO
  const handleTeamModalOpen = () => {
    const currentTeamIds = (project.projectFieldTeam || []).map(member => member.id.toString());
    setSelectedTeamIds(currentTeamIds);
    setShowTeamModal(true);
  };

  const handleTeamChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTeamIds(selectedIds);
  };

  const handleTeamSave = () => {
    const newTeamArray = availableStaff.filter(staff => 
      selectedTeamIds.includes(staff.id.toString())
    );

    const success = updateProjectFieldTeam(projectId, newTeamArray);
    
    if (success) {
      loadData(projectId);
      setSuccess("Equipe de campo atualizada com sucesso!");
      setShowTeamModal(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };
  
  // Funções de Gerenciamento de QUALIDADE
  const handleQualityModalOpen = () => {
    const teamArray = Array.isArray(project.projectQualityTeam) ? project.projectQualityTeam : [];
    const currentQualityIds = teamArray.map(member => member.id.toString());
    
    setSelectedQualityIds(currentQualityIds);
    setShowQualityModal(true);
  };

  const handleQualityChange = (e) => {
    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedQualityIds(selectedIds);
  };

  const handleQualitySave = () => {
    const newTeamArray = availableQualityStaff.filter(staff => 
      selectedQualityIds.includes(staff.id.toString())
    );

    const success = updateProjectQualityTeam(projectId, newTeamArray);
    
    if (success) {
      loadData(projectId);
      setSuccess("Equipe de qualidade atualizada com sucesso!");
      setShowQualityModal(false);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  if (loading) {
    return (
      <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  if (isNaN(projectId) || !project) {
    return (
      <Container fluid>
        <Alert variant="danger" className="mb-4">
          <strong>Projeto não encontrado ou ID inválido.</strong>
        </Alert>
        <Button onClick={() => navigate(user.role === 'client' ? "/client" : "/projects")}>
          Voltar para {user.role === 'client' ? "Meus Projetos" : "Projetos"}
        </Button>
      </Container>
    );
  }

  if (user.role === 'client' && project.customerId !== user.id) {
    return (
      <Container fluid>
        <Alert variant="danger" className="mb-4">
          <strong>Acesso negado.</strong> Você não tem permissão para visualizar este projeto.
        </Alert>
        <Button onClick={() => navigate("/client")}>Voltar para Meus Projetos</Button>
      </Container>
    );
  }

  const canEdit = canUserEditProjectStatus(user, project);
  const nextStatuses = getAvailableNextStatuses(project.projectStatus, user.role);
  const progressValue = getProgressValue(project.projectStatus);
  const canManageTeam = hasRole(['admin', 'supervisor']);
  const canViewFeedback = hasRole(['admin', 'supervisor', 'sales', 'client']);

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <Button
            variant="link"
            className="p-0 mb-3"
            onClick={() => navigate(user.role === 'client' ? "/client" : "/projects")}
          >
            <ArrowLeft size={18} className="me-2" />
            Voltar para {user.role === 'client' ? "Meus Projetos" : "Projetos"}
          </Button>
          <h1 className="h3 fw-bold">{project.projectName}</h1>
          <p className="text-muted">{project.projectDescription}</p>
        </Col>
      </Row>

      {success && (
        <Alert variant="success" className="mb-4">
          {success}
        </Alert>
      )}

      <Row className="mb-4">
        <Col lg={8}>
          {/* Informações do Projeto */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Informações do Projeto</Card.Title>
              {canEdit && nextStatuses.length > 0 && (
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => setShowModal(true)}
                >
                  <Edit2 size={16} className="me-2" />
                  Alterar Status
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="text-muted small mb-1">Cliente</p>
                  <p className="fw-bold">{project.customerName}</p>
                </Col>
                <Col md={6}>
                  <p className="text-muted small mb-1">Status Atual</p>
                  <Badge bg={getStatusColor(project.projectStatus)} className="fs-6">
                    {getStatusLabel(project.projectStatus)}
                  </Badge>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="text-muted small mb-1">Filial OTIS</p>
                  <p className="fw-bold">{project.projectOtisBranch}</p>
                </Col>
                <Col md={6}>
                  <p className="text-muted small mb-1">Nº do Contrato</p>
                  <p className="fw-bold">{project.contractNumber}</p>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="text-muted small mb-1">Data de Início</p>
                  <p className="fw-bold">
                    {new Date(project.projectDtStartDate).toLocaleDateString("pt-BR")}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="text-muted small mb-1">Prazo Previsto</p>
                  <p className="fw-bold">
                    {new Date(project.projectDtExpectedEndDate).toLocaleDateString("pt-BR")}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <p className="text-muted small mb-1">Orçado</p>
                  <p className="fw-bold">
                    R$ {project.contractBudget.toLocaleString("pt-BR", { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="text-muted small mb-1">Custo Real</p>
                  <p className="fw-bold">
                    R$ {project.realCost.toLocaleString("pt-BR", { 
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2 
                    })}
                  </p>
                </Col>
              </Row>

              {/* Ações Rápidas de Status - Apenas para roles que podem editar */}
              {canEdit && nextStatuses.length > 0 && (
                <div className="mt-4 pt-3 border-top">
                  <p className="text-muted small mb-2">Avançar Status:</p>
                  <div className="d-flex gap-2 flex-wrap">
                    {nextStatuses.map(status => (
                      <Button
                        key={status.statusId}
                        variant="outline-success"
                        size="sm"
                        onClick={() => handleQuickStatusUpdate(status.statusId)}
                        className="d-flex align-items-center gap-1"
                      >
                        <ArrowRight size={14} />
                        {status.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Timeline */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Histórico do Projeto</Card.Title>
            </Card.Header>
            <Card.Body>
              {timeline.length === 0 ? (
                <p className="text-muted">Nenhum registro no histórico</p>
              ) : (
                <div className="timeline">
                  {timeline.map((item, index) => (
                    <div key={item.id} className="mb-3">
                      <div className="d-flex gap-3">
                        <div
                          className="bg-primary rounded-circle flex-shrink-0"
                          style={{
                            width: "12px",
                            height: "12px",
                            marginTop: "4px",
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-start mb-1">
                            <p className="fw-bold mb-0">
                              {getStatusLabel(item.statusId)}
                            </p>
                            <small className="text-muted">
                              {new Date(item.createdAt).toLocaleDateString("pt-BR")} às{" "}
                              {new Date(item.createdAt).toLocaleTimeString("pt-BR")}
                            </small>
                          </div>
                          <p className="text-muted small mb-1">
                            Por: {item.userName}
                          </p>
                          {item.notes && (
                            <p className="small mb-0 p-2 bg-light rounded">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>
                      {index < timeline.length - 1 && (
                        <div
                          className="ms-1"
                          style={{
                            width: "1px",
                            height: "20px",
                            backgroundColor: "#dee2e6",
                          }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Progresso */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Progresso</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold">Conclusão Geral</span>
                  <span className="fw-bold text-primary">{progressValue}%</span>
                </div>
                <ProgressBar 
                  now={progressValue} 
                  variant={
                    progressValue < 30 ? "primary" :
                    progressValue < 70 ? "warning" : "success"
                  }
                  style={{ height: "12px" }}
                />
              </div>

              <div className="mb-3">
                <p className="text-muted small mb-2">Etapa Atual</p>
                <Badge 
                  bg={getStatusColor(project.projectStatus)} 
                  className="w-100 p-2 fs-6 text-center"
                >
                  {getStatusLabel(project.projectStatus)}
                </Badge>
              </div>

              {/* Próximos Status Disponíveis - Apenas para roles que podem editar */}
              {canEdit && nextStatuses.length > 0 && (
                <div className="mt-4">
                  <p className="text-muted small mb-2">Próximas Etapas:</p>
                  <div className="d-grid gap-1">
                    {nextStatuses.map(status => (
                      <Badge 
                        key={status.statusId}
                        bg="outline-primary" 
                        text="dark"
                        className="p-2 text-center border"
                      >
                        {status.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Inspeções */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Inspeções</Card.Title>
            </Card.Header>
            <Card.Body>
              {inspections.length === 0 ? (
                <p className="text-muted small mb-0">Nenhuma inspeção registrada para este projeto.</p>
              ) : (
                <div className="d-grid gap-2">
                  {inspections.slice(0, 3).map((insp) => (
                    <div key={insp.id} className="p-2 border rounded">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <Badge bg={insp.approved ? 'success' : 'danger'}>
                          {insp.approved ? 'Aprovado' : 'Reprovado'}
                        </Badge>
                        <small className="text-muted">
                          {new Date(insp.inspectionDate).toLocaleDateString('pt-BR')}
                        </small>
                      </div>
                      <p className="small mb-1">
                        <strong>Inspetor:</strong> {insp.inspector}
                      </p>
                      {insp.notes && (
                        <p className="small mb-0 text-muted">
                          {insp.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Tarefas do Projeto - Para field, supervisor e admin */}
          {(user.role === 'field' || user.role === 'supervisor' || user.role === 'admin') && (
            <div className="mt-4">
              <TaskList
                tasks={tasks}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onComplete={handleCompleteTask}
                canEdit={user.role === 'field' || user.role === 'supervisor' || user.role === 'admin'}
                onNewTask={handleNewTask}
              />
            </div>
          )}

          {/* Equipe do Projeto - Apenas para roles internos */}
          {(user.role !== 'client') && (
            <Card className="border-0 shadow-sm mt-4">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <Card.Title className="mb-0">Equipe</Card.Title>
                {canManageTeam && (
                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={handleTeamModalOpen}
                      className="d-flex align-items-center"
                    >
                      <Users size={16} className="me-2" />
                      Time de Campo
                    </Button>
                     <Button 
                      variant="outline-info" 
                      size="sm"
                      onClick={handleQualityModalOpen}
                      className="d-flex align-items-center"
                    >
                      <Shield size={16} className="me-2" />
                      Qualidade
                    </Button>
                  </div>
                )}
              </Card.Header>
              <Card.Body>
                {/* Exibição Time de Campo */}
                <div className="mb-3">
                  <small className="text-muted d-block">Time de Campo:</small>
                  {project.projectFieldTeam && project.projectFieldTeam.length > 0 ? (
                    project.projectFieldTeam.map(member => (
                      <div key={member.id} className="small">
                        • {member.name} ({member.type === 'mechanical_technician' ? 'Téc. Mecânico' : 'Téc. Ajustador'})
                      </div>
                    ))
                  ) : (
                    <small className="text-muted">Nenhum membro de campo alocado.</small>
                  )}
                </div>

                {/* Exibição da Equipe de Qualidade */}
                <div className="border-top pt-3">
                  <small className="text-muted d-block">Equipe de Qualidade:</small>
                  {Array.isArray(project.projectQualityTeam) && project.projectQualityTeam.length > 0 ? (
                    project.projectQualityTeam.map(member => (
                      <div key={member.id} className="small">
                        • {member.name} (Inspetor)
                      </div>
                    ))
                  ) : (
                    <small className="text-muted">Nenhum inspetor alocado.</small>
                  )}
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Botão de Feedback para Clientes - Apenas para projetos concluídos */}
          {(user.role === 'client' && project.projectStatus === 10) && (
            <Card className="border-0 shadow-sm mt-4">
              <Card.Body className="text-center">
                <p className="small text-muted mb-2">Projeto concluído! Deixe seu feedback.</p>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => navigate("/client/feedback")}
                >
                  Enviar Feedback
                </Button>
              </Card.Body>
            </Card>
          )}

          {/* Feedback */}
          {canViewFeedback && (
            <Card className="border-0 shadow-sm mt-4">
              <Card.Header className="bg-light">
                <Card.Title className="mb-0 d-flex align-items-center">
                  <MessageSquare size={18} className="me-2" /> Feedback Recebido
                </Card.Title>
              </Card.Header>
              <Card.Body>
                {(!project.clientFeedback || project.clientFeedback.length === 0) ? (
                  <p className="small text-muted mb-0">Nenhum feedback recebido para este projeto.</p>
                ) : (
                  <div className="d-grid gap-3">
                    {project.clientFeedback.map((fb) => (
                      <div key={fb.id} className="p-3 border rounded bg-light-subtle">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <span className="fw-bold text-primary">
                            Avaliação: {fb.rating} / 5
                          </span>
                          <small className="text-muted">
                            {new Date(fb.createdAt).toLocaleDateString('pt-BR')}
                          </small>
                        </div>
                        <p className="small mb-1">
                          <strong>Tipo:</strong> {fb.feedbackType}
                        </p>
                        <p className="small mb-1">
                          <strong>Cliente:</strong> {fb.clientName}
                        </p>
                        {fb.comments && (
                          <p className="small mb-0 fst-italic text-dark">
                            "{fb.comments}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

        </Col>
      </Row>

      {/* Modal de Alterar Status - Apenas para roles que podem editar */}
      {canEdit && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Alterar Status do Projeto</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {project && (
              <div className="mb-3">
                <p><strong>Projeto:</strong> {project.projectName}</p>
                <p><strong>Status Atual:</strong> {getStatusLabel(project.projectStatus)}</p>
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Novo Status</Form.Label>
              <Form.Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="">Selecione um status</option>
                {nextStatuses.map((status) => (
                  <option key={status.statusId} value={status.statusId}>
                    {status.label}
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Você só pode avançar para os próximos status disponíveis para seu perfil
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>Notas (Opcional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione observações sobre esta transição de status..."
                style={{ resize: "none" }}
              />
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
      )}

      {/* Modal de Tarefa */}
      <TaskForm
        show={showTaskModal}
        onHide={() => setShowTaskModal(false)}
        onSave={handleSaveTask}
        task={editingTask}
        projectFieldTeam={project?.projectFieldTeam || []}
        projectId={projectId}
      />

      {/* Modal de Gerenciamento de Equipe de CAMPO */}
      {canManageTeam && (
        <Modal show={showTeamModal} onHide={() => setShowTeamModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Gerenciar Equipe de Campo</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label className="fw-bold">Membros da Equipe de Campo</Form.Label>
              <Form.Select
                multiple 
                value={selectedTeamIds}
                onChange={handleTeamChange}
                style={{ height: "200px" }} 
              >
                {availableStaff.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.type === 'mechanical_technician' ? 'Téc. Mecânico' : 'Téc. Ajustador'})
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Segure Ctrl (ou Cmd no Mac) para selecionar mais de um membro.
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowTeamModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleTeamSave}>
              Salvar Equipe
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal de Gerenciamento de Equipe de QUALIDADE */}
      {canManageTeam && (
        <Modal show={showQualityModal} onHide={() => setShowQualityModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Gerenciar Equipe de Qualidade</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label className="fw-bold">Membros da Equipe de Qualidade</Form.Label>
              <Form.Select
                multiple
                value={selectedQualityIds}
                onChange={handleQualityChange}
                style={{ height: "150px" }}
              >
                {availableQualityStaff.map(member => (
                  <option key={member.id} value={member.id}>
                    {member.name} (Inspetor)
                  </option>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                Segure Ctrl (ou Cmd no Mac) para selecionar mais de um membro (se aplicável).
              </Form.Text>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowQualityModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleQualitySave}>
              Salvar Equipe
            </Button>
          </Modal.Footer>
        </Modal>
      )}

    </Container>
  );
}

// Componente principal com proteção de rota
export default function ProjectDetail() {
  return (
    <ProtectedRoute requiredRoles={['sales', 'supervisor', 'admin', 'field', 'quality', 'client']}>
      <ProjectDetailContent />
    </ProtectedRoute>
  );
}