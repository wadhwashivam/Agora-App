import { useState } from "react";
import { Button } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';

import { toggleFollow } from "../api/users";

const UI = '"Work Sans", system-ui, sans-serif';

function FollowButton({userId, initialIsFollowing}){
    const [submitting, setSubmitting] = useState(false);
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);

    const label = isFollowing ? "Unfollow" : "Follow";

    async function followToggleHandler(){
        if (submitting){
            return;
        }
        setSubmitting(true);

        try {
            await toggleFollow(userId);
            setIsFollowing(true);
        } catch (error) {
            console.error(error);
        }finally{
            setSubmitting(false);
        }
    }

    return (
        <Button 
            onClick={followToggleHandler}
            variant={isFollowing ? 'outlined' : 'contained'}
            size='medium'
            startIcon={isFollowing? <CheckIcon sx={{fontSize: 16}} /> : null}
            sx={{
                fontFamily: UI,
                textTransform: 'none',
                fontWeight: 500,
                fontSize: 15,
                minWidth: 108,
                px: 2.5,
                whiteSpace: "nowrap"
            }}
        >
            {label}
        </Button>
    );
}

export default FollowButton;
