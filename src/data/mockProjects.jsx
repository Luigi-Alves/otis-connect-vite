// data/mockProjects.jsx

// CONSTANTES
const STORAGE_KEYS = {
  PROJECTS: 'otisconnect_projects',
  INSPECTIONS: 'otisconnect_inspections',
  TIMELINE: 'otisconnect_timeline',
  FEEDBACK: 'otisconnect_feedback',
  TASKS: 'otisconnect_tasks',
  STATUSES: 'otisconnect_statuses',
  LOCATIONS: 'otisconnect_locations'
};

// DADOS MOCKADOS INICIAIS

// Status dos projetos
const INITIAL_PROJECT_STATUSES = [
  { statusId: 1, label: "Contrato Fechado", roles: ['sales', 'supervisor'], canEdit: ['sales', 'supervisor'] },
  { statusId: 2, label: "Aguardando Liberação", roles: ['supervisor'], canEdit: ['supervisor'] },
  { statusId: 3, label: "Liberado para fabricação", roles: ['supervisor'], canEdit: ['supervisor'] },
  { statusId: 4, label: "Em Produção", roles: ['supervisor'], canEdit: ['supervisor'] },
  { statusId: 5, label: "Entregue na Obra", roles: ['supervisor'], canEdit: ['supervisor'] },
  { statusId: 6, label: "Instalação Mecânica", roles: ['supervisor', 'field'], canEdit: ['supervisor', 'field'] },
  { statusId: 7, label: "Ajuste Fino", roles: ['supervisor', 'field'], canEdit: ['supervisor', 'field'] },
  { statusId: 8, label: "Aguardando Inspeção", roles: ['supervisor', 'quality'], canEdit: ['supervisor', 'quality'] },
  { statusId: 9, label: "Revisão Solicitada", roles: ['supervisor', 'field', 'quality'], canEdit: ['supervisor', 'field', 'quality'] },
  { statusId: 10, label: "Concluído", roles: ['supervisor', 'quality'], canEdit: ['supervisor', 'quality'] }
];
// Exporta a constante inicial
export { INITIAL_PROJECT_STATUSES as MOCKED_PROJECT_STATUSES };

// Status das tarefas
export const MOCKED_TASKS_STATUSES = [
  { statusId: 1, label: "Pendente" },
  { statusId: 2, label: "Em Andamento" },
  { statusId: 3, label: "Concluída" }
];

// Listas Mestras de Pessoal
export const MOCKED_FIELD_STAFF = [
  { id: 15, name: 'Ricardo Lemos', type: 'mechanical_technician' },
  { id: 20, name: 'Diogo Pessoa', type: 'fitter_technician' },
  { id: 25, name: 'Fernando Silva', type: 'mechanical_technician' },
  { id: 30, name: 'Carlos Santos', type: 'fitter_technician' },
  { id: 35, name: 'Ana Beatriz', type: 'mechanical_technician' },
  { id: 40, name: 'Lucas Mendes', type: 'fitter_technician' }
];
export const MOCKED_QUALITY_STAFF = [
  { id: 30, name: 'Ana Costa', type: 'inspector' },
  { id: 31, name: 'Roberto Ferreira', type: 'inspector' }
];

// Localidades
const INITIAL_LOCATIONS = [
  { id: 1, country: "Brasil", branch: "OTIS BRASIL", region: "Sudeste" },
  { id: 2, country: "Brasil", branch: "OTIS BRASIL", region: "Sul" },
  { id: 3, country: "Brasil", branch: "OTIS BRASIL", region: "Nordeste" },
  { id: 4, country: "Argentina", branch: "OTIS ARGENTINA", region: "Buenos Aires" },
];
// Exporta a constante inicial
export { INITIAL_LOCATIONS as MOCKED_LOCATIONS };

// Projetos iniciais
const INITIAL_PROJECTS = [
  {
    projectId: 1,
    projectName: "Americanas Palladium Shopping Center",
    projectStatus: 8, projectOtisBranch: "OTIS BRASIL", projectProgress: "80%", projectDtStartDate: "2024-01-15", projectDtExpectedEndDate: "2024-03-20", projectDtActualEndDate: null, projectDtLastUpdate: "2024-02-25", projectDtReadyForManufacturing: null, projectDescription: "Instalação de sistema completo no shopping center", projectSalesperson: 5, projectSupervisor: 10,
    projectFieldTeam: [ { id: 15, name: 'Ricardo Lemos', type: 'mechanical_technician' }, { id: 20, name: 'Diogo Pessoa', type: 'fitter_technician' }, ],
    projectFieldTasks: [ { id: 1, name: "Instalação mecânica", status: 3 }, { id: 2, name: "Instalação elétrica", status: 3 }, { id: 3, name: "Ajustes finos", status: 2 } ],
    projectQualityTeam: [{ id: 31, name: 'Roberto Ferreira', type: 'inspector' }], projectQualityNotes: null, contractNumber: "CT-2024-001", contractFiles: [], contractBudget: 125000, realCost: 130000, kpiDelayDays: 0, kpiCostVariance: -5000, customerId: 13, customerName: 'Americanas', customerContactId: 1, customerCountry: 'Brasil', customerAddress: "São Paulo, SP", clientFeedback: [], createdAt: "2024-01-15T10:00:00Z"
  },
  {
    projectId: 2,
    projectName: "Torre Alpha Corporate",
    projectStatus: 9, projectOtisBranch: "OTIS BRASIL", projectProgress: "90%", projectDtStartDate: "2024-02-01", projectDtExpectedEndDate: "2024-05-15", projectDtActualEndDate: null, projectDtLastUpdate: "2024-03-20", projectDtReadyForManufacturing: "2024-02-20", projectDescription: "Instalação em edifício corporativo", projectSalesperson: 5, projectSupervisor: 10,
    projectFieldTeam: [ { id: 15, name: 'Ricardo Lemos', type: 'mechanical_technician' }, ],
    projectFieldTasks: [ { id: 1, name: "Instalação mecânica", status: 3 }, { id: 2, name: "Instalação elétrica", status: 3 }, { id: 3, name: "Ajustes finos", status: 3 } ],
    projectQualityTeam: [{ id: 30, name: 'Ana Costa', type: 'inspector' }], projectQualityNotes: "Aguardando revisão dos ajustes finais", contractNumber: "CT-2024-002", contractFiles: [], contractBudget: 180000, realCost: 175000, kpiDelayDays: 0, kpiCostVariance: 5000, customerId: 14, customerName: 'Construtora X', customerContactId: 2, customerCountry: 'Brasil', customerAddress: "Rio de Janeiro, RJ", clientFeedback: [], createdAt: "2024-02-01T09:15:00Z"
  },
   {
    projectId: 3,
    projectName: "Residencial Green Valley",
    projectStatus: 10, projectOtisBranch: "OTIS SÃO PAULO", projectProgress: "100%", projectDtStartDate: "2023-11-10", projectDtExpectedEndDate: "2024-02-28", projectDtActualEndDate: "2024-02-25", projectDtLastUpdate: "2024-02-25", projectDtReadyForManufacturing: "2023-11-25", projectDescription: "Instalação residencial de alto padrão", projectSalesperson: 5, projectSupervisor: 10,
    projectFieldTeam: [ { id: 25, name: 'Fernando Silva', type: 'mechanical_technician' }, { id: 30, name: 'Carlos Santos', type: 'fitter_technician' }, ],
    projectFieldTasks: [ { id: 1, name: "Instalação mecânica", status: 3 }, { id: 2, name: "Instalação elétrica", status: 3 }, { id: 3, name: "Ajustes finos", status: 3 } ],
    projectQualityTeam: [{ id: 30, name: 'Ana Costa', type: 'inspector' }], projectQualityNotes: "Projeto concluído com sucesso", contractNumber: "CT-2023-045", contractFiles: [], contractBudget: 95000, realCost: 92000, kpiDelayDays: -3, kpiCostVariance: 3000, customerId: 15, customerName: 'Green Valley Residencial', customerContactId: 3, customerCountry: 'Brasil', customerAddress: "São Paulo, SP", clientFeedback: [], createdAt: "2023-11-10T08:30:00Z"
  }
];

// Inspeções iniciais
const INITIAL_INSPECTIONS = [
  { id: 1, projectId: 3, inspectionDate: "2024-02-20", approved: true, reworkNeeded: false, comments: "Instalação concluída com excelente qualidade.", inspector: "Ana Costa", createdAt: "2024-02-20T14:30:00Z" },
  { id: 2, projectId: 2, inspectionDate: "2024-03-15", approved: false, reworkNeeded: true, comments: "Necessário ajuste nos parafusos.", inspector: "Ana Costa", createdAt: "2024-03-15T11:20:00Z" },
  { id: 3, projectId: 1, inspectionDate: "2024-03-10", approved: true, reworkNeeded: false, comments: "Sistema instalado corretamente.", inspector: "Roberto Ferreira", createdAt: "2024-03-10T16:45:00Z" }
];

// Timeline inicial
const INITIAL_TIMELINE = [
  { id: 1, projectId: 1, statusId: 1, notes: "Contrato assinado", createdAt: "2024-01-15T10:00:00Z", userId: "user_sales_001", userName: "Maria Santos" },
  { id: 2, projectId: 1, statusId: 2, notes: "Documentação enviada", createdAt: "2024-01-20T14:30:00Z", userId: "user_supervisor_001", userName: "Roberto Ferreira" },
  { id: 3, projectId: 2, statusId: 1, notes: "Contrato assinado", createdAt: "2024-02-01T09:15:00Z", userId: "user_sales_001", userName: "Maria Santos" },
  { id: 4, projectId: 3, statusId: 10, notes: "Projeto concluído", createdAt: "2024-02-25T16:00:00Z", userId: "user_quality_001", userName: "Ana Costa" }
];

// Feedback inicial
const INITIAL_FEEDBACK = [
  { id: 1, projectId: 3, feedbackType: "satisfacao", rating: 5, comments: "Excelente trabalho!", clientName: "João Silva", createdAt: "2024-02-28T10:30:00Z" }
];

// Tasks iniciais
const INITIAL_TASKS = [
   { taskId: 1, projectId: 1, taskName: "Instalação mecânica", taskResponsible: { id: 15, name: "Ricardo Lemos" }, taskStatus: 3, taskDeadline: "2024-02-10", createdAt: "2024-01-20T08:00:00Z", completedAt: "2024-02-10T17:30:00Z"},
   { taskId: 2, projectId: 1, taskName: "Instalação elétrica", taskResponsible: { id: 20, name: "Diogo Pessoa" }, taskStatus: 3, taskDeadline: "2024-02-20", createdAt: "2024-02-11T08:00:00Z", completedAt: "2024-02-20T16:00:00Z"},
   { taskId: 3, projectId: 1, taskName: "Ajustes finos", taskResponsible: { id: 15, name: "Ricardo Lemos" }, taskStatus: 2, taskDeadline: "2024-03-05", createdAt: "2024-02-21T09:00:00Z", completedAt: null},
   { taskId: 4, projectId: 2, taskName: "Instalação mecânica", taskResponsible: { id: 15, name: "Ricardo Lemos" }, taskStatus: 3, taskDeadline: "2024-03-01", createdAt: "2024-02-05T08:00:00Z", completedAt: "2024-03-01T18:00:00Z"},
   { taskId: 5, projectId: 2, taskName: "Instalação elétrica", taskResponsible: { id: 15, name: "Ricardo Lemos" }, taskStatus: 3, taskDeadline: "2024-03-15", createdAt: "2024-03-02T08:00:00Z", completedAt: "2024-03-15T17:00:00Z"},
   { taskId: 6, projectId: 2, taskName: "Ajustes finos", taskResponsible: { id: 15, name: "Ricardo Lemos" }, taskStatus: 3, taskDeadline: "2024-03-20", createdAt: "2024-03-16T08:00:00Z", completedAt: "2024-03-20T16:30:00Z"}
];

// FUNÇÕES DE GERENCIAMENTO

const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Erro ao salvar ${key} no localStorage:`, error);
    return false;
  }
};

const loadFromStorage = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    if (data === null || data === undefined || data === 'undefined') {
        return defaultValue;
    }

    try {
        return JSON.parse(data);
    } catch (parseError) {
        console.error(`Erro ao fazer parse de ${key} do localStorage:`, parseError);
        localStorage.removeItem(key);
        return defaultValue;
    }
  } catch (error) {
    console.error(`Erro ao carregar ${key} do localStorage:`, error);
    localStorage.removeItem(key);
    return defaultValue;
  }
};


// Inicializar localStorage
export const initializeStorage = () => {

  if (!localStorage.getItem(STORAGE_KEYS.PROJECTS)) {
    saveToStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.INSPECTIONS)) {
    saveToStorage(STORAGE_KEYS.INSPECTIONS, INITIAL_INSPECTIONS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TIMELINE)) {
    saveToStorage(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE);
  }
  if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK)) {
    saveToStorage(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);
  }
  if (!localStorage.getItem(STORAGE_KEYS.TASKS)) {
    saveToStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.STATUSES)) {
    saveToStorage(STORAGE_KEYS.STATUSES, INITIAL_PROJECT_STATUSES);
  }
   if (!localStorage.getItem(STORAGE_KEYS.LOCATIONS)) {
    saveToStorage(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
  }
};

// FUNÇÕES DE CONSULTA

// Projetos
export const getAllProjects = () => loadFromStorage(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
export const getProjectsByUser = (user, allProjects = null) => {
  const projects = allProjects || getAllProjects();
  if (!user) return [];
  if (user.role === 'client') {
    const userIdNum = parseInt(user.id);
    return projects.filter(project => project.customerId === userIdNum);
  }
  return projects;
};
export const getProjectById = (projectId) => {
  const idNum = parseInt(projectId);
  if (isNaN(idNum)) return null;
  const projects = getAllProjects();
  return projects.find(project => project.projectId === idNum);
};

// Inspeções
export const getAllInspections = () => loadFromStorage(STORAGE_KEYS.INSPECTIONS, INITIAL_INSPECTIONS);
export const getProjectInspections = (projectId) => {
  const idNum = parseInt(projectId);
  if (isNaN(idNum)) return [];
  const inspections = getAllInspections();
  return inspections.filter(inspection => inspection.projectId === idNum)
    .sort((a, b) => new Date(b.inspectionDate) - new Date(a.inspectionDate));
};
export const getInspectionById = (inspectionId) => {
  const idNum = parseInt(inspectionId);
  if (isNaN(idNum)) return null;
  const inspections = getAllInspections();
  return inspections.find(inspection => inspection.id === idNum);
};

// Timeline
export const getAllTimeline = () => loadFromStorage(STORAGE_KEYS.TIMELINE, INITIAL_TIMELINE);
export const getProjectTimeline = (projectId) => {
  const idNum = parseInt(projectId);
  if (isNaN(idNum)) return [];
  const timeline = getAllTimeline();
  return timeline.filter(entry => entry.projectId === idNum)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// Feedback
export const getAllFeedback = () => loadFromStorage(STORAGE_KEYS.FEEDBACK, INITIAL_FEEDBACK);

// Equipes
export const getAvailableFieldStaff = () => MOCKED_FIELD_STAFF;
export const getAvailableQualityStaff = () => MOCKED_QUALITY_STAFF;

// Statuses e Locations
export const getAllStatuses = () => loadFromStorage(STORAGE_KEYS.STATUSES, INITIAL_PROJECT_STATUSES);
export const getAllLocations = () => loadFromStorage(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);

// FUNÇÕES DE MANIPULAÇÃO

// Projetos
export const createProject = (projectData) => {
  const projects = getAllProjects();
  const newProject = {
    ...projectData,
    projectId: projects.length > 0 ? Math.max(...projects.map(p => p.projectId)) + 1 : 1,
    projectStatus: 1,
    projectProgress: "0%",
    realCost: 0, kpiDelayDays: 0, kpiCostVariance: 0,
    clientFeedback: [],
    projectFieldTeam: projectData.projectFieldTeam || [],
    projectQualityTeam: projectData.projectQualityTeam || [],
    projectFieldTasks: projectData.projectFieldTasks || [],
    projectQualityNotes: null, projectDtActualEndDate: null,
    projectDtLastUpdate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString()
  };
  const updatedProjects = [...projects, newProject];
  saveToStorage(STORAGE_KEYS.PROJECTS, updatedProjects);
  addTimelineEntry({
    projectId: newProject.projectId, statusId: 1, notes: "Projeto criado",
    userId: projectData.createdById || "system", userName: projectData.createdBy || "Sistema"
  });
  return newProject;
};

export const updateProjectStatus = (projectId, newStatusId, notes = "", user) => {
  const idNum = parseInt(projectId);
  if (isNaN(idNum)) return null;
  const projects = getAllProjects();
  const projectIndex = projects.findIndex(p => p.projectId === idNum);
  if (projectIndex === -1) return null;
  
  projects[projectIndex].projectStatus = newStatusId;
  projects[projectIndex].projectDtLastUpdate = new Date().toISOString().split('T')[0];
  projects[projectIndex].projectProgress = `${getProgressValue(newStatusId)}%`;
  
  if (newStatusId === 10 && !projects[projectIndex].projectDtActualEndDate) {
    projects[projectIndex].projectDtActualEndDate = new Date().toISOString().split('T')[0];
  }
  
  saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  
  const timelineUser = user || { id: 'system', name: 'Sistema' }; // Fallback
  addTimelineEntry({
    projectId: idNum, statusId: newStatusId, notes,
    userId: timelineUser.id, userName: timelineUser.name
  });
  
  return projects[projectIndex];
};

export const updateProject = (projectId, updatedData) => {
  const idNum = parseInt(projectId);
  if (isNaN(idNum)) return null;
  const projects = getAllProjects();
  const projectIndex = projects.findIndex(p => p.projectId === idNum);
  if (projectIndex === -1) return null;
  projects[projectIndex] = { ...projects[projectIndex], ...updatedData, projectDtLastUpdate: new Date().toISOString().split('T')[0] };
  const success = saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  return success ? projects[projectIndex] : null;
};

export const updateProjectFieldTeam = (projectId, newTeamArray) => {
  const idNum = parseInt(projectId);
  if (isNaN(idNum)) return false;
  const projects = getAllProjects();
  const projectIndex = projects.findIndex(p => p.projectId === idNum);
  if (projectIndex === -1) return false;
  projects[projectIndex].projectFieldTeam = newTeamArray;
  return saveToStorage(STORAGE_KEYS.PROJECTS, projects);
};

export const updateProjectQualityTeam = (projectId, newTeamArray) => {
  const idNum = parseInt(projectId);
  if (isNaN(idNum)) return false;
  const projects = getAllProjects();
  const projectIndex = projects.findIndex(p => p.projectId === idNum);
  if (projectIndex === -1) return false;
  projects[projectIndex].projectQualityTeam = newTeamArray;
  return saveToStorage(STORAGE_KEYS.PROJECTS, projects);
};

export const deleteProject = (projectId) => {
  const idNum = parseInt(projectId);
   if (isNaN(idNum)) return false;
  const projects = getAllProjects();
  const updatedProjects = projects.filter(p => p.projectId !== idNum);
  
  // Deleta itens relacionados
  const tasks = getAllTasks().filter(t => t.projectId !== idNum); saveToStorage(STORAGE_KEYS.TASKS, tasks);
  const inspections = getAllInspections().filter(i => i.projectId !== idNum); saveToStorage(STORAGE_KEYS.INSPECTIONS, inspections);
  const timeline = getAllTimeline().filter(tl => tl.projectId !== idNum); saveToStorage(STORAGE_KEYS.TIMELINE, timeline);
  const feedback = getAllFeedback().filter(fb => fb.projectId !== idNum); saveToStorage(STORAGE_KEYS.FEEDBACK, feedback);
  
  return saveToStorage(STORAGE_KEYS.PROJECTS, updatedProjects);
};

// Inspeções
export const addInspection = (inspectionData) => {
  const inspections = getAllInspections();
  const newInspection = {
    ...inspectionData,
    id: inspections.length > 0 ? Math.max(...inspections.map(i => i.id)) + 1 : 1,
    createdAt: new Date().toISOString()
  };
  const updatedInspections = [...inspections, newInspection];
  saveToStorage(STORAGE_KEYS.INSPECTIONS, updatedInspections);
  
  const project = getProjectById(newInspection.projectId);
  if (project) {
      if (newInspection.approved && project.projectStatus !== 10) {
        updateProjectStatus(newInspection.projectId, 10, "Projeto concluído após inspeção aprovada"); 
      } else if (!newInspection.approved && inspectionData.reworkNeeded && project.projectStatus !== 9) {
        updateProjectStatus(newInspection.projectId, 9, "Revisão solicitada após inspeção reprovada");
      }
  }
  
  return newInspection;
};

// Timeline
const addTimelineEntry = (entryData) => {
  const timeline = getAllTimeline();
  const newEntry = {
    ...entryData,
    id: timeline.length > 0 ? Math.max(...timeline.map(t => t.id)) + 1 : 1,
    createdAt: new Date().toISOString()
  };
  const updatedTimeline = [...timeline, newEntry];
  saveToStorage(STORAGE_KEYS.TIMELINE, updatedTimeline);
  return newEntry;
};

// Feedback
export const addFeedback = (feedbackData) => {
  const feedbacks = getAllFeedback();
  const projectIdNum = parseInt(feedbackData.projectId);
  if (isNaN(projectIdNum)) return null;
  const newFeedback = {
    ...feedbackData, projectId: projectIdNum,
    id: feedbacks.length > 0 ? Math.max(...feedbacks.map(f => f.id)) + 1 : 1,
    createdAt: new Date().toISOString()
  };
  const updatedFeedbacks = [...feedbacks, newFeedback];
  saveToStorage(STORAGE_KEYS.FEEDBACK, updatedFeedbacks);
  
  const projects = getAllProjects();
  const projectIndex = projects.findIndex(p => p.projectId === projectIdNum);
  if (projectIndex !== -1) {
    if (!Array.isArray(projects[projectIndex].clientFeedback)) {
      projects[projectIndex].clientFeedback = [];
    }
    projects[projectIndex].clientFeedback.push(newFeedback);
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
  }
  return newFeedback;
};

// Statuses
const getNextStatusId = () => {
    const statuses = getAllStatuses();
    return statuses.length > 0 ? Math.max(...statuses.map(s => s.statusId)) + 1 : 1;
};
export const addStatus = (newStatusData) => {
    const statuses = getAllStatuses();
    
    const stringToArray = (str) => Array.isArray(str) ? str : (str || '').split(',').map(s => s.trim()).filter(Boolean);
    const newStatus = {
        ...newStatusData,
        statusId: getNextStatusId(),
        roles: stringToArray(newStatusData.roles),
        canEdit: stringToArray(newStatusData.canEdit),
    };
    const updatedStatuses = [...statuses, newStatus];
    return saveToStorage(STORAGE_KEYS.STATUSES, updatedStatuses);
};
export const updateStatus = (statusId, updatedData) => {
    const idNum = parseInt(statusId);
    if (isNaN(idNum)) return false;
    const statuses = getAllStatuses();
    const statusIndex = statuses.findIndex(s => s.statusId === idNum);
    if (statusIndex === -1) return false;
    const stringToArray = (str) => Array.isArray(str) ? str : (str || '').split(',').map(s => s.trim()).filter(Boolean);
    statuses[statusIndex] = {
        ...statuses[statusIndex],
        ...updatedData,
        roles: stringToArray(updatedData.roles),
        canEdit: stringToArray(updatedData.canEdit),
    };
    return saveToStorage(STORAGE_KEYS.STATUSES, statuses);
};
export const deleteStatus = (statusId) => {
    const idNum = parseInt(statusId);
    if (isNaN(idNum)) return false;
    
    const statuses = getAllStatuses();
    const updatedStatuses = statuses.filter(s => s.statusId !== idNum);
    return saveToStorage(STORAGE_KEYS.STATUSES, updatedStatuses);
};

// Locations
const getNextLocationId = () => {
    const locations = getAllLocations();
    return locations.length > 0 ? Math.max(...locations.map(l => l.id)) + 1 : 1;
};
export const addLocation = (newLocationData) => {
    const locations = getAllLocations();
    const newLocation = { ...newLocationData, id: getNextLocationId() };
    const updatedLocations = [...locations, newLocation];
    return saveToStorage(STORAGE_KEYS.LOCATIONS, updatedLocations);
};
export const updateLocation = (locationId, updatedData) => {
    const idNum = parseInt(locationId);
    if (isNaN(idNum)) return false;
    const locations = getAllLocations();
    const locationIndex = locations.findIndex(l => l.id === idNum);
    if (locationIndex === -1) return false;
    locations[locationIndex] = { ...locations[locationIndex], ...updatedData };
    return saveToStorage(STORAGE_KEYS.LOCATIONS, locations);
};
export const deleteLocation = (locationId) => {
    const idNum = parseInt(locationId);
    if (isNaN(idNum)) return false;
    const locations = getAllLocations();
    const updatedLocations = locations.filter(l => l.id !== idNum);
    return saveToStorage(STORAGE_KEYS.LOCATIONS, updatedLocations);
};

// FUNÇÕES UTILITÁRIAS

export const getStatusLabel = (statusId) => {
  const statuses = getAllStatuses();
  const status = statuses.find((s) => s.statusId === statusId);
  return status?.label || `Status ${statusId}`;
};

export const getStatusColor = (statusId) => {
  const colors = { 1: "primary", 2: "secondary", 3: "info", 4: "info", 5: "info", 6: "warning", 7: "warning", 8: "info", 9: "danger", 10: "success" };
  return colors[statusId] || "secondary"; 
};

export const getProgressValue = (statusId) => {
  if (statusId <= 1) return 0;
  if (statusId >= 10) return 100;
  return Math.round(((statusId - 1) / 9) * 90) + 10; 
};

export const canUserEditProjectStatus = (user, project) => {
  if (!user || !project) return false;
  const statuses = getAllStatuses();
  const statusInfo = statuses.find(s => s.statusId === project.projectStatus);
  return Array.isArray(statusInfo?.canEdit) && statusInfo.canEdit.includes(user.role);
};

export const getAvailableNextStatuses = (currentStatusId, userRole) => {
  const statuses = getAllStatuses();
  const currentStatusIndex = statuses.findIndex(s => s.statusId === currentStatusId);
  if (currentStatusIndex === -1 || currentStatusId === statuses[statuses.length - 1]?.statusId) return [];

  const nextPossibleStatuses = statuses.slice(currentStatusIndex + 1);
  return nextPossibleStatuses.filter(status => Array.isArray(status.canEdit) && status.canEdit.includes(userRole));
};


// INICIALIZAÇÃO
initializeStorage();

// Exporta constantes iniciais
export {
  INITIAL_PROJECTS,
  INITIAL_INSPECTIONS,
  INITIAL_TIMELINE,
  INITIAL_FEEDBACK,
  INITIAL_TASKS,
  INITIAL_LOCATIONS,
};

// FUNÇÕES DE TASKS
export const getAllTasks = () => loadFromStorage(STORAGE_KEYS.TASKS, INITIAL_TASKS);
export const getProjectTasks = (projectId) => {
  const idNum = parseInt(projectId);
  if (isNaN(idNum)) return [];
  const tasks = getAllTasks();
  return tasks.filter(task => task.projectId === idNum)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};
export const getTaskById = (taskId) => {
  const idNum = parseInt(taskId);
  if (isNaN(idNum)) return null;
  const tasks = getAllTasks();
  return tasks.find(task => task.taskId === idNum);
};
export const getTaskStatusLabel = (statusId) => {
  const status = MOCKED_TASKS_STATUSES.find(s => s.statusId === statusId);
  return status?.label || "Desconhecido";
};
export const getTaskStatusColor = (statusId) => {
  const colors = { 1: "secondary", 2: "warning", 3: "success" };
  return colors[statusId] || "secondary";
};
export const createTask = (taskData) => {
  const tasks = getAllTasks();
  const projectIdNum = parseInt(taskData.projectId);
  if (isNaN(projectIdNum)) return null;
  if (!taskData.taskResponsible || !taskData.taskResponsible.id || !taskData.taskResponsible.name) return null; 
  const newTask = {
    ...taskData, projectId: projectIdNum,
    taskId: tasks.length > 0 ? Math.max(...tasks.map(t => t.taskId)) + 1 : 1,
    taskStatus: taskData.taskStatus || 1, createdAt: new Date().toISOString(), completedAt: null
  };
  const updatedTasks = [...tasks, newTask];
  saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
  return newTask;
};
export const updateTask = (taskId, updates) => {
  const idNum = parseInt(taskId);
  if (isNaN(idNum)) return null;
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(t => t.taskId === idNum);
  if (taskIndex === -1) return null;
  if (updates.taskResponsible && (typeof updates.taskResponsible !== 'object' || !updates.taskResponsible.id)) {
      delete updates.taskResponsible; 
  }
  tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
  if (updates.taskStatus) {
    tasks[taskIndex].completedAt = (updates.taskStatus === 3) ? new Date().toISOString() : null;
  }
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
  return tasks[taskIndex];
};
export const deleteTask = (taskId) => {
  const idNum = parseInt(taskId);
  if (isNaN(idNum)) return false;
  const tasks = getAllTasks();
  const updatedTasks = tasks.filter(t => t.taskId !== idNum);
  return saveToStorage(STORAGE_KEYS.TASKS, updatedTasks);
};
export const completeTask = (taskId) => {
  const idNum = parseInt(taskId);
  if (isNaN(idNum)) return null;
  const tasks = getAllTasks();
  const taskIndex = tasks.findIndex(t => t.taskId === idNum);
  if (taskIndex === -1) return null;
  tasks[taskIndex].taskStatus = 3; 
  tasks[taskIndex].completedAt = new Date().toISOString();
  saveToStorage(STORAGE_KEYS.TASKS, tasks);
  return tasks[taskIndex];
};
// Exporta constante inicial de tasks
export { INITIAL_TASKS as MOCKED_TASKS };