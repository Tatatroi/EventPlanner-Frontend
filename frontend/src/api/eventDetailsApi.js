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