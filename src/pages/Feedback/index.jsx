// ClientFeedback/index.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { 
  getAllProjects,
  addFeedback,
  getProjectsByUser 
} from "../../data/mockProjects";
import ProtectedRoute from "../../components/ProtectedRoute";

function ClientFeedbackContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    projectId: "",
    feedbackType: "satisfacao",
    rating: 5,
    comments: "",
  });

  useEffect(() => {

    const allProjects = getAllProjects();
    
    // Filtra projetos pelo cliente
    const clientProjects = getProjectsByUser(user, allProjects);

    const completedClientProjects = clientProjects.filter(p => p.projectStatus === 10);
    
    setProjects(completedClientProjects);
    setLoading(false);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.projectId) {

      addFeedback({
        projectId: parseInt(formData.projectId),
        feedbackType: formData.feedbackType,
        rating: formData.rating,
        comments: formData.comments,
        clientName: user.name,
      });
      
      setSuccess(true);
      setFormData({ projectId: "", feedbackType: "satisfacao", rating: 5, comments: "" });
      setTimeout(() => navigate("/client"), 2000);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Carregando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Button variant="link" className="p-0 mb-3" onClick={() => navigate("/client")}>
            <ArrowLeft size={18} className="me-2" />
            Voltar para Meus Projetos
          </Button>
          <h1 className="h3 fw-bold">Feedback do Projeto</h1>
          <p className="text-muted">Compartilhe sua experiência sobre os projetos concluídos</p>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              {success && (
                <Alert variant="success" className="mb-4">
                  <strong>Feedback enviado com sucesso!</strong> Obrigado por compartilhar sua experiência.
                </Alert>
              )}

              {projects.length === 0 ? (
                <Alert variant="info">
                  <strong>Nenhum projeto concluído disponível para feedback.</strong><br />
                  Você só pode enviar feedback para projetos que já foram finalizados (Status: Concluído).
                </Alert>
              ) : (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Projeto Concluído *</Form.Label>
                    <Form.Select
                      value={formData.projectId}
                      onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                      required
                    >
                      <option value="">Selecione um projeto concluído</option>
                      {projects.map((project) => (
                        <option key={project.projectId} value={project.projectId}>
                          {project.projectName} - {project.customerName}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Selecione o projeto sobre o qual deseja enviar feedback
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Tipo de Feedback *</Form.Label>
                    <Form.Select
                      value={formData.feedbackType}
                      onChange={(e) => setFormData({ ...formData, feedbackType: e.target.value })}
                      required
                    >
                      <option value="satisfacao">Satisfação Geral</option>
                      <option value="qualidade">Qualidade do Serviço</option>
                      <option value="prazo">Cumprimento de Prazo</option>
                      <option value="comunicacao">Comunicação</option>
                      <option value="profissionalismo">Profissionalismo da Equipe</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">
                      Avaliação: <span className="text-primary">{formData.rating} / 5</span>
                    </Form.Label>
                    <Form.Range
                      min={1}
                      max={5}
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                      className="mb-2"
                    />
                    <div className="d-flex justify-content-between text-muted small">
                      <span>1 - Muito Insatisfeito</span>
                      <span>5 - Muito Satisfeito</span>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">Comentários Adicionais</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                      placeholder="Compartilhe detalhes sobre sua experiência, sugestões de melhoria ou elogios..."
                      style={{ resize: "none" }}
                    />
                    <Form.Text className="text-muted">
                      Sua opinião é muito importante para melhorarmos nossos serviços
                    </Form.Text>
                  </Form.Group>

                  <div className="d-flex gap-2">
                    <Button 
                      variant="outline-secondary" 
                      onClick={() => navigate("/client")}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      variant="primary" 
                      type="submit"
                      disabled={!formData.projectId}
                    >
                      Enviar Feedback
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Informações adicionais */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="fw-bold mb-3">💡 Sobre o Feedback</h6>
              <p className="small text-muted mb-3">
                Seu feedback nos ajuda a melhorar continuamente nossos serviços e a qualidade dos projetos.
              </p>
              
              <h6 className="fw-bold mb-2">✅ O que avaliar:</h6>
              <ul className="small text-muted">
                <li>Qualidade do trabalho executado</li>
                <li>Cumprimento dos prazos</li>
                <li>Comunicação com a equipe</li>
                <li>Profissionalismo</li>
                <li>Satisfação geral</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Componente principal com proteção de rota
export default function ClientFeedback() {
  return (
    <ProtectedRoute requiredRoles={['client']}>
      <ClientFeedbackContent />
    </ProtectedRoute>
  );
}