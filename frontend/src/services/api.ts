import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

// Patient API calls
export const getPatients = async () => {
  const response = await axios.get(`${API_BASE_URL}/patients`);
  return response.data;
};

export const getPatient = async (id: number) => {
  const response = await axios.get(`${API_BASE_URL}/patients/${id}`);
  return response.data;
};

export const createPatient = async (patientData: {
  name: string;
  date_of_birth: string;
  gender: string;
}) => {
  const response = await axios.post(`${API_BASE_URL}/patients`, patientData);
  return response.data;
};

export const updatePatient = async (
  id: number,
  patientData: {
    name: string;
    date_of_birth: string;
    gender: string;
  }
) => {
  const response = await axios.put(`${API_BASE_URL}/patients/${id}`, patientData);
  return response.data;
};

export const deletePatient = async (id: number) => {
  await axios.delete(`${API_BASE_URL}/patients/${id}`);
};

// Notes API calls
export const getNotes = async () => {
  const response = await axios.get(`${API_BASE_URL}/notes`);
  return response.data;
};

export const getPatientNotes = async (patientId: number) => {
  const response = await axios.get(`${API_BASE_URL}/patients/${patientId}/notes`);
  return response.data;
};

export const createNote = async (patientId: number, content: string) => {
  const response = await axios.post(`${API_BASE_URL}/patients/${patientId}/notes`, {
    content,
  });
  return response.data;
};

export const updateNote = async (noteId: number, content: string) => {
  const response = await axios.put(`${API_BASE_URL}/notes/${noteId}`, {
    content,
  });
  return response.data;
};

export const deleteNote = async (noteId: number) => {
  await axios.delete(`${API_BASE_URL}/notes/${noteId}`);
}; 