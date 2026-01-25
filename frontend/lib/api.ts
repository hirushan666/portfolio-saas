// lib/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API methods
export const userApi = {
  getById: (id: string) => api.get(`/users/${id}`),
  getByGithubUsername: (username: string) => api.get(`/users/github/${username}`),
  create: (data: any) => api.post('/users', data),
  update: (id: string, data: any) => api.put(`/users/${id}`, data),
  getStats: (id: string) => api.get(`/users/${id}/stats`),
};

export const portfolioApi = {
  create: (data: any) => api.post('/portfolios', data),
  getAll: (userId?: string) => api.get('/portfolios', { params: { userId } }),
  getById: (id: string) => api.get(`/portfolios/${id}`),
  getByUsernameAndNumber: (username: string, number: number) => 
    api.get(`/portfolios/user/${username}/${number}`),
  update: (id: string, data: any) => api.put(`/portfolios/${id}`, data),
  publish: (id: string) => api.post(`/portfolios/${id}/publish`),
  unpublish: (id: string) => api.post(`/portfolios/${id}/unpublish`),
  delete: (id: string) => api.delete(`/portfolios/${id}`),
  reloadGithub: (id: string, token: string) => 
    api.post(`/portfolios/${id}/reload-github`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    }),
};

export const projectApi = {
  create: (data: any) => api.post('/projects', data),
  getByPortfolio: (portfolioId: string) => 
    api.get(`/portfolios/${portfolioId}/projects`),
  getById: (id: string) => api.get(`/projects/${id}`),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
};

export const githubApi = {
  getRepos: (token: string) => 
    api.get('/github/repos', {
      headers: { Authorization: `Bearer ${token}` }
    }),
};