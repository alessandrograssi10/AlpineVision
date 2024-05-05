import React, { useEffect, useState, useRef,useLayoutEffect } from 'react';
import { Container, Card, Row, Col, Button, Alert, Form } from 'react-bootstrap';
import { Link,useNavigate } from 'react-router-dom';
import { fetchBlogPosts, updateImageUrlById, handleSessionStorage, getSessionStorageOrDefault, generateNewArticle, fetchBlobFromUrl } from './BlogEditLogic';


export const BlogEdit = () => {
  const [blogPosts, setBlogPosts] = useState(() => getSessionStorageOrDefault('blogPosts', []));
  const [blogPostsCopy, setBlogPostsCopy] = useState(() => getSessionStorageOrDefault('blogPostsCopy', []));
  const [blogPostsVerify, setBlogPostsVerify] = useState(() => getSessionStorageOrDefault('blogPostsVerify', false));
  const [Images, setImages] = useState(() => getSessionStorageOrDefault('blogImages', []));
  const [ImagesCopy, setImagesCopy] = useState(() => getSessionStorageOrDefault('blogImagesCopy', []));
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const ruolo = localStorage.getItem("ruoloUser");
  let p = false;

  useEffect(() => {
    if(ruolo !== "admin")
      {
        window.location.href = '/home';
      }
      if(!p)
        {
          p = true;
      if(localStorage.getItem("prevPage") !== "Edit")
        {
          console.log("PUTTANA")
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
  }, []);


  useLayoutEffect(() => {

    

    
    if (blogPosts.length === 0) {
      fetchBlogPosts()
      .then(data => {setBlogPosts(data);setBlogPostsCopy(data);})
      .catch(error => console.error("Failed to fetch posts:", error));
    }
    
  }, []); 

  useLayoutEffect(() => {
    console.log("Car IMMAGINI",blogPosts.length, imagesLoaded);

    if (!Images.length) {

    const setImagesFun = () => {
      console.log("Car IMMAGINI");
      const newItems = blogPosts.map((post) => ({
        copertina: `http://localhost:3000/api/posts/photo-copertina?id=${post._id}`,
        copertinaFile: null,
        contenuto: `http://localhost:3000/api/posts/photo-contenuto?id=${post._id}`,
        contenutoFile: null,
        id: post._id
      }));
      console.log(newItems);
      setImages(JSON.parse(JSON.stringify(newItems))); 
      setImagesCopy(JSON.parse(JSON.stringify(newItems))); 
    };
    console.log("Car ",(blogPosts.length > 0 && imagesLoaded === false));
    setImagesFun();
  
    if (blogPosts.length > 0 && imagesLoaded === false) {
      console.log("Car IMMAGINI load");

      setImagesFun();
      setImagesLoaded(true); 

    }
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
    return image ? image.copertina : 'No image found with such ID';
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
  
  const handleDescriptionChange = (event, position) => {
    setBlogPostsVerify(true);
    const updatedPosts = [...blogPosts];
    updatedPosts[position].description = event.target.value;
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
      _id: Math.random().toString(36).substr(2, 9),  // Generates a unique ID for the new post
      title: '',  // Title empty, to be filled by the user
      description: '',  // Description empty, to be filled by the user
      content: {
        part1: '',
        part2: {
          title: '',
          body: ''
        },
        part3: {
          title: '',
          body: ''
        }
      },  // Content structured as an object with specific fields for each part
      author: '',  // Author empty or a default value
      date: new Date().toISOString().slice(0, 10),  // Current date as YYYY-MM-DD string
      position: 0  // Initial index set to 0
    };

    // Update positions of existing posts
    const updatedPosts = blogPosts.map(post => ({
        ...post,
        position: post.position + 1  // Increment each post's position by 1
    }));

    console.log(newArticle);
    // Add the new article at the start of the array and update the state
    setBlogPosts([newArticle, ...updatedPosts]);  // Prepend the new article

    //
     // Add a new image entry for the new article
     const newImageEntry = {
      id: newArticle._id,
      copertina: 'Default Image Path or Placeholder',
      copertinaFile: null,
      contenuto: 'Default Image Path or Placeholder',
      contenutoFile: null
  };
  setImages([...Images, newImageEntry]);
  setBlogPostsVerify(true); // To trigger verification or alerts if needed
    
};
  const handleDeleteChanges = () => {
    setBlogPostsVerify(true);
    // Reset the blog posts to their original state
    setBlogPosts(JSON.parse(JSON.stringify([...blogPostsCopy])));
    setImages(JSON.parse(JSON.stringify([...ImagesCopy])));

    // Reset any additional states if they depend on the posts
    // For example, if Images should reflect the state of blogPosts
    const resetImages = blogPostsCopy.map(post => ({
      copertina: `http://localhost:3000/api/posts/photo-copertina?id=${post._id}`,
      copertinaFile: null,
      contenuto: `http://localhost:3000/api/posts/photo-contenuto?id=${post._id}`,
      contenutoFile: null,
      id: post._id

    }));
    setImages(resetImages);

    // Ensuring this state is reset properly
   // setImages([]); 
    //setImagesLoaded(false); 

    // Reset the verification flag
    setBlogPostsVerify(false);
    console.log("Changes discarded");
};


async function handleSaveChanges() {
  const existingPostIds = new Set(blogPostsCopy.map(post => post._id));
  const currentPostIds = new Set(blogPosts.map(post => post._id));

  let updatePromises = [];
  let createPromises = [];
  let deletePromises = [];
  let updatedBlogPosts = [...blogPosts]; // Create a shallow copy of blogPosts for immutability
  let tempImages = [...Images];

  blogPostsCopy.forEach(post => {
    if (!currentPostIds.has(post._id)) {
      // This post has been removed in the current session and should be deleted from the server
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
          // Update existing post
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
                      // Update the _id of the post in the updatedBlogPosts array
                      

                      let imageIndex = tempImages.findIndex(img => img.id === post._id);
                      tempImages[imageIndex].id = data.postId; 

                      updatedBlogPosts[index]._id = data.postId;
                      existingPostIds.add(data.postId); // Add new ID to the set of existing IDs
                  }
                  return updatedBlogPosts[index]; // Return the updated post
              })
          );
      }
  });
console.log(updatedBlogPosts);
  try {
      await Promise.all(updatePromises);
      await Promise.all(createPromises);

      // Prepare to upload images for all posts (both updated and newly created)
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
          // AGGIUNTO DOPO
          /*if (details && details.copertinaFile !== null) {
            const copertinaUrl = `http://localhost:3000/api/posts/${existingPostIds.has(post._id) ? `update/copertina/${post._id}` : `upload/copertina/${post._id}`}`;
            const file = await fetchBlobFromUrl(details.copertinaFile);
            if(!file) return;
            uploads.push(uploadImage(post._id, file, copertinaUrl));
        }

        if (details && details.contenutoFile!== null) {
            const contenutoUrl = `http://localhost:3000/api/posts/${existingPostIds.has(post._id) ? `update/contenuto/${post._id}` : `upload/contenuto/${post._id}`}`;
            const file = await fetchBlobFromUrl(details.copertinaFile);
            if(!file) return;

            uploads.push(uploadImage(post._id, file, contenutoUrl));
        }*/

          return Promise.all(uploads);
      });

      // Execute all image uploads
      await Promise.all(imageUploadPromises);

      console.log("All posts and images processed successfully");
      setBlogPosts(updatedBlogPosts);  // Update the local state with all changes
      setBlogPostsCopy([...updatedBlogPosts]);  // Keep a copy for reference
      setBlogPostsVerify(false);
      //setImages([]); 
      //setImagesLoaded(false); 
    console.log(Images)
      console.log(ImagesCopy)
      alert("Changes saved successfully!");
  } catch (error) {
      console.error("Error processing changes:", error);
      alert("Failed to process changes. Please try again.");
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






return (
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
      variant="success"
      className='m-3'
      onClick={handleAddArticleClick} // Aggiungi l'evento onClick qui
    >
      Aggiungi articolo
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
                  {/* Dettagli del post */}
                  <Form.Group className="mb-3">
                    <Form.Control type="text" value={post.title} placeholder="Title" onChange={(event) => handleTitleChange(event, position)} />
                  </Form.Group>
               
                  <Link to={`/BlogArticleEdit/${post._id}`}>Apri articolo</Link>
                </Card.Body>
               
                <Row>
                  {/* Pulsanti per spostare il post */}
                  <Col md={6} className="d-flex justify-content-center align-items-center">
                    <Button 
                      onClick={() => handleMoveUpClick(position)} // Passa l'indice corrente
                      variant="primary"
                      className='m-2 d-inline-block w-100' 
                    >
                      Sposta in alto
                    </Button>
                  </Col>
                  <Col md={6} className="d-flex justify-content-center align-items-center">
                    <Button 
                      onClick={() => handleMoveDownClick(position)} // Passa l'indice corrente
                      variant="primary"
                      className='m-2 d-inline-block w-100' 
                    >
                      Sposta in basso
                    </Button>
                  </Col>
                </Row>
                {/* Pulsante per eliminare il post */}
                <Button 
                  onClick={() => handleDeleteClick(position)} // Passa l'indice corrente
                  variant="danger"
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