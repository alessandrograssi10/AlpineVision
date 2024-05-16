import React, { useState, useEffect } from 'react';
import { Image,Container, Row, Col,Card } from 'react-bootstrap';
import ImmagineBg from '../../assets/Images/BgProd3.png';
import { Link ,useNavigate} from 'react-router-dom';
import heart from '../../assets/Images/heart-3.png';
import filledHeart from '../../assets/Images/heart-full.png';

export const Accessories = () => {
  let navigate = useNavigate();
    const userId = localStorage.getItem('userId');
    const [accessories, setAccessories] = useState([]); // accessori
    const [imageUrlsp, setImageUrlsp] = useState({}); // immagini frontali
    const [imageUrlspLat, setImageUrlspLat] = useState({}); // immagini laterali
    const [hoverIndex, setHoverIndex] = useState(null); //elemento selezionato
    const [Favorite, setFavorite] = useState([]); // stato per i preferiti
    const [animateFav, setAnimateFav] = useState({});


  // useEffect per l'animazione dei cuori (Prodotti preferiti)
  useEffect(() => {
      const timers = Object.keys(animateFav).map(id => {
          if (animateFav[id]) {
              return setTimeout(() => {
                  setAnimateFav(prev => ({ ...prev, [id]: false }));
              }, 200); 
          }
          return null;
      });
      return () => timers.forEach(timer => clearTimeout(timer));
  }, [animateFav]);

  // useEffect per prendere gli elementi preferiti dal database
  useEffect(() => {
    if (userId) {
        // Effettua la richiesta fetch
        fetch(`http://localhost:3000/api/favourites/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore nella richiesta fetch');
                }
                return response.json();
            })
            .then(data => {

                // Aggiorna lo stato dei preferiti
                const favoriteIds = data.favourites.map(item => item.productId);
                setFavorite(favoriteIds);
            })
            .catch(error => {
                console.error('Si è verificato un errore:', error);
            });
    } /*else {
        // Prendi i valori dal localStorage
        const localFavorite = JSON.parse(localStorage.getItem("Favorite") || "[]");
        setFavorite(localFavorite);
    }*/
}, [userId]);
    // Vengono recupeate le informazioni degli accessori dal backend
    useEffect(() => {
      fetch(`http://localhost:3000/api/accessories`)
        .then(response => {if (!response.ok) {throw new Error('errore');}return response.json();})
        .then(data => {
          if(data){
              setAccessories(data);
          }          
          // Crea un array di promises per ottenere le immagini tutte insieme
          const promises = data.map(product => getImageById(product._id));
          
          // Attendere che tutte le promises vengano eseguite
          Promise.all(promises)
            .then(imageUrls => {

              // Variabili con ID prodotto come chiave e URL immagine come valore
              const urls = {};
              const urlsLat = {};

              // Si assegnano i valori alle variabili
              data.forEach((product, index) => {
                urls[product._id] = imageUrls[index][0];
                urlsLat[product._id] = imageUrls[index][1];
              });
              setImageUrlsp(urls);
              setImageUrlspLat(urlsLat);
            })
            .catch(error => console.error("Errore nel recupero delle immagini", error));
        })
        .catch(error => console.error("Errore nel recupero degli accessori", error));
    }, []);

    async function handleClickFavorite (prodotto, evento)  {
      evento.preventDefault();
      evento.stopPropagation();
      setAnimateFav(prev => ({ ...prev, [prodotto._id]: true }));
      if(!userId)
      {
          navigate(`/login`);
          return;
      }
      if(Favorite.includes(prodotto._id)) {
             
          if(userId)
              {
                  try {
                      const response = await fetch("http://localhost:3000/api/favourites/remove", {
                          method: 'DELETE',
                          headers: {
                              'Content-Type': 'application/json'
                          },
                          body: JSON.stringify({
                              userId: userId,
                              productId: prodotto._id,
                              type: "accessory",
                          })
      
                      });
                  }
                  catch (error) { console.error('Errore:', error); }
              }
              setFavorite(prevFavorites => prevFavorites.filter(id => id !== prodotto._id));

             /* let index = Favorite.indexOf(prodotto._id);
              if (index > -1) {
                  Favorite.splice(index, 1);
              }*/
              if(!userId)localStorage.setItem("Favorite",JSON.stringify(Favorite));

          }
          else{
              if(userId)
                  {
                      try {
                          const response = await fetch("http://localhost:3000/api/favourites/add", {
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({
                                  userId: userId,
                                  productId: prodotto._id,
                                  type: "accessory",
                              })
          
                          });
                      }
                      catch (error) { console.error('Errore:', error); }
                  }
              
              //Favorite.push(prodotto._id);
              setFavorite(prevFavorites => [...prevFavorites, prodotto._id]);

              if(!userId) localStorage.setItem("Favorite",JSON.stringify(Favorite));
          }
  }

    // Recupera l'immagini tramite l'id
    const getImageById = async (id) => {
      try {
          const imageUrl = `http://localhost:3000/api/accessories/${id}/image1`;
          const imageUrl2 = `http://localhost:3000/api/accessories/${id}/image2`;
          return [imageUrl,imageUrl2];
      } catch (error) {
          console.error("Errore nel recupero degli accessori", error);
          return ''; 
      }
  };

  return (
    <Container fluid className="p-0 ml-0 mr-0 no-space-row">
      <Row className="m-0 p-0 w-100 h-100 no-space-rowBg">
        <Image src={ImmagineBg} className="p-0 img-fluid w-100 darkness darkness" />
        <div className="centered-text">Scopri il tuo stile</div>
      </Row>
      <Row className="ml-0 mr-0 no-space-row mt-3">
        <h3 className="m-4 mb-1 boldText">Accessori</h3>
        <h5 className="m-4 mt-1 mb-2 notbold">Stile Unico</h5>
      </Row>
      <Row className='mt-4 mb-5'>
        {accessories.map((prodotto) => {
          return (
            <Col xs={12} sm={6} md={4} lg={3} key={prodotto._id}>
              <Card as={Link} to={`/accessory/${prodotto._id}`} className='m-3 card-text-prod card-prod card-prod-prod-ca ' onMouseEnter={() => setHoverIndex(prodotto._id)} onMouseLeave={() => setHoverIndex(null)}>
                
                {/* Immagine dell accessorio */}

                <div className="card-image-container">
                  <Card.Img
                    key={`${prodotto._id}-front`}
                    className={`card-image-fit-prod ${hoverIndex === prodotto._id ? '' : 'card-image-visible'}`}
                    src={imageUrlsp[prodotto._id]}
                  />
                  <Card.Img
                    key={`${prodotto._id}-lat`}
                    className={`card-image-fit-prod ${hoverIndex === prodotto._id ? 'card-image-visible' : ''}`}
                    src={imageUrlspLat[prodotto._id]}
                  />
                </div>
                
                {/* Dettagli dell accessorio */}

                <Card.Body>
                  <Card.Title>{prodotto.name}</Card.Title>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Card.Text>{prodotto.prezzo} €</Card.Text>
                    <Image className={`heart ${animateFav[prodotto._id] ? 'animate' : ''}`}  key={`${prodotto._id}-${Favorite.includes(prodotto._id) ? 'filledHeart' : 'heart'}`}   onClick={(e) => {handleClickFavorite(prodotto,e)}} src={Favorite.includes(prodotto._id) ? filledHeart : heart} style={{ width: '25px', height: '25px' }} alt="Descrizione Immagine" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};
