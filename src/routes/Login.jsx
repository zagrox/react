import AuthForm from '../components/AuthForm';
import client from '../lib/directus';
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';


const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const onLogin = async (data) => {
        const result = await client.login(data.email, data.password)
        localStorage.setItem('directus_auth', JSON.stringify(result))
        navigate("/");
        setIsAuthenticated(true);
    }

    return (
        <div>
            <AuthForm title="Login" submitButtonTitle="Login" linkHref='/register' linkText="Don't have an account? Register here" onSubmit={onLogin} />
        </div>
    );
};
Login.propTypes = {
    setIsAuthenticated: PropTypes.func.isRequired,
};

export default Login;