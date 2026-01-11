import { getAuthToken } from '../auth/UserDataFunction';

const BASE_URL = "http://localhost:8081/events"; 

export const deleteEvent = async (eventId) => {
    const token = getAuthToken();

    try {
        const response = await fetch(`${BASE_URL}/${eventId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to delete event. Status: ${response.status}`);
        }

        return true; 
    } catch (error) {
        console.error("Delete API Error:", error);
        throw error;
    }
};