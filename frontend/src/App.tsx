import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Container } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import Navbar from './components/Navbar.tsx';
import PatientList from './components/PatientList.tsx';
import PatientNotes from './components/PatientNotes.tsx';
import PatientForm from './components/PatientForm.tsx';
import AllNotes from './components/AllNotes.tsx';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Routes>
            <Route path="/" element={<PatientList />} />
            <Route path="/patients/new" element={<PatientForm />} />
            <Route path="/patients/:patientId/edit" element={<PatientForm />} />
            <Route path="/patients/:patientId" element={<PatientNotes />} />
            <Route path="/notes" element={<AllNotes />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
