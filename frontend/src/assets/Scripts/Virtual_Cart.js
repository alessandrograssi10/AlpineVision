// Logica carello nel localstorage (utenti non loggati)

// Aggiungi elemento al carrello
export function addToVirtualCart(element, color) {
    var cart = JSON.parse(localStorage.getItem("virtualCart") || "[]"); // Info sul carrello dal localstorage
    console.log("ID", element._id);

    // Cerca se l'elemento esiste già nel carrello in base al productId e al colore
    var existingItem = cart.find(item => item.productId === element._id && item.color === color);

    // Se l'elemento esiste già, aggiorna la quantità e il totale
    // Se l'elemento non esiste, crea un nuovo oggetto e aggiungilo al carrello
    if (existingItem) {
        existingItem.quantity += 1;
        existingItem.total = element.prezzo * existingItem.quantity;
    } else {
        var newItem = addInfo(element, color);
        cart.push(newItem);
    }

    localStorage.setItem("virtualCart", JSON.stringify(cart)); // Salvo
}

// Crea un nuovo elemento del carrello con tutte le informazioni
function addInfo(element, color) {

    var type = color ? "product" : "accessry";

    var info = {
        productId: element._id,
        color: color,
        quantity: 1,
        total: Number(element.prezzo),
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
        let newTotale = ((existingItem.total/existingItem.quantity) * qnt).toFixed(2);
        console.log(newTotale);
        existingItem.quantity = qnt;
        existingItem.total = Number(newTotale);
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