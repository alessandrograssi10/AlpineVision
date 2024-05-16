

export async function getUserRole(userId) {

    console.log("entrato", userId)
    const url = `http://localhost:3000/api/users/${userId}/role`;
    const jwtToken = localStorage.getItem('token');
    console.log("jwtToken", jwtToken)

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