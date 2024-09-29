import { jwtDecode } from 'jwt-decode';

export const validateTokenJwt = () => {
    const token = localStorage.getItem('jwt') as string
    return isTokenExpired(token)
}

const isTokenExpired = (token: string) => {
    try {
        if (!token) {
            clearStorage()
            return true
        }

        const decoded: any = jwtDecode(token);

        if (!decoded.exp) {
            clearStorage()
            return true
        }

        localStorage.setItem('user_id', decoded.user_id)
        localStorage.setItem('user_name', decoded.user_name)
        localStorage.setItem('email', decoded.email)

        if (decoded.exp * 1000 < Date.now()) {
            clearStorage()
            return true;
        } else {
            return false;
        }
    } catch (error) {
        clearStorage()
        console.log(error)
        return true;
    }
};

export const clearStorage = () => [
    'user_id',
    'user_name',
    'email'
].forEach(key => localStorage.removeItem(key))

