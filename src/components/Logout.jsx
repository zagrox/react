import { useNavigate } from 'react-router-dom';
import {logoutUser} from '../lib/directus';

export const LogOut = () => {
    const navigate = useNavigate();

    const onLogoutClick = async () => {
        try {
            await logoutUser();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            navigate("/");
        }
    }

    return <>
        <button onClick={onLogoutClick}>Logout</button>
    </>

};
