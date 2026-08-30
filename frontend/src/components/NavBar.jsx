import { AppBar, Toolbar, Box, Typography, Button, Avatar, Divider } from '@mui/material';
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

function NavBar(){
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const LINKS = [
        {key: 'feed', label: 'Feed', path: '/feed'},
        {key: 'explore', label: 'Explore', path: '/users'},
        {key: 'profile', label: 'Profile', path: `/users/${user?.id}` },
    ];

    function handleLogout(){
        logout();
        navigate('/login');
    }

    return (
        <AppBar position="sticky" elevation={0} color="transparent" sx={{bgcolor: 'background.default', backdropFilter: 'saturate(180%) blur(6px)' }}>
            <Toolbar disableGutters sx={{ width: '100%', maxWidth: 1080, mx: 'auto', px: { xs: 2, sm: 3 }, minHeight: {xs: 60, sm: 68}, gap: {xs: 1.5, sm:3},}}>
                <Box component= "button" onClick={()=> navigate('feed')} sx={{ all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'baseline', gap: 0.75, mr: { sm: 1}, }}>
                    <Typography sx={{ fontFamily: SERIF, fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em' }}>Agora</Typography>
                    <Box sx={{ width: 5, height: 5, bgcolor: 'primary.main', mb: '4px' }}/>
                </Box>

                <Box sx={{display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1.5 }, flexGrow: 1 }}>
                    {LINKS.map((link) => {
                        const isActive = location.pathname.startsWith(link.path);
                        return (
                            <Button key={link.key} onClick={() => navigate(link.path)} disableRipple sx={{ fontFamily: UI, fontSize: 15, fontWeight: isActive? 600: 400, textTransform: 'none', color: isActive? 'primary.main': 'text.primary', px: 1, minWidth: 0, borderRadius: 0, bgcolor: 'transparent', '&:hover': { bgcolor: 'transparent', color: 'primary.main'},}}>
                                {link.label}
                            </Button>
                        );
                    })}
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    {user && (
                        <Box component="button" onClick={() => navigate(`/users/${user.id}`)} sx={{ all: 'unset', cursor: 'pointer', display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1,}}>
                            <Avatar src={user.avatar || undefined} alt={user.name || user.username} sx={{ width: 30, height: 30, fontFamily: UI, fontSize: 13 }}>
                                {(user.name || user.username || '?').charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography sx={{ fontFamily: UI, fontSize: 14, color: 'text.secondary' }}>
                                @{user.username}
                            </Typography>
                        </Box>
                    )}
                    <Button onClick = {handleLogout} startIcon = {<LogoutOutlinedIcon sx={{ fontSize: 18 }} />} sx={{ fontFamily: UI, fontSize: 14, textTransform: 'none', color: 'text.secondary', px: 1, '&:hover': { bgcolor: 'transparent', color: 'primary.main' },}}>
                        Log out
                    </Button>
                </Box>
            </Toolbar>
            <Divider />
        </AppBar>
    )
}

export default NavBar;