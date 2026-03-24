// KPIs/index.jsx
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Badge, ProgressBar, Table, Alert } from "react-bootstrap";
import { useAuth } from "../../contexts/AuthContext";
import { 
  TrendingUp, 
  BarChart3, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  DollarSign,
  Calendar,
  Target
} from "lucide-react";
import { 
  getAllProjects,
  getAllInspections,
  getStatusLabel,
  getStatusColor,
  getProgressValue
} from "../../data/mockProjects";
import ProtectedRoute from "../../components/ProtectedRoute";

function KPIsContent() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const allProjects = getAllProjects();
    const allInspections = getAllInspections();
    
    setProjects(allProjects);
    setInspections(allInspections);
    setLoading(false);
  };

  // Cálculos de KPIs
  const calculateKPIs = () => {
    const totalProjects = projects.length;
    const completedProjects = projects.filter(p => p.projectStatus === 10).length;
    const inProgressProjects = projects.filter(p => p.projectStatus > 1 && p.projectStatus < 10).length;
    const notStartedProjects = projects.filter(p => p.projectStatus === 1).length;
    const reviewRequested = projects.filter(p => p.projectStatus === 9).length;

    // Cálculo de prazos
    const today = new Date();
    const projectsWithDelay = projects.filter(project => {
      if (project.projectStatus === 10) return false; // Ignorar concluídos
      const deadline = new Date(project.projectDtExpectedEndDate);
      return deadline < today;
    });

    const projectsOnTime = projects.filter(project => {
      if (project.projectStatus === 10) return false;
      const deadline = new Date(project.projectDtExpectedEndDate);
      return deadline >= today;
    });

    // Cálculo de custos
    const totalBudget = projects.reduce((sum, project) => sum + project.contractBudget, 0);
    const totalActualCost = projects.reduce((sum, project) => sum + project.realCost, 0);
    const costVariance = totalBudget - totalActualCost;
    const costVariancePercentage = totalBudget > 0 ? (costVariance / totalBudget) * 100 : 0;

    // Cálculo de qualidade
    const totalInspectionsCount = inspections.length;
    const approvedInspections = inspections.filter(i => i.approved).length;
    const approvalRate = totalInspectionsCount > 0 ? (approvedInspections / totalInspectionsCount) * 100 : 0;

    // Cálculo de progresso médio
    const averageProgress = projects.length > 0 
      ? projects.reduce((sum, project) => sum + getProgressValue(project.projectStatus), 0) / projects.length 
      : 0;

    // Projetos por status
    const projectsByStatus = projects.reduce((acc, project) => {
      const status = getStatusLabel(project.projectStatus);
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      notStartedProjects,
      reviewRequested,
      projectsWithDelay: projectsWithDelay.length,
      projectsOnTime: projectsOnTime.length,
      onTimeRate: totalProjects > 0 ? (projectsOnTime.length / totalProjects) * 100 : 0,
      completionRate: totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0,
      totalBudget,
      totalActualCost,
      costVariance,
      costVariancePercentage,
      budgetUtilization: totalBudget > 0 ? (totalActualCost / totalBudget) * 100 : 0,
      totalInspectionsCount,
      approvedInspections,
      approvalRate,
      averageProgress,
      projectsByStatus
    };
  };

  const kpis = calculateKPIs();

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
          <h1 className="h3 fw-bold">KPIs e Relatórios</h1>
          <p className="text-muted">Métricas de desempenho da plataforma</p>
        </Col>
      </Row>

      {/* KPI Cards Principais */}
      <Row className="mb-4">
        <Col md={6} lg={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted small mb-1">Taxa de Conclusão</p>
                  <h3 className="fw-bold mb-0">{kpis.completionRate.toFixed(1)}%</h3>
                  <small className="text-muted">
                    {kpis.completedProjects} de {kpis.totalProjects} projetos
                  </small>
                </div>
                <CheckCircle size={32} className="text-success opacity-50" />
              </div>
              <ProgressBar 
                now={kpis.completionRate} 
                variant="success" 
                className="mt-2" 
                style={{ height: "6px" }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted small mb-1">Projetos no Prazo</p>
                  <h3 className="fw-bold mb-0">{kpis.onTimeRate.toFixed(1)}%</h3>
                  <small className="text-muted">
                    {kpis.projectsOnTime} de {kpis.totalProjects} projetos
                  </small>
                </div>
                <Clock size={32} className="text-info opacity-50" />
              </div>
              <ProgressBar 
                now={kpis.onTimeRate} 
                variant="info" 
                className="mt-2" 
                style={{ height: "6px" }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted small mb-1">Utilização Orçamentária</p>
                  <h3 className="fw-bold mb-0">{kpis.budgetUtilization.toFixed(1)}%</h3>
                  <small className="text-muted">
                    R$ {kpis.totalActualCost.toLocaleString('pt-BR')} / R$ {kpis.totalBudget.toLocaleString('pt-BR')}
                  </small>
                </div>
                <DollarSign size={32} className="text-warning opacity-50" />
              </div>
              <ProgressBar 
                now={kpis.budgetUtilization} 
                variant={kpis.budgetUtilization > 100 ? "danger" : "warning"} 
                className="mt-2" 
                style={{ height: "6px" }}
              />
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={3} className="mb-3">
          <Card className="border-0 shadow-sm h-100">
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-muted small mb-1">Taxa de Aprovação</p>
                  <h3 className="fw-bold mb-0">{kpis.approvalRate.toFixed(1)}%</h3>
                  <small className="text-muted">
                    {kpis.approvedInspections} de {kpis.totalInspectionsCount} inspeções
                  </small>
                </div>
                <Target size={32} className="text-primary opacity-50" />
              </div>
              <ProgressBar 
                now={kpis.approvalRate} 
                variant="primary" 
                className="mt-2" 
                style={{ height: "6px" }}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Segunda Linha de KPIs */}
      <Row className="mb-4">
        <Col md={6} lg={2} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="py-3">
              <TrendingUp size={24} className="text-success mb-2" />
              <h4 className="fw-bold text-success mb-1">{kpis.averageProgress.toFixed(1)}%</h4>
              <small className="text-muted">Progresso Médio</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={2} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="py-3">
              <AlertCircle size={24} className="text-danger mb-2" />
              <h4 className="fw-bold text-danger mb-1">{kpis.projectsWithDelay}</h4>
              <small className="text-muted">Com Atraso</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={2} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="py-3">
              <BarChart3 size={24} className="text-warning mb-2" />
              <h4 className="fw-bold text-warning mb-1">{kpis.reviewRequested}</h4>
              <small className="text-muted">Em Revisão</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={2} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="py-3">
              <CheckCircle size={24} className="text-info mb-2" />
              <h4 className="fw-bold text-info mb-1">{kpis.inProgressProjects}</h4>
              <small className="text-muted">Em Andamento</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={2} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="py-3">
              <Calendar size={24} className="text-secondary mb-2" />
              <h4 className="fw-bold text-secondary mb-1">{kpis.notStartedProjects}</h4>
              <small className="text-muted">Não Iniciados</small>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={2} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body className="py-3">
              <DollarSign size={24} className={kpis.costVariance >= 0 ? "text-success" : "text-danger"} />
              <h4 className={`fw-bold mb-1 ${kpis.costVariance >= 0 ? "text-success" : "text-danger"}`}>
                {kpis.costVariance >= 0 ? "+" : ""}{kpis.costVariancePercentage.toFixed(1)}%
              </h4>
              <small className="text-muted">Variação de Custo</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Distribuição Detalhada */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Distribuição de Projetos por Status</Card.Title>
            </Card.Header>
            <Card.Body>
              {Object.entries(kpis.projectsByStatus).map(([status, count]) => (
                <div key={status} className="mb-3">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small">{status}</span>
                    <Badge bg={getStatusColor(projects.find(p => getStatusLabel(p.projectStatus) === status)?.projectStatus)}>
                      {count}
                    </Badge>
                  </div>
                  <ProgressBar 
                    now={(count / kpis.totalProjects) * 100} 
                    variant={getStatusColor(projects.find(p => getStatusLabel(p.projectStatus) === status)?.projectStatus)}
                    style={{ height: "8px" }}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">Resumo Financeiro</Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">Orçamento Total</span>
                  <strong className="text-primary">
                    R$ {kpis.totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </strong>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">Custo Real Total</span>
                  <strong className={kpis.totalActualCost > kpis.totalBudget ? "text-danger" : "text-success"}>
                    R$ {kpis.totalActualCost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </strong>
                </div>
                
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="small">Variação de Custo</span>
                  <strong className={kpis.costVariance >= 0 ? "text-success" : "text-danger"}>
                    {kpis.costVariance >= 0 ? "+" : ""}R$ {Math.abs(kpis.costVariance).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </strong>
                </div>

                <div className="mt-3 p-3 bg-light rounded">
                  <small className="text-muted">
                    <strong>Status Financeiro:</strong>{" "}
                    {kpis.costVariance > 0 
                      ? "Dentro do orçamento" 
                      : kpis.costVariance === 0 
                        ? "No orçamento exato" 
                        : "Acima do orçamento"
                    }
                  </small>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Projetos com Atraso */}
      {kpis.projectsWithDelay > 0 && (
        <Row>
          <Col>
            <Card className="border-0 shadow-sm">
              <Card.Header className="bg-light">
                <Card.Title className="mb-0">
                  <AlertCircle size={20} className="text-danger me-2" />
                  Projetos com Atraso
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <div className="table-responsive">
                  <Table hover>
                    <thead>
                      <tr>
                        <th>Projeto</th>
                        <th>Cliente</th>
                        <th>Status</th>
                        <th>Prazo Original</th>
                        <th>Dias de Atraso</th>
                        <th>Progresso</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects
                        .filter(project => {
                          if (project.projectStatus === 10) return false;
                          const deadline = new Date(project.projectDtExpectedEndDate);
                          return deadline < new Date();
                        })
                        .map(project => {
                          const deadline = new Date(project.projectDtExpectedEndDate);
                          const today = new Date();
                          const delayDays = Math.ceil((today - deadline) / (1000 * 60 * 60 * 24));
                          
                          return (
                            <tr key={project.projectId}>
                              <td className="fw-bold">{project.projectName}</td>
                              <td>{project.customerName}</td>
                              <td>
                                <Badge bg={getStatusColor(project.projectStatus)}>
                                  {getStatusLabel(project.projectStatus)}
                                </Badge>
                              </td>
                              <td>{deadline.toLocaleDateString('pt-BR')}</td>
                              <td>
                                <Badge bg="danger">{delayDays} dias</Badge>
                              </td>
                              <td>
                                <ProgressBar 
                                  now={getProgressValue(project.projectStatus)} 
                                  variant="warning"
                                  style={{ height: "8px" }}
                                  label={`${getProgressValue(project.projectStatus)}%`}
                                />
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Resumo Geral */}
      <Row className="mt-4">
        <Col>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h6 className="fw-bold mb-3">📊 Resumo Geral</h6>
              <Row>
                <Col md={4}>
                  <div className="text-center">
                    <h4 className="fw-bold text-primary">{kpis.totalProjects}</h4>
                    <small className="text-muted">Total de Projetos</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <h4 className="fw-bold text-success">{kpis.completedProjects}</h4>
                    <small className="text-muted">Projetos Concluídos</small>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center">
                    <h4 className="fw-bold text-warning">{kpis.totalInspectionsCount}</h4>
                    <small className="text-muted">Inspeções Realizadas</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

// Componente principal com proteção de rota
export default function KPIs() {
  return (
    <ProtectedRoute requiredRoles={['supervisor', 'admin', 'sales']}>
      <KPIsContent />
    </ProtectedRoute>
  );
}