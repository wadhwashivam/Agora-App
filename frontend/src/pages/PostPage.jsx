import {Avatar, Box, Button, ButtonBase, CircularProgress, Divider, Typography} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { useNavigate, useParams } from 'react-router-dom';
import LikeButton from "../components/LikeButton"
import CommentCard from "../components/CommentCard";
import CommentComposer from "../components/CommentComposer";
import { useEffect, useState } from "react";
import { getPostById } from "../api/posts";

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

function PostPage(){
    const { postId } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadPost(){
            setLoading(true);
            setError("");
            try {
                const data = await getPostById(postId);
                if(!cancelled) setPost(data);
            } catch (error) {
                if(!cancelled) setError(error.message);
            } finally {
                if(!cancelled) setLoading(false);
            }
        }
        loadPost();
        return () => { cancelled = true };
    }, [postId]);

    if(loading){
        return <Box sx={{ display: 'flex', justifyContent: "center", py:6}}><CircularProgress size={28} /></Box>
    }

    if(error){
        return <Typography color="error" sx={{ py: 4, textAlign: 'center' }}>{error}</Typography>
    }

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default'}}>
            <Box sx={{ maxWidth: 700, mx: 'auto', px: {xs: 2.5, sm: 3}, pb: 12}}>
                <Button
                    onClick={() => navigate(`/feed`)}
                    startIcon={<ArrowBackIcon sx={{ fontSize: 17 }} />}
                    sx={{ 
                        mt: 4,
                        ml: -1,
                        fontFamily: UI,
                        fontSize: 14,
                        textTransform: 'none',
                        color: 'text.secondary',
                        '&:hover': {bgcolor: 'transparent', color: 'primary.main'},
                    }}
                >
                    Back
                </Button>

                <Box component="article" sx={{ pt: 3 }}>
                    <ButtonBase
                        onClick={() => navigate(`/users/${post.postedBy.id}`)}
                        disableRipple
                        sx={{ display: 'flex', alignItems: 'center', gap: 1.75, borderRadius: 0}}
                    >
                        <Avatar
                            src={post.postedBy.avatar || undefined}
                            alt={post.postedBy.name || post.postedBy.username}
                            sx={{ width: 46, height: 46, fontFamily: UI, fontSize: 18}}
                        >
                            {(post.postedBy.name || post.postedBy.username || '?').charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ textAlign: 'left' }}>
                            <Typography
                                sx={{
                                    fontFamily: UI,
                                    fontSize: 16,
                                    fontWeight: 600,
                                    '&:hover' : {color: 'primary.main'}
                                }}
                            >
                                {post.postedBy.name || post.postedBy.username}
                            </Typography>

                            <Box sx={{ textAlign: "left"}}>
                                <Typography sx={{fontFamily: UI, fontSize: 16, fontWeight: 600, '&:hover': {color: 'primary.main'}}}>
                                    @{post.postedBy.username}
                                </Typography>
                                <Box sx={{ width: 3, height: 3, bgcolor: 'divider'}} />
                            </Box>
                        </Box>
                    </ButtonBase>

                    <Typography 
                        sx={{
                            mt: 4,
                            fontFamily: SERIF,
                            fontSize: 20,
                            lineHeight: 1.8,
                            whiteSpace: 'pre-wrap',
                            textWrap: 'pretty',
                            maxWidth: '66ch',
                        }}
                    >
                        {post.content}
                    </Typography>

                    <Box sx={{ mt: 4, ml: -0.5}}>
                        <LikeButton  postId={post.id} initialLiked={post.isLiked} initialCount = {post._count.likes} />
                    </Box>
                </Box>

                <Box sx={{ mt: 5, display: 'flex', alignItems: 'baseline', gap: 1.5}}>
                    <Typography 
                        sx={{
                            fontFamily: UI,
                            fontSize: 12.5,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            color: 'text.secondary'
                        }}
                    >
                        Discussion
                    </Typography>
                    <Typography
                        sx={{ fontFamily: UI, fontSize: 12.5, color: 'text.secondary', fontVariantNumeric: 'tabular-nums'}}
                    >
                        {post.comments.length}
                    </Typography>
                </Box>
                <Divider sx={{ mt: 1.5, borderBottomWidth: 2, borderColor: 'text.primary' }} />

                {post.comments.length === 0 ? (
                    <Box sx={{ py: 4, textAlign: 'center'}}>
                        <Typography sx={{ fontFamily: UI, color: 'text.secondary'}}>No replies yet</Typography> 
                        <Typography sx={{ fontFamily: UI, fontSize: 13.5, color: 'text.secondary', mt: 0.5 }}>Be the first to repond - a hundred words is plenty to disagree well.</Typography>
                    </Box>
                ):(
                    post.comments.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} />
                    ))
                )}

                <CommentComposer
                    postId={post.id}
                />
            </Box>
        </Box>
    )
}

export default PostPage;