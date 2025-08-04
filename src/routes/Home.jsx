import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { LogOut } from '../components/Logout';

const Home = ({ isAuthenticated }) => {
    return (
        <div>
            Home Component
            {(isAuthenticated ? <Link to="/profile">View Profile</Link> : <div/>)}
            {(isAuthenticated ? <LogOut /> : <div/>)}
            {(!isAuthenticated ? <Link to="/login">Login</Link> : <div/>)}
        </div>
    );
};
Home.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
};

export default Home;