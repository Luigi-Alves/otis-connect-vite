// Support/index.jsx
import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, HelpCircle, Bug, Lightbulb, MessageCircle } from "lucide-react";
import ProtectedRoute from "../../components/ProtectedRoute";

// Função para simular o envio de ticket de suporte
const submitSupportTicket = (ticketData) => {
    console.log('Ticket de suporte enviado:', ticketData);
    return {
        id: Math.floor(Math.random() * 10000),
        ...ticketData,
        createdAt: new Date().toISOString(),
        status: 'open'
    };
};

function SupportContent() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        category: "technical",
        priority: "medium",
        subject: "",
        description: "",
        attachments: []
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!formData.subject.trim() || !formData.description.trim()) {
            setError("Assunto e descrição são obrigatórios");
            setLoading(false);
            return;
        }

        try {
            const ticketData = {
                ...formData,
                userId: user.id,
                userName: user.name,
                userRole: user.role,
                userEmail: user.email
            };

            const newTicket = submitSupportTicket(ticketData);

            setSuccess(`Ticket #${newTicket.id} enviado com sucesso! Nossa equipe entrará em contato em breve.`);

            // Limpa o formulário
            setFormData({
                category: "technical",
                priority: "medium",
                subject: "",
                description: "",
                attachments: []
            });

        } catch (err) {
            setError("Erro ao enviar ticket. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case "technical": return <Bug size={20} className="text-danger" />;
            case "feature": return <Lightbulb size={20} className="text-warning" />;
            case "general": return <HelpCircle size={20} className="text-info" />;
            default: return <MessageCircle size={20} className="text-primary" />;
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "low": return "success";
            case "medium": return "warning";
            case "high": return "danger";
            case "urgent": return "danger";
            default: return "secondary";
        }
    };

    return (
        <Container fluid>
            <Row className="mb-4">
                <Col>
                    <Button
                        variant="link"
                        className="p-0 mb-3"
                        onClick={() => navigate("/dashboard")}
                    >
                        <ArrowLeft size={18} className="me-2" />
                        Voltar para Dashboard
                    </Button>
                    <h1 className="h3 fw-bold">Suporte da Plataforma</h1>
                    <p className="text-muted">Precisa de ajuda? Abra um ticket de suporte</p>
                </Col>
            </Row>

            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            <Row>
                <Col lg={8}>
                    <Card className="border-0 shadow-sm">
                        <Card.Header className="bg-light">
                            <Card.Title className="mb-0">Novo Ticket de Suporte</Card.Title>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Categoria *</Form.Label>
                                            <Form.Select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="technical">
                                                    🐛 Problema Técnico
                                                </option>
                                                <option value="feature">
                                                    💡 Sugestão de Melhoria
                                                </option>
                                                <option value="general">
                                                    ❓ Dúvida Geral
                                                </option>
                                                <option value="access">
                                                    🔐 Problema de Acesso
                                                </option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="fw-bold">Prioridade *</Form.Label>
                                            <Form.Select
                                                name="priority"
                                                value={formData.priority}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="low">🟢 Baixa</option>
                                                <option value="medium">🟡 Média</option>
                                                <option value="high">🟠 Alta</option>
                                                <option value="urgent">🔴 Urgente</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-bold">Assunto *</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        placeholder="Descreva brevemente o assunto..."
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-4">
                                    <Form.Label className="fw-bold">Descrição Detalhada *</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={6}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Descreva em detalhes o problema, sugestão ou dúvida. Inclua informações como:
- O que você estava tentando fazer?
- O que aconteceu?
- Qual resultado você esperava?
- Passos para reproduzir o problema (se aplicável)"
                                        style={{ resize: "none" }}
                                        required
                                    />
                                    <Form.Text className="text-muted">
                                        Quanto mais detalhes você fornecer, mais rápido poderemos ajudá-lo.
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
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <MessageCircle size={18} />
                                                Enviar Ticket
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => navigate("/dashboard")}
                                        disabled={loading}
                                    >
                                        Cancelar
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Informações de Suporte */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm mb-4">
                        <Card.Body>
                            <h6 className="fw-bold mb-3">📞 Canais de Suporte</h6>

                            <div className="mb-3">
                                <small className="text-muted">
                                    <strong>Email:</strong> suporte@otisconnect.com
                                </small>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted">
                                    <strong>Telefone:</strong> (11) 4004-1234
                                </small>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted">
                                    <strong>Horário de Atendimento:</strong><br />
                                    Segunda a Sexta: 8h às 18h<br />
                                    Sábado: 8h às 12h
                                </small>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="border-0 shadow-sm">
                        <Card.Body>
                            <h6 className="fw-bold mb-3">💡 Antes de Enviar</h6>

                            <div className="mb-3">
                                <small className="text-muted">
                                    <strong>Problemas Técnicos:</strong> Inclua printscreens e detalhes do erro
                                </small>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted">
                                    <strong>Sugestões:</strong> Descreva o problema que a melhoria resolveria
                                </small>
                            </div>

                            <div className="mb-3">
                                <small className="text-muted">
                                    <strong>Dúvidas:</strong> Verifique primeiro a documentação disponível
                                </small>
                            </div>

                            <Alert variant="info" className="small mb-0">
                                <strong>Importante:</strong> Tickets são respondidos em até 24 horas úteis.
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

// Componente principal com proteção de rota
export default function Support() {
    return (
        <ProtectedRoute>
            <SupportContent />
        </ProtectedRoute>
    );
}