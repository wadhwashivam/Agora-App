import apiRequest from "./client";

async function createPost(content){
    const data = await apiRequest("/posts", {
        method: "POST",
        body: JSON.stringify({content })
    });

    return data;
}

async function getPostsList(page = 1,limit = 20){
    const data = await apiRequest(`/posts?page=${page}&limit=${limit}`, {
        method: "GET"
    });
    return data;
}

async function getPostById(postId){
    const data = await apiRequest(`/posts/${postId}` , {
        method: "GET"
    });
    return data;
}

async function postCommentsByPostId(postId, {content}){
    const data = await apiRequest(`/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
    });

    return data;
}

async function postLikesByPostId(postId){
    const data = await apiRequest(`/posts/${postId}/likes`, {
        method: "POST",
    });

    return data;
}

export { createPost, getPostsList, getPostById, postCommentsByPostId, postLikesByPostId };