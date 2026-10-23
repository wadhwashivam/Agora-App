import { useAuth} from "../context/useAuth.js";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }){
    const {token, loading} = useAuth();

    if(loading){
        return(<><p>Loading...</p></>);
    }

    if(!token){
        return <Navigate to= "/login" replace />;
    }
    return children;
}

export default ProtectedRoute;