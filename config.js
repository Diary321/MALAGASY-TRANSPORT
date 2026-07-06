// config.js - Version pour Vercel
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://votre-projet.vercel.app'  // Remplacez par votre URL Vercel
    : 'http://localhost:3000';

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