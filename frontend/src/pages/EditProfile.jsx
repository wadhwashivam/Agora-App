import EditProfileForm from "../components/EditProfileForm";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useAuth } from "../context/AuthContext";

import { useNavigate } from "react-router-dom";

import { Box, Typography, Button } from "@mui/material";

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

function EditProfile(){
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default'}}>
            <Box sx={{ maxWidth: 620, mx: 'auto', px: { xs: 2.5, sm: 3}, pb: 12 }}>
                <Button
                    onClick={() => navigate(`/users/${user.id}`)}
                    startIcon= {<ArrowBackIcon sx={{fontSize: 17 }} />}
                    sx={{
                        mt: 4,
                        ml: -1,
                        fontFamily: UI,
                        fontSize: 14,
                        textTransform: 'none',
                        color: 'text.secondary',
                        '&:hover':{bgcolor: 'transparent', color: 'primary.main'},
                    }}
                >
                    Back to profile
                </Button>

                <Typography sx={{ mt: 2, fontFamily: SERIF, fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em' }}>
                    Edit Profile
                </Typography>
                <Typography sx={{ mt: 0.75, mb: 5, fontFamily: UI, fontSize: 14, color: 'text.secondary' }}>
                    How you appear beside everything you write.
                </Typography>
                <EditProfileForm />
            </Box>
        </Box>
    )
}

export default EditProfile;