import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
} from '@mui/material';
import { createPatient, getPatient, updatePatient } from '../services/api';

interface PatientFormData {
  name: string;
  date_of_birth: string;
  gender: string;
}

const PatientForm = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    date_of_birth: '',
    gender: '',
  });

  useEffect(() => {
    if (patientId) {
      const fetchPatient = async () => {
        try {
          const patient = await getPatient(Number(patientId));
          setFormData({
            name: patient.name,
            date_of_birth: patient.date_of_birth,
            gender: patient.gender,
          });
        } catch (error) {
          console.error('Error fetching patient:', error);
        }
      };
      fetchPatient();
    }
  }, [patientId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (patientId) {
        await updatePatient(Number(patientId), formData);
      } else {
        await createPatient(formData);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving patient:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        {patientId ? 'Edit Patient' : 'New Patient'}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Date of Birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            select
            label="Gender"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            required
            sx={{ mb: 3 }}
          >
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </TextField>
          <Button type="submit" variant="contained" color="primary">
            {patientId ? 'Update Patient' : 'Create Patient'}
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default PatientForm; 