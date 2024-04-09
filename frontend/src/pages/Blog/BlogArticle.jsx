import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function BlogArticle() {
    const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`URL_DEL_TUO_SERVER/blog-posts/${id}`)
      .then(response => {
        setPost(response.data);
      })
      .catch(error => console.error("Errore nel recupero dell'articolo:", error));
  }, [id]);

  if (!post) return <div>Caricamento...</div>;

  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.description}</p>
      {/* Visualizza altri dettagli dell'articolo qui */}
    </div>
  );
}

