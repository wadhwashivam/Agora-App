import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import './index.css'
import App from './App.jsx'
import { ThemeProvider, CssBaseline } from '@mui/material';
import { getTheme } from "./theme.js";
import '@fontsource/lora/400.css';
import '@fontsource/work-sans'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={getTheme('light')}>
      <CssBaseline>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </CssBaseline>
    </ThemeProvider>
  </StrictMode>,
)
