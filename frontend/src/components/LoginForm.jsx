import { Box, Typography, TextField, Button, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

const fieldSx = {
  '& .MuiInputBase-input': { fontFamily: UI, fontSize: 15.5, py: 1.5 },
  '& .MuiInputLabel-root': { fontFamily: UI, fontSize: 15 },
  '& .MuiFormHelperText-root': { fontFamily: UI },
};

function LoginForm(){
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");
  const [ submitting, setSubmitting ] = useState(false); 

  const { login } = useAuth();
  const navigate = useNavigate();

  async function loginSubmitHandler(e){
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      await login(username,password);
      navigate("/feed");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={loginSubmitHandler} noValidate sx={{ width: '100%' }}>
      <Typography sx={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, letterSpacing: '-0.02em' }}>
        Welcome back
      </Typography>
      <Typography sx={{ mt: 1, fontFamily: SERIF, fontSize: 17, lineHeight: 1.7, color: 'text.secondary' }}>
        Pick up the conversations you left open.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 4 }}>
        <TextField
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          fullWidth
          disabled= {submitting}
          sx={fieldSx}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          fullWidth
          disabled = {submitting}
          sx={fieldSx}
        />
      </Box>
      {errorMessage && <Typography color='error'>{errorMessage}</Typography>}

      <Button
        type="submit"
        variant="contained"
        disableElevation
        fullWidth
        disabled = {submitting}
        sx={{ mt: 4, py: 1.4, fontFamily: UI, fontSize: 16, fontWeight: 500, textTransform: 'none' }}
      >{submitting ? 'Signing in...' : 'Log in'}
      </Button>

      <Typography sx={{ mt: 3, fontFamily: UI, fontSize: 14.5, color: 'text.secondary' }}>
        New here?{' '}
        <Link
          component="button"
          type="button"
          underline="always"
          onClick={() => navigate("/signup")}
          sx={{ fontFamily: UI, fontSize: 14.5, color: 'primary.main', textDecorationColor: 'currentColor' }}
        >
          Create an account
        </Link>
      </Typography>
    </Box>
  );
}


export default LoginForm;