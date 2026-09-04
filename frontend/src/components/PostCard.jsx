import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutlined";
import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import LikeButton from "./LikeButton";

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

function PostCard({ post, full = false }){
    const navigate = useNavigate();

    function handleOpenAuthor(){
        navigate(`/users/${post.postedBy.id}`);
    }

    function handleOpenPost(){
        navigate(`/posts/${post.id}`);
    }

    return(
        <Box component="article" sx={{borderBottom: '1px solid', borderColor: 'divider'}}>
            <Box sx={{ display: 'flex', alignItems: "center", gap: 1.5, mb: 2 }}>
                <ButtonBase onClick={handleOpenAuthor} disableRipple sx={{ display: "flex", alignItems: "center", gap: 1.5, borderRadius: 0 }}>
                    <Avatar src={post.postedBy.avatar || undefined} alt={post.postedBy.name || post.postedBy.username} sx={{fontFamily: UI, fontSize: 15 }}>
                        {(post.postedBy.name || post.postedBy.username || '?').charAt(0).toUpperCase()}
                    </Avatar>
                    <Box sx={{ textAlign: 'left' }}>
                        <Typography sx={{ fontFamily: UI, fontSize: 15, fontWeight: 600, lineHeight: 1.3, '&:hover': { color: 'primary.main' }, }}>
                            {post.postedBy.name || post.postedBy.username}
                        </Typography>
                        <Typography sx={{fontFamily: UI, fontSize: 13.5, color: 'text.secondary', lineHeight: 1.3 }}>
                            @{post.postedBy.username}
                        </Typography>
                    </Box>
                </ButtonBase>
                <Box sx={{ flexGrow: 1 }} />
            </Box>

            <Box onClick = {handleOpenPost}>
                <Typography sx={{fontFamily: SERIF, fontSize: 19, lineHeight: 1.78, whiteSpace: 'pre-wrap', textWrap: "pretty", maxWidth: '68ch' }}>
                    {post.content}
                </Typography>
            </Box>

            <Box sx={{display: "flex", alignItems: "center", gap: 2.5, mt: 2.25, ml: -0.5 }}>
                <LikeButton postId = {post.id} initialLiked={post.isLiked} initialCount={post._count.likes} />
                <ButtonBase onClick={handleOpenPost} disableRipple sx={{ display:'flex', alignItems: 'center', gap: 0.75, px: 0.5, color: 'text.secondary', borderRadius: 0, '&:hover': {color: 'primary.main'}, }} >
                    <ChatBubbleOutlineIcon sx={{ fontSize: 17 }} />
                    <Typography sx={{ fontFamily: UI, fontSize: 14, fontVariantNumeric: 'tabular-nums'}}>
                        {post._count.comments}
                    </Typography>
                </ButtonBase>

                {!full && (
                    <ButtonBase onClick={handleOpenPost} disableRipple sx={{ml: 'auto', fontFamily: UI, fontSize: 13.5, color: 'text.secondary', borderRadius: 0, '&:hover': {color: 'primary.main'}}}>
                        Read
                    </ButtonBase>
                )}
            </Box>
        </Box>
    );
}

export default PostCard;