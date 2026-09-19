import {Box, CircularProgress, Divider, InputBase, Typography} from "@mui/material";

import { getUsers } from "../api/users";
import SearchIcon from "@mui/icons-material/Search";
import UserCard from "../components/UserCard";
import { useEffect, useState } from "react";

const UI = '"Work Sans", system-ui, sans-serif';
const SERIF = '"Lora", Georgia, serif';

function UserIndexPage(){
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [error, setError] = useState("");

    useEffect(()=> {
        let cancelled = false;

        async function loadUsers(){
            setLoading(true);
            setError("");
            try {
                const fetchedUsers = await getUsers();
                if(!cancelled) setUsers(fetchedUsers);
            } catch (error) {
                if(!cancelled) setError(error.message);
            } finally{
                if(!cancelled) setLoading(false);
            }
        }
        loadUsers();
        return () => {cancelled = true};
    },[]);

    const filteredUsers = users.filter((user) => {
        const q = query.toLowerCase();
        return(
            user.name?.toLowerCase().includes(q) ||
            user.username.toLowerCase().includes(q)
        );
    })

    return(
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default'}}>
            <Box sx={{ minWidth: 720, mx: 'auto', px: {xs: 2.5, sm: 3}, pb: 10}}>
                <Box sx={{ pt: 6 }}>
                    <Typography sx={{ fontFamily: SERIF, fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em'}}>
                        Explore
                    </Typography>
                    <Typography sx={{ mt: 0.75, fontFamily: UI, fontSize: 14, color: 'text.secondary'}}>
                        Everyone writing on Agora
                    </Typography>
                </Box>

                <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 4, 
                    gap: 1.5,
                    pb: 1.25,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:focus-within' : {borderColor: 'text.primary'},
                }}>
                    <SearchIcon sx={{ fontSize: 19, color: 'text.secondary' }} />
                    <InputBase
                        value={query || ''}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by name or username"
                        sx={{
                            flexGrow: 1,
                            fontFamily: UI,
                            fontSize: 15.5,
                            '& input::placeholder': {color: 'text.secondary', opacity: 1},
                        }}
                    />
                </Box>

                <Divider sx={{mt: 4, borderBottomWidth: 2, borderColor: 'text.primary'}} />

                {loading && (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 6}}>
                        <CircularProgress size={28} />
                    </Box>
                )}

                {!loading && error && (
                    <Typography color="error" sx={{ py: 3, textAlign: 'center'}}>
                        {error}
                    </Typography>
                )}

                {!loading && !error && users.length > 0 &&  filteredUsers.length === 0 && (
                    <Typography sx={{ py: 6, textAlign: 'center', color: 'text.secondary' }}>
                        No one else here yet.
                    </Typography>
                )}

                {!loading && !error && filteredUsers.map((user) => (
                    <UserCard key={user.id} user= {user} />
                ))}
            </Box>

        </Box>
    )
}

export default UserIndexPage;