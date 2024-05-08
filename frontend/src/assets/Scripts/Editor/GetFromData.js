
export async function GetAllProducts() {
    try {
        const response = await fetch(`http://localhost:3000/api/products`);
        if (!response.ok) {
            throw new Error('Errore nella richiesta dei prodotti');
        }
        const data = await response.json();

        // Funzione per ottenere le immagini del prodotto (frontale e laterale)
        const getImageUrls = async (product) => {
            try {
                const response = await fetch(`http://localhost:3000/api/products/${product._id}/variants`);
                if (!response.ok) {
                    throw new Error('Errore durante la richiesta');
                }
                const data2 = await response.json();
        
                // Verifica che data2 contenga almeno un elemento
                if (data2.length > 0) {
                    const colore = data2[0].colore;
                    const frontRes = await fetch(`http://localhost:3000/api/products/${product._id}/${colore}/frontale`);
                    const sideRes = await fetch(`http://localhost:3000/api/products/${product._id}/${colore}/sinistra`);
                    const frontUrl = frontRes.ok ? await frontRes.url : '';
                    const sideUrl = sideRes.ok ? await sideRes.url : '';
                    const color = colore;
                    const variants = data2;
                    const categoria = product.categoria;

        
                    return { frontUrl, sideUrl, color, variants };
                } else {
                    console.error("No variants found for product", product._id);
                    return { frontUrl: '', sideUrl: '', color: '', variants: [] };
                }
            } catch (error) {
                console.error("Error fetching images for product", product._id, error);
                return { frontUrl: '', sideUrl: '', color: '', variants: [] };
            }
        };
        

        // Ottieni le immagini per tutti i prodotti
        const imageFetchPromises = data.map(product => getImageUrls(product));
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
            if(element.categoria === "occiale" || element.categoria === "maschera" ) await addProduct(element);
            else await addAccessory(element);
            console.log("Aggingo...")
        }
    }));

    
    await Promise.all(allElements.map(async element => {
        if(element.categoria === "occiale" || element.categoria === "maschera" ){
        // Trova l'elemento originale corrispondente
        const originalElement = originalElements.find(originalElement => originalElement._id === element._id);
    
        // Se non ci sono elementi originali o le varianti sono state modificate
        if (!originalElement || JSON.stringify(element.variants) !== JSON.stringify(originalElement.variants)) {
            // Se l'elemento è nuovo, aggiungilo all'archivio
        
    
            // Controlla le varianti del prodotto e aggiungi o elimina le varianti necessarie
            if (!addedOrModifiedElements.some(e => e._id === element._id)) {
             await handleVariants(element, originalElements);
        }
            //await handleVariants(element, originalElements);
        }
    }
    }));
    

    // Rimuovi i prodotti dall'archivio
    await Promise.all(removedElements.map(async element => {
        if(element.categoria === "occiale" || element.categoria === "maschera" ) await deleteProduct(element._id);
        else await deleteAccessory(element._id);
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
        console.log("VAR",addedOrModifiedVariants)
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
            await deleteVariant(product._id, variant.colore);
        }));
    }
}




async function addProduct(product) {
    try {
        const prod = {
            nome: product.nome,
            prezzo: Number(product.prezzo),
            descrizione: product.descrizione,
            categoria: product.categoria
        };

        // Step 1: Aggiungi il prodotto principale
        const productResponse = await fetch('http://localhost:3000/api/products/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prod)
        });

        if (!productResponse.ok) {
            throw new Error('Errore durante l\'aggiunta del prodotto principale');
        }

        const { _id } = await productResponse.json();

        // Step 2: Aggiungi le varianti del prodotto
        const variantsResponses = await Promise.all(product.variants.map(async (variant) => {
            const varia = {
                colore: variant.colore,
                quantita: variant.quantita,
                productId: _id
            };

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
            console.log(_id)

            return variantData; // Ritorna i dati della variante
        }));

        // Step 3: Invia le immagini per le varianti del prodotto
        await Promise.all(product.variants.map(async (variant, index) => {
            const formData = new FormData();

            formData.append('fileB', variant.immagini[0], variant.immagini[0].name);
            formData.append('fileF', variant.immagini[1], variant.immagini[1].name);
            formData.append('fileS', variant.immagini[2], variant.immagini[2].name);
            formData.append('fileD', variant.immagini[3], variant.immagini[3].name);
            console.log(formData)
            console.log(variant)
            console.log(variant.colore)

            const variantImageResponse = await fetch(`http://localhost:3000/api/products/upload/${_id}/${variant.colore}`, {
                method: 'POST',
                body: formData
            });

            if (!variantImageResponse.ok) {
                throw new Error('Errore durante l\'aggiunta delle immagini della variante del prodotto');
            }
        }));

        //
        // Step 4: Invia le immagini per le varianti del prodotto
        await Promise.all([
            (async () => {
                const formData = new FormData();
        
                formData.append('file1', product.immagini[0], product.immagini[0].name);
                formData.append('file2', product.immagini[1], product.immagini[1].name);
                formData.append('fileS', product.immagini[2], product.immagini[2].name);
                formData.append('fileI', product.immagini[3], product.immagini[3].name);
                console.log("Faccio",formData)
                console.log(product)
        
                const variantImageResponse = await fetch(`http://localhost:3000/api/products/uploadPic/${_id}`, {
                    method: 'POST',
                    body: formData
                });
        
                if (!variantImageResponse.ok) {
                    throw new Error('Errore durante l\'aggiunta delle immagini della variante del prodotto');
                }
            })()
        ]);


        // Restituisci l'ID del prodotto principale e gli ID delle varianti aggiunte
        return { productId: _id, variantIds: variantsResponses.map(response => response._id) };
    } catch (error) {
        console.error('Si è verificato un errore durante l\'aggiunta del prodotto con le varianti:', error);
        throw error;
    }
}





// Funzione per eliminare un prodotto
async function deleteProduct(productId) {
    try {
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


// Funzione per aggiungere una variante a un prodotto
// Funzione per aggiungere una variante a un prodotto
async function addVariant(productId, variant) {
    try {
        const varia = {
            colore: variant.colore,
            quantita: variant.quantita,
            productId: productId
        };

        // Aggiungi la variante al prodotto
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
        console.log('Variante aggiunta con successo:', variantData);

        // Carica le immagini per la variante
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

        const variantImageResponse = await fetch(`http://localhost:3000/api/products/upload/${productId}/${variant.colore}`, {
            method: 'POST',
            body: formData
        });

        if (!variantImageResponse.ok) {
            throw new Error('Errore durante l\'aggiunta delle immagini della variante del prodotto');
        }

        // Restituisci i dati della variante aggiunta
        return variantData;
    } catch (error) {
        console.error('Si è verificato un errore durante l\'aggiunta della variante al prodotto:', error);
        throw error;
    }
}



// Funzione per eliminare una variante di un prodotto
async function deleteVariant(productId, variantColor) {
    //
    console.log("DELETE VARIANT")
    try {
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
    }}

async function addAccessory(product) {
    console.log("addAccessory",product)

    try {
        const prod = {
            "name": product.nome,
            "prezzo": Number(product.prezzo),
            "description": product.descrizione,
        };

        const productResponse = await fetch('http://localhost:3000/api/accessories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(prod)
        });

        if (!productResponse.ok) {
            throw new Error('Errore durante l\'aggiunta del prodotto principale');
        }

        //const aloa = await productResponse.json();
        const { accessoryId } = await productResponse.json();
        console.log("addAccessory Finito",accessoryId)

        
            const formData = new FormData();
            console.log("Puerco",product.immagini)
            console.log("Puerco",accessoryId)

            formData.append('image1', product.immagini[0], product.immagini[0].name);
            formData.append('image2', product.immagini[1], product.immagini[1].name);
            formData.append('image3', product.immagini[2], product.immagini[2].name);
            console.log(formData)

            const variantImageResponse = await fetch(`http://localhost:3000/api/accessories/upload/${accessoryId}`, {
                method: 'POST',
                body: formData
            });

            if (!variantImageResponse.ok) {
                throw new Error('Errore durante l\'aggiunta delle immagini della variante del prodotto');
            }
        

        
        return { productId: accessoryId };
    } catch (error) {
        console.error('Si è verificato un errore durante l\'aggiunta del prodotto con le varianti:', error);
        throw error;
    }
}

async function deleteAccessory(productId) {
    try {
        const response = await fetch(`http://localhost:3000/api/accessories/${productId}`, {
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