import { useState } from "react"
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

const AuthForm = ({ title,
    submitButtonTitle,
    onSubmit,
    linkText,
    linkHref }) => {

    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        onSubmit(data);
    };

    const handleInputChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>{title}</h1>
            <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={data.email}
                onChange={handleInputChange}
                required
            />
            <input
                type="password"
                placeholder="Enter your Password"
                name="password"
                value={data.password}
                required
                onChange={handleInputChange}
            />
            <button>
                {submitButtonTitle}
            </button>
            <p>
                <Link
                    to={linkHref}>
                    {linkText}
                </Link>
            </p>
        </form>
    );
}
AuthForm.propTypes = {
    title: PropTypes.string.isRequired,
    submitButtonTitle: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    linkText: PropTypes.string.isRequired,
    linkHref: PropTypes.string.isRequired,
};

export default AuthForm;