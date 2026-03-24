// TaskForm/index.jsx
import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert } from "react-bootstrap";
import { MOCKED_TASKS_STATUSES } from "../../data/mockProjects";

function TaskForm({ show, onHide, onSave, task, projectFieldTeam, projectId }) {
  const [formData, setFormData] = useState({
    taskName: "",
    taskDescription: "",
    taskStartDate: "",
    taskEndDate: "",
    taskDeadline: "",
    taskResponsible: { id: "", name: "" },
    taskStatus: 1
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (show) {
      if (task) {
        // Modo edição
        setFormData({
          taskName: task.taskName || "",
          taskDescription: task.taskDescription || "",
          taskStartDate: task.taskStartDate || "",
          taskEndDate: task.taskEndDate || "",
          taskDeadline: task.taskDeadline || "",
          taskResponsible: task.taskResponsible || { id: "", name: "" },
          taskStatus: task.taskStatus || 1
        });
      } else {
        // Modo criação - resetar formulário
        setFormData({
          taskName: "",
          taskDescription: "",
          taskStartDate: "",
          taskEndDate: "",
          taskDeadline: "",
          taskResponsible: { id: "", name: "" },
          taskStatus: 1
        });
      }
      setError("");
    }
  }, [task, show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResponsibleChange = (e) => {
    const selectedId = parseInt(e.target.value);
    
    if (!selectedId || isNaN(selectedId)) {
      setFormData(prev => ({
        ...prev,
        taskResponsible: { id: "", name: "" }
      }));
      return;
    }
    
    const selectedMember = projectFieldTeam.find(m => m.id === selectedId);
    
    if (selectedMember) {
      setFormData(prev => ({
        ...prev,
        taskResponsible: { id: selectedMember.id, name: selectedMember.name }
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Validações
    if (!formData.taskName.trim()) {
      setError("O nome da tarefa é obrigatório");
      return;
    }

    if (!formData.taskDeadline) {
      setError("O prazo é obrigatório");
      return;
    }

    if (!formData.taskResponsible.id) {
      setError("Selecione um responsável pela tarefa");
      return;
    }

    // Validar datas
    if (formData.taskStartDate && formData.taskEndDate) {
      if (new Date(formData.taskStartDate) > new Date(formData.taskEndDate)) {
        setError("A data de início não pode ser posterior à data de término");
        return;
      }
    }

    // Preparar dados para salvar
    const taskData = {
      ...formData,
      projectId
    };

    onSave(taskData);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{task ? "Editar Tarefa" : "Nova Tarefa"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nome da Tarefa *</Form.Label>
            <Form.Control
              type="text"
              name="taskName"
              value={formData.taskName}
              onChange={handleChange}
              placeholder="Ex: Instalação mecânica"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Descrição</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleChange}
              placeholder="Descreva os detalhes da tarefa (opcional)"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Responsável *</Form.Label>
            <Form.Select
              value={formData.taskResponsible.id}
              onChange={handleResponsibleChange}
              required
            >
              <option value="">Selecione um responsável</option>
              {projectFieldTeam && projectFieldTeam.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.type === 'mechanical_technician' ? 'Técnico Mecânico' : 'Técnico Ajustador'})
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="taskStatus"
              value={formData.taskStatus}
              onChange={handleChange}
            >
              {MOCKED_TASKS_STATUSES.map(status => (
                <option key={status.statusId} value={status.statusId}>
                  {status.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="row">
            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Data de Início</Form.Label>
                <Form.Control
                  type="date"
                  name="taskStartDate"
                  value={formData.taskStartDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Data de Término</Form.Label>
                <Form.Control
                  type="date"
                  name="taskEndDate"
                  value={formData.taskEndDate}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group className="mb-3">
                <Form.Label>Prazo *</Form.Label>
                <Form.Control
                  type="date"
                  name="taskDeadline"
                  value={formData.taskDeadline}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {task ? "Salvar Alterações" : "Criar Tarefa"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default TaskForm;

