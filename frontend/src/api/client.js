import { getToken } from "./token.js";

async function apiRequest(endpoint, options = {}){
    const baseUrl= import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const url = `${baseUrl}${endpoint}`;

    const defaultHeaders = {
        'Content-Type': 'application/json',
        ...(getToken() && { Authorization: `Bearer ${getToken()}`})
    };

    const headers = { ...defaultHeaders, ...options.headers};

    const response = await fetch(url, { ...options, headers});

    if(!response.ok){
        let message = "API request failed";
        try {
            const errorData = await response.json();
            message = errorData.message || errorData.errors?.[0]?.msg || message;    
        } catch {
            
        }
        
        throw new Error(message);
    }
    if(response.status === 204){
        return null; 
    }
    return response.json();
}

export default apiRequest;