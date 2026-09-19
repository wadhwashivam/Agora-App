import { Avatar, Box, ButtonBase, Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

function CommentCard({comment}){
    const navigate = useNavigate();

    if(!comment) return null;
    const author = comment.author || {};

    return (
        <Box
            component="article"
            sx={{ py: 2.75, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', gap: 2}}
        >
            <Avatar
                src={author.avatar || undefined}
                alt={author.name || author.username}
                sx={{width: 32, height: 32, fontFamily: UI, fontSize: 13.5, mt: 0.25}}
            >
                {(author.name || author.username || '?').charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flexGrow: 1, minWidth: 0}}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 0.75 }}>
                    <ButtonBase
                        onClick={() => navigate(`/users/${author.id}`)}
                        disableRipple
                        sx={{
                            fontFamily: UI,
                            fontSize: 14.5,
                            fontWeight: 600, 
                            borderRadius: 0,
                            '&:hover': { color: 'primary.main'},
                        }}
                    >
                        {author.name || author.username}
                    </ButtonBase>
                    <Typography sx={{ fontFamily: UI, fontSize: 13, color: 'text.secondary'}}>
                        @{author.username}
                    </Typography>
                    <Box sx={{ flexGrow: 1}} />
                </Box>
                <Typography
                    sx={{
                        fontFamily: SERIF,
                        fontSize: 16.5,
                        lineHeight: 1.7,
                        whiteSpace: 'pre-wrap',
                        textWrap: 'pretty',
                        maxWidth: '66ch',
                    }}
                >
                    {comment.content}
                </Typography>
            </Box>
        </Box>
    );
}

export default CommentCard;