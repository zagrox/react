import {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {getCurrentUserId} from '../lib/directus';

const Profile = () => {
    const [userId, setUserId] = useState("");

    useEffect(() => {
        async function fetchData() {
            const id = await getCurrentUserId();
            setUserId(id);
        }
        fetchData();
    }, [])

    return (
        <div>
            Profile Component
            <p>Your user id: {userId}</p>
            <Link to="/">Go to Home</Link>
        </div>
    );
};

export default Profile;