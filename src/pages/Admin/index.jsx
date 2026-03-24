// Admin/index.jsx
import React, { useState, useEffect } from "react";
import { 
  Container, Row, Col, Card, Table, Badge, Alert, Spinner, Button, Modal, Form 
} from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { 
    getAllProjects, 
    getAllStatuses,
    getAllLocations,
    addStatus,      
    updateStatus,   
    deleteStatus,   
    addLocation,    
    updateLocation, 
    deleteLocation, 
    updateProject,  
    getStatusLabel, 
    getStatusColor  
} from "../../data/mockProjects"; 
import ProtectedRoute from "../../components/ProtectedRoute";
import { Edit2, Trash2, Plus } from "lucide-react"; // Ícones

function AdminContent() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });

  // Estados para Modais
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null); 
  const [editProjectFormData, setEditProjectFormData] = useState({ projectName: '', customerName: '' }); 
  
  const [showAddStatusModal, setShowAddStatusModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);
  const [editingStatus, setEditingStatus] = useState(null);
  const [statusFormData, setStatusFormData] = useState({ label: '', roles: '', canEdit: '' });

  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [showEditLocationModal, setShowEditLocationModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [locationFormData, setLocationFormData] = useState({ country: '', branch: '', region: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setLoading(true);
    setProjects(getAllProjects()); 
    setStatuses(getAllStatuses()); 
    setLocations(getAllLocations()); 
    setLoading(false);
  };

  // Funções de Feedback
  const showFeedback = (type, text) => {
    setFeedbackMessage({ type, text });
    setTimeout(() => setFeedbackMessage({ type: '', text: '' }), 3000);
  }

  // Funções para Modais de PROJETO
  const handleEditProjectClick = (project) => {
    setEditingProject(project);
    setEditProjectFormData({ projectName: project.projectName, customerName: project.customerName });
    setShowEditProjectModal(true);
  };
  const handleProjectFormChange = (e) => {
    const { name, value } = e.target;
    setEditProjectFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleSaveProject = () => {
    if (!editingProject) return;
    const updated = updateProject(editingProject.projectId, editProjectFormData);
    if (updated) {
      showFeedback('success', "Projeto atualizado com sucesso!");
      closeModal();
      loadData(); 
    } else {
      showFeedback('danger', "Erro ao atualizar o projeto.");
    }
  };
  
  // Funções para Modais de STATUS
  const handleStatusFormChange = (e) => {
    const { name, value } = e.target;
    setStatusFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleAddStatusClick = () => {
    setStatusFormData({ label: '', roles: '', canEdit: '' }); 
    setShowAddStatusModal(true);
  };
  const handleEditStatusClick = (status) => {
    setEditingStatus(status);
    setStatusFormData({ 
        label: status.label, 
        roles: Array.isArray(status.roles) ? status.roles.join(', ') : '', 
        canEdit: Array.isArray(status.canEdit) ? status.canEdit.join(', ') : '' 
    });
    setShowEditStatusModal(true);
  };
  const handleSaveNewStatus = () => {
    if (!statusFormData.label) {
        showFeedback('warning', 'O nome (Label) do status é obrigatório.');
        return;
    }
    const success = addStatus(statusFormData); 
    if (success) {
      showFeedback('success', 'Novo status adicionado!');
      closeModal();
      loadData();
    } else {
      showFeedback('danger', 'Erro ao adicionar status.');
    }
  };
   const handleSaveEditedStatus = () => {
    if (!editingStatus || !statusFormData.label) {
        showFeedback('warning', 'O nome (Label) do status é obrigatório.');
        return;
    }
    const success = updateStatus(editingStatus.statusId, statusFormData); 
     if (success) {
      showFeedback('success', 'Status atualizado!');
      closeModal();
      loadData();
    } else {
      showFeedback('danger', 'Erro ao atualizar status.');
    }
  };
  const handleDeleteStatus = (statusId) => {
    if (window.confirm(`Tem certeza que deseja excluir o Status #${statusId}? Verifique se ele não está em uso por projetos.`)) {
        const success = deleteStatus(statusId);
        if (success) {
            showFeedback('success', `Status #${statusId} excluído.`);
            loadData();
        } else {
            showFeedback('danger', 'Erro ao excluir status.');
        }
    }
  };

  // Funções para Modais
   const handleLocationFormChange = (e) => {
    const { name, value } = e.target;
    setLocationFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleAddLocationClick = () => {
    setLocationFormData({ country: '', branch: '', region: '' }); 
    setShowAddLocationModal(true);
  };
  const handleEditLocationClick = (location) => {
    setEditingLocation(location);
    setLocationFormData({ country: location.country, branch: location.branch, region: location.region });
    setShowEditLocationModal(true);
  };
  const handleSaveNewLocation = () => {
    if (!locationFormData.branch || !locationFormData.country) {
        showFeedback('warning', 'País e Filial são obrigatórios.');
        return;
    }
    const success = addLocation(locationFormData);
    if (success) {
      showFeedback('success', 'Nova localidade adicionada!');
      closeModal();
      loadData();
    } else {
      showFeedback('danger', 'Erro ao adicionar localidade.');
    }
  };
   const handleSaveEditedLocation = () => {
    if (!editingLocation || !locationFormData.branch || !locationFormData.country) {
        showFeedback('warning', 'País e Filial são obrigatórios.');
        return;
    }
    const success = updateLocation(editingLocation.id, locationFormData);
     if (success) {
      showFeedback('success', 'Localidade atualizada!');
      closeModal();
      loadData();
    } else {
      showFeedback('danger', 'Erro ao atualizar localidade.');
    }
  };
  const handleDeleteLocation = (locationId) => {
    if (window.confirm(`Tem certeza que deseja excluir a Localidade #${locationId}? Verifique se ela não está em uso por projetos.`)) {
        const success = deleteLocation(locationId);
        if (success) {
            showFeedback('success', `Localidade #${locationId} excluída.`);
            loadData();
        } else {
            showFeedback('danger', 'Erro ao excluir localidade.');
        }
    }
  };

  // Função genérica para fechar modais e limpar estados
  const closeModal = () => {
    setShowEditProjectModal(false);
    setShowAddStatusModal(false);
    setShowEditStatusModal(false);
    setShowAddLocationModal(false);
    setShowEditLocationModal(false);
    // Limpa estados de edição
    setEditingProject(null);
    setEditingStatus(null);
    setEditingLocation(null);
    // Limpa forms
    setEditProjectFormData({ projectName: '', customerName: '' });
    setStatusFormData({ label: '', roles: '', canEdit: '' });
    setLocationFormData({ country: '', branch: '', region: '' });
  }

  if (loading) {
    return (
        <Container fluid className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <Spinner animation="border" role="status"><span className="visually-hidden">Carregando...</span></Spinner>
        </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <h1 className="h3 fw-bold">Administração</h1>
          <p className="text-muted">Gerenciamento da plataforma</p>
        </Col>
      </Row>

      {/* Mensagem de Feedback */}
      {feedbackMessage.text && <Alert variant={feedbackMessage.type} className="mb-4">{feedbackMessage.text}</Alert>}

      {/* Estatísticas */}
       <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <p className="text-muted small mb-1">Total de Projetos</p>
              <h3 className="fw-bold mb-0">{projects.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <p className="text-muted small mb-1">Status Disponíveis</p>
              <h3 className="fw-bold mb-0">{statuses.length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <p className="text-muted small mb-1">Localidades</p>
              <h3 className="fw-bold mb-0">{locations.length}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabela de Projetos */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
             <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Todos os Projetos</Card.Title>
            </Card.Header>
            <Card.Body>
              {projects.length === 0 ? ( <Alert variant="info" className="mb-0">Nenhum projeto cadastrado</Alert> ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                       <tr><th>ID</th><th>Título</th><th>Cliente</th><th>Status</th><th>Início</th><th>Prazo</th><th>Filial</th><th>Ações</th></tr>
                    </thead>
                    <tbody>
                      {projects.map((project) => (
                        <tr key={project.projectId}>
                          <td>#{project.projectId}</td>
                          <td className="fw-bold">{project.projectName}</td>
                          <td>{project.customerName}</td>
                          <td><Badge bg={getStatusColor(project.projectStatus)}>{getStatusLabel(project.projectStatus)}</Badge></td>
                          <td>{new Date(project.projectDtStartDate).toLocaleDateString("pt-BR")}</td>
                          <td>{new Date(project.projectDtExpectedEndDate).toLocaleDateString("pt-BR")}</td>
                          <td>{project.projectOtisBranch}</td>
                          <td>
                            <Button variant="outline-primary" size="sm" onClick={() => handleEditProjectClick(project)} title="Editar Projeto"><Edit2 size={14} /></Button>
                          
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabela Status do Sistema */}
      <Row className="mb-4">
        <Col>
          <Card className="border-0 shadow-sm">
             <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Status do Sistema</Card.Title>
              <Button variant="primary" size="sm" onClick={handleAddStatusClick}>
                 <Plus size={16} className="me-1" /> Novo Status
              </Button>
            </Card.Header>
            <Card.Body>
              {statuses.length === 0 ? (<Alert variant="info" className="mb-0">Nenhum status cadastrado.</Alert>) : (
                <div className="table-responsive">
                    <Table hover>
                    <thead><tr><th>ID</th><th>Label</th><th>Roles Acesso</th><th>Roles Edição</th><th>Ações</th></tr></thead>
                    <tbody>
                        {statuses.map((status) => (
                        <tr key={status.statusId}>
                            <td>#{status.statusId}</td>
                            <td className="fw-bold">{status.label}</td>
                            <td>{Array.isArray(status.roles) && status.roles.map(role => ( <Badge key={`${status.statusId}-${role}-view`} bg="secondary" className="me-1">{role}</Badge> ))}</td>
                            <td>{Array.isArray(status.canEdit) && status.canEdit.map(role => ( <Badge key={`${status.statusId}-${role}-edit`} bg="primary" className="me-1">{role}</Badge> ))}</td>
                            <td>
                            <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEditStatusClick(status)} title="Editar Status"> <Edit2 size={14} /> </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteStatus(status.statusId)} title="Excluir Status"> <Trash2 size={14} /> </Button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tabela Localidades */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
             <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Localidades</Card.Title>
               <Button variant="primary" size="sm" onClick={handleAddLocationClick}>
                 <Plus size={16} className="me-1" /> Nova Localidade
              </Button>
            </Card.Header>
            <Card.Body>
               {locations.length === 0 ? (<Alert variant="info" className="mb-0">Nenhuma localidade cadastrada.</Alert>) : (
                <div className="table-responsive">
                    <Table hover>
                    <thead><tr><th>ID</th><th>País</th><th>Filial</th><th>Região</th><th>Ações</th></tr></thead>
                    <tbody>
                        {locations.map((loc) => (
                        <tr key={loc.id}>
                            <td>#{loc.id}</td>
                            <td>{loc.country}</td>
                            <td className="fw-bold">{loc.branch}</td>
                            <td>{loc.region || '-'}</td>
                            <td>
                            <Button variant="outline-primary" size="sm" className="me-1" onClick={() => handleEditLocationClick(loc)} title="Editar Localidade"> <Edit2 size={14} /> </Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteLocation(loc.id)} title="Excluir Localidade"> <Trash2 size={14} /> </Button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
                </div>
               )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ----- MODAIS ----- */}

      {/* Modal Editar Projeto */}
      {editingProject && (
        <Modal show={showEditProjectModal} onHide={closeModal}>
          <Modal.Header closeButton> <Modal.Title>Editar Projeto #{editingProject.projectId}</Modal.Title> </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Nome do Projeto</Form.Label>
                <Form.Control type="text" name="projectName" value={editProjectFormData.projectName} onChange={handleProjectFormChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Nome do Cliente</Form.Label>
                <Form.Control type="text" name="customerName" value={editProjectFormData.customerName} onChange={handleProjectFormChange} required />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
            <Button variant="primary" onClick={handleSaveProject}>Salvar Alterações</Button>
          </Modal.Footer>
        </Modal>
      )}

      {/* Modal Adicionar Status */}
       <Modal show={showAddStatusModal} onHide={closeModal}>
          <Modal.Header closeButton> <Modal.Title>Adicionar Novo Status</Modal.Title> </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => { e.preventDefault(); handleSaveNewStatus(); }}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Label*</Form.Label>
                <Form.Control type="text" name="label" value={statusFormData.label} onChange={handleStatusFormChange} required />
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label>Roles com Acesso</Form.Label>
                <Form.Control type="text" name="roles" value={statusFormData.roles} onChange={handleStatusFormChange} placeholder="admin, supervisor, sales" />
                 <Form.Text>Separados por vírgula.</Form.Text>
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label>Roles que Podem Editar</Form.Label>
                <Form.Control type="text" name="canEdit" value={statusFormData.canEdit} onChange={handleStatusFormChange} placeholder="admin, supervisor" />
                 <Form.Text>Separados por vírgula.</Form.Text>
              </Form.Group>
               <Modal.Footer className="px-0 pt-3 pb-0">
                    <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
                    <Button variant="primary" type="submit">Adicionar Status</Button>
                </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

      {/* Modal Editar Status */}
       <Modal show={showEditStatusModal} onHide={closeModal}>
          <Modal.Header closeButton> <Modal.Title>Editar Status #{editingStatus?.statusId}</Modal.Title> </Modal.Header>
          <Modal.Body>
             <Form onSubmit={(e) => { e.preventDefault(); handleSaveEditedStatus(); }}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Label*</Form.Label>
                <Form.Control type="text" name="label" value={statusFormData.label} onChange={handleStatusFormChange} required />
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label>Roles com Acesso</Form.Label>
                <Form.Control type="text" name="roles" value={statusFormData.roles} onChange={handleStatusFormChange} />
                 <Form.Text>Separados por vírgula.</Form.Text>
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label>Roles que Podem Editar</Form.Label>
                <Form.Control type="text" name="canEdit" value={statusFormData.canEdit} onChange={handleStatusFormChange} />
                 <Form.Text>Separados por vírgula.</Form.Text>
              </Form.Group>
               <Modal.Footer className="px-0 pt-3 pb-0">
                    <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
                    <Button variant="primary" type="submit">Salvar Alterações</Button>
                </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

      {/* Modal Adicionar Localidade */}
      <Modal show={showAddLocationModal} onHide={closeModal}>
          <Modal.Header closeButton> <Modal.Title>Adicionar Nova Localidade</Modal.Title> </Modal.Header>
          <Modal.Body>
            <Form onSubmit={(e) => { e.preventDefault(); handleSaveNewLocation(); }}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">País*</Form.Label>
                <Form.Control type="text" name="country" value={locationFormData.country} onChange={handleLocationFormChange} required />
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Filial*</Form.Label>
                <Form.Control type="text" name="branch" value={locationFormData.branch} onChange={handleLocationFormChange} required />
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label>Região</Form.Label>
                <Form.Control type="text" name="region" value={locationFormData.region} onChange={handleLocationFormChange} />
              </Form.Group>
               <Modal.Footer className="px-0 pt-3 pb-0">
                    <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
                    <Button variant="primary" type="submit">Adicionar Localidade</Button>
                </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

        {/* Modal Editar Localidade */}
         <Modal show={showEditLocationModal} onHide={closeModal}>
          <Modal.Header closeButton> <Modal.Title>Editar Localidade #{editingLocation?.id}</Modal.Title> </Modal.Header>
          <Modal.Body>
             <Form onSubmit={(e) => { e.preventDefault(); handleSaveEditedLocation(); }}>
              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">País*</Form.Label>
                <Form.Control type="text" name="country" value={locationFormData.country} onChange={handleLocationFormChange} required />
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Filial*</Form.Label>
                <Form.Control type="text" name="branch" value={locationFormData.branch} onChange={handleLocationFormChange} required />
              </Form.Group>
               <Form.Group className="mb-3">
                <Form.Label>Região</Form.Label>
                <Form.Control type="text" name="region" value={locationFormData.region} onChange={handleLocationFormChange} />
              </Form.Group>
               <Modal.Footer className="px-0 pt-3 pb-0">
                    <Button variant="secondary" onClick={closeModal}>Cancelar</Button>
                    <Button variant="primary" type="submit">Salvar Alterações</Button>
                </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>

    </Container>
  );
}

// Componente principal com proteção de rota
export default function Admin() {
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <AdminContent />
    </ProtectedRoute>
  );
}