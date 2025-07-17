import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api';
import { RFRESH_TOKEN, ACCESS_TOKEN } from '../constants';
import { useState, useEffect } from 'react';

function ProtectedRoutes({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    useEffect(() => {
        auth().catch(error => {
            setIsAuthorized(false);
        })
    })

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(RFRESH_TOKEN);
        try {
            const res = api.post('/api/token/refresh/', { 
                refresh: refreshToken
            });
            if(res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access)
            }else{
                setIsAuthorized(false);
                return;
            }
        } catch (error) {
            setIsAuthorized(false);
            console.error("Refresh token failed", error);
        }
    }

    const auth = async () => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(!token){
            setIsAuthorized(false);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const tokenExpiration = decoded.exp;
            const now = Date.now() / 1000;

            if(tokenExpiration < now){
                await refreshToken();
            }else{
                setIsAuthorized(true);
            }

        } catch (error) {
            console.error("Token decoding failes: ", error);
            setIsAuthorized(false);
        }
    }

    if(isAuthorized === null) {
        return <div>Loading...</div>
    }

    return isAuthorized?children:<Navigate to='/login'/>;

}

export default ProtectedRoutes;