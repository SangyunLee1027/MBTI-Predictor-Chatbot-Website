import React from 'react'
import axios from '../api/axios'
import useAuth from './useAuth'


const useRefreshToken = () => {
    const {setAuth} = useAuth();

    const refresh = async() => {
        const response = await axios.get('/auths/user', {
            withCredentials: true
        });

        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {email: response.data.email, name: response.data.name, accessToken: response.data.accessToken}
            // return { ...prev, accessToken: response.data.accessToken}

        });
        return response.data.accessToken;
    }

    return refresh;
}

export default useRefreshToken;
