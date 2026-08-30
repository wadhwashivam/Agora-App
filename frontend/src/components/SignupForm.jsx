import { Box, Typography, TextField, Button, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signup } from '../api/auth';

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

const fieldSx = {
  '& .MuiInputBase-input': { fontFamily: UI, fontSize: 15.5, py: 1.5 },
  '& .MuiInputLabel-root': { fontFamily: UI, fontSize: 15 },
  '& .MuiFormHelperText-root': { fontFamily: UI },
};


function SignupForm(){
  const [ username, setUsername ] = useState("");
  const [ name, setName ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ confirmPassword, setConfirmPassword ] = useState("");

  const [ errorMessage, setErrorMessage ] = useState("");
  const [ submitting, setSubmitting ] = useState(false);

  const navigate = useNavigate();

  async function signupSubmitHandler(e){
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      await signup(username, name, password, confirmPassword);
      navigate("/feed");
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Box component="form" onSubmit={signupSubmitHandler} noValidate sx={{ width: '100%' }}>
      <Typography sx={{ fontFamily: SERIF, fontSize: 34, fontWeight: 600, letterSpacing: '-0.02em' }}>
        Join the conversation
      </Typography>
      <Typography sx={{ mt: 1, fontFamily: SERIF, fontSize: 17, lineHeight: 1.7, color: 'text.secondary' }}>
        Words only. Up to five hundred of them at a time.
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 4 }}>
        <TextField
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          helperText="Your handle across Agora — letters, numbers, underscores."
          fullWidth
          disabled={submitting}
          sx={fieldSx}
        />
        <TextField
          label="Display name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
          fullWidth
          disabled={submitting}
          sx={fieldSx}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          fullWidth
          disabled={submitting}
          sx={fieldSx}
        />
        <TextField
          label="Confirm password"
          name="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
          fullWidth
          disabled={submitting}
          sx={fieldSx}
        />
      </Box>
      {errorMessage && <Typography color='error'>{errorMessage}</Typography>}
      <Button
        type="submit"
        variant="contained"
        disableElevation
        fullWidth
        disabled={submitting}
        sx={{ mt: 3, py: 1.4, fontFamily: UI, fontSize: 16, fontWeight: 500, textTransform: 'none' }}
      >
        {submitting ? 'Creating account…' : 'Create account'}
      </Button>

      <Typography sx={{ mt: 3, fontFamily: UI, fontSize: 14.5, color: 'text.secondary' }}>
        Already have an account?{' '}
        <Link
          component="button"
          type="button"
          onClick={() => navigate("/login")}
          underline="always"
          sx={{ fontFamily: UI, fontSize: 14.5, color: 'primary.main', textDecorationColor: 'currentColor' }}
        >
          Log in
        </Link>
      </Typography>
    </Box>
  );
}


export default SignupForm;