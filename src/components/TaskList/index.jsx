// TaskList/index.jsx
import React, { useState } from "react";
import { Card, Table, Badge, Button, ButtonGroup, Alert } from "react-bootstrap";
import { Plus, Edit2, Trash2, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { getTaskStatusLabel, getTaskStatusColor } from "../../data/mockProjects";

function TaskList({ tasks, onEdit, onDelete, onComplete, canEdit, onNewTask }) {
  const [filter, setFilter] = useState("all"); // all, pending, inProgress, completed

  const getFilteredTasks = () => {
    if (filter === "all") return tasks;
    if (filter === "pending") return tasks.filter(t => t.taskStatus === 1);
    if (filter === "inProgress") return tasks.filter(t => t.taskStatus === 2);
    if (filter === "completed") return tasks.filter(t => t.taskStatus === 3);
    return tasks;
  };

  const isOverdue = (task) => {
    if (task.taskStatus === 3) return false; // Já concluída
    const today = new Date();
    const deadline = new Date(task.taskDeadline);
    return deadline < today;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("pt-BR");
  };

  const filteredTasks = getFilteredTasks();

  return (
    <Card className="border-0 shadow-sm">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center flex-wrap">
        <Card.Title className="mb-0">Tarefas do Projeto</Card.Title>
        {canEdit && (
          <Button variant="primary" size="sm" onClick={onNewTask}>
            <Plus size={16} className="me-2" />
            Nova Tarefa
          </Button>
        )}
      </Card.Header>
      <Card.Body>
        {/* Filtros */}
        <div className="mb-3">
          <ButtonGroup size="sm">
            <Button
              variant={filter === "all" ? "primary" : "outline-primary"}
              onClick={() => setFilter("all")}
            >
              Todas ({tasks.length})
            </Button>
            <Button
              variant={filter === "pending" ? "secondary" : "outline-secondary"}
              onClick={() => setFilter("pending")}
            >
              Pendentes ({tasks.filter(t => t.taskStatus === 1).length})
            </Button>
            <Button
              variant={filter === "inProgress" ? "warning" : "outline-warning"}
              onClick={() => setFilter("inProgress")}
            >
              Em Andamento ({tasks.filter(t => t.taskStatus === 2).length})
            </Button>
            <Button
              variant={filter === "completed" ? "success" : "outline-success"}
              onClick={() => setFilter("completed")}
            >
              Concluídas ({tasks.filter(t => t.taskStatus === 3).length})
            </Button>
          </ButtonGroup>
        </div>

        {/* Lista de Tarefas */}
        {filteredTasks.length === 0 ? (
          <Alert variant="info" className="mb-0">
            Nenhuma tarefa encontrada neste filtro.
          </Alert>
        ) : (
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead>
                <tr>
                  <th>Tarefa</th>
                  <th>Responsável</th>
                  <th>Prazo</th>
                  <th>Status</th>
                  {canEdit && <th className="text-end">Ações</th>}
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task.taskId}>
                    <td>
                      <div className="d-flex align-items-start">
                        {isOverdue(task) && (
                          <AlertCircle size={16} className="text-danger me-2 mt-1" />
                        )}
                        <div>
                          <div className="fw-bold">{task.taskName}</div>
                          {task.taskDescription && (
                            <small className="text-muted">{task.taskDescription}</small>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>{task.taskResponsible.name}</div>
                    </td>
                    <td>
                      <div className={isOverdue(task) ? "text-danger fw-bold" : ""}>
                        {formatDate(task.taskDeadline)}
                      </div>
                      {task.taskStartDate && (
                        <small className="text-muted">
                          Início: {formatDate(task.taskStartDate)}
                        </small>
                      )}
                    </td>
                    <td>
                      <Badge bg={getTaskStatusColor(task.taskStatus)}>
                        {getTaskStatusLabel(task.taskStatus)}
                      </Badge>
                      {task.completedAt && (
                        <div>
                          <small className="text-muted">
                            Concluída em {formatDate(task.completedAt)}
                          </small>
                        </div>
                      )}
                    </td>
                    {canEdit && (
                      <td className="text-end">
                        <div className="d-flex gap-1 justify-content-end">
                          {task.taskStatus !== 3 && (
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => onComplete(task.taskId)}
                              title="Marcar como concluída"
                            >
                              <CheckCircle size={14} />
                            </Button>
                          )}
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => onEdit(task)}
                            title="Editar tarefa"
                          >
                            <Edit2 size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => onDelete(task.taskId)}
                            title="Excluir tarefa"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        {/* Estatísticas */}
        <div className="mt-3 pt-3 border-top">
          <div className="row text-center">
            <div className="col-md-3">
              <div className="text-muted small">Total de Tarefas</div>
              <div className="h5 mb-0">{tasks.length}</div>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">Pendentes</div>
              <div className="h5 mb-0 text-secondary">
                {tasks.filter(t => t.taskStatus === 1).length}
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">Em Andamento</div>
              <div className="h5 mb-0 text-warning">
                {tasks.filter(t => t.taskStatus === 2).length}
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-muted small">Concluídas</div>
              <div className="h5 mb-0 text-success">
                {tasks.filter(t => t.taskStatus === 3).length}
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default TaskList;

