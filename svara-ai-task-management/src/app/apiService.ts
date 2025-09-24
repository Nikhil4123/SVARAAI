const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  }

  // Auth APIs
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  async register(name: string, email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    return response.json();
  }

  // Project APIs
  async getProjects() {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createProject(name: string, description: string) {
    const response = await fetch(`${API_BASE_URL}/projects`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ name, description }),
    });
    return response.json();
  }

  async deleteProject(id: string) {
    const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Task APIs
  async getTasksByProject(projectId: string) {
    const response = await fetch(`${API_BASE_URL}/tasks/project/${projectId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async createTask(task: { title: string; description?: string; status?: string; priority?: string; deadline: string; projectId: string; assignee?: string; }) {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(task),
    });
    return response.json();
  }

  async updateTask(id: string, updates: { title?: string; description?: string; status?: string; priority?: string; deadline?: string; projectId?: string; assignee?: string; }) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    return response.json();
  }

  async deleteTask(id: string) {
    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  // Task Assignment APIs
  async assignTask(taskId: string, assigneeId: string) {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/assign`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ assignee: assigneeId }),
    });
    return response.json();
  }

  async getTasksByAssignee(assigneeId: string) {
    const response = await fetch(`${API_BASE_URL}/tasks/assignee/${assigneeId}`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }

  async getUsers() {
    const response = await fetch(`${API_BASE_URL}/users`, {
      headers: this.getAuthHeaders(),
    });
    return response.json();
  }
}

export default new ApiService();