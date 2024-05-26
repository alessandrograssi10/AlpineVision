# 🏂❄️AlpineVision-LTW PROJECT🏂❄️

AlpineVision is a project for creating a modern online ski goggles store undertaken by our team of four enthusiasts. Our goal was to create an engaging and visually stunning website that caters to skiing enthusiasts looking for high-quality ski goggles. Utilizing frontend and backend technologies including HTML, CSS, React, Node.js, and Bootstrap, we aimed to offer a unique and engaging online shopping experience.

Below is a description of the folders that make up the source code:

The Alpine Vision folder consists of two main folders: backend and frontend.

## Backend

The backend handles the server-side management of the application. This part includes files and configurations that enable interaction between the application, the database, and the frontend via API calls. The backend is structured into the following subfolders:

### Config

This folder configures the database using MongoDB hosted online through MongoDB Atlas. Here, the collections are defined for:

- Products
- Accessories
- Blog articles
- Users
- Carts
- Orders
- Favorite products

### Images

Contains images related to:

- Products
- Accessories
- Blog articles

### Models

Includes the main functions to retrieve or model the elements in the various collections of the database.

### Routes

Encompasses the various endpoints available for the frontend application, allowing CRUD (Create, Read, Update, Delete) operations on the collection products.

## Frontend

The frontend handles the client-side of the application, with the following structure:

### Public

Contains public elements including the logos used within the store and the main index.html page.

### Src

Contains the folders "assets," "components," "pages," and other files necessary for the application's operation.

- **Assets:** Contains images and videos present on the site's pages, as well as scripts containing only JavaScript functions called within the page code (e.g., product editing functions) that regulate the correct functioning of the application.
- **Components:** Contains the header and footer of the store, elements present on all pages.
- **Pages:** Contains all the pages that structure the store, with the respective .jsx and .css files.

In addition to the previous folders, there are the files App.css, which encompasses the common aesthetic features for all pages, and App.js, which allows the dynamic display of the store by rendering the pages through appropriate routes (inserted via the "react-router-dom" library). The entire application is rendered by inserting the App.js component within index.js (which in turn handles the "transfer" of the code into index.html).

## Testing the Store

To test the store, the procedure to follow is as follows:
1. Clone the repository to your local device.
2. Open the folder of files, preferably using an editor like Visual Studio Code.
3. Start the backend from the respective folder by running the command "node server.js" in the terminal.
4. Start the frontend from the respective folder by running the commands "npm install react-scripts" and "npm start" in the terminal.
