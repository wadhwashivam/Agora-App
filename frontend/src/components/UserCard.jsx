import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import FollowButton from "./FollowButton";
import {useNavigate} from "react-router-dom";

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

function UserCard({user}){
    const navigate = useNavigate();

    if(!user) return null;

    return(
        <Box 
            sx={{
                py: 3,
                borderBottom: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                gap: 2,
                alignItems: 'flex-start',
            }}
        >
            <ButtonBase
                onClick={() => navigate(`/users/${user.id}`)}
                disableRipple
                sx={{ borderRadius: 0, alignSelf: 'flex-start'}}
            >
                <Avatar
                    src={user.avatar || undefined}
                    alt={user.name || user.username}
                    sx={{ width: 44, height: 44, fontFamily: UI, fontSize: 17 }}
                >
                    {(user.name || user.username || '?').charAt(0).toUpperCase()}
                </Avatar>
            </ButtonBase>

            <Box sx={{ flexGrow: 1, minWidth: 0}}>
                <ButtonBase 
                    onClick={() => navigate(`/users/${user.id}`)}
                    disableRipple
                    sx={{ display: 'block', textAlign: 'left', borderRadius: 0 }}
                >
                    <Typography 
                        sx={{
                            fontFamily: UI,
                            fontSize: 16,
                            fontWeight: 600,
                            lineHeight: 1.35,
                            '&:hover': {color: 'primary.main'},
                        }}
                    >
                        {user.name || user.username}
                    </Typography>
                    <Typography sx={{ fontFamily: UI, fontSize: 13.5, color: 'text.secondary'}}>
                        @{user.username}
                    </Typography>
                </ButtonBase>
                {user.bio && (
                    <Typography
                        sx={{
                            mt: 1,
                            fontFamily: SERIF,
                            fontSize: 16,
                            lineHeight: 1.65,
                            color: 'text.primary',
                            maxWidth: '58ch',
                            textWrap: 'pretty',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                        }}
                    >
                        {user.bio}
                    </Typography>
                )}
            </Box>

            <FollowButton userId = {user.id} initialIsFollowing = {user.isFollowing}/>
        </Box>
    )
}

export default UserCard;