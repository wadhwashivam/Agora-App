import { useEffect, useState } from "react";
import { Box , CircularProgress, Typography } from "@mui/material";

import PostComposer from "../components/PostComposer";
import PostCard from "../components/PostCard";
import PaginationControls from "../components/PaginationControls";
import { getPostsList } from "../api/posts";


const LIMIT = 20;

function FeedPage(){
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading,setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let cancelled = false;

        async function loadFeed(){
            setLoading(true);
            setError("");
            try {
                const data = await getPostsList(page, LIMIT);
                if(!cancelled){
                    setPosts(data);
                }
            } catch (error) {
                if(!cancelled){
                    setError(error.message);
                }
            }finally{
                if(!cancelled){
                    setLoading(false);
                }
            }
        }

        loadFeed();
        return () => {
            cancelled = true;
        }
    }, [page]);

    const hasMore = posts.length === LIMIT;

    return(
        <Box sx={{ maxWidth: 680, mx: 'auto', px: {xs:2, sm: 3}}}>
            <PostComposer />

            {loading && (
                <Box sx={{display: "flex", justifyContent: "center", py: 6 }}>
                    <CircularProgress size={28} />
                </Box>
            )}

            {!loading && error && (
                <Typography color="error" sx={{ py: 4, textAlign: "center"}}>
                    {error}
                </Typography>
            )}

            {!loading && !error && posts.length === 0 && (
                <Typography sx={{ py:6, textAlign: 'center', color: 'text.secondary'}}>
                    Nothing here yet - follow people to see their posts, or write the first one.
                </Typography>
            )}

            {!loading && !error && posts.map((post) => (
                <PostCard key= {post.id} post= {post} />
            ))}

            {!loading && !error && (
                <PaginationControls
                    page = {page}
                    hasMore={hasMore}
                    onPrev={() => setPage((p) => Math.max(1, p-1))}
                    onNext={() => setPage((p) => p+1)}
                    disabled = {loading}
                />
            )}
        </Box>
    )
}

export default FeedPage;