import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Patient Notes
        </Typography>
        <Button color="inherit" component={RouterLink} to="/">
          Patients
        </Button>
        <Button color="inherit" component={RouterLink} to="/notes">
          All Notes
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 