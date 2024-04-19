const API_URL = 'http://localhost:3000/api/posts';

// Fetch all blog posts
export const fetchBlogPosts = async () => {
  try {
    const response = await fetch(`${API_URL}/getAllPosts`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return JSON.parse(JSON.stringify(data)); // Ensures data is serializable
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    throw error;  // Rethrow to handle it in the component
  }
};

// Update image URLs by ID
export const updateImageUrlById = (Images, id, newUrl, file) => {
  return Images.map(image => {
    if (image.id === id) {
        return { ...image, 'copertina': newUrl, 'copertinaFile': file };
    }
    return image;
  });
};


// Generate new article data
export const generateNewArticle = () => {
  return {
    _id: Math.random().toString(36).substr(2, 9),  // Generates a unique ID
    title: '',
    description: '',
    content: { part1: '', part2: { title: '', body: '' }, part3: { title: '', body: '' } },
    author: '',
    date: new Date().toISOString().slice(0, 10),  // Current date as YYYY-MM-DD string
    position: 0  // Initial index set to 0
  };
};

// Functions for handling session storage
export const getSessionStorageOrDefault = (key, defaultValue) => {
  const stored = sessionStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultValue;
};

export const handleSessionStorage = (key, value) => {
  sessionStorage.setItem(key, JSON.stringify(value));
};

// Handle Image Fetching from Blob URL
export const fetchBlobFromUrl = async (blobUrl) => {
  try {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const file = new File([blob], "uploaded_image.jpg", { type: blob.type });
    return file;
  } catch (error) {
    console.error('Error retrieving file from blob URL:', error);
    return null;
  }
};





// Existing imports or exports...

// Function to save changes to the blog posts
export const saveChanges = async (blogPosts, blogPostsCopy, Images) => {
  const existingPostIds = new Set(blogPostsCopy.map(post => post._id));
  const currentPostIds = new Set(blogPosts.map(post => post._id));
  let updatePromises = [];
  let createPromises = [];
  let deletePromises = [];

  // Handle deletions
  blogPostsCopy.forEach(post => {
    if (!currentPostIds.has(post._id)) {
      deletePromises.push(deletePost(post._id));
    }
  });

  // Handle updates and creations
  blogPosts.forEach(post => {
    const postData = {
      position: post.position,
      title: post.title,
      description: post.description,
      art_p1: post.content?.part1,
      art_p2_title: post.content?.part2?.title,
      art_p2: post.content?.part2?.body,
      art_p3_title: post.content?.part3?.title,
      art_p3: post.content?.part3?.body,
      author: post.author,
      _id: post._id,
    };

    if (existingPostIds.has(post._id)) {
      updatePromises.push(updatePost(post._id, postData));
    } else {
      createPromises.push(createPost(postData));
    }
  });

  // Wait for all operations to complete
  await Promise.all([...updatePromises, ...createPromises, ...deletePromises]);
  // Handle image uploads if needed
  return handleImageUploads(blogPosts, Images);
};

// Delete a post
const deletePost = async (postId) => {
  return fetch(`${API_URL}/${postId}`, { method: 'DELETE' })
    .then(response => {
      if (!response.ok) throw new Error(`Failed to delete post: ${response.statusText}`);
      return response.json();
    });
};

// Update a post
const updatePost = async (postId, postData) => {
  return fetch(`${API_URL}/editPost/${postId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  })
  .then(response => response.ok ? response.json() : Promise.reject(`Failed to update post: ${response.statusText}`));
};

// Create a new post
const createPost = async (postData) => {
  return fetch(`${API_URL}/createPost`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  })
  .then(response => response.ok ? response.json() : Promise.reject(`Failed to create post: ${response.statusText}`));
};

// Handle image uploads
const handleImageUploads = async (blogPosts, Images) => {
  let imageUploadPromises = blogPosts.map(post => {
    let details = Images.find(img => img.id === post._id);
    if (details && details.copertinaFile) {
      return uploadImage(post._id, details.copertinaFile, `${API_URL}/upload/copertina/${post._id}`);
    }
  }).filter(promise => promise !== undefined);
  
  await Promise.all(imageUploadPromises);
};

// Upload an image
const uploadImage = async (postId, file, uploadUrl) => {
  const formData = new FormData();
  formData.append('file', file);
  return fetch(uploadUrl, {
    method: 'POST',
    body: formData
  }).then(response => {
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return response.json();
  });
};

