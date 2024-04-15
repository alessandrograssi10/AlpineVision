
const apiBaseUrl = 'http://localhost:3000/api/products'; // vediamo se va bene


async function fetchApi(endpoint, options = {}) {
    const response = await fetch(`${baseUrl}/${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return response.json();
  }

// Products
export async function createProduct(productData) {
    return fetchApi('products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  }
  
  export async function getProducts() {
    return fetchApi('products');
  }
  
  export async function getProductById(productId) {
    return fetchApi(`products/${productId}`);
  }
  
  export async function updateProduct(productId, updateData) {
    return fetchApi(`products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }
  
  export async function deleteProduct(productId) {
    return fetchApi(`products/${productId}`, {
      method: 'DELETE',
    });
  }
  
  // Users
  export async function createUser(userData) {
    return fetchApi('users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }
  
  export async function getUsers() {
    return fetchApi('users');
  }
  
  export async function getUserById(userId) {
    return fetchApi(`users/${userId}`);
  }
  
  export async function updateUser(userId, updateData) {
    return fetchApi(`users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }
  
  export async function deleteUser(userId) {
    return fetchApi(`users/${userId}`, {
      method: 'DELETE',
    });
  }
  
  // Orders
  export async function createOrder(orderData) {
    return fetchApi('orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }
  
  export async function getOrders() {
    return fetchApi('orders');
  }
  
  export async function getOrderById(orderId) {
    return fetchApi(`orders/${orderId}`);
  }
  
  export async function updateOrder(orderId, updateData) {
    return fetchApi(`orders/${orderId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  }
  
  export async function deleteOrder(orderId) {
    return fetchApi(`orders/${orderId}`, {
      method: 'DELETE',
    });
  }