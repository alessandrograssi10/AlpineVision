import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image, Form, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export const BlogArticleEdit = () => {
  // Ottieni l'ID del post dalla route
  const { id } = useParams();

  // Stati per i post del blog, le immagini, il post attuale, la verifica dei post e l'elaborazione del post
  const [blogPosts, setBlogPosts] = useState(() => {
    const savedPosts = sessionStorage.getItem('blogPosts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  const [Images, setImages] = useState(() => {
    const savedImages = sessionStorage.getItem('blogImages');
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [post, setPost] = useState(null);
  const [blogPostsVerify, setBlogPostsVerify] = useState(() => {
    const savedVerify = sessionStorage.getItem('blogPostsVerify');
    return savedVerify ? JSON.parse(savedVerify) : false;
  });

  // Effetto per caricare i dettagli del post corrente
  useEffect(() => {
    console.log(`Caricamento dei dettagli per il post con ID: ${id}`);
    const foundPost = blogPosts.find(p => p._id.toString() === id.toString());
    if (foundPost) {
      console.log('Post ricevuto:', foundPost);
      setPost(foundPost);
    } else {
      console.error("Errore: Post non trovato");
    }
    console.log(blogPosts)

  }, [id, blogPosts]);

  // Effetti per salvare i post, le immagini e la verifica dei post in sessionStorage
  useEffect(() => {
    sessionStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);

  useEffect(() => {
    sessionStorage.setItem('blogImages', JSON.stringify(Images));
  }, [Images]);

  useEffect(() => {
    sessionStorage.setItem('blogPostsVerify', JSON.stringify(blogPostsVerify));
  }, [blogPostsVerify]);

  // Funzione per ottenere l'URL dell'immagine corrispondente all'ID
  const getImageById = (id) => {
    const image = Images.find(image => image.id === id);
    return image ? image.contenuto : 'No image found with such ID';
  };

  // Funzione per aggiornare l'URL dell'immagine corrispondente all'ID
  const updateImageUrlById = (id, newUrl, file) => {
    const updatedImages = Images.map(image => {
      if (image.id === id) {
        return { ...image, 'contenuto': newUrl, 'contenutoFile': file };
      }
      return image;
    });
    setImages(updatedImages);
  };

  // Gestisce il cambio di file
  const handleFileChange = (event) => {
    setBlogPostsVerify(true);

    const file = event.target.files[0];
    if (file) {
      const newUrl = URL.createObjectURL(file).toString();
      updateImageUrlById(id, newUrl, file);
    }
  };

  // Se non c'è nessun post, mostra un messaggio di caricamento
  if (!post) {
    return <div>Caricamento...</div>;
  }

  // Funzione per gestire il cambiamento dei campi del post
  const handleChange = (event, path) => {
    if (!post) return;

    setBlogPostsVerify(true);
    // Utilizza l'aggiornamento funzionale per assicurarsi di lavorare sempre con lo stato più recente
    setPost(currentPost => {
      // Crea una copia profonda del post corrente per garantire l'immutabilità
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

  return (
    <Container>
      {/* Pulsante per tornare all'area editor */}
      <Button as={Link} to={`/BlogEdit`} onClick={() => handleSavePost()} className="mt-3" variant="outline-success">
        Torna Area Editor
      </Button>
      {/* Avviso per la modalità di modifica */}
      <Alert variant={'warning'} className='m-0 mt-4'>
        YOU ARE IN EDIT MODE!!!!!
      </Alert>
      {/* Avviso per salvare le modifiche */}
      <Alert variant={'danger'} className='m-0 mt-4'>
        Tutte le modifiche devono essere salvate nell'area blog!!!!!
      </Alert>
      {/* Titolo del post */}
      <Row className="my-2 mt-4 justify-content-center">
        <Col lg={12} className="text-center">
          <h1>
            <Form.Group className="mb-3">
              <Form.Control type="text" value={post?.title} placeholder="Title" onChange={(event) => handleChange(event, 'title')} onBlur={handleSavePost} />
            </Form.Group>
          </h1>
        </Col>
      </Row>
      {/* Data di pubblicazione */}
      <Row className="my-2 mt-4 justify-content-center">
        <p className="text-muted text-center"> {post?.date ? `Pubblicato il ${new Date(post.date).toLocaleDateString()}` : 'Data non disponibile'}</p>
      </Row>
      {/* Parte 1 del contenuto */}
      <Row className="my-2 mt-4 justify-content-center">
        <Form.Group className="mb-3">
          <Form.Control as="textarea" rows={3} type="text" value={post.content.part1} placeholder="Parte 1" onChange={(event) => handleChange(event, 'content.part1')} onBlur={handleSavePost} />
        </Form.Group>
      </Row>
      {/* Immagine e caricamento di file */}
      <Row className="my-2 justify-content-center">
        <Col lg={6}>
          <Col lg={6}>
            {post && (
              <>
                <Image
                  key={post._id}
                  src={getImageById(id)}
                  fluid
                  className="mb-3"
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
                    top: '10px',
                    left: '10px',
                    zIndex: 5,
                    backgroundColor: 'red',
                  }}
                  onClick={() => document.getElementById(`file-input-contenuto-${id}`).click()}
                  variant="primary"
                >
                  Upload
                </Button>
              </>
            )}
          </Col>
        </Col>
        {/* Parte 2 del contenuto */}
        <Col lg={6}>
          <Row>
            <h3>
              <Form.Group className="mb-3">
                <Form.Control type="text" value={post.content.part2.title} placeholder="Parte 2 Title" onChange={(event) => handleChange(event, 'content.part2.title')} onBlur={handleSavePost} />
              </Form.Group>
            </h3>
          </Row>
          <Row>
            <p className="text-muted">
              <Form.Group className="mb-3">
                <Form.Control type="text" as="textarea" rows={12} value={post.content.part2.body} placeholder="Parte 2" onChange={(event) => handleChange(event, 'content.part2.body')} onBlur={handleSavePost} />
              </Form.Group>
            </p>
          </Row>
        </Col>
      </Row>
      {/* Parte 3 del contenuto */}
      <Row className="my-2 justify-content-center">
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
      {/* Pulsante per tornare all'area editor */}
      <Row className="my-2 justify-content-center">
        <Col lg={6} className="d-flex justify-content-center mb-3">
          <Button as={Link} to={`/BlogEdit`} variant="primary" className="mt-3">Torna area editor</Button>
        </Col>
      </Row>
    </Container>
  );
};
