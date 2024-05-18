import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image, Form, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getUserRole } from '../../../assets/Scripts/GetUserInfo.js';

export const BlogArticleEdit = () => {
  const { id } = useParams(); //prendo l'id dall'url
  localStorage.setItem("prevPage","Edit"); //setto che sono nella pagina editing
  const [ruolo, setRuolo] = useState(null);

  // Se esistono prendo gli elementi dall'localstorage senno prendo un elemneto vuoto per le seguenti variabili
  const [blogPosts, setBlogPosts] = useState(() => {const savedPosts = sessionStorage.getItem('blogPosts');return savedPosts ? JSON.parse(savedPosts) : [];}); 
  const [Images, setImages] = useState(() => {const savedImages = sessionStorage.getItem('blogImages');return savedImages ? JSON.parse(savedImages) : [];});
  const [blogPostsVerify, setBlogPostsVerify] = useState(() => {const savedVerify = sessionStorage.getItem('blogPostsVerify');return savedVerify ? JSON.parse(savedVerify) : false;});
  
  const [post, setPost] = useState(null); // Variabile per i dati del post

  // Vai alla home se non sei admin
  useEffect(() => {
    if(!localStorage.getItem('userId')){ window.location.href = '/home'; }
    (async () => {
      try {
        const fetchedRole = await getUserRole();
        if(!fetchedRole) setRuolo("user");
        else setRuolo(fetchedRole);
        if(fetchedRole !== "admin" && fetchedRole !== "editor-blog"){ window.location.href = '/home'; }
      } catch (error) {
        console.error('Errore durante il recupero del ruolo:', error);
        setRuolo("user");
      }
    })();
  }, []);

  // Recupero l'immagine copertina tramite l'Id
  const getImageByIdCop = (id) => {
    return `http://localhost:3000/api/posts/photo-copertina?id=${id}`;
  };

  // Recupero l'immagine copertina tramite l'Id
  const getImageById = (id) => {
    const image = Images.find(image => image.id === id);
    return image ? image.contenuto : 'Immagine non trovata';
  };

  // Prendo le informazioni del post corrente cercando tra tutti i post
  useEffect(() => {
    console.log(`Caricamento dei dettagli del il post`);
    const foundPost = blogPosts.find(p => p._id.toString() === id.toString());
    if (foundPost) {
      console.log('Post ricevuto:', foundPost);
      setPost(foundPost);
    } else {
      console.error("Errore: Post non trovato");
    }
  }, [id, blogPosts]);

  /*
  useEffect(() => {
    sessionStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    sessionStorage.setItem('blogImages', JSON.stringify(Images));
  }, [Images]);

  useEffect(() => {
    sessionStorage.setItem('blogPostsVerify', JSON.stringify(blogPostsVerify));
  }, [blogPostsVerify]);*/

  // Salvo le variabili nel localstorage quando vengono cambiate
  useEffect(() => {
    sessionStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    sessionStorage.setItem('blogImages', JSON.stringify(Images));
    sessionStorage.setItem('blogPostsVerify', JSON.stringify(blogPostsVerify));
  }, [blogPosts, Images, blogPostsVerify]);


  // Caricamento dell'immagine da file
  const handleFileChange = (event) => {
    setBlogPostsVerify(true);

    const file = event.target.files[0];
    if (file) {
      const newUrl = URL.createObjectURL(file).toString();
      updateImageUrlById(id, newUrl, file);
    }
  };

  // Carico l'immagine caricata sulla variabile generale delle immagini
  const updateImageUrlById = (id, newUrl, file) => {
    const updatedImages = Images.map(image => {
      if (image.id === id) {
        return { ...image, 'contenuto': newUrl, 'contenutoFile': file };
      }
      return image;
    });
    setImages(updatedImages);
  };

  
  // Funzione per gestire il cambiamento dei campi del post
  const handleChange = (event, path) => {
    if (!post) return;

    setBlogPostsVerify(true); // Variabile per tenere conto che c'è stata una modifica

    setPost(currentPost => {
      const newPost = JSON.parse(JSON.stringify(currentPost));

      // Funzione per impostare il valore nel percorso all'interno di un oggetto nidificato
      function setNested(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const lastObj = keys.reduce((obj, key) =>
          obj[key] = obj[key] || {},
          obj);
        lastObj[lastKey] = value;
      }

      // Imposta il nuovo valore nel percorso
      setNested(newPost, path, event.target.value);
      return newPost;
    });
  };

  // Funzione per salvare il post
  const handleSavePost = () => {
    const index = blogPosts.findIndex(p => p._id === post._id);
    const updatedPosts = [
      ...blogPosts.slice(0, index),
      post,
      ...blogPosts.slice(index + 1)
    ];
    setBlogPosts(updatedPosts);
  };

  // Se non c'è nessun post, mostra un messaggio di caricamento
  if (!post) {
    return <div>Caricamento...</div>;
  }

  if (ruolo !== "admin" && ruolo !== "editor-blog") {
    return null;
  } else return (
    <Container fluid className="m-0 p-0">
     
      {/* Avviso per la modalità di modifica */}
      <Alert variant={'warning'} className='m-2 mt-4'>
        SEI IN EDIT MODE!!!!!
      </Alert>
      {/* Avviso per salvare le modifiche */}
      <Alert variant={'danger'} className='m-2 mt-4'>
      TUTTE LE MODIFICHE DEVONO ESSERE SALVATE NELL'AREA BLOG!!!!!      </Alert>
      {/* Pulsante per tornare all'area editor */}
      <Button as={Link} to={`/BlogEdit`} onClick={() => handleSavePost()} className="mt-3 mx-2 button-green-prod" variant="outline-success">
        Torna Area Editor
      </Button>
      <Row className="m-0  mt-4 p-0 h-10 no-space-rowBg img-cop-blog">
        <Image
          src={getImageByIdCop(post._id)}
          className="img-cop-blog p-0 img-fluid-no-space h-10 darkness"
        />
        <div className="centered-text">
          <h1>{post.title}</h1>
        </div>
      </Row>

      {/* Titolo del post */}
      <Row className="my-2 mt-4 justify-content-center m-3">
        <Col lg={12} className="text-center">
          <h1>
            <Form.Group className="mb-3">
              <Form.Control type="text" value={post?.title} placeholder="Title" onChange={(event) => handleChange(event, 'title')} onBlur={handleSavePost} />
            </Form.Group>
          </h1>
        </Col>
      </Row>
      
      {/* Parte 1 del contenuto */}

      <Row className="my-2 mt-4 justify-content-center m-3">
        <Form.Group className="mb-3">
          <Form.Control as="textarea" rows={3} type="text" value={post.content.part1} placeholder="Parte 1" onChange={(event) => handleChange(event, 'content.part1')} onBlur={handleSavePost} />
        </Form.Group>
      </Row>

      {/* Immagine e caricamento di file */}

      <Row className="my-2 justify-content-center">
            {post && (
              <>
                <Image
                  key={post._id}
                  src={getImageById(id)}
                  fluid
                  className="mb-3 img-maxH"
                />
                <input
                  type="file"
                  onChange={(event) => handleFileChange(event, id)}
                  style={{ display: 'none' }}
                  accept="image/*"
                  id={`file-input-contenuto-${id}`}
                />
                <Button
                  style={{
                    position: 'relative',
                    top: '-50px',
                    left: '0',
                    zIndex: 5,
                    
                    width: '10%', 

                  }}
                  onClick={() => document.getElementById(`file-input-contenuto-${id}`).click()}
                  variant="primary"
                  className='m-3'
                >
                  Upload
                </Button>
              </>
            )}
          
        
        {/* Parte 2 del contenuto */}

        <Col lg={12} >
          <Row className='m-3'>
            <h3>
              <Form.Group className="mb-3">
                <Form.Control type="text" value={post.content.part2.title} placeholder="Parte 2 Title" onChange={(event) => handleChange(event, 'content.part2.title')} onBlur={handleSavePost} />
              </Form.Group>
            </h3>
          </Row>
          <Row className='m-3'>
            <p className="text-muted">
              <Form.Group className="mb-3">
                <Form.Control type="text" as="textarea" rows={12} value={post.content.part2.body} placeholder="Parte 2" onChange={(event) => handleChange(event, 'content.part2.body')} onBlur={handleSavePost} />
              </Form.Group>
            </p>
          </Row>
        </Col>
      </Row >

      {/* Parte 3 del contenuto */}

      <Row className="my-2 justify-content-center m-3" >
        <Col lg={12}>
          <Row>
            <h3 className=' text-left mt-3'>
              <Form.Group className="mb-3">
                <Form.Control type="text" value={post.content.part3.title} placeholder="Parte 3 Title" onChange={(event) => handleChange(event, 'content.part3.title')} onBlur={handleSavePost} />
              </Form.Group>
            </h3>
          </Row>
          <Row>
            <p className="text-muted">
              <Form.Group className="mb-3">
                <Form.Control type="text" as="textarea" rows={7} value={post.content.part3.body} placeholder="Parte 3" onChange={(event) => handleChange(event, 'content.part3.body')} onBlur={handleSavePost} />
              </Form.Group>
            </p>
          </Row>
        </Col>
      </Row>

      {/* Data di pubblicazione */}

      <Row className="my-2 mt-4 justify-content-center">
        <p className="text-muted text-center"> {post?.date ? `Pubblicato il ${new Date(post.date).toLocaleDateString()}` : 'Data non disponibile'}</p>
      </Row>
      
      {/* Pulsante per tornare all'area editor */}

      <Row className="my-2 justify-content-center">
        <Col lg={6} className="d-flex justify-content-center mb-3">
          <Button as={Link} to={`/BlogEdit`} variant="outline-success" className="mt-3 button-green-prod">Torna area editor</Button>
        </Col>
      </Row>
    </Container>
  );
};
