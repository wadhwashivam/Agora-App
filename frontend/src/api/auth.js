import apiRequest from "./client";

import { setToken } from "./token.js";

async function login(username, password){
    const data = await apiRequest("/login", {
        method: "POST",
        body: JSON.stringify({ username, password })
    });

    setToken(data.token);
    return data;
}

async function signup(username, name, password, confirmPassword){
    const data = await apiRequest("/signup", {
        method: "POST",
        body: JSON.stringify({ username, password, confirmPassword, name })
    });

    return data;
}



export { login, signup };