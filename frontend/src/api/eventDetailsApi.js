import { getAuthToken } from '../auth/UserDataFunction';

const BASE_URL = "http://localhost:8081/events"; 

export const fetchEventDetails = async (eventId) => {
    const token = getAuthToken();

    try {
        const response = await fetch(`${BASE_URL}/${eventId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error ${response.status}: Failed to fetch event`);
        }

        const data = await response.json();
        return data; 
        
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};

export const updateEvent = async (eventId, eventData) => {
    const token = getAuthToken();
    
    const response = await fetch(`${BASE_URL}/${eventId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(eventData)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update event');
    }

    return await response.json();
};


export const notifyGuests = async (eventId) => {
    const token = getAuthToken();
    const BASE_URL = "http://localhost:8081/events";

    const response = await fetch(`${BASE_URL}/${eventId}/notify-guests`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to send updates.');
    }

    return await response.text();
};