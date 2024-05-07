
const requestOptions = {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
};

export async function GetInfo(element) {
    const idProd = (element.type === "product");
    var info;

    if (idProd) {
        info = await getInfoProduct(element);
    } else {
        info = await getInfoAccessory(element);
    }

    info.quantita = element.quantity;
    info.totale = element.total;

    return info;
}

async function getInfoAccessory(element) {
    let info = {};  // Usa un oggetto invece di un array
    try {
        const response = await fetch("http://localhost:3000/api/accessories", requestOptions);
        const accessories = await response.json();
        const accessorio = accessories.find(acc => acc._id === element.productId);
        info.nome = accessorio.name;
        info.colore = null;  
        info.immagine = `http://localhost:3000/api/accessories/${accessorio._id}/image1`;
    } catch (error) {
        console.error(error);
    }

    return info;
}

async function getInfoProduct(element) {
    let info = {};  // Usa un oggetto invece di un array
    try {
        const response = await fetch("http://localhost:3000/api/products", requestOptions);
        const products = await response.json();
        const prodotto = products.find(prod => prod._id === element.productId);
        info.nome = prodotto.nome;
        info.colore = element.color;
        info.immagine = `http://localhost:3000/api/products/${prodotto._id}/${element.color}/frontale`;
    } catch (error) {
        console.error(error);
    }

    return info;
}
