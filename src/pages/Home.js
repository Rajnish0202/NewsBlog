import React, { useEffect } from "react";
import { useState } from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { FaTrashAlt } from "react-icons/fa";

function Home({ isAuth }) {
  const [postLists, setPostLists] = useState([]);
  const postsCollectionRef = collection(db, "posts");

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postsCollectionRef);
      setPostLists(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getPosts();
  }, [postsCollectionRef]);

  const deletePost = async (id) => {
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
    window.location.pathname = "/";
  };

  return (
    <div className='homePage'>
      {postLists.map((post) => {
        console.log(post);
        return (
          <div className='post' key={post.id}>
            <div className='postHeader'>
              <div className='title'>
                <h1>{post.title}</h1>
              </div>
              <div className='deletePost'>
                {isAuth && post.author.id === auth.currentUser.uid && (
                  <button onClick={() => deletePost(post.id)}>
                    <FaTrashAlt />
                  </button>
                )}
              </div>
            </div>
            <div className='postTextContainer'>{post.postText}</div>
            <h3>@{post.author.name}</h3>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
