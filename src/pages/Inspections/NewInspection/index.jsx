// Inspections/New/index.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { 
  getAllProjects,
  addInspection,
  getStatusLabel
} from "../../../data/mockProjects";
import ProtectedRoute from "../../../components/ProtectedRoute";

function NewInspectionContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    projectId: "",
    approved: true,
    reworkNeeded: false,
    comments: "",
    inspectionDate: new Date().toISOString().split("T")[0]
  });

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = getAllProjects();
    const projectsForInspection = allProjects.filter(project => 
      project.projectStatus >= 8 && project.projectStatus <= 10
    );
    setProjects(projectsForInspection);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (!formData.projectId) {
      setError("Selecione um projeto para inspeção");
      setLoading(false);
      return;
    }

    try {
      const newInspection = addInspection({
        projectId: parseInt(formData.projectId),
        inspectionDate: formData.inspectionDate,
        approved: formData.approved,
        reworkNeeded: formData.reworkNeeded,
        comments: formData.comments,
        inspector: user.name
      });

      setSuccess("Inspeção registrada com sucesso! Redirecionando...");
      
      setTimeout(() => {
        navigate("/inspections");
      }, 2000);
    } catch (err) {
      setError("Erro ao registrar inspeção. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

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
          <h1 className="h3 fw-bold">Nova Inspeção</h1>
          <p className="text-muted">Registre uma nova inspeção de qualidade</p>
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Projeto *</Form.Label>
                  <Form.Select
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Selecione um projeto para inspeção</option>
                    {projects.map((project) => (
                      <option key={project.projectId} value={project.projectId}>
                        {project.projectName} - {getStatusLabel(project.projectStatus)}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    Apenas projetos em status de inspeção estão disponíveis
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">Data da Inspeção *</Form.Label>
                  <Form.Control
                    type="date"
                    name="inspectionDate"
                    value={formData.inspectionDate}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Resultado *</Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          label="Aprovado"
                          name="approved"
                          checked={formData.approved}
                          onChange={() => setFormData(prev => ({ ...prev, approved: true }))}
                        />
                        <Form.Check
                          inline
                          type="radio"
                          label="Reprovado"
                          name="approved"
                          checked={!formData.approved}
                          onChange={() => setFormData(prev => ({ ...prev, approved: false }))}
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Retrabalho Necessário</Form.Label>
                      <Form.Check
                        type="checkbox"
                        name="reworkNeeded"
                        label="Sim"
                        checked={formData.reworkNeeded}
                        onChange={handleInputChange}
                      />
                      <Form.Text className="text-muted">
                        Marque se for necessário retrabalho
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-bold">Comentários e Observações</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="comments"
                    value={formData.comments}
                    onChange={handleInputChange}
                    placeholder="Descreva os detalhes da inspeção, pontos verificados, não conformidades encontradas..."
                    style={{ resize: "none" }}
                  />
                  <Form.Text className="text-muted">
                    Inclua observações detalhadas sobre a qualidade do trabalho
                  </Form.Text>
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    type="submit"
                    disabled={loading}
                    className="d-flex align-items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Registrando...
                      </>
                    ) : (
                      "Registrar Inspeção"
                    )}
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate("/inspections")}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="fw-bold mb-3">📋 Diretrizes de Inspeção</h6>
              
              <div className="mb-3">
                <small className="text-muted">
                  <strong>Projetos Elegíveis:</strong> Apenas projetos em status "Revisão Solicitada" ou "Concluído"
                </small>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  <strong>Aprovação:</strong> Aprove apenas se todos os critérios de qualidade forem atendidos
                </small>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  <strong>Retrabalho:</strong> Marque como necessário quando houver não conformidades que impeçam a aprovação
                </small>
              </div>

              <Alert variant="info" className="small mb-0">
                <strong>Importante:</strong> Inspeções aprovadas avançam automaticamente o status do projeto para "Concluído".
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Componente principal com proteção de rota
export default function NewInspection() {
  return (
    <ProtectedRoute requiredRoles={['quality', 'supervisor']}>
      <NewInspectionContent />
    </ProtectedRoute>
  );
}