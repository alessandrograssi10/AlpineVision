import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Image,Form,Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

export const BlogArticleEdit = () => {
  const { id } = useParams();
  const [blogPosts, setBlogPosts] = useState(() => {
    const savedPosts = sessionStorage.getItem('blogPosts');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  const [Images, setImages] =  useState(() => {
    const savedImages = sessionStorage.getItem('blogImages');
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [post, setPost] = useState(null);
  const [postCopy, setPostCopy] = useState(false);
  const [blogPostsVerify, setBlogPostsVerify] = useState(() => {
    const savedVerify = sessionStorage.getItem('blogPostsVerify');
    return savedVerify ? JSON.parse(savedVerify) : false;
  });
  useEffect(() => {
    console.log(`Caricamento dei dettagli per il post con ID: ${id}`);
    const foundPost = blogPosts.find(p => p._id.toString() === id.toString());
    if (foundPost) {
      console.log('Post ricevuto:', foundPost);
      setPost(foundPost);
    } else {
      console.error("Errore: Post non trovato");
    }
  }, [id, blogPosts]);
  useEffect(() => {
    sessionStorage.setItem('blogPosts', JSON.stringify(blogPosts));
  }, [blogPosts]);
  useEffect(() => {
    sessionStorage.setItem('blogImages', JSON.stringify(Images));
  }, [Images]);
  useEffect(() => {
    sessionStorage.setItem('blogPostsVerify', JSON.stringify(blogPostsVerify));
  }, [blogPostsVerify]);

  const getImageById = (id) => {
    const image = Images.find(image => image.id === id);
    console.log("Image", image);
    return image ? image.contenuto : 'No image found with such ID';
  };
    
const updateImageUrlById = (id, newUrl,file) => {
  const updatedImages = Images.map(image => {
      if (image.id === id) {
          return { ...image, 'contenuto': newUrl,'contenutoFile': file }; // Updates the specific field (copertina or contenuto)
      }
      return image;
  });
  setImages(updatedImages);
  console.log("Updated Images", updatedImages);
};
  const handleFileChange = (event) => {
    setBlogPostsVerify(true);

    const file = event.target.files[0];
    if (file) {
        const newUrl = URL.createObjectURL(file).toString();
        updateImageUrlById(id, newUrl, file);
    }
};









  if (!post) {
    console.log('Caricamento o nessun post trovato');
    return <div>Caricamento...</div>;
  }

  function setNested(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const lastObj = keys.reduce((obj, key) =>
        obj[key] = obj[key] || {}, 
        obj);
    lastObj[lastKey] = value;
}
 /* const handleChange = (event,parte) => {
    setBlogPostsVerify(true);
    const newPost = { ...post };
    setNested(newPost, parte, event.target.value);
    setPost(newPost);
    handleSavePost();
  };*/
  const handleChange = (event, path) => {
    if (!post) return; // Ensure post is not null

    setBlogPostsVerify(true);
    // Using functional update to ensure we're always working with the latest state
    setPost(currentPost => {
        // Create a deep copy of currentPost to ensure immutability
        const newPost = JSON.parse(JSON.stringify(currentPost));

        // Function to set value at path inside a nested object
        function setNested(obj, path, value) {
            const keys = path.split('.');
            const lastKey = keys.pop();
            const lastObj = keys.reduce((obj, key) =>
                obj[key] = obj[key] || {}, 
                obj);
            lastObj[lastKey] = value;
        }

        // Set the new value at the path
        setNested(newPost, path, event.target.value);
        return newPost;
    });
};
  const handleSavePost = () => {
    const index = blogPosts.findIndex(p => p._id === post._id);
    const updatedPosts = [
      ...blogPosts.slice(0, index),
      post,
      ...blogPosts.slice(index + 1)
  ];
  setBlogPosts(updatedPosts);
  sessionStorage.setItem('blogPosts', JSON.stringify(updatedPosts));
};


  return (
    <Container>
      <Button as={Link} to={`/BlogEdit`} onClick={() => handleSavePost()}className="  " variant="outline-success">
            Torna Area Editor
          </Button>
        <Alert variant={'warning'} className='m-0 mt-4'>
        YOU ARE IN EDIT MODE!!!!!
      </Alert>
      <Alert variant={'danger'} className='m-0 mt-4'>
        Tutte le modifiche devo essere salvate nell area blog!!!!!
      </Alert>
      <Row className="my-2 mt-4 justify-content-center">
      <Col lg={12}className="text-center"> <h1><Form.Group className="mb-3">
                          <Form.Control type="text" value={post?.title} placeholder="Title" onChange={(event) => handleChange(event,'title')} onBlur={handleSavePost} />
                        </Form.Group></h1></Col>
      </Row>
      <Row className="my-2 mt-4 justify-content-center">
      <p className="text-muted text-center">Pubblicato il {new Date(post.date).toLocaleDateString()}</p>

      </Row>
      <Row className="my-2 mt-4 justify-content-center">
      <Form.Group className="mb-3">
                          <Form.Control as="textarea" rows={3} type="text" value={post.content.part1} placeholder="Parte 1" onChange={(event) => handleChange(event,'content.part1')} onBlur={handleSavePost} />
                        </Form.Group>

      </Row>
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
                onChange={(event) => handleFileChange(event, id)} // Adjust based on your function signature
                style={{ display: 'none' }}
                accept="image/*"
                id={`file-input-contenuto-${id}`}  // Ensure this is unique
                />
            <Button
                style={{
                    position: 'relative',
                    top: '10px', // Adjust these values as needed to position the button
                    left: '10px',
                    zIndex: 5, // Ensure the button is above the image
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
        <Col lg={6}>
          <Row><h3> <Form.Group className="mb-3">
                          <Form.Control  type="text" value={post.content.part2.title} placeholder="Parte 2 Title" onChange={(event) => handleChange(event,'content.part2.title')} onBlur={handleSavePost}/>
                        </Form.Group>
</h3></Row>
          <Row>
          <p className="text-muted"><Form.Group className="mb-3">
                          <Form.Control  type="text" as="textarea" rows={12} value={post.content.part2.body} placeholder="Parte 2" onChange={(event) => handleChange(event,'content.part2.body')} onBlur={handleSavePost}/>
                        </Form.Group></p>
         </Row>
        </Col>
      </Row>
      <Row className="my-2 justify-content-center">
        <Col lg={12}>
        <Row><h3 className=' text-left mt-3'><Form.Group className="mb-3">
                          <Form.Control  type="text" value={post.content.part3.title} placeholder="Parte 3 Title" onChange={(event) => handleChange(event,'content.part3.title')} onBlur={handleSavePost}/>
                        </Form.Group></h3></Row>
          <Row>
          <p className="text-muted"><Form.Group className="mb-3">
                          <Form.Control  type="text" as="textarea" rows={7} value={post.content.part3.body} placeholder="Parte 3" onChange={(event) => handleChange(event,'content.part3.body')} onBlur={handleSavePost}/>
                        </Form.Group></p>
         </Row>
         
        </Col>
      </Row>
      <Row className="my-2 justify-content-center">
        <Col lg={6} className="d-flex justify-content-center mb-3">
          <Button as={Link} to={`/BlogEdit`} variant="primary" className="mt-3">Torna ai post</Button>
        </Col>
      </Row>
    </Container>
  );
};
