
# 🏂❄️AlpineVision-LTW PROJECT🏂❄️

AlpineVision is a project to create a modern online ski goggles store undertaken by our team of 4 enthusiasts. Our goal was to create an engaging and visually stunning website that caters to skiing enthusiasts looking for high-quality ski goggles. Utilizing frontend and backend technologies including HTML, CSS, React, Node.js, and Bootstrap, we aimed to offer a unique and immersive online shopping experience.

Below is a description of the folders that make up the source code:

The Alpine Vision folder is composed of two main folders: backend and frontend.

The backend folder handles the server-side of the application, within which the FILE BACKEND files are present.

The frontend folder handles the client-side of the application, with the following structure:

1) public: contains public elements including the logos used within the store and the main index.html page.

2) src: contains the assets, components, and pages folders, along with other files necessary for the functioning of the application.

   - Assets: contains images and videos present within the site pages, as well as scripts containing only JavaScript functions called in the page code (e.g., product editing functions) that regulate the correct functioning of the application.
   
   - Components: contains the store's header and footer, elements present on all pages.
   
   - Pages: contains all the pages that structure the store, with their respective .jsx and .css files.
   
   In addition to these folders, there are the App.css file, which encompasses common aesthetic characteristics for all pages, and App.js, which enables the dynamic visualization of the store by rendering the pages through appropriate routes (inserted via the "react-router-dom" library) within the eponymous function. The entire application is rendered by inserting the App.js component into index.js (which in turn handles the "transfer" of the code into index.html).

You can view the complete project (including images and libraries) in the following GitHub repository: https://github.com/tequilasunrisecoder/AlpineVision

If you want to test the store, follow these steps:
1) Clone the repository to your local device;
2) Open the folder of files preferably using an editor like Visual Studio Code;
3) Start the backend from its folder using the command "Node server.js" in the terminal;
4) Start the frontend from its folder using the commands "npm install react-scripts" and "npm start".
