import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function ProtectedLayout(){
    return (
        <>
            <NavBar />
            <Outlet />
        </>
    );
}

export default ProtectedLayout;