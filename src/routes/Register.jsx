import React from 'react';
import AuthForm from '../components/AuthForm';
import client from "../lib/directus"
import { registerUser } from "@directus/sdk"

const Register = () => {
    const onRegister = async (data) => {
        const result = await client.request(registerUser(data.email, data.password))
        console.log(result)
    }
    return (
        <div>
            <AuthForm title="Register" submitButtonTitle="Register" linkHref='/login' linkText="Have an account? Login here" onSubmit={onRegister} />
        </div>
    );
};

export default Register;