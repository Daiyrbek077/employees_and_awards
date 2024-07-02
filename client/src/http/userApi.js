import { $authHost, $host } from "./index";
import { jwtDecode } from 'jwt-decode';


export const registration = async (name, password, role) => {
    const { data } = await $host.post('api/user/registration', { name, password, role })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const login = async (name, password) => {
    const { data } = await $authHost.post('api/user/login', { name, password })
    localStorage.setItem('token', data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    try {
        const { data } = await $authHost.get('api/user/auth');
        localStorage.setItem('token', data.token);
        return jwtDecode(data.token);
    } catch (error) {
        console.error("Failed to check authentication:", error);
        localStorage.removeItem('token'); // Remove token if authentication check fails
        throw error; // Rethrow the error to handle it in the calling code
    }
}
