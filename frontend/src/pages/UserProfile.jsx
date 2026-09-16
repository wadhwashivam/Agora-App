import FollowButton from "../components/FollowButton";
import PostCard from "../components/PostCard";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Avatar, Box, Button, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getUserProfile } from "../api/users";

import {CircularProgress} from "@mui/material";

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

function UserProfile(){
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        let cancelled = false;

        async function loadProfile(){
            setLoading(true);
            setError("");
            try {
                const data = await getUserProfile(id);
                if(!cancelled){
                    setProfile(data);
                }
            } catch (error) {
                if(!cancelled){
                    setError(error.message);
                }
            } finally {
                if(!cancelled){
                    setLoading(false);
                }
            }
        }
        
        loadProfile();
        return () => {
            cancelled = true;
        }
    }, [id]);

    if(loading){
        return <Box sx={{display: 'flex', justifyContent: 'center', py: 6 }}><CircularProgress size= {28} /></Box>
    }

    if (error){
        return <Typography color="error" sx={{py: 4, textAlign: 'center'}}>{error}</Typography>
    }

    const isOwnProfile = user?.id === profile.id;

    return (
        <Box sx={{ maxWidth: 680, mx: 'auto', px: {xs: 2, sm: 3}, py: 4 }}>
            <Box sx={{display: "flex", alignItems: "center", gap: 2, mb: 3}}>
                <Avatar src={profile.avatar || undefined} alt={profile.name || profile.username} sx={{ width: 64, height: 64}}>
                    {(profile.name || profile.username || '?').charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1}}>
                    <Typography sx={{ fontFamily: UI, fontWeight: 600, fontsize: 18}}>{profile.name || profile.username}</Typography>
                    <Typography sx={{ fontFamily: UI, fontWeight: 14, color: 'text.scondary'}}>@{profile.username}</Typography>
                    {profile.bio && <Typography sx={{ fontFamily: SERIF, fontsize: 15, mt: 1}}>{profile.bio}</Typography>}
                </Box>

                {isOwnProfile ? (
                    <Button onClick={() => navigate('/profile/edit')} variant="outlined">Edit Profile</Button>
                ): (
                    <FollowButton userId={profile.id} initialIsFollowing={profile.isFollowing} />
                )}
            </Box>
            {profile.posts.length === 0 ? (
                <Typography sx={{ py: 4, textAlign: "center", color: 'text.secondary'}}>No posts yet.</Typography>
            ): (
                profile.posts.map((post) => (
                    <PostCard key={post.id} post={{ ...post, postedBy: profile}} />
                ))
            )}
        </Box>
    );
}

export default UserProfile;