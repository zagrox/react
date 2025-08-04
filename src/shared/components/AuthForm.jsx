import { useState } from "react";
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

const AuthForm = ({ title, submitButtonTitle, onSubmit, linkText, linkHref }) => {
    const [data, setData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>{title}</h1>
            <input
                type="email"
                placeholder="Email"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <input
                type="password"
                placeholder="Password"
                value={data.password}
                onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <button type="submit">{submitButtonTitle}</button>
            <Link to={linkHref}>{linkText}</Link>
        </form>
    );
};

AuthForm.propTypes = {
    title: PropTypes.string.isRequired,
    submitButtonTitle: PropTypes.string.isRequired,
    onSubmit: PropTypes.func.isRequired,
    linkText: PropTypes.string.isRequired,
    linkHref: PropTypes.string.isRequired,
};

export default AuthForm;