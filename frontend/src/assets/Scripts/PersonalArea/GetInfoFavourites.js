export const getProductInfo = async (productId, type) => {
    try {
        let response;
        let data;
        let product;
        let imageInfo;

        if (type === 'product') {
            response = await fetch(`http://localhost:3000/api/products`);
            if (!response.ok) throw new Error('Errore durante la richiesta dei prodotti');
            data = await response.json();
            product = data.find(prod => prod._id === productId);
            if (!product) throw new Error('Prodotto non trovato');
            imageInfo = await getProductImageById(productId);

        } else if (type === 'accessory') {
            response = await fetch(`http://localhost:3000/api/accessories`);
            if (!response.ok) throw new Error('Errore durante la richiesta degli accessori');
            data = await response.json();
            product = data.find(access => access._id === productId);
            if (!product) throw new Error('Accessorio non trovato');
            imageInfo = await getAccessoryImageById(productId);
        } else {
            throw new Error('Tipo non valido');
        }

        return {
            nome: product.nome || product.name || 'Nome non disponibile',
            colore: type === 'product' ? imageInfo.colore : null,
            linkImmagine: imageInfo.imageUrl,
            type: type,
            prezzo: product.prezzo,
            productId: productId
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
        return { imageUrl, colore };
    } catch (error) {
        console.error("Errore nel recupero delle immagini del prodotto", error);
        return { imageUrl: '', colore: '' };
    }
};

const getAccessoryImageById = async (id) => {
    try {
        const imageUrl = `http://localhost:3000/api/accessories/${id}/image1`;
        return { imageUrl, colore: '' };
    } catch (error) {
        console.error("Errore nel recupero delle immagini dell'accessorio", error);
        return { imageUrl: '', colore: '' };
    }
};
