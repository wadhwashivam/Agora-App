import { Box, Typography, TextField, Button, Alert, Avatar, Divider } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

const fieldSx = {
    "& .MuiInputBase-input": { fontFamily: UI, fontSize: 15.5, py: 1.5 },
    "& .MuiInputLabel-root": { fontFamily: UI, fontSize: 15 },
    "& .MuiFormHelperText-root": { fontFamily: UI },
};

const BIO_MAX = 100;

function EditProfileForm() {
    const { user, updateProfile } = useAuth();

    const [name, setName] = useState(user?.name || "");
    const [bio, setBio] = useState(user?.bio || "");
    const [avatar, setAvatar] = useState(user?.avatar || "");


    const [errorMessage, setErrorMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);


    const navigate = useNavigate();


    const bioLen = bio.length;

    async function editProfileSubmitHandler(e) {
        e.preventDefault();
        setErrorMessage("");
        setSubmitting(true);

        try {
            await updateProfile({ name, bio, avatar });
            navigate(`/users/${user.id}`);
        } catch (error) {
            setErrorMessage(error.message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Box component= "form" onSubmit={editProfileSubmitHandler}>
            {errorMessage && (
                <Alert severity="error" sx={{ mb: 3, fontFamily: UI, borderRadius: 0}}>
                    {errorMessage}
                </Alert>
            )}

            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 4 }}>
                <Avatar
                    src={avatar || undefined}
                    alt={name}
                    sx={{ width: 64, height: 64, fontFamily: UI, fontSize: 24 }}
                >
                    {(name || '?').charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                    <Typography sx={{ fontFamily: UI, fontSize: 14, fontWeight: 600 }}>Avatar preview</Typography>
                    <Typography sx={{ fontFamily: UI, fontSize: 13.5, color: 'text.secondary' }}>
                        Paste an image URL below
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ mb: 4 }} />

            <Box sx={{ display: "flex", flexDirection: "column", gap: 3}} >
                <TextField 
                    label = "Display Name"
                    name= "name"
                    value= {name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    disabled= {submitting}
                    sx={fieldSx}
                />
                <TextField
                    label= "Bio"
                    name= "bio"
                    value={bio}
                    onChange={(e)=>setBio(e.target.value)}
                    multiline
                    minRows={3}
                    fullWidth
                    disabled= {submitting}
                    error= {bioLen > BIO_MAX}
                    helperText = {`${bioLen} / ${BIO_MAX} characters`}
                    sx={{
                        ...fieldSx, 
                        '& .MuiInputBase-input' : {fontFamily: SERIF, fontSize: 16.5, lineHeight: 1.7},
                    }}
                />

                <TextField
                    label= "Avatar URL"
                    name="avatar"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    fullWidth
                    disabled= {submitting}
                    placeholder="https://..."
                    helperText= "The only image anywhere in Agora."
                    sx={fieldSx}
                />
            </Box>

            <Box sx={{display: "flex", gap: 1.5, mt: 4, alignItems: 'center'}}>
                <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled= {submitting || bioLen > BIO_MAX}
                    sx={{ fontFamily: UI, textTransform: 'none', fontWeight: 500, px: 3, py: 1.1, fontSize: 15.5 }}
                >
                    {submitting ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button
                    onClick={() => navigate(`/users/${user.id}`)}
                    sx={{
                        fontFamily: UI,
                        textTransform: 'none',
                        fontSize: 15, 
                        color: 'text.secondary',
                        '&:hover': {bgcolor: 'transparent', color: 'primary.main' },
                    }}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    );
}

export default EditProfileForm;
