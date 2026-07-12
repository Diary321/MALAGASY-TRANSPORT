/*
 * @Author: Diary321 dyarijuniorofficiel@gmail.com
 * @Date: 2026-07-01 12:27:01
 * @LastEditors: Diary321 dyarijuniorofficiel@gmail.com
 * @LastEditTime: 2026-07-12 11:05:27
 * @FilePath: \MALAGASY_TRANSPORT\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// config.js - Version corrigée pour Vercel
// Détection automatique de l'environnement
const getApiBaseUrl = () => {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;

    // Mode développement local
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:3000';
    }

    // Mode production (Vercel, Railway, etc.)
    // Utilise l'URL actuelle du site
    return `${protocol}//${hostname}`;
};

const API_BASE_URL = getApiBaseUrl();

console.log('🔗 API connectée à:', API_BASE_URL);

const API = {
    auth: {
        login: `${API_BASE_URL}/auth/login`,
        register: `${API_BASE_URL}/auth/register`
    },
    client: {
        accueil: `${API_BASE_URL}/client/accueil`,
        selection: `${API_BASE_URL}/client/selection`,
        confirmation: (id) => `${API_BASE_URL}/client/confirmation/${id}`,
        historique: (userId) => `${API_BASE_URL}/client/historique/${userId}`,
        messages: (userId) => `${API_BASE_URL}/client/messages/${userId}`,
        sendMessage: `${API_BASE_URL}/client/messages`
    },
    admin: {
        dashboard: `${API_BASE_URL}/admin/dashboard`,
        reservations: `${API_BASE_URL}/admin/reservations`,
        pending: `${API_BASE_URL}/admin/reservations/pending`,
        confirm: (id) => `${API_BASE_URL}/admin/reservations/confirm/${id}`,
        cancel: (id) => `${API_BASE_URL}/admin/reservations/cancel/${id}`,
        messages: `${API_BASE_URL}/admin/messages`,
        unread: `${API_BASE_URL}/admin/messages/unread`,
        read: (id) => `${API_BASE_URL}/admin/messages/read/${id}`,
        reply: (id) => `${API_BASE_URL}/admin/messages/reply/${id}`,
        voyages: `${API_BASE_URL}/admin/gestion/voyages`,
        voyage: (id) => `${API_BASE_URL}/admin/gestion/voyages/${id}`
    }
};