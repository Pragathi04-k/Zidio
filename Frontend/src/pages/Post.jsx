import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Post = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    // fetch post by id
  }, [id]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      {post && (
        <>
          <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
          <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
          {/* Likes & Comments components go here */}
        </>
      )}
    </div>
  );
};

export default Post;