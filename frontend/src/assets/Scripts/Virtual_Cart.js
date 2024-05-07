
/*
export function addToVirtualCart(element, color) {
    var cart = JSON.parse(localStorage.getItem("virtualCart") || "{}");
    console.log("ID",element._id)
    if (cart[element._id + color] && cart[element._id].color === color) {
        cart[element._id + color].quantity += 1;
        cart[element._id + color].total = element.prezzo * cart[element._id].quantity;
    } else {
        cart[element._id + color] = addInfo(element, color);
    }

    localStorage.setItem("virtualCart", JSON.stringify(cart));
}

function addInfo(element, color) {
    var info = {};

    info.productId = element._id;
    info.color = color;
    info.quantity = 1;
    info.total = element.prezzo;

    return info;
}
*/

export function addToVirtualCart(element, color) {
    var cart = JSON.parse(localStorage.getItem("virtualCart") || "[]");
    console.log("ID", element._id);

    // Cerca se l'elemento esiste già nel carrello in base al productId e al colore
    var existingItem = cart.find(item => item.productId === element._id && item.color === color);

    if (existingItem) {
        // Se l'elemento esiste già, aggiorna la quantità e il totale
        existingItem.quantity += 1;
        existingItem.total = element.prezzo * existingItem.quantity;
    } else {
        // Se l'elemento non esiste, crea un nuovo oggetto e aggiungilo al carrello
        var newItem = addInfo(element, color);
        cart.push(newItem);
    }

    localStorage.setItem("virtualCart", JSON.stringify(cart));
}

function addInfo(element, color) {
    // Crea un nuovo oggetto con le informazioni del prodotto
    var type = color ? "product" : "accessory";

    var info = {
        productId: element._id,
        color: color,
        quantity: 1,
        total: element.prezzo,
        type: type

    };

    return info;
}

export function changeCart(elementId, qnt, color) {
    var cart = JSON.parse(localStorage.getItem("virtualCart") || "[]");

    // Cerca se l'elemento esiste già nel carrello in base al productId e al colore
    var existingItem = cart.find(item => item.productId === elementId && item.color === color);

    if (existingItem) {
        // Se l'elemento esiste già, aggiorna la quantità e il totale
        let newTotale = Math.floor(existingItem.total/existingItem.quantity) * qnt;
        existingItem.quantity = qnt;
        existingItem.total = newTotale;
    } else {
        return;
    }

    localStorage.setItem("virtualCart", JSON.stringify(cart));
}

export function deleteFromCart(elementId, color) {
    var cart = JSON.parse(localStorage.getItem("virtualCart") || "[]");

    // Filtra l'array del carrello per rimuovere l'elemento con l'ID e il colore specificati
    cart = cart.filter(item => !(item.productId === elementId && item.color === color));

    localStorage.setItem("virtualCart", JSON.stringify(cart));
}