// Inspections/index.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert, Table, Badge } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus, Eye } from "lucide-react";
import { 
  getAllInspections,
  getAllProjects,
  getStatusLabel,
  getStatusColor
} from "../../../data/mockProjects";
import ProtectedRoute from "../../../components/ProtectedRoute";

function InspectionsContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inspections, setInspections] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allInspections = getAllInspections();
    const allProjects = getAllProjects();
    
    // Enriquecer inspeções com dados do projeto
    const enrichedInspections = allInspections.map(inspection => {
      const project = allProjects.find(p => p.projectId === inspection.projectId);
      return {
        ...inspection,
        projectName: project?.projectName || 'Projeto não encontrado',
        projectStatus: project?.projectStatus || 0,
        customerName: project?.customerName || 'N/A'
      };
    }).sort((a, b) => new Date(b.inspectionDate) - new Date(a.inspectionDate));
    
    setInspections(enrichedInspections);
    setProjects(allProjects);
    setLoading(false);
  };

  const getApprovalBadge = (approved) => {
    return approved ? 
      <Badge bg="success">✓ Aprovado</Badge> : 
      <Badge bg="danger">✗ Reprovado</Badge>;
  };

  const getReworkBadge = (reworkNeeded) => {
    return reworkNeeded ? 
      <Badge bg="warning">Sim</Badge> : 
      <Badge bg="secondary">Não</Badge>;
  };

  // Estatísticas
  const totalInspections = inspections.length;
  const approvedInspections = inspections.filter(i => i.approved).length;
  const rejectedInspections = inspections.filter(i => !i.approved).length;
  const reworkNeeded = inspections.filter(i => i.reworkNeeded).length;
  const approvalRate = totalInspections > 0 ? Math.round((approvedInspections / totalInspections) * 100) : 0;

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
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 fw-bold">Inspeções de Qualidade</h1>
              <p className="text-muted">Histórico completo de todas as inspeções realizadas</p>
            </div>
            
            {(user.role === 'admin' || user.role === 'quality') && (
              <Button variant="primary" onClick={() => navigate("/inspections/new")}>
                <Plus size={18} className="me-2" />
                Nova Inspeção
              </Button>
            )}

          </div>
        </Col>
      </Row>

      {/* Estatísticas */}
      <Row className="mb-4">
        <Col md={2} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-3">
              <h4 className="fw-bold text-primary mb-1">{totalInspections}</h4>
              <small className="text-muted">Total</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-3">
              <h4 className="fw-bold text-success mb-1">{approvedInspections}</h4>
              <small className="text-muted">Aprovadas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-3">
              <h4 className="fw-bold text-danger mb-1">{rejectedInspections}</h4>
              <small className="text-muted">Reprovadas</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-3">
              <h4 className="fw-bold text-warning mb-1">{reworkNeeded}</h4>
              <small className="text-muted">Retrabalho</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-3">
              <h4 className="fw-bold text-info mb-1">{approvalRate}%</h4>
              <small className="text-muted">Taxa Aprovação</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={2} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center py-3">
              <h4 className="fw-bold text-secondary mb-1">{projects.length}</h4>
              <small className="text-muted">Projetos</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Lista de Inspeções */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light d-flex justify-content-between align-items-center">
              <Card.Title className="mb-0">Histórico de Inspeções</Card.Title>
              <Badge bg="primary">{inspections.length} registros</Badge>
            </Card.Header>
            <Card.Body>
              {inspections.length === 0 ? (
                <Alert variant="info" className="mb-0">
                  Nenhuma inspeção registrada.
                  {/* Esconde o link de criar para o supervisor */}
                  {(user.role === 'admin' || user.role === 'quality') && (
                    <Button variant="link" className="p-0" onClick={() => navigate("/inspections/new")}>
                      Clique aqui para criar a primeira inspeção.
                    </Button>
                  )}
                </Alert>
              ) : (
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Projeto</th>
                        <th>Cliente</th>
                        <th>Data</th>
                        <th>Inspetor</th>
                        <th>Resultado</th>
                        <th>Retrabalho</th>
                        <th>Status Projeto</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inspections.map((insp) => (
                        <tr key={insp.id}>
                          <td className="fw-bold">#{insp.id}</td>
                          <td className="fw-bold">{insp.projectName}</td>
                          <td>{insp.customerName}</td>
                          <td>{new Date(insp.inspectionDate).toLocaleDateString("pt-BR")}</td>
                          <td>{insp.inspector}</td>
                          <td>{getApprovalBadge(insp.approved)}</td>
                          <td>{getReworkBadge(insp.reworkNeeded)}</td>
                          <td>
                            <Badge bg={getStatusColor(insp.projectStatus)}>
                              {getStatusLabel(insp.projectStatus)}
                            </Badge>
                          </td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => navigate(`/inspections/${insp.id}`)}
                              title="Ver detalhes"
                            >
                              <Eye size={14} />
                            </Button>
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
    </Container>
  );
}

// Componente principal com proteção de rota
export default function Inspections() {
  return (
    <ProtectedRoute requiredRoles={['quality', 'supervisor', 'admin']}>
      <InspectionsContent />
    </ProtectedRoute>
  );
}