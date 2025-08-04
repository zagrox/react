import { createDirectus, rest, authentication, withToken, readMe, logout } from '@directus/sdk';

const BACKEND_URL = "http://localhost:8055/"

const client = createDirectus(BACKEND_URL)
    .with(authentication("json"))
    .with(rest())

export const getCurrentUserId = async () => {
    const accessToken = (JSON.parse(localStorage.getItem('directus_auth')) || {}).access_token;

    let result

    if (accessToken)
        result = await client.request(withToken(accessToken, readMe()));

    return result?.id
}

export const logoutUser = async () => {
    const refreshToken = (JSON.parse(localStorage.getItem('directus_auth')) || {}).refresh_token;
    await client.request(logout(refreshToken, "json"));
    localStorage.removeItem('directus_auth');
}

export const refreshAuthToken = async () => {
    // refresh using the authentication composable
    const result = await client.refresh();

    // refresh http request using a cookie
    // const result = await client.request(refresh('cookie'));

    // refresh http request using json
    // const result = await client.request(refresh('json', refresh_token));
}

export default client;
