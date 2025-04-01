import React, { useState, useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, ListGroup, Badge } from 'react-bootstrap';

function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditConfirm, setShowEditConfirm] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [newTask, setNewTask] = useState("");
  const [editText, setEditText] = useState("");
  const [originalText, setOriginalText] = useState("");

  // Load tasks from Local Storage
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(savedTasks);
  }, []);

  // Save tasks to Local Storage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const startEditing = (index) => {
    setTaskToEdit(index);
    setEditText(tasks[index]);
    setOriginalText(tasks[index]);
  };

  const requestEditSave = (index) => {
    if (editText.trim() !== tasks[index]) {
      setTaskToEdit(index);
      setShowEditConfirm(true);
    }
  };

  const confirmEdit = () => {
    const updatedTasks = [...tasks];
    updatedTasks[taskToEdit] = editText.trim();
    setTasks(updatedTasks);
    setShowEditConfirm(false);
    setTaskToEdit(null);
  };

  const cancelEdit = () => {
    setTaskToEdit(null);
  };

  const requestDelete = (index) => {
    setTaskToDelete(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const updatedTasks = tasks.filter((_, i) => i !== taskToDelete);
    setTasks(updatedTasks);
    setShowDeleteConfirm(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") addTask();
  };

  const handleEditKeyPress = (e, index) => {
    if (e.key === "Enter") {
      requestEditSave(index);
    }
  };

  return (
    <div className="container mt-5 todo-app">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header bg-primary text-white">
              <h2 className="text-center mb-0">My To-Do List</h2>
            </div>
            
            <div className="card-body">
              <Form.Group className="mb-3">
                <div className="input-group">
                  <Form.Control
                    type="text"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="What needs to be done?"
                  />
                  <Button 
                    variant="success" 
                    onClick={addTask}
                  >
                    Add Task
                  </Button>
                </div>
              </Form.Group>

              {tasks.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-muted empty-message">Motivate yourself by adding the task you need to complete !!</p>
                </div>
              ) : (
                <ListGroup className="task-list-container">
                  {tasks.map((task, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                      {taskToEdit === index ? (
                        <div className="d-flex w-100">
                          <Form.Control
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            onKeyDown={(e) => handleEditKeyPress(e, index)}
                            autoFocus
                            className="me-2 edit-input"
                          />
                          <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() => requestEditSave(index)}
                            className="me-2"
                          >
                            Save
                          </Button>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={cancelEdit}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <>
                          <span>{task}</span>
                          <div className="task-actions">
                            <Button 
                              variant="warning" 
                              size="sm" 
                              onClick={() => startEditing(index)}
                              className="me-2"
                            >
                              Edit
                            </Button>
                            <Button 
                              variant="danger" 
                              size="sm" 
                              onClick={() => requestDelete(index)}
                            >
                              Delete
                            </Button>
                          </div>
                        </>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
            
            <div className="card-footer text-muted">
              <Badge bg="info" pill>
                {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this task?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Confirmation Modal */}
      <Modal show={showEditConfirm} onHide={() => setShowEditConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Edit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to make these changes?</p>
          <div className="mb-3">
            <p className="mb-1"><strong>Original:</strong></p>
            <p className="text-muted">{originalText}</p>
          </div>
          <div>
            <p className="mb-1"><strong>New:</strong></p>
            <p>{editText}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditConfirm(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={confirmEdit}>
            Confirm Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ToDoList;