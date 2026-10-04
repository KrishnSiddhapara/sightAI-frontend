import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_BASE_URL = `${API_URL.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 120 seconds (2 minutes)
});

export const getHealth = async () => {
  const response = await api.get('/health', { timeout: 15000 });
  return response.data;
};

export const checkSafety = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/safety-check', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return response.data;
};

export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const response = await api.post('/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000, // Explicit 2-minute timeout for VLM image analysis
  });
  return response.data;
};

export const editImage = async ({ file, imageBase64, instruction, visionContextJson }) => {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  if (imageBase64) {
    formData.append('image_base64', imageBase64);
  }
  formData.append('instruction', instruction);
  if (visionContextJson) {
    formData.append('vision_context_json', JSON.stringify(visionContextJson));
  }
  
  const response = await api.post('/edit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  });
  return response.data;
};

export const askQuestion = async ({ file, imageBase64, question }) => {
  const formData = new FormData();
  if (file) {
    formData.append('file', file);
  }
  if (imageBase64) {
    formData.append('image_base64', imageBase64);
  }
  formData.append('question', question);

  const response = await api.post('/ask', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 120000,
  });
  return response.data;
};

export const researchWithAgent = async ({ question, imageContext, conversationHistory, userRegion }) => {
  const response = await api.post('/agent/research', {
    question,
    image_context: imageContext || null,
    conversation_history: conversationHistory || [],
    user_region: userRegion || null
  }, {
    timeout: 120000, // Explicit 2-minute timeout for agent web research
  });
  return response.data;
};

export const exportImage = async ({ imageBase64, formatType }) => {
  const formData = new FormData();
  formData.append('image_base64', imageBase64);
  formData.append('format_type', formatType || 'JPEG');

  const response = await api.post('/export', formData, {
    responseType: 'blob',
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  });
  return response.data;
};

export default api;
