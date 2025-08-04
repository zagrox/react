import { useNavigate } from 'react-router-dom';
import directus from '../directus';

export const LogOut = () => {
    const navigate = useNavigate();

    const onLogoutClick = async () => {
        try {
            await directus.auth.logout();
            navigate("/login");
        } catch (error) {
            console.error("Logout failed:", error);
            navigate("/");
        }
    };

    return (
        <button onClick={onLogoutClick}>Logout</button>
    );
};

export default LogOut;