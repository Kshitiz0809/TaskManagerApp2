import axios from 'axios';

// For Android Emulator, use 10.0.2.2 instead of localhost
// For Physical Device, use your computer's IP (192.168.x.x)
const API_BASE_URL = 'http://10.0.2.2:3000/api';

// Alternative for physical device (uncomment and use your IP):
// const API_BASE_URL = 'http://192.168.9.186:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const todoAPI = {
  // Get all todos
  getAllTodos: async () => {
    try {
      const response = await api.get('/todos');
      return response.data;
    } catch (error) {
      console.error('Error fetching todos:', error);
      throw error;
    }
  },

  // Get single todo
  getTodo: async (id: number) => {
    try {
      const response = await api.get(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching todo:', error);
      throw error;
    }
  },

  // Create new todo
  createTodo: async (text: string) => {
    try {
      const response = await api.post('/todos', { text, completed: false });
      return response.data;
    } catch (error) {
      console.error('Error creating todo:', error);
      throw error;
    }
  },

  // Update todo
  updateTodo: async (id: number, data: { text?: string; completed?: boolean }) => {
    try {
      const response = await api.put(`/todos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  },

  // Delete todo
  deleteTodo: async (id: number) => {
    try {
      const response = await api.delete(`/todos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting todo:', error);
      throw error;
    }
  },

  // Delete all todos
  deleteAllTodos: async () => {
    try {
      const response = await api.delete('/todos');
      return response.data;
    } catch (error) {
      console.error('Error deleting all todos:', error);
      throw error;
    }
  },

  // Get statistics
  getStats: async () => {
    try {
      const response = await api.get('/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },
};

export default api;
