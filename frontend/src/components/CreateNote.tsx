import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import axios from 'axios';

const CreateNote = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(`http://localhost:3000/patients/${patientId}/notes`, {
        content,
      });
      navigate(`/patients/${patientId}`);
    } catch (error) {
      console.error('Error creating note:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Create New Note
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={8}
            label="Note Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={!content.trim() || isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Note'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate(`/patients/${patientId}`)}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateNote; 