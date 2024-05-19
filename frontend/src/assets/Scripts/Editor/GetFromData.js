import ImmagineBg from '../../Images/BgProd3.png';
import ImmagineBg2 from '../../Images/Bg.png';


// Funzione per reperire tutti i prodotti (maschere e occhiali) dal database
export async function GetAllProducts() {
    try {
        const response = await fetch(`http://localhost:3000/api/products`); // Chiamata api per reperire tutti i prodotti
        if (!response.ok) {
            throw new Error('Errore nella richiesta dei prodotti');
        }
        const data = await response.json();

        // Funzione per ottenere le immagini del prodotto (frontale e laterale) e informazioni
        const getImageUrls = async (product) => {
            try {
                // Recupero le varianti per prendere l'immagine della prima (come copertina) e le altre informazioni
                const response = await fetch(`http://localhost:3000/api/products/${product._id}/variants`);
                if (!response.ok) {
                    throw new Error('Errore durante la richiesta');
                }
                const data2 = await response.json();
        
                // Verifica che data2 contenga almeno un elemento
                if (data2.length > 0) {
                    const colore = data2[0].colore; // Colore della prima variante
                    // Recupero le immagini della prima variante
                    const frontRes = await fetch(`http://localhost:3000/api/products/${product._id}/${colore}/frontale`);
                    const sideRes = await fetch(`http://localhost:3000/api/products/${product._id}/${colore}/sinistra`);
                    const frontUrl = frontRes.ok ? await frontRes.url : '';
                    const sideUrl = sideRes.ok ? await sideRes.url : '';
                    const color = colore;
                    const variants = data2;
                    const categoria = product.categoria;

        
                    return { frontUrl, sideUrl, color, variants };
                } else {
                    console.error("Errore nel recupero delle varianti del prodotto", product._id);
                    return { frontUrl: '', sideUrl: '', color: '', variants: [] };
                }
            } catch (error) {
                console.error("Errore nel recupero delle immagini del prodotto", product._id, error);
                return { frontUrl: '', sideUrl: '', color: '', variants: [] };
            }
        };
        

        // Chiamate per tutti i prodotti
        const imageFetchPromises = data.map(product => getImageUrls(product));
        // Chiamo il Promise.all di tutte le chimate per averle tutte insieme
        const images = await Promise.all(imageFetchPromises);

        // Costruisco gli elementi con le immagini e le informazioni ottenute precedentemente in images per ogni prodotto
        const productsWithImages = data.map((product, index) => ({
            ...product,
            color: images[index].color,
            imageUrlFront: images[index].frontUrl,
            imageUrlSide: images[index].sideUrl,
            variants:images[index].variants
        }));

        // Divido i prodotti maschera da quelli occhile
        const masks = productsWithImages.filter(product => product.categoria === "maschera");
        const glasses = productsWithImages.filter(product => product.categoria !== "maschera");

        return { masks, glasses };
    } catch (error) {
        console.error("Errore nel recupero dei prodotti", error);
        
        // Ritorna oggetti vuoti in caso di errore
        return { masks: [], glasses: [] };
    }
}


// Funzione per reperire tutti gli accessori dal database
export async function GetAllAccessory() {
    try {
        const response = await fetch(`http://localhost:3000/api/accessories`);// Chiamata api per reperire tutti gli accessori
        if (!response.ok) {
            throw new Error('Errore nella richiesta degli accessori');
        }
        const data = await response.json();

        // Funzione per ottenere le immagini dell'accessorio
        const getImageUrls = async (id) => {
            try {
                const frontRes = await fetch(`http://localhost:3000/api/accessories/${id}/image1`);
                const sideRes = await fetch(`http://localhost:3000/api/accessories/${id}/image2`);
                const frontUrl = frontRes.ok ? await frontRes.url : '';
                const sideUrl = sideRes.ok ? await sideRes.url : '';
                return { frontUrl, sideUrl };
            } catch (error) {
                console.error("Errore nel recuper delle immagini dell'accessorio", id, error);
                return { frontUrl: '', sideUrl: '' };
            }
        };

        // Ottieni le immagini per tutti gli accessori e aspetta che tutti vengano completati
        const imageFetchPromises = data.map(product => getImageUrls(product._id));
        const images = await Promise.all(imageFetchPromises);

        // Costruisco gli elementi con le immagini e le informazioni ottenute precedentemente in images per ogni accessorio
        const productsWithImages = data.map((product, index) => ({
            ...product,
            color: null,
            imageUrlFront: images[index].frontUrl,
            imageUrlSide: images[index].sideUrl
        }));

        const accessory = productsWithImages;

        return { accessory };
    } catch (error) {
        console.error("Errore nel recupero deigli accessori", error);
        return { accessory: []}; // Ritorna oggetti vuoti in caso di errore
    }
}

// Funzione per reperire tutte le varianti di un prodotto dato l'Id
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




/* 

SALVATAGGIO 

Viene preso sia l'elenco con le modifiche sia l'elenco originale e vengono comparati
Vengono divisi tra prodotti (maschere e occhiali) ed accessori
Vengono chiamate le rispettive api per il caricamento delle modifiche
(aggiungi prodotto)
(rimuovi prodotto)
(aggiungi variante prodotto) 
(rimuovi variante prodotto) 
(aggiungi accessorio)
(rimuovi accessorio)

*/

// Funzione per il salvataggio
export async function saveAll(allElements, originalElements) {
    console.log("Salvataggio")

    // Filtra gli elementi e vengono ritornati solo gli elementi che sono stati aggiunti (rispetto ad originalElements)
    const addedElements = allElements.filter(element => {
        // const originalElement = originalElements.find(originalElement => originalElement._id === element._id);
        return !originalElements.some(originalElement => originalElement._id === element._id);
    });

    // Filtra gli elementi e vengono ritornati solo gli elementi che sono stati eleiminati (rispetto ad originalElements)
    const removedElements = originalElements.filter(originalElement => {
        return !allElements.some(element => element._id === originalElement._id);
    });

    // Promise.all per l'aggiunta degli elementi nel database (Aspetta il completamento di tutte le chiamate)
    await Promise.all(addedElements.map(async element => {

        //verifica di nuovo che non sia presente in originalElements e fa due chiamate diverse in base che sia prodotto o accessorio
        if (!originalElements.some(originalElement => originalElement._id === element._id)) {
            console.log(element.categoria)
            if(element.categoria === "occhiale" || element.categoria === "maschera" ) await addProduct(element);// (aggiungi prodotto)
            else await addAccessory(element);// (aggiungi accessorio)
        }
    }));

    // Promise.all per la rimozione delle varianti nel database (Aspetta il completamento di tutte le chiamate)
    await Promise.all(allElements.map(async element => {

        // Funziona solo per i prodotti (cchiali e maschere)
        if(element.categoria === "occhiale" || element.categoria === "maschera" ){

        // Trova l'elemento originale corrispondente
        const originalElement = originalElements.find(originalElement => originalElement._id === element._id);
    
        // Se sono stati eliminati o le varianti sono state modificate vengono aggiornate le varianti
        if (!originalElement || JSON.stringify(element.variants) !== JSON.stringify(originalElement.variants)) {
        
    
            // Controlla che il prodotto trovato non sia un novo prodotto (viene gestito direttamente nella chiamata della creazione)
            if (!addedElements.some(e => e._id === element._id)) {
                await handleVariants(element, originalElements); // Avvia la funzione per gestire le varianti
            }
        }
    }
    }));
    
    // Promise.all per la rimozione degli elementi nel database (Aspetta il completamento di tutte le chiamate)
    await Promise.all(removedElements.map(async element => {
        if(element.categoria === "occhiale" || element.categoria === "maschera" ) await deleteProduct(element._id);// (rimuovo prodotto)
        else await deleteAccessory(element._id);// (rimuovo prodotto)
    }));
}

//Funzione per gestire la modifica di varianti
async function handleVariants(product,originalElements) {

    // Controlla che ci siano le varianti
    if (product.variants && product.variants.length > 0) {

        // Filtra le varianti che sono state aggiunte o modificate rispetto alle varianti originali
        const addedOrModifiedVariants = product.variants.filter(variant => {
            const originalVariant = originalElements
                .find(originalElement => originalElement._id === product._id)
                .variants.find(originalVariant => originalVariant._id === variant._id);
            return !originalVariant || JSON.stringify(originalVariant) !== JSON.stringify(variant);
        });

        // Filtra le varianti che sono state rimosse rispetto alle varianti originali
        const removedVariants = originalElements
            .find(originalElement => originalElement._id === product._id)
            .variants.filter(originalVariant => !product.variants.some(variant => variant._id === originalVariant._id));

        // Promise.all per l'aggiunta delle varianti nel database (Aspetta il completamento di tutte le chiamate)
        await Promise.all(addedOrModifiedVariants.map(async variant => {
            await addVariant(product._id, variant);// (aggiungi variante)
        }));

        // Promise.all per la rimozione delle varianti nel database (Aspetta il completamento di tutte le chiamate)
        await Promise.all(removedVariants.map(async variant => {
            await deleteVariant(product._id, variant.colore);// (rimuovi variante)
        }));
    }
}

/* Aggiungi prodotto */

async function addProduct(product) {
    try {

        //prodotto da aggiungere con i rispettivi dati
        const prod = {
            nome: product.nome,
            prezzo: Number(product.prezzo),
            descrizione: product.descrizione,
            categoria: product.categoria,
            motto: product.motto,
            caratteristiche: product.caratteristiche
        };

        // Viene chiamata l'api per l'aggiunta del prodotto
        const productResponse = await fetch('http://localhost:3000/api/products/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prod)
        });

        if (!productResponse.ok) {
            throw new Error('Errore durante l\'aggiunta del prodotto');
        }

        // Id prodotto ritonato dalla chiamata fetch precedente
        const { _id } = await productResponse.json();

        // Promise.all per aggiungere le varianti al prodotto (per ogni variante)
        const variantsResponses = await Promise.all(product.variants.map(async (variant) => {
            
            //dati della variante
            const varia = {
                colore: variant.colore,
                quantita: variant.quantita,
                productId: _id
            };

            // Viene creata la variante
            const variantResponse = await fetch(`http://localhost:3000/api/products/${_id}/variants`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(varia)
            });

            if (!variantResponse.ok) {
                throw new Error('Errore durante l\'aggiunta di una variante del prodotto');
            }

            const variantData = await variantResponse.json();
            return variantData;
        }));

        // Promise.all per aggiungere le immagini alle varianti (per ogni variante)
        await Promise.all(product.variants.map(async (variant, index) => {
            const formData = new FormData();

            // Vengono recuperati i file e caricati su un formData che poi viene inserito nella chiamata fetch
            formData.append('fileB', variant.immagini[0], variant.immagini[0].name);
            formData.append('fileF', variant.immagini[1], variant.immagini[1].name);
            formData.append('fileS', variant.immagini[2], variant.immagini[2].name);
            formData.append('fileD', variant.immagini[3], variant.immagini[3].name);

            const variantImageResponse = await fetch(`http://localhost:3000/api/products/upload/${_id}/${variant.colore}`, {
                method: 'POST',
                body: formData
            });

            if (!variantImageResponse.ok) {
                throw new Error('Errore durante l\'aggiunta delle immagini della variante del prodotto');
            }
        }));

        // Promise.all per aggiungere le immagini del Prodotto (Immagini per la pagina prodotto uguali per ogni variante)
        await Promise.all([
            (async () => {
                const formData = new FormData();
        
                // Vengono recuperati i file e caricati su un formData che poi viene inserito nella chiamata fetch
                //formData.append('file1', ImmagineBg, ImmagineBg.name);
                //formData.append('file2', ImmagineBg2, ImmagineBg2.name);
                    // Fetch the first image and append it as a Blob
                const response1 = await fetch(ImmagineBg);
                const blob1 = await response1.blob();
                formData.append('file1', blob1, 'BgProd3.png');

                // Fetch the second image and append it as a Blob
                const response2 = await fetch(ImmagineBg2);
                const blob2 = await response2.blob();
                formData.append('file2', blob2, 'Bg.png');
                formData.append('fileS', product.immagini[0], product.immagini[0].name);
                formData.append('fileI', product.immagini[1], product.immagini[1].name);
                console.log("Faccio",formData)
                console.log(product)
        
                const variantImageResponse = await fetch(`http://localhost:3000/api/products/uploadPic/${_id}`, {
                    method: 'POST',
                    body: formData
                });
        
                if (!variantImageResponse.ok) {
                    throw new Error('Errore durante l\'aggiunta delle immagini del prodotto');
                }
            })()
        ]);

        return { productId: _id, variantIds: variantsResponses.map(response => response._id) };
    } catch (error) {
        console.error('Si è verificato un errore durante l\'aggiunta del prodotto e delle sue varianti:', error);
        throw error;
    }
}

/* Rimuovi prodotto */

async function deleteProduct(productId) {
    try {
        //Viene chiamata una fetch per eliminare il prodotto attraverso l'Id
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            console.log(`Prodotto con ID ${productId} eliminato con successo.`);
        } else {
            console.error(`Si è verificato un problema durante l'eliminazione del prodotto con ID ${productId}.`);
        }
    } catch (error) {
        console.error('Si è verificato un errore durante la richiesta di eliminazione del prodotto:', error);
    }
}

/* Aggiungi variante */

async function addVariant(productId, variant) {
    try {

        //variante da aggiungere con i rispettivi dati
        const varia = {
            colore: variant.colore,
            quantita: variant.quantita,
            productId: productId
        };

        // Viene aggiunta la variante al prodotto
        const variantResponse = await fetch(`http://localhost:3000/api/products/${productId}/variants`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(varia)
        });

        if (!variantResponse.ok) {
            throw new Error('Errore durante l\'aggiunta della variante al prodotto');
        }

        const variantData = await variantResponse.json();

        // FormData per il caricamento delle immagini della variante
        const formData = new FormData();
        console.log(variant.immaginiVar)
        if (variant.immaginiVar && variant.immaginiVar.length > 0) {
            formData.append('fileB', variant.immaginiVar[0], variant.immaginiVar[0].name);
            formData.append('fileF', variant.immaginiVar[1], variant.immaginiVar[1].name);
            formData.append('fileS', variant.immaginiVar[2], variant.immaginiVar[2].name);
            formData.append('fileD', variant.immaginiVar[3], variant.immaginiVar[3].name);
        } else {
            console.error('Array delle immagini della variante non definito o vuoto');
        }

        // Chiamata api per aggiungere le immagini alla variante
        const variantImageResponse = await fetch(`http://localhost:3000/api/products/upload/${productId}/${variant.colore}`, {
            method: 'POST',
            body: formData
        });

        if (!variantImageResponse.ok) {
            throw new Error('Errore durante l\'aggiunta delle immagini della variante del prodotto');
        }

        return variantData;
    } catch (error) {
        console.error('Si è verificato un errore durante l\'aggiunta della variante al prodotto:', error);
        throw error;
    }
}

/* Rimuovi variante */

async function deleteVariant(productId, variantColor) {
    try {
        //Viene chiamata una fetch per eliminare lavariante attraverso l'Id ed il colore da elimanre
        const response = await fetch(`http://localhost:3000/api/products/${productId}/${variantColor}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log(`Prodotto con ID ${productId} eliminato con successo.`);
        } else {
            console.error(`Si è verificato un problema durante l'eliminazione del prodotto con ID ${productId}.`);
        }
    } catch (error) {
        console.error('Si è verificato un errore durante la richiesta di eliminazione del prodotto:', error);
    }
}

/* Aggiungi accessorio */

async function addAccessory(accessory) {
    try {
        //accessorio da aggiungere con i rispettivi dati
        const prod = {
            "name": accessory.nome,
            "prezzo": Number(accessory.prezzo),
            "description": accessory.descrizione,
            "quantita": accessory.quantita,
        };

        // Viene aggiunta l'accessorio nel database
        const productResponse = await fetch('http://localhost:3000/api/accessories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prod)
        });

        if (!productResponse.ok) {
            throw new Error('Errore durante l\'aggiunta dell\'accessorio');
        }

        // Viene preso accessoryId dalla risposta del backend alla chiamata fetch
        const { accessoryId } = await productResponse.json();
        const formData = new FormData();

        // Viene creato e riempito il formData con le immagini da caricare
        formData.append('image1', accessory.immagini[0], accessory.immagini[0].name);
        formData.append('image2', accessory.immagini[1], accessory.immagini[1].name);
        formData.append('image3', accessory.immagini[2], accessory.immagini[2].name);
        console.log(formData)

        // Vengono caricate le immagini nel backend
        const variantImageResponse = await fetch(`http://localhost:3000/api/accessories/upload/${accessoryId}`, {
            method: 'POST',
            body: formData
        });

        if (!variantImageResponse.ok) {
            throw new Error('Errore durante l\'aggiunta delle immagini dell\'accessorio');
        }
        

        
        return { productId: accessoryId };
    } catch (error) {
        console.error('Si è verificato un errore durante l\'aggiunta dell\'accessorio:', error);
        throw error;
    }
}

/* Rimuovi accessorio */

async function deleteAccessory(accessoryId) {
    try {

        //Viene chiamata una fetch per eliminare l\'accessorio attraverso accessoryId
        const response = await fetch(`http://localhost:3000/api/accessories/${accessoryId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log(`Prodotto con ID ${accessoryId} eliminato con successo.`);
        } else {
            console.error(`Si è verificato un problema durante l'eliminazione del prodotto con ID ${accessoryId}.`);
        }
    } catch (error) {
        console.error('Si è verificato un errore durante la richiesta di eliminazione del prodotto:', error);
    }
}
