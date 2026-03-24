// CreateProject/index.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from "react-bootstrap";
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { createProject, getAllProjects } from "../../../data/mockProjects";
import ProtectedRoute from "../../../components/ProtectedRoute";

function CreateProjectContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientList, setClientList] = useState([]);
  
  const [formData, setFormData] = useState({
    projectName: "",
    projectDescription: "",
    customerId: "",
    newCustomerName: "",
    projectDtStartDate: new Date().toISOString().split("T")[0],
    projectDtExpectedEndDate: "",
    contractBudget: "",
    projectOtisBranch: "OTIS BRASIL",
    contractNumber: "",
  });

  // Efeito para carregar clientes existentes
  useEffect(() => {
    const allProjects = getAllProjects();
    const clientsMap = new Map();
    
    // Cria uma lista única de clientes
    allProjects.forEach(project => {
      if (project.customerId && project.customerName) {
        clientsMap.set(project.customerId, project.customerName);
      }
    });

    const uniqueClients = Array.from(clientsMap, ([id, name]) => ({ id, name }));
    setClientList(uniqueClients);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!formData.projectName.trim()) {
      setError("Nome do projeto é obrigatório");
      setLoading(false);
      return;
    }
    if (!formData.customerId) {
      setError("Selecione um cliente ou crie um novo");
      setLoading(false);
      return;
    }

    let customerIdToSubmit;
    let customerNameToSubmit;

    if (formData.customerId === "NEW") {
      if (!formData.newCustomerName.trim()) {
        setError("O nome do novo cliente é obrigatório");
        setLoading(false);
        return;
      }
      customerNameToSubmit = formData.newCustomerName;
      customerIdToSubmit = Math.floor(Math.random() * 1000) + 100; // Garante um ID único (simulado)
    } else {
      // Cliente existente
      const selectedClient = clientList.find(c => c.id === parseInt(formData.customerId));
      customerNameToSubmit = selectedClient.name;
      customerIdToSubmit = selectedClient.id;
    }

    if (!formData.projectDtExpectedEndDate) {
      setError("Prazo previsto é obrigatório");
      setLoading(false);
      return;
    }

    if (!formData.contractBudget || parseFloat(formData.contractBudget) <= 0) {
      setError("Orçamento deve ser maior que zero");
      setLoading(false);
      return;
    }

    try {
      const newProject = createProject({
        projectName: formData.projectName,
        projectDescription: formData.projectDescription,
        customerName: customerNameToSubmit, // Dado dinâmico
        customerId: customerIdToSubmit, // Dado dinâmico
        projectDtStartDate: formData.projectDtStartDate,
        projectDtExpectedEndDate: formData.projectDtExpectedEndDate,
        contractBudget: parseFloat(formData.contractBudget),
        projectOtisBranch: formData.projectOtisBranch,
        contractNumber: formData.contractNumber || `CT-${Date.now()}`,
        projectSalesperson: user.id,
        createdBy: user.name
      });

      setSuccess(true);
      // Limpa o formulário
      setFormData({
        projectName: "",
        projectDescription: "",
        customerId: "",
        newCustomerName: "",
        projectDtStartDate: new Date().toISOString().split("T")[0],
        projectDtExpectedEndDate: "",
        contractBudget: "",
        projectOtisBranch: "OTIS BRASIL",
        contractNumber: "",
      });

      setTimeout(() => {
        navigate("/projects");
      }, 2000);
    } catch (err) {
      setError("Erro ao criar projeto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <Button
            variant="link"
            className="p-0 mb-3"
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft size={18} className="me-2" />
            Voltar para Projetos
          </Button>
          <h1 className="h3 fw-bold">Criar Novo Projeto</h1>
          <p className="text-muted">Preencha as informações para criar um novo projeto</p>
        </Col>
      </Row>

      <Row>
        <Col lg={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  <strong>Projeto criado com sucesso!</strong> Redirecionando para a lista de projetos...
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                {/* Informações Básicas */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Informações Básicas</h5>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Nome do Projeto *</Form.Label>
                    <Form.Control
                      type="text"
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleInputChange}
                      placeholder="Ex: Americanas Palladium Shopping Center"
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Descrição</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="projectDescription"
                      value={formData.projectDescription}
                      onChange={handleInputChange}
                      placeholder="Descreva os detalhes do projeto, escopo e objetivos..."
                      style={{ resize: "none" }}
                    />
                    <Form.Text className="text-muted">
                      Forneça uma descrição clara do escopo do projeto
                    </Form.Text>
                  </Form.Group>
                </div>

                <div className="mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Informações do Cliente</h5>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Cliente *</Form.Label>
                    <Form.Select
                      name="customerId"
                      value={formData.customerId}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecione um cliente existente...</option>
                      {clientList.map(client => (
                        <option key={client.id} value={client.id}>
                          {client.name} (ID: {client.id})
                        </option>
                      ))}
                      <option value="NEW" className="fw-bold text-primary">--- Criar novo cliente ---</option>
                    </Form.Select>
                  </Form.Group>

                  {/* Campo condicional para novo cliente */}
                  {formData.customerId === "NEW" && (
                    <Form.Group className="mb-3 p-3 bg-light-subtle rounded border">
                      <Form.Label className="fw-bold">Nome do Novo Cliente *</Form.Label>
                      <Form.Control
                        type="text"
                        name="newCustomerName"
                        value={formData.newCustomerName}
                        onChange={handleInputChange}
                        placeholder="Digite o nome do novo cliente"
                        required
                      />
                      <Form.Text className="text-muted">
                        Um novo ID será gerado automaticamente para este cliente.
                      </Form.Text>
                    </Form.Group>
                  )}
                </div>

                {/* Informações da OTIS */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Informações da OTIS</h5>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Filial *</Form.Label>
                        <Form.Select
                          name="projectOtisBranch"
                          value={formData.projectOtisBranch}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="OTIS BRASIL">OTIS BRASIL</option>
                          <option value="OTIS SÃO PAULO">OTIS SÃO PAULO</option>
                          <option value="OTIS RIO DE JANEIRO">OTIS RIO DE JANEIRO</option>
                          <option value="OTIS MINAS GERAIS">OTIS MINAS GERAIS</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Número do Contrato</Form.Label>
                        <Form.Control
                          type="text"
                          name="contractNumber"
                          value={formData.contractNumber}
                          onChange={handleInputChange}
                          placeholder="Ex: CT-2024-001"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>

                {/* Datas e Orçamento */}
                <div className="mb-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2">Datas e Orçamento</h5>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Data de Início *</Form.Label>
                        <Form.Control
                          type="date"
                          name="projectDtStartDate"
                          value={formData.projectDtStartDate}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">Prazo Previsto *</Form.Label>
                        <Form.Control
                          type="date"
                          name="projectDtExpectedEndDate"
                          value={formData.projectDtExpectedEndDate}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Orçamento do Contrato (R$) *</Form.Label>
                    <Form.Control
                      type="number"
                      name="contractBudget"
                      value={formData.contractBudget}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      required
                    />
                    <Form.Text className="text-muted">
                      Informe o valor total orçado para o projeto
                    </Form.Text>
                  </Form.Group>
                </div>

                {/* Botões */}
                <div className="d-flex gap-2 pt-3 border-top">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading || success}
                    className="d-flex align-items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" />
                        Criando...
                      </>
                    ) : (
                      "Criar Projeto"
                    )}
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => navigate("/projects")}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* Informações Adicionais */}
        <Col lg={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="fw-bold mb-3">💡 Informações Importantes</h6>
              
              <div className="mb-3">
                <small className="text-muted">
                  <strong>Status Inicial:</strong> Todo novo projeto inicia com status "Contrato Fechado"
                </small>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  <strong>Responsável:</strong> Você será registrado como o responsável comercial pelo projeto
                </small>
              </div>

              <div className="mb-3">
                <small className="text-muted">
                  <strong>Próximos Passos:</strong> Após a criação, o supervisor será notificado para dar andamento
                </small>
              </div>

              <Alert variant="info" className="small mb-0">
                <strong>Dica:</strong> Preencha todas as informações obrigatórias (*) para garantir o correto cadastro do projeto.
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Componente principal com proteção de rota
export default function CreateProject() {
  return (
    <ProtectedRoute requiredRoles={['sales', 'supervisor', 'admin']}>
      <CreateProjectContent />
    </ProtectedRoute>
  );
}