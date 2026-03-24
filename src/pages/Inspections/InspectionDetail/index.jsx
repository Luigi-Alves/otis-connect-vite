// Inspections/Detail/index.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, Alert, Spinner, Button } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { 
  getInspectionById,
  getAllProjects,
  getStatusLabel,
  getStatusColor
} from "../../../data/mockProjects";
import ProtectedRoute from "../../../components/ProtectedRoute";

function InspectionDetailContent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [inspection, setInspection] = useState(null);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const inspectionId = parseInt(id);

  useEffect(() => {
    if (isNaN(inspectionId)) {
      setLoading(false);
      return;
    }
    loadData(inspectionId);
  }, [id]);

  const loadData = (id) => {
    const inspectionData = getInspectionById(id);
    if (inspectionData) {
      setInspection(inspectionData);
      
      // Buscar dados do projeto
      const projects = getAllProjects();
      const projectData = projects.find(p => p.projectId === inspectionData.projectId);
      setProject(projectData);
    }
    setLoading(false);
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

  if (!inspection) {
    return (
      <Container fluid>
        <Alert variant="danger" className="mb-4">
          <strong>Inspeção não encontrada ou ID inválido.</strong>
        </Alert>
        <Button onClick={() => navigate("/inspections")}>Voltar para Inspeções</Button>
      </Container>
    );
  }

  return (
    <Container fluid>
      <Row className="mb-4">
        <Col>
          <Button
            variant="link"
            className="p-0 mb-3"
            onClick={() => navigate("/inspections")}
          >
            <ArrowLeft size={18} className="me-2" />
            Voltar para Inspeções
          </Button>
          <h1 className="h3 fw-bold">Detalhes da Inspeção #{inspection.id}</h1>
          <p className="text-muted">Informações completas sobre a inspeção realizada</p>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          {/* Informações da Inspeção */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Informações da Inspeção</Card.Title>
            </Card.Header>
            <Card.Body>
              <Row className="mb-3">
                <Col md={6}>
                  <p className="text-muted small mb-1">Resultado</p>
                  <Badge bg={inspection.approved ? "success" : "danger"} className="fs-6">
                    {inspection.approved ? "✓ Aprovado" : "✗ Reprovado"}
                  </Badge>
                </Col>
                <Col md={6}>
                  <p className="text-muted small mb-1">Retrabalho Necessário</p>
                  <Badge bg={inspection.reworkNeeded ? "warning" : "secondary"} className="fs-6">
                    {inspection.reworkNeeded ? "Sim" : "Não"}
                  </Badge>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <p className="text-muted small mb-1">Data da Inspeção</p>
                  <p className="fw-bold">
                    {new Date(inspection.inspectionDate).toLocaleDateString("pt-BR")}
                  </p>
                </Col>
                <Col md={6}>
                  <p className="text-muted small mb-1">Inspetor Responsável</p>
                  <p className="fw-bold">{inspection.inspector}</p>
                </Col>
              </Row>

              {inspection.comments && (
                <div className="mt-3 pt-3 border-top">
                  <p className="text-muted small mb-1">Comentários e Observações</p>
                  <div className="bg-light p-3 rounded">
                    <p className="mb-0">{inspection.comments}</p>
                  </div>
                </div>
              )}

              <div className="mt-3 pt-3 border-top">
                <p className="text-muted small mb-1">Data de Registro</p>
                <p className="fw-bold">
                  {new Date(inspection.createdAt).toLocaleDateString("pt-BR")} às{" "}
                  {new Date(inspection.createdAt).toLocaleTimeString("pt-BR")}
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Informações do Projeto */}
          {project && (
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-light">
                <Card.Title className="mb-0">Projeto Inspecionado</Card.Title>
              </Card.Header>
              <Card.Body>
                <p className="text-muted small mb-1">Nome do Projeto</p>
                <p className="fw-bold mb-3">{project.projectName}</p>

                <p className="text-muted small mb-1">Cliente</p>
                <p className="fw-bold mb-3">{project.customerName}</p>

                <p className="text-muted small mb-1">Status do Projeto</p>
                <Badge bg={getStatusColor(project.projectStatus)} className="fs-6 mb-3">
                  {getStatusLabel(project.projectStatus)}
                </Badge>

                <p className="text-muted small mb-1">Filial</p>
                <p className="fw-bold mb-0">{project.projectOtisBranch}</p>
              </Card.Body>
            </Card>
          )}

          {/* Impacto da Inspeção */}
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Impacto</Card.Title>
            </Card.Header>
            <Card.Body>
              {inspection.approved ? (
                <Alert variant="success" className="small mb-0">
                  <strong>✓ Projeto Concluído:</strong> Esta inspeção aprovada resultou na conclusão do projeto.
                </Alert>
              ) : (
                <Alert variant="warning" className="small mb-0">
                  <strong>⚠️ Ações Necessárias:</strong> Esta inspeção reprovada indica a necessidade de correções antes da aprovação final.
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Componente principal com proteção de rota
export default function InspectionDetail() {
  return (
    <ProtectedRoute requiredRoles={['quality', 'supervisor', 'admin']}>
      <InspectionDetailContent />
    </ProtectedRoute>
  );
}