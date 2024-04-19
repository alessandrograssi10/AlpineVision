import React, { useEffect, useState, useRef } from 'react';
import { Container, Card, Row, Col, Button, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Img from '../../../assets/Images/notfound.png';

export const BlogEdit = () => {
  const [blogPosts, setBlogPosts] = useState(() => {
    const savedPosts = sessionStorage.getItem('blogPosts');
    console.log(savedPosts);
    return savedPosts ? JSON.parse(savedPosts) : [];
  });
  const [blogPostsCopy, setBlogPostsCopy] = useState(() => {
    const savedPosts = sessionStorage.getItem('blogPostsCopy');
    return savedPosts ? JSON.parse(savedPosts) : [];
  });


  const [blogPostsVerify, setBlogPostsVerify] = useState(() => {
    const savedVerify = sessionStorage.getItem('blogPostsVerify');
    return savedVerify ? JSON.parse(savedVerify) : false;
  });
    const [Images, setImages] =  useState(() => {
    const savedImages = sessionStorage.getItem('blogImages');
    console.log(savedImages);
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [ImagesCopy, setImagesCopy] =  useState(() => {
    const savedImages = sessionStorage.getItem('blogImagesCopy');
    return savedImages ? JSON.parse(savedImages) : [];
  });
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (blogPosts.length === 0) {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts/getAllPosts');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBlogPosts(JSON.parse(JSON.stringify(data)));
        setBlogPostsCopy(JSON.parse(JSON.stringify(data)));
        console.log(data);
      } catch (error) {
        console.error("Errore nel recuperare i post del blog:", error);
      }
    };
    fetchBlogPosts();
  }
  }, []);

  useEffect(() => {
    if (!Images.length) {
    const setImagesFun = () => {
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

    if (blogPosts.length > 0 && !imagesLoaded) {
      setImagesFun();
      setImagesLoaded(true); 
    }
  }
  },[blogPosts, imagesLoaded]);
  function deepEqual(obj1, obj2) {
    if (obj1 === obj2) {
        return true;
    }
    if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null) {
        return false;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
        return false;
    }
    for (const key of keys1) {
        if (!keys2.includes(key) || !deepEqual(obj1[key], obj2[key])) {
            return false;
        }
    }
    return true;
}
  /*useEffect(() => {
    const checkDifferences = () => {
        const isDifferent = blogPosts.some((post, position) => {
            if (!blogPostsCopy[position]) return true; // New post
            const hasDifferentMetadata = post._id !== blogPostsCopy[position]._id ||
                                         post.title !== blogPostsCopy[position].title ||
                                         !deepEqual(post.content, blogPostsCopy[position].content) ||
                                         post.description !== blogPostsCopy[position].description;

            const currentImage = Images.find(img => img.id === post._id);
            const oldImage = Images.find(img => img.id === blogPostsCopy[position]._id);
            const hasDifferentImages = !currentImage || !oldImage ||
                                       currentImage.copertina !== oldImage.copertina ||
                                       currentImage.contenuto !== oldImage.contenuto;
            console.log(hasDifferentMetadata || hasDifferentImages);
            console.log(blogPosts);
            console.log(blogPostsCopy);

            return hasDifferentMetadata || hasDifferentImages;
        });

        setBlogPostsVerify(isDifferent || blogPosts.length !== blogPostsCopy.length);
    };

    checkDifferences();
}, [blogPosts, blogPostsCopy, Images]);*/
useEffect(() => {
  sessionStorage.setItem('blogPostsVerify', JSON.stringify(blogPostsVerify));
}, [blogPostsVerify]);
  useEffect(() => {
    sessionStorage.setItem('blogPosts', JSON.stringify(blogPosts));
    sessionStorage.setItem('blogPostsCopy', JSON.stringify(blogPostsCopy));

  }, [blogPosts]);
  useEffect(() => {
    sessionStorage.setItem('blogPostsCopy', JSON.stringify(blogPostsCopy));

  }, [blogPostsCopy]);
  useEffect(() => {
    sessionStorage.setItem('blogImages', JSON.stringify(Images));

  }, [Images]);

  const getImageById = (id) => {
    const image = Images.find(image => image.id === id);
    //console.log(image.copertina.toString());
    return image ? image.copertina : 'No image found with such ID';
};
    
const updateImageUrlById = (id, newUrl, file) => {
  const updatedImages = Images.map(image => {
      if (image.id === id) {
          return { ...image, 'copertina': newUrl,'copertinaFile': file}; // Updates the specific field (copertina or contenuto)
      }
      return image;
  });
  setImages(updatedImages);
  console.log("Updated Images", updatedImages);
};
  const handleFileChange = (event, position) => {
    setBlogPostsVerify(true);
    const file = event.target.files[0];
    if (file) {
        const newUrl = URL.createObjectURL(file).toString();
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
    setImagesLoaded(false);

    // Reset the verification flag
    setBlogPostsVerify(false);
    console.log("Changes discarded");
};


const fetchBlobFromUrl = async (blobUrl) => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();

    // Creating a file from blob, assuming you need file properties like name
    const file = new File([blob], "uploaded_image.jpg", { type: blob.type });
    return file;
  } catch (error) {
    console.error('Error retrieving file from blob URL:', error);
    return null;
  }
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
    };

    console.log("New Post Data:", newPostData);
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
                      console.log(newPostData);
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
      console.log(Images);

      // Prepare to upload images for all posts (both updated and newly created)
      const imageUploadPromises = updatedBlogPosts.map(async post => {
          const uploads = [];
          const details = tempImages.find(img => img.id === post._id);

          if (details && details.copertinaFile) {
              const copertinaUrl = `http://localhost:3000/api/posts/${existingPostIds.has(post._id) ? `update/copertina/${post._id}` : `upload/copertina/${post._id}`}`;
              const file = await fetchBlobFromUrl(details.copertina);
              uploads.push(uploadImage(post._id, file, copertinaUrl));
          }

          if (details && details.contenutoFile) {
              const contenutoUrl = `http://localhost:3000/api/posts/${existingPostIds.has(post._id) ? `update/contenuto/${post._id}` : `upload/contenuto/${post._id}`}`;
              const file = await fetchBlobFromUrl(details.contenuto);
              uploads.push(uploadImage(post._id, file, contenutoUrl));
          }

          return Promise.all(uploads);
      });

      // Execute all image uploads
      await Promise.all(imageUploadPromises);

      console.log("All posts and images processed successfully");
      setBlogPosts(updatedBlogPosts);  // Update the local state with all changes
      setBlogPostsCopy([...updatedBlogPosts]);  // Keep a copy for reference
      setBlogPostsVerify(false);
      alert("Changes saved successfully!");
      console.log(tempImages);
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
    <Container>
      <Alert variant={'warning'} className='m-3 mt-4'>
        YOU ARE IN EDIT MODE!!!!!
      </Alert>
      {blogPostsVerify && (
        <Alert variant={'danger'} className='m-3 mt-4 d-flex align-items-center justify-content-between'>
          DO YOU WANNA SAVE YOUR CHANGES?
          <Button onClick={() => handleDeleteChanges()}className="float-end  " variant="outline-danger">
            DISCARD
          </Button>
          <Button onClick={() => handleSaveChanges()} className="float-end " variant="outline-success">
            SAVE
          </Button>
        </Alert>
      )}


      <Button 
                        variant="success"
                        className='m-3'
                        onClick={handleAddArticleClick} // Aggiungi l'evento onClick qui

                      >
                        Add Article
                      </Button>
      <Row>
         {blogPosts.sort((a, b) => a.position - b.position).map((post, position) => {
          if (position === 0) {
            // Primo post, occupa tutta la larghezza
            return (
              <Col key={post._id} md={12}>
                <Card className='m-3'>
                  <Row noGutters>
                    <Col md={4}>
                      <Card.Img  key={post._id} src={getImageById(post._id)} />
                      <input
                type="file"
                onChange={(event) => handleFileChange(event, position)}
                style={{ display: 'none' }}
                accept="image/*"
                id={`file-input-copertina-${post._id}`}  // Ensure this is unique
                />
                      <Button 
                        style={{ 
                          position: 'absolute', 
                          top: '10px', 
                          left: '10px' 
                        }}
                        onClick={() => document.getElementById(`file-input-copertina-${post._id}`).click()}
                        variant="primary"
                      >
                        Upload
                      </Button>
                    
                    <Button onClick={() => handleMoveDownClick(position)} // Passa l'indice correntevariant="primary"
                        style={{ 
                          position: 'absolute', 
                          bottom: '10px', 
                          right: '100px' 
                        }}
                      >
                        Sposta in basso
                      </Button>
                
                      <Button 
                        style={{ 
                          position: 'absolute', 
                          bottom: '10px', 
                          right: '10px' 
                        }}
                        onClick={() => handleDeleteClick(position)} // Passa l'indice corrente
                        variant="danger"
                      >
                        Elimina
                      </Button>
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Form.Group className="mb-3">
                          <Form.Control type="text" value={post.title} placeholder="Title" onChange={(event) => handleTitleChange(event, position)} />
                        </Form.Group>
                        <Form.Group className="mb-1">
                          <Form.Control as="textarea" rows={3} value={post.description} placeholder="Short description"style={{ resize: 'none' }} onChange={(event) => handleDescriptionChange(event, position)} />
                        </Form.Group>
                        <Button as={Link} to={`/BlogArticleEdit/${post._id}`} variant="primary" className="mt-3">
                          Leggi di più
                        </Button>                
                      </Card.Body>         
                    </Col>
                  </Row>
                </Card>
              </Col>
            );
          } else {
            // Altri post, disposti in colonne di un terzo della larghezza
            return (
              <Col key={position} md={4}>
                <Card className='m-3'>
                  <Card.Img variant="top" key={post._id} src={getImageById(post._id)} />
                  
                  <Card.Body>
                  <input
                type="file"
                onChange={(event) => handleFileChange(event, position)}
                style={{ display: 'none' }}
                accept="image/*"
                id={`file-input-copertina-${post._id}`}  // Ensure this is unique
              />
                      <Button 
                        style={{ 
                          position: 'absolute', 
                          top: '10px', 
                          left: '10px' 
                        }}
                        onClick={() => document.getElementById(`file-input-copertina-${post._id}`).click()}
                        variant="primary"
                      >
                        Upload
                      </Button>
                  <Form.Group className="mb-3">
                          <Form.Control type="text" value={post.title} placeholder="Title"onChange={(event) => handleTitleChange(event, position)} />
                        </Form.Group>
                        <Form.Group className="mb-1">
                          <Form.Control as="textarea" rows={3} value={post.description} placeholder="Short description"style={{ resize: 'none' }} onChange={(event) => handleDescriptionChange(event, position)} />
                        </Form.Group>
                    <Link to={`/BlogArticleEdit/${post._id}`}>Leggi di più</Link>
                    
                  </Card.Body>
                  <Card.Footer>
                    <small className="text-muted">
                      By {post.author} | {post.date}
                    </small>     
                  </Card.Footer>
                  <Row>
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
                  
                  <Button 
                        onClick={() => handleDeleteClick(position)} // Passa l'indice corrente
                        variant="danger"
                        className='m-2'
                      >
                        Delete
                      </Button>
                </Card>
              </Col>
            );
          }
        })}
      </Row>
    </Container>
  );
};