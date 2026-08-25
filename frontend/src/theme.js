import { createTheme } from "@mui/material/styles";

export const tokens = {
    ink: '#0D0D0D',
    paper: '#FBFBF9',
    accent: '#C84B31'
};

function getTheme(mode){
    return createTheme({
        palette: {
            mode,
            background: { default: tokens.paper, paper: tokens.paper},
            primary: { main: tokens.accent},
            text: {primary: tokens.ink}
        },
        typography: {
            fontFamily: '"Lora", serif',
            button: {fontFamily: '"Work Sans", sans-serif', textTransform: 'none'}
        }
    });
}

export { getTheme};