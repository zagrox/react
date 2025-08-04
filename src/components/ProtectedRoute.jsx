import { Navigate, Outlet } from 'react-router-dom'
import PropTypes from 'prop-types'

const ProtectedRoute = ({ isAuthenticated }) => {
    
    return (
        isAuthenticated ? 
        <Outlet /> : <Navigate to="/login" />
    )
}
ProtectedRoute.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
}

export default ProtectedRoute;