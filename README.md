# 🏂❄️AlpineVision-LTW PROJECT🏂❄️


AlpineVision è un progetto di creazione di un moderno negozio online di maschere da sci intrapreso dal nostro team di 4 appassionati. Il nostro obiettivo è stato creare un sito web coinvolgente e visivamente sorprendente che si rivolga agli appassionati di sci in cerca di maschere da sci di alta qualità. Sfruttando tecnologie frontend e backend tra cui HTML, CSS, React, Node.js, Bootstrap, abbiamo cercato di offrire un'esperienza di shopping online unica e coinvolgente.

Nel seguito viene fornita una descrizione delle cartelle che compongono il codice sorgente:

La cartella Alpine Vision è composta da due cartelle principali: backend e frontend.

Nella cartella backend viene gestito il lato server dell'applicazione, all'interno della quale sono presenti i file FILE BACKEND.

Nella cartella frontend viene gestito il lato client dell'applicazione, con la seguente suddivisione:

1) public: contiene elementi pubblici tra cui i loghi utilizzati all'interno dello store e la pagina principale index.html 


2) src: contiene le cartelle "assets", "components" , "pages" e altri file necessari per il funzionamento dell'applicazione.

   Assets: contiene immagini e video presenti all'interno delle pagine del sito, ma anche script contenenti soltanto funzioni javascript richiamate nel codice delle pagine(ad es. le funzioni per l'editing dei prodotti), che regolano il corretto funzionamento dell'applicazione.
   
   Components: contiene l'header ed il footer dello store, elementi presenti in tutte le pagine.
   
   Pages: contiene tutte le pagine che strutturano lo store, con relativo file .jsx e .css.
   
   Oltre alle precedenti cartelle sono presenti i file App.css che racchiude le caratteristiche estetiche comuni a tutte le pagine e App.js che permette la visualizzazione dinamica dello store renderizzando le pagine tramite opportune routes(inserite tramite la libreria "react-router-dom"). Tutta l'applicazione viene renderizzata inserendo il componente App.js all'interno di index.js (il quale a sua volta si occupa del "trasferimento" del codice in index.html)



È possibile visualizzare il progetto nella sua interezza(comprendente di immagini e librerie) nella seguente repository github: https://github.com/tequilasunrisecoder/AlpineVision

Nel caso si volesse testare lo store, la procedura da seguire e' la seguente:
1)Clonare la repository nel proprio dispositivo locale;
2)Aprire, possibilmente, la cartella di file mediante un editor come Visual Studio Code;
3)Avviare il backend dall'omonima cartella mediante il comando "Node server.js" , inserito da terminale;
4)Avviare il frontend dall'omonima cartella mediante i comandi " npm install react-scripts" e "npm start" , inseriti da terminale.
