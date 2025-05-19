import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getPatient, getPatientNotes, createNote, updateNote, deleteNote } from '../services/api';

interface Note {
  id: number;
  content: string;
  created_at: string;
  patient_id: number;
}

interface Patient {
  id: number;
  name: string;
  date_of_birth: string;
  gender: string;
}

const PatientNotes = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (patientId) {
      fetchPatient();
      fetchNotes();
    }
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      const data = await getPatient(Number(patientId));
      setPatient(data);
    } catch (error) {
      console.error('Error fetching patient:', error);
    }
  };

  const fetchNotes = async () => {
    try {
      const data = await getPatientNotes(Number(patientId));
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  const handleCreateNote = async () => {
    if (!newNote.trim() || !patientId) return;
    try {
      await createNote(Number(patientId), newNote);
      setNewNote('');
      fetchNotes();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  const handleEditClick = (note: Note) => {
    setEditingNote(note);
    setEditContent(note.content);
  };

  const handleEditSave = async () => {
    if (!editingNote) return;
    try {
      await updateNote(editingNote.id, editContent);
      await fetchNotes();
      setEditingNote(null);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const handleDeleteClick = (noteId: number) => {
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    try {
      await deleteNote(noteToDelete);
      await fetchNotes();
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!patient) return null;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1">
            {patient.name}
          </Typography>
          <Typography color="text.secondary">
            DOB: {new Date(patient.date_of_birth).toLocaleDateString()} | Gender: {patient.gender}
          </Typography>
        </Box>
        <Button
          variant="outlined"
          onClick={() => navigate(`/patients/${patientId}/edit`)}
        >
          Edit Patient
        </Button>
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="New Note"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateNote}
          disabled={!newNote.trim()}
        >
          Add Note
        </Button>
      </Box>

      {notes.map((note) => (
        <Card key={note.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Created: {formatDate(note.created_at)}
              </Typography>
              <Box>
                <IconButton onClick={() => handleEditClick(note)} size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteClick(note.id)} size="small">
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {note.content}
            </Typography>
          </CardContent>
        </Card>
      ))}

      {/* Edit Dialog */}
      <Dialog open={!!editingNote} onClose={() => setEditingNote(null)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              style={{
                width: '100%',
                minHeight: '200px',
                padding: '8px',
                fontSize: '16px',
                fontFamily: 'inherit',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingNote(null)}>Cancel</Button>
          <Button onClick={handleEditSave} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Note</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this note?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PatientNotes; 