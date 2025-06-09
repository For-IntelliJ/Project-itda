import axios from 'axios';

export const registerUser = async (formData) => {
    return await axios.post('http://localhost:8080/api/member/join', formData, {
        withCredentials: true,
    });
};

export const loginUser = async (data) => {
    return await axios.post('http://localhost:8080/api/member/login', data, {
        withCredentials: true,
    });
};