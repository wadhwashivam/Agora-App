import { Avatar, Box, Button, InputBase,  Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {createPost} from "../api/posts";


const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

function countWords(text){
    return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function PostComposer( onPostCreated ){
    const {user} = useAuth(); 
    const [submitting, setSubmitting] = useState(false);
    const [draft, setDraft] = useState('');
    
    const text = draft;
    const maxWords = 500;
    const words = countWords(text);
    const over = words > maxWords;

    async function handleSubmit(){
        if(!text.trim() || over || submitting){
            return ;
        }
        setSubmitting(true);

        try {
            await createPost(draft.trim());
            setDraft('');
        } catch (error) {
            console.error(error);
        } finally{
            setSubmitting(false);
        }
    }
    
    return (
        <Box component="section" sx={{ pt: 3.5, pb: 2.5, borderBottom: '2px solid', borderColor: 'text.primary'}}>
            <Box sx={{ display: 'flex', gap: 2}}>
                {user && (
                    <Avatar 
                        src={user.avatar || undefined}
                        alt={user.name || user.username}
                        sx={{ width: 38, height:38, fontFamily:UI, fontSize: 15,mt:0.5}}
                    >
                        {(user.name || user.username || '?').charAt(0).toUpperCase()}
                    </Avatar>
                )}

                <Box sx={{flexGrow: 1 }}>
                    <InputBase
                        multiline
                        minRows={3}
                        value = {draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="What are you thinking through today?"
                        disabled= {submitting}
                        sx={{
                            width: '100%',
                            fontFamily: SERIF, 
                            fontSize: 18,
                            lineHeight: 1.72,
                            p: 0,
                            '& textarea::placeholder': {color: 'text.secondary', opacity: 1},
                        }}
                    />

                    <Typography sx={{ mt: 0.75, fontFamily: UI, fontSize: 12.5, fontVariantNumeric: 'tabular-nums', color: over? 'error.main': 'text.secondary'}}>
                        {words} / {maxWords} words{over ? ` - ${words - maxWords} over`: ''}
                    </Typography>
                </Box>

                <Button variant="contained" disableElevation onClick={handleSubmit} disabled= {!text.trim() || over || submitting} sx={{ fontFamily: UI, textTransform: 'none', fontWeight: 500, px: 3, minWidth: 104}}>
                    {submitting? 'Posting...': 'Post'}
                </Button>
            </Box>
        </Box>
    )
}

export default PostComposer;