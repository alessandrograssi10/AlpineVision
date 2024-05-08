
export async function GetAllProducts() {
    try {
        const response = await fetch(`http://localhost:3000/api/products`);
        if (!response.ok) {
            throw new Error('Errore nella richiesta dei prodotti');
        }
        const data = await response.json();

        // Funzione per ottenere le immagini del prodotto (frontale e laterale)
        const getImageUrls = async (id) => {
            try {
                const response = await fetch(`http://localhost:3000/api/products/${id}/variants`);
                if (!response.ok) {
                    throw new Error('Errore durante la richiesta');
                }
                const data2 = await response.json();
        
                // Verifica che data2 contenga almeno un elemento
                if (data2.length > 0) {
                    const colore = data2[0].colore;
                    const frontRes = await fetch(`http://localhost:3000/api/products/${id}/${colore}/frontale`);
                    const sideRes = await fetch(`http://localhost:3000/api/products/${id}/${colore}/sinistra`);
                    const frontUrl = frontRes.ok ? await frontRes.url : '';
                    const sideUrl = sideRes.ok ? await sideRes.url : '';
                    const color = colore;
                    const variants = data2;
        
                    return { frontUrl, sideUrl, color, variants };
                } else {
                    console.error("No variants found for product", id);
                    return { frontUrl: '', sideUrl: '', color: '', variants: [] };
                }
            } catch (error) {
                console.error("Error fetching images for product", id, error);
                return { frontUrl: '', sideUrl: '', color: '', variants: [] };
            }
        };
        

        // Ottieni le immagini per tutti i prodotti
        const imageFetchPromises = data.map(product => getImageUrls(product._id));
        const images = await Promise.all(imageFetchPromises);

        // Costruisci i prodotti con le immagini corrispondenti
        const productsWithImages = data.map((product, index) => ({
            ...product,
            color: images[index].color,
            imageUrlFront: images[index].frontUrl,
            imageUrlSide: images[index].sideUrl,
            variants:images[index].variants
        }));

        // Filtra per categoria
        const masks = productsWithImages.filter(product => product.categoria === "maschera");
        const glasses = productsWithImages.filter(product => product.categoria !== "maschera");

        return { masks, glasses };
    } catch (error) {
        console.error("Errore nel recupero dei prodotti", error);
        return { masks: [], glasses: [] }; // Ritorna oggetti vuoti in caso di errore
    }
}

export async function GetAllAccessory() {
    try {
        const response = await fetch(`http://localhost:3000/api/accessories`);
        if (!response.ok) {
            throw new Error('Errore nella richiesta dei prodotti');
        }
        const data = await response.json();

        // Funzione per ottenere le immagini del prodotto (frontale e laterale)
        const getImageUrls = async (id) => {
            try {
                const frontRes = await fetch(`http://localhost:3000/api/accessories/${id}/image1`);
                const sideRes = await fetch(`http://localhost:3000/api/accessories/${id}/image2`);
                const frontUrl = frontRes.ok ? await frontRes.url : '';
                const sideUrl = sideRes.ok ? await sideRes.url : '';
                return { frontUrl, sideUrl };
            } catch (error) {
                console.error("Error fetching images for product", id, error);
                return { frontUrl: '', sideUrl: '' };
            }
        };

        // Ottieni le immagini per tutti i prodotti
        const imageFetchPromises = data.map(product => getImageUrls(product._id));
        const images = await Promise.all(imageFetchPromises);

        // Costruisci i prodotti con le immagini corrispondenti
        const productsWithImages = data.map((product, index) => ({
            ...product,
            color: null,
            imageUrlFront: images[index].frontUrl,
            imageUrlSide: images[index].sideUrl
        }));

        // Filtra per categoria
        const accessory = productsWithImages;

        return { accessory };
    } catch (error) {
        console.error("Errore nel recupero dei prodotti", error);
        return { accessory: []}; // Ritorna oggetti vuoti in caso di errore
    }
}


export async function GetAllProductVariants(ProdId) {
    try {
        const response = await fetch(`http://localhost:3000/api/products/${ProdId}/variants`);
        if (!response.ok) {
            throw new Error('Errore nella richiesta dei prodotti');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Errore nel recupero dei prodotti", error);
        return []; // Ritorna oggetti vuoti in caso di errore
    }
}

/* SALVATAGGIO */


export async function saveAll(allElements, originalElements) {
    console.log("salvataggio")
   // console.log(allElements,originalElements)

    // Filtra gli elementi che sono stati aggiunti o modificati rispetto agli originali
    const addedOrModifiedElements = allElements.filter(element => {
        // Trova l'elemento corrispondente nell'array originalElements
        const originalElement = originalElements.find(originalElement => originalElement._id === element._id);
        // Se non trova un corrispondente originale o se l'elemento è stato modificato, restituisci true
        //return !originalElement;
        return !originalElements.some(originalElement => originalElement._id === element._id);

    });
    console.log("addedOrModifiedElements",addedOrModifiedElements)

    // Filtra gli elementi che sono stati rimossi rispetto agli originali
    const removedElements = originalElements.filter(originalElement => {
        // Trova l'elemento corrispondente nell'array allElements
        return !allElements.some(element => element._id === originalElement._id);
    });

    // Aggiungi o modifica i prodotti nell'archivio
    await Promise.all(addedOrModifiedElements.map(async element => {
        // Se l'elemento è nuovo, aggiungilo all'archivio
        console.log("Agg")

        if (!originalElements.some(originalElement => originalElement._id === element._id)) {
            await addProduct(element);
            console.log("Aggingo...")

        }

        // Controlla le varianti del prodotto e aggiungi o elimina le varianti necessarie
       // await handleVariants(element, originalElements);
    }));

    // Rimuovi i prodotti dall'archivio
    await Promise.all(removedElements.map(async element => {
        await deleteProduct(element._id);
    }));
}
async function handleVariants(product,originalElements) {
    // Se il prodotto ha varianti, gestiscile
    if (product.variants && product.variants.length > 0) {
        // Filtra le varianti che sono state aggiunte o modificate rispetto alle varianti originali
        const addedOrModifiedVariants = product.variants.filter(variant => {
            // Trova la variante corrispondente nell'array originalVariants
            const originalVariant = originalElements
                .find(originalElement => originalElement._id === product._id)
                .variants.find(originalVariant => originalVariant._id === variant._id);

            // Se non trova un corrispondente originale o se la variante è stata modificata, restituisci true
            return !originalVariant || JSON.stringify(originalVariant) !== JSON.stringify(variant);
        });

        // Filtra le varianti che sono state rimosse rispetto alle varianti originali
        const removedVariants = originalElements
            .find(originalElement => originalElement._id === product._id)
            .variants.filter(originalVariant => !product.variants.some(variant => variant._id === originalVariant._id));

        // Aggiungi o modifica le varianti
        await Promise.all(addedOrModifiedVariants.map(async variant => {
            await addVariant(product._id, variant);
        }));

        // Rimuovi le varianti
        await Promise.all(removedVariants.map(async variant => {
            await deleteVariant(product._id, variant._id);
        }));
    }
}



// Funzione per aggiungere un prodotto
async function addProduct(product) {

    console.log("Salvando prodotto")
    const prod = {
        "nome": product.nome,
        "prezzo": product.prezzo,
        "descrizione": product.descrizione,
        "categoria": 'maschera',
    };

    console.log(prod);


    try {
        // Step 1: Aggiungi il prodotto principale
        const response = await fetch('http://localhost:3000/api/products/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prod)
        });

        // Verifica se la richiesta ha avuto successo
        if (!response.ok) {
            throw new Error('Errore durante l\'aggiunta del prodotto principale');
        }

        // Estrai l'_id del nuovo prodotto dalla risposta
        const { _id } = await response.json();
        console.log(_id)

        // Step 2: Aggiungi le varianti del prodotto
        const variants = product.variants.map(variant => ({
            ...variant,
            productId: _id // Assicurati che ogni variante abbia l'_id del prodotto principale
        }));

        const variantsResponse = await fetch(`http://localhost:3000/api/products//${_id}/variants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(variants)
        });

        // Verifica se la richiesta ha avuto successo
        if (!variantsResponse.ok) {
            throw new Error('Errore durante l\'aggiunta delle varianti del prodotto');
        }

        // Se entrambe le richieste hanno avuto successo, restituisci l'_id del nuovo prodotto
        return _id;
    } catch (error) {
        console.error('Si è verificato un errore durante l\'aggiunta del prodotto con le varianti:', error);
        throw error; // Rilancia l'errore per gestirlo più in alto nell'applicazione, se necessario
    }
}


// Funzione per eliminare un prodotto
async function deleteProduct(productId) {
    // Implementa l'eliminazione del prodotto dall'archivio (ad esempio, inviando i dati al server)
    console.log("Elimina il prodotto con ID:", productId);
}


// Funzione per aggiungere una variante a un prodotto
async function addVariant(productId, variant) {
    // Implementa l'aggiunta della variante al prodotto nell'archivio (ad esempio, inviando i dati al server)
    console.log("Aggiungi la variante al prodotto con ID:", productId, variant);
}

// Funzione per eliminare una variante di un prodotto
async function deleteVariant(productId, variantId) {
    // Implementa l'eliminazione della variante dal prodotto nell'archivio (ad esempio, inviando i dati al server)
    console.log("Elimina la variante dal prodotto con ID:", productId, "e ID variante:", variantId);
}