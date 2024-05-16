const getProductInfo = async (productId, type) => {
    try {
        let response;
        let data;
        let imageUrl;

        if (type === 'product') {
            // Recupera le informazioni del prodotto
            response = await fetch(`http://localhost:3000/api/products/${productId}`);
            if (!response.ok) throw new Error('Errore durante la richiesta dei prodotti');
            data = await response.json();
            
            // Recupera l'immagine del prodotto
            imageUrl = await getProductImageById(productId);

        } else if (type === 'accessory') {
            // Recupera le informazioni dell'accessorio
            response = await fetch(`http://localhost:3000/api/accessories/${productId}`);
            if (!response.ok) throw new Error('Errore durante la richiesta degli accessori');
            data = await response.json();
            
            // Recupera l'immagine dell'accessorio
            imageUrl = await getAccessoryImageById(productId);
        } else {
            throw new Error('Tipo non valido');
        }

        // Restituisce l'oggetto con le informazioni richieste
        return {
            nome: data.nome,
            colore: type === 'product' ? data.colore : null,
            linkImmagine: imageUrl,
            type: type,
            prezzo: data.prezzo
        };
    } catch (error) {
        console.error("Errore nel recupero delle informazioni", error);
        return null;
    }
};

const getProductImageById = async (id) => {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${id}/variants`);
        if (!response.ok) throw new Error('Errore durante la richiesta delle immagini del prodotto');
        const data = await response.json();
        const colore = data[0]?.colore;
        const imageUrl = `http://localhost:3000/api/products/${id}/${colore}/frontale`;
        return imageUrl;
    } catch (error) {
        console.error("Errore nel recupero delle immagini del prodotto", error);
        return '';
    }
};

const getAccessoryImageById = async (id) => {
    try {
        const imageUrl = `http://localhost:3000/api/accessories/${id}/image1`;
        return imageUrl;
    } catch (error) {
        console.error("Errore nel recupero delle immagini dell'accessorio", error);
        return '';
    }
};
