
export async function getUserRole() {

    const userId = localStorage.getItem('userId');
    const url = `http://localhost:3000/api/users/${userId}/role`;
    const jwtToken = localStorage.getItem('token');

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            // Se la risposta non è valida (es. errore di autorizzazione o utente non trovato), lancia un errore
            throw new Error(`HTTP status ${response.status}`);
        }

        const data = await response.json();
        // Restituisce il ruolo dell'utente dalla risposta
        return data.role;
    } catch (error) {
        // Gestisce eventuali errori nella richiesta o nella risposta e li rilancia
        console.error('Errore durante il recupero del ruolo:', error);
        throw error;
    }
}

export async function verifyTokenAndUserId() {

    const userId = localStorage.getItem('userId');
    const jwtToken = localStorage.getItem('token');
    
    if (!userId || !jwtToken) {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('ruoloUser');
        localStorage.removeItem('emailUser');
        return false;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/users/verify/${userId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${jwtToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return true;
        } else {
            console.error("Verification failed. Status:", response.status);
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            localStorage.removeItem('ruoloUser');
            localStorage.removeItem('emailUser');
            return false;
        }
    } catch (error) {
        console.error("Error during verification:", error);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('ruoloUser');
        localStorage.removeItem('emailUser');
        return false;
    }
}
