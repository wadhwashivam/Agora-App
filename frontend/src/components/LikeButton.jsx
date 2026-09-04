import { useState } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";

import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { postLikedByPostId } from "../api/posts";

const UI = '"Work Sans", system-ui, sans-serif';

function LikeButton({postId, initialLiked, initialCount }){
    const [liked, setLiked] = useState(initialLiked);
    const [count, setCount] = useState(initialCount);
    const [submitting, setSubmitting] = useState(false);

    const Icon = liked? FavoriteIcon : FavoriteBorderIcon;
    async function likeToggleHandler(){
        if (submitting){
            return;
        }
        setSubmitting(true);

        try {
            const data = await postLikedByPostId(postId);
            setLiked(data.like);
            setCount((prev) => prev + (data.like ? 1: -1));
        } catch (error) {
            console.error(error);
        }finally{
            setSubmitting(false);
        }
    }

    return (
        <ButtonBase onClick={likeToggleHandler} disabled = {submitting} disableRipple sx={{ px: 0.5, py: 0.25, borderRadius: 9, color: liked? 'primary.main': 'text.secondary', transition: 'color 120ms ease', '&:hover': {color: 'primary.main'}}}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75}}>
                <Icon sx= {{ fontSize: 16 }} />
                <Typography sx={{ fontFamily: UI, fontSize: 13, fontVariantNumeric: 'tabular-nums', fontWeight: liked ? 600 : 400}}>
                    {count}
                </Typography>
            </Box>            
        </ButtonBase>
    );
}

export default LikeButton;
