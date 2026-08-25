import apiRequest from "./client";

async function getUsers(){
    const data = await apiRequest("/users", {
        method: "GET",
    });
    return data;
}

async function getUserProfile(userId){
    const data = await apiRequest(`/users/${userId}`, {
        method: "GET",
    });

    return data;
}

async function editUserProfile(userId, {name, bio, avatar}){
    const data = await apiRequest(`/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ name, bio, avatar })
    });

    return data;
}

async function toggleFollow(userId){
    const data = await apiRequest(`/users/${userId}/follow`, {
        method: "POST",
    })

    return data;
}

export { getUsers, getUserProfile, editUserProfile, toggleFollow };