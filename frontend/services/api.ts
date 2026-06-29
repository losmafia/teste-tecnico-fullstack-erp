import axios from 'axios';

// Cria a instância base apontando para o seu backend
export const api = axios.create({
    baseURL: 'http://localhost:3333/api',
});

// Interceptador de Requisição (O "Pedágio")
api.interceptors.request.use((config) => {
    // Como o Next.js roda no servidor (SSR) e no cliente, precisamos garantir 
    // que estamos no navegador (window) antes de tentar ler o localStorage
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('erp_token');

        // Se o crachá (token) existir, pendura na requisição
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});