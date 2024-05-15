
// Impostazione dell'intestazione per richiedere risposte in formato JSON
const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
};

// Funzione per ottenere le informazioni sull'elemento (prodotto o accessorio)
export async function GetInfo(element) {
    const idProd = (element.type === "product"); // Determina se l'elemento è un prodotto o un accessorio in base al tipo
    console.log("elementos", element);
    var info;

    // Se l'elemento è un prodotto, ottieni le informazioni sul prodotto, altrimenti sul accessorio
    if (idProd) {
        info = await getInfoProduct(element);
    } else {
        info = await getInfoAccessory(element);
    }

    // Informazioni aggiuntive come quantità e totale
    info.quantita = element.quantity;
    info.totale = element.total;

    return info; 
}

// Funzione per ottenere le informazioni su un accessorio
async function getInfoAccessory(element) {
    let info = {};
    try {
        // Richiesta GET per ottenere l'elenco degli accessori
        const response = await fetch("http://localhost:3000/api/accessories", requestOptions);
        const accessories = await response.json();
        const accessorio = accessories.find(acc => acc._id === element.productId);  // Trova l'accessorio corrispondente all'ID specificato nell'elemento
        // Assegna le informazioni dell'accessorio all'oggetto "info"
        info.nome = accessorio.name;
        info.productId = element.productId + element.color;
        info.colore = null;  // Gli accessori non hanno colore
        info.immagine = `http://localhost:3000/api/accessories/${accessorio._id}/image1`;  // URL per l'immagine dell'accessorio
    } catch (error) {
        console.error(error);  // Gestisce gli errori e li registra nella console
    }

    return info;
}

// Funzione per ottenere le informazioni su un prodotto
async function getInfoProduct(element) {
    let info = {};
    try {
         // Richiesta GET per ottenere l'elenco dei prodotti
        const response = await fetch("http://localhost:3000/api/products", requestOptions);
        const products = await response.json();
        const prodotto = products.find(prod => prod._id === element.productId);  // Trova il prodotto corrispondente all'ID specificato nell'elemento
        // Assegna le informazioni del prodotto all'oggetto "info"
        info.nome = prodotto.nome;
        info.colore = element.color;  // Assegna il colore
        info.productId = element.productId + element.color;
        info.immagine = `http://localhost:3000/api/products/${prodotto._id}/${element.color}/frontale`; // URL per l'immagine del prodotto
    } catch (error) {
        console.error(error);  // Gestisce gli errori e li registra nella console
    }

    return info; 
}
