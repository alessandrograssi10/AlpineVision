import React, { useEffect, useState,useLayoutEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { fetchBlogPosts, getSessionStorageOrDefault, fetchBlobFromUrl } from './BlogEditLogic';
import { getUserRole } from '../../../assets/Scripts/GetUserInfo.js';


export const BlogEdit = () => {
  const [ruolo, setRuolo] = useState(null);
  /*const [blogPosts, setBlogPosts] = useState(() => getSessionStorageOrDefault('blogPosts', [])); // Elementi*/
  const [blogPosts, setBlogPosts] = useState(() => getSessionStorageOrDefault('blogPosts', [])); // Elementi

  const [blogPostsCopy, setBlogPostsCopy] = useState(() => getSessionStorageOrDefault('blogPostsCopy', [])); //Copia degli elementi
  const [blogPostsVerify, setBlogPostsVerify] = useState(() => getSessionStorageOrDefault('blogPostsVerify', false)); // Variabile per le modifiche
  const [Images, setImages] = useState(() => getSessionStorageOrDefault('blogImages', []));
  const [ImagesCopy, setImagesCopy] = useState(() => getSessionStorageOrDefault('blogImagesCopy', []));
  const [imagesLoaded, setImagesLoaded] = useState(false);
  let firstOpen = false;

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

  useEffect(() => {

      if(!firstOpen){
          firstOpen = true;
      if(localStorage.getItem("prevPage") !== "Edit")
        {
          setBlogPosts([]);
          setBlogPostsCopy([]);
          setImages([]); 
          setImagesLoaded(false); 
          fetchBlogPosts()
        .then(data => {setBlogPosts(data);setBlogPostsCopy(data);})
        .catch(error => console.error("Failed to fetch posts:", error));
        }
        else{
          localStorage.setItem("prevPage","");
        }
      }
  }, [ruolo]);

  useLayoutEffect(() => {
    if (blogPosts.length === 0) {
      fetchBlogPosts()
      .then(data => {setBlogPosts(data);setBlogPostsCopy(data);})
      .catch(error => console.error("Failed to fetch posts:", error));
    }
  }, []); 

  useLayoutEffect(() => {

    if (!Images.length) {

    const setImagesFun = () => {
      const newItems = blogPosts.map((post) => ({
        copertina: `http://localhost:3000/api/posts/photo-copertina?id=${post._id}`,
        copertinaFile: null,
        contenuto: `http://localhost:3000/api/posts/photo-contenuto?id=${post._id}`,
        contenutoFile: null,
        id: post._id
      }));
      setImages(JSON.parse(JSON.stringify(newItems))); 
      setImagesCopy(JSON.parse(JSON.stringify(newItems))); 
    };
    setImagesFun();
  }
  },[blogPosts, imagesLoaded],[imagesLoaded]);
  
  useLayoutEffect(() => {    
    sessionStorage.setItem('blogPostsVerify', JSON.stringify(blogPostsVerify));
    sessionStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    sessionStorage.setItem('blogPostsCopy', JSON.stringify(blogPostsCopy));
    sessionStorage.setItem('blogImages', JSON.stringify(Images));
  }, [blogPostsVerify, blogPosts, blogPostsCopy, Images]); 

  const getImageById = (id) => {
    const image = Images.find(image => image.id === id);
    return image ? image.copertina : 'Nessuna Immagine Trovata';
};
    
const updateImageUrlById = (id, newUrl, file) => {
  const updatedImages = Images.map(image => {
      if (image.id === id) {
          return { ...image, 'copertina': newUrl,'copertinaFile': file};
      }
      return image;
  });
  setImages(updatedImages);
};
  const handleFileChange = (event, position) => {
    setBlogPostsVerify(true);
    const file = event.target.files[0];
    if (file) {
        const newUrl = URL.createObjectURL(file).toString();
        console.log(newUrl);
        updateImageUrlById(blogPosts[position]._id, newUrl,file);
    }
};

  const handleTitleChange = (event, position) => {
    setBlogPostsVerify(true);

    const updatedPosts = [...blogPosts];
    updatedPosts[position].title = event.target.value;
    setBlogPosts(updatedPosts);
  };

  const handleDeleteClick = (position) => {
    setBlogPostsVerify(true);
    const updatedPosts = [...blogPosts];
    updatedPosts.splice(position, 1);
    
    setBlogPosts(updatedPosts);
  };
  const handleMoveUpClick = (position) => {
    setBlogPostsVerify(true);
    if (position > 0 && position < blogPosts.length) {
      const updatedPosts = [...blogPosts];
      [updatedPosts[position], updatedPosts[position - 1]] = [updatedPosts[position - 1], updatedPosts[position]];
      [updatedPosts[position].position, updatedPosts[position - 1].position] = [updatedPosts[position - 1].position, updatedPosts[position].position];
      setBlogPosts(updatedPosts);
    }
  };
  
  const handleMoveDownClick = (position) => {
    setBlogPostsVerify(true);
    if (position >= 0 && position < blogPosts.length - 1) {
      const updatedPosts = [...blogPosts];
      [updatedPosts[position], updatedPosts[position + 1]] = [updatedPosts[position + 1], updatedPosts[position]];
      [updatedPosts[position].position, updatedPosts[position + 1].position] = [updatedPosts[position + 1].position, updatedPosts[position].position];
      setBlogPosts(updatedPosts);
    }
  };

  const handleAddArticleClick = () => {
    setBlogPostsVerify(true);
    const newArticle = {
      _id: Math.random().toString(36).substr(2, 9), 
      title: '', description: '', content: {part1: '',part2: {title: '',body: ''},part3: {title: '',body: ''}}, author: '', 
      date: new Date().toISOString().slice(0, 10),  
      position: 0  
    };

    const updatedPosts = blogPosts.map(post => ({
        ...post,
        position: post.position + 1  
    }));

    setBlogPosts([newArticle, ...updatedPosts]);  

     const newImageEntry = {
      id: newArticle._id,
      copertina: '',
      copertinaFile: null,
      contenuto: '',
      contenutoFile: null
  };
  setImages([...Images, newImageEntry]);
  setBlogPostsVerify(true); 
};


  const handleDeleteChanges = () => {
    setBlogPostsVerify(true);
    setBlogPosts(JSON.parse(JSON.stringify([...blogPostsCopy])));
    setImages(JSON.parse(JSON.stringify([...ImagesCopy])));

    const resetImages = blogPostsCopy.map(post => ({
      copertina: `http://localhost:3000/api/posts/photo-copertina?id=${post._id}`,
      copertinaFile: null,
      contenuto: `http://localhost:3000/api/posts/photo-contenuto?id=${post._id}`,
      contenutoFile: null,
      id: post._id

    }));
    setImages(resetImages);
    setBlogPostsVerify(false);
    console.log("Changes discarded");
};


async function handleSaveChanges() {
  const existingPostIds = new Set(blogPostsCopy.map(post => post._id));
  const currentPostIds = new Set(blogPosts.map(post => post._id));

  let updatePromises = [];
  let createPromises = [];
  let deletePromises = [];
  let updatedBlogPosts = [...blogPosts]; 
  let tempImages = [...Images];

  blogPostsCopy.forEach(post => {
    if (!currentPostIds.has(post._id)) {
      deletePromises.push(
        fetch(`http://localhost:3000/api/posts/${post._id}`, {
          method: 'DELETE'
        }).then(response => {
          if (!response.ok) {
            throw new Error(`Failed to delete post: ${response.statusText}`);
          }
          return response.json();
        })
      );
    }
  });
  updatedBlogPosts.forEach((post, index) => {
    const newPostData = {
      "position": post.position,
      "title": post.title,
      "description": post.description,
      "art_p1": post.content?.part1,
      "art_p2_title": post.content?.part2?.title,
      "art_p2": post.content?.part2?.body,
      "art_p3_title": post.content?.part3?.title,
      "art_p3": post.content?.part3?.body,
      "author": post.author,
      "_id": post._id,
      "date": post.date,
    };

      if (existingPostIds.has(post._id)) {
          updatePromises.push(
              fetch(`http://localhost:3000/api/posts/editPost/${post._id}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newPostData)
              })
              .then(response => response.ok ? response.json() : Promise.reject(`Failed to update post: ${response.statusText}`))
          );
      } else {
          createPromises.push(
              fetch(`http://localhost:3000/api/posts/createPost`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(newPostData)
                 
              })
              
              .then(response => response.ok ? response.json() : Promise.reject(`Failed to create post: ${response.statusText}`))
              .then(data => {
                  if (data.postId) {
                      let imageIndex = tempImages.findIndex(img => img.id === post._id);
                      tempImages[imageIndex].id = data.postId; 

                      updatedBlogPosts[index]._id = data.postId;
                      existingPostIds.add(data.postId); 
                  }
                  return updatedBlogPosts[index]; 
              })
          );
      }
  });
console.log(updatedBlogPosts);
  try {
      await Promise.all(updatePromises);
      await Promise.all(createPromises);

      const imageUploadPromises = updatedBlogPosts.map(async post => {
          const uploads = [];
          const details = tempImages.find(img => img.id === post._id);

          if (details && details.copertinaFile) {
              const copertinaUrl = `http://localhost:3000/api/posts/${existingPostIds.has(post._id) ? `update/copertina/${post._id}` : `upload/copertina/${post._id}`}`;
              const file = await fetchBlobFromUrl(details.copertina);
              if(!file) return;
              uploads.push(uploadImage(post._id, file, copertinaUrl));
          }

          if (details && details.contenutoFile) {
              const contenutoUrl = `http://localhost:3000/api/posts/${existingPostIds.has(post._id) ? `update/contenuto/${post._id}` : `upload/contenuto/${post._id}`}`;
              const file = await fetchBlobFromUrl(details.contenuto);
              if(!file) return;

              uploads.push(uploadImage(post._id, file, contenutoUrl));
          }

          return Promise.all(uploads);
      });

      await Promise.all(imageUploadPromises);

      setBlogPosts(updatedBlogPosts);  
      setBlogPostsCopy([...updatedBlogPosts]); 
      setBlogPostsVerify(false);
      alert("Modifiche salvate con successo");
  } catch (error) {
      console.error("Errore salvataggio:", error);
      alert("Errore durante il salvataggio");
  }
}

async function uploadImage(postId, file, uploadUrl) {
  const formData = new FormData();
  formData.append('file', file);
  return fetch(uploadUrl, {
      method: 'POST',
      body: formData
  }).then(response => {
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
  });
}


 
  if (ruolo !== "admin" && ruolo !== "editor-blog") {
    return null;
  } else return (
  <Container fluid className="p-0 m-0">
    {/* Alert per avvertire che si è in modalità editing */}
    <Alert variant={'warning'} className='m-3 mt-4'>
      STAI IN MODALITA EDITING
    </Alert>

    {/* Alert per chiedere conferma salvataggio modifiche */}
    {blogPostsVerify && (
      <Alert variant={'danger'} className='m-3 mt-4 d-flex align-items-center justify-content-between'>
        VUOI SALVARE LE MODIFICHE?
        {/* Pulsanti per eliminare o salvare modifiche */}
        <div className="d-flex">
          <Button onClick={() => handleDeleteChanges()} variant="outline-danger" className="me-2">
            ELIMINA
          </Button>
          <Button onClick={() => handleSaveChanges()} variant="outline-success">
            SALVA
          </Button>
        </div>
      </Alert>
    )}

    {/* Pulsante per aggiungere un nuovo articolo */}
    <Button 
      variant="outline-success"
      className='m-3'
      onClick={handleAddArticleClick} // Aggiungi l'evento onClick qui
    >
      AGGIUNGI ARTICOLO
    </Button>

    {/* Griglia per visualizzare gli articoli */}
    <Row className='mt-1 m-0 p-0 w-100 d-flex flex-grow-1'>
      {blogPosts.sort((a, b) => a.position - b.position).map((post, position) => {
        
          // Altri post, disposti in colonne di un terzo della larghezza
          return (
            <Col key={position} md={12} lg={4} className=' m-0 p-0'>
              <Card className='card-blog m-0 p-0'>
              <div className="zoom-image">
                {/* Immagine di copertina del post */}
                <Card.Img className='zoom-image m-0 p-0 img-car-blog' variant="top" src={getImageById(post._id)} />
              </div>
              <Card.Title className='centered-text centered-text-blog-edit p-1' >
                <h2>{post.title}</h2>
              </Card.Title>
                 <Card.Body>
                  {/* Input per caricare un'immagine */}
                  <input
                    type="file"
                    onChange={(event) => handleFileChange(event, position)}
                    style={{ display: 'none' }}
                    accept="image/*"
                    id={`file-input-copertina-${post._id}`} // Ensure this is unique
                  />
                  <Button 
                    style={{ position: 'absolute', top: '10px', left: '10px' }}
                    onClick={() => document.getElementById(`file-input-copertina-${post._id}`).click()}
                    variant="primary"
                  >
                    Carica
                  </Button>
                  <div className="text-center mb-3">
        <Button className=' button-green-prod mt-4'as={Link} to={`/BlogArticleEdit/${post._id}`} variant='outline-success '>Apri articolo</Button>
    </div>
                  {/* Dettagli del post */}
                  <Form.Group className="mb-1">
                    <Form.Control type="text" value={post.title} placeholder="Title" onChange={(event) => handleTitleChange(event, position)} />
                  </Form.Group>
               
                </Card.Body>
               
                <Row>
                  {/* Pulsanti per spostare il post */}
                  <Col md={6} className="d-flex justify-content-center align-items-center">
                    <Button 
                      onClick={() => handleMoveUpClick(position)} // Passa l'indice corrente
                      variant="outline-dark"
                      className='m-2 d-inline-block w-100' 
                    >
                      Sposta in alto
                    </Button>
                  </Col>
                  <Col md={6} className="d-flex justify-content-center align-items-center">
                    <Button 
                      onClick={() => handleMoveDownClick(position)} // Passa l'indice corrente
                      variant="outline-dark"
                      className='m-2 d-inline-block w-100' 
                    >
                      Sposta in basso
                    </Button>
                  </Col>
                </Row>
                {/* Pulsante per eliminare il post */}
                <Button 
                  onClick={() => handleDeleteClick(position)} // Passa l'indice corrente
                  variant="outline-danger"
                  className='m-2'
                >
                  Elimina
                </Button>
              </Card>
            </Col>
          );
      })}
    </Row>
  </Container>
);
};