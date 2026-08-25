import { createContext, useState, useContext, useEffect } from "react";
import { getToken, removeToken } from "../api/token.js";
import { jwtDecode } from "jwt-decode";
import apiRequest from "../api/client.js";

import { login as authLogin } from "../api/auth.js";

const AuthContext = createContext(null);

function AuthProvider({ children }){
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadUserProfile(tokenString){
        const decodedToken = jwtDecode(tokenString);
        const data = await apiRequest(`/users/${decodedToken.id}`);
        setToken(tokenString);
        setUser(data);
    }

    useEffect(() =>{
        async function checkExistingSession(){
            try {
                
                const checkingLocalStorage = getToken();

                if(checkingLocalStorage !== null){
                    const decodedToken = jwtDecode(checkingLocalStorage);
                    if(decodedToken.exp * 1000 < Date.now()){
                        removeToken();
                        setLoading(false);
                        return;
                    }

                    await loadUserProfile(checkingLocalStorage);
                    setLoading(false);
                }else{
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                setLoading(false);
                removeToken();
            }
        };

        checkExistingSession();
    }, []);

    async function login(username, password){
        const newTokenData = await authLogin(username, password);
        const newToken = newTokenData.token;
        await loadUserProfile(newToken);
    }

    function logout(){
        removeToken();
        setUser(null);
        setToken(null);
    }

    async function updateProfile(updates){
        const updatedUser = await apiRequest(`/users/${user.id}`, {
            method: "PATCH",
            body: JSON.stringify(updates),
        });
        setUser(updatedUser);
        return updatedUser;
    }

    const value = {token, user, loading, login, logout, updateProfile};

    return (
        <AuthContext.Provider value = {value}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(){
    return useContext(AuthContext);
}

export { AuthProvider, useAuth };