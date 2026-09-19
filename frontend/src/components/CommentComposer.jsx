import { Avatar, Box, Button, InputBase, Typography } from '@mui/material';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postCommentsByPostId } from '../api/posts';

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

const countWords = (text) => (text.trim() ? text.trim().split(/\s+/).length : 0);

function CommentComposer({postId}){
    const {user} = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [draft, setDraft] = useState('');

    const text = draft;
    const maxWords = 100;
    const words = countWords(text);
    const over = words > maxWords;

    async function handleSubmit(){
        if(!text.trim() || over || submitting){
            return ;
        }
        setSubmitting(true);

        try {
            await postCommentsByPostId(postId, draft.trim());
            setDraft('');
        } catch (error) {
            console.error(error);
        } finally{
            setSubmitting(false);
        }
    }

    return (
        <Box component="section" sx={{ pt: 3, pb: 1, display: 'flex', gap: 2}}>
            {user && (
                <Avatar 
                    src={user.avatar || undefined }
                    alt={user.name || user.username}
                    sx={{ width: 32, height: 32, fontFamily: UI, fontSize: 13.5, mt: 0.5 }}
                >
                    {(user.name || user.username || '?').charAt(0).toUpperCase()}
                </Avatar>
            )}
            <Box sx={{ flexGrow: 1 }}>
                <InputBase
                    multiline
                    minRows={2}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder='Add to the discussion...'
                    disabled= {submitting}
                    sx={{
                        width: '100%',
                        p: 0,
                        pb: 1.25,
                        fontFamily: SERIF,
                        lineHeight: 1.7,
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                    }}
                />
                <Box sx={{ mt: 1.5, display: 'flex', alignItems: 'center', gap: 2}}>
                    <Typography
                        sx={{
                            fontFamily: UI,
                            fontSize: 12.5,
                            fontVariantNumeric: 'tabular-nums',
                            color: over ? 'error.main' : 'text.secondary',
                        }}
                    >
                        {words} / {maxWords} words
                    </Typography>
                    <Box sx={{ flexGrow: 1}} />
                    <Button
                        variant='contained'
                        disableElevation
                        size='small'
                        onClick={handleSubmit}
                        disabled= {!text.trim() || over || submitting}
                        sx={{ fontFamily: UI, textTransform: 'none', fontWeight :500, px: 2.25 }}
                    >
                        {submitting ? 'Sending...' : 'Reply'}
                    </Button>
                </Box>
            </Box>
        </Box>
    )

}

export default CommentComposer;