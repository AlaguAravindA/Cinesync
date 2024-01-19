import React, { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "D:\\project_react\\moviesapp1\\src\\firebaseauth.js";
import user from "../components/images/posters/user.svg";

const CommentsComponent = ({ imdb_id }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userNameemail, setUserNameemail] = useState("");
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [likedComments, setLikedComments] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setUserName(user?.displayName || "");
      setUserNameemail(user?.email || "");
    });

    return () => unsubscribe();
  }, []);

  function extractUsername(email) {
    const match = email.match(/^([a-zA-Z0-9._%+-]+)@/);
    if (match && match[1]) {
      return match[1];
    } else {
      return "";
    }
  }

  let usernameemail = extractUsername(userNameemail);
  if (userName === "" && userNameemail != null) {
    usernameemail = usernameemail;
  } else if (userName != null && userNameemail === "") {
    usernameemail = userName;
  } else if (userName !== "" || userNameemail !== "") {
    usernameemail = userName;
  } else {
    console.log("some problem");
  }

  useEffect(() => {
    fetchComments();
  }, [imdb_id]);

  const fetchComments = async () => {
    try {
      const response = await fetch(
        `/addcomments/getcomm/${imdb_id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      const sortedComments = data.comments.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setComments(sortedComments);
    } catch (error) {
      console.error("Error fetching comments:", error.message);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `/addcomments/${imdb_id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userName: usernameemail,
            commentText: newComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      fetchComments();
      setNewComment("");
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  const handleReplyButton = (commentId) => {
    setReplyToCommentId(commentId === replyToCommentId ? null : commentId);
  };

  const handleReplySubmit = async (commentId) => {
    try {
      const response = await fetch(
        `/addcomments/addreply/${commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: usernameemail,
            replyText: newReply,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add reply");
      }

      fetchComments();
      setNewReply("");
      setReplyToCommentId(null);
    } catch (error) {
      console.error("Error adding reply:", error.message);
    }
  };

  const handleLike = async (commentId) => {
    try {
      // Check if the user has already liked the comment
      if (likedComments.includes(commentId)) {
        console.log("You have already liked this comment.");
        return;
      }

      const response = await fetch(
        `/addcomments/addlike/${commentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add like");
      }

      // Update liked comments
      setLikedComments([...likedComments, commentId]);

      fetchComments();
    } catch (error) {
      console.error("Error adding like:", error.message);
    }
  };
  const BoldAtWords = ({ text }) => {
    const boldWords = (text) => {
      // Handle mentions (words starting with '@')
      const boldMentions = text.replace(/@(\w+)/g, "<strong>@$1</strong>");

      // Handle URLs (words starting with 'https://')
      const boldURLs = boldMentions.replace(
        /\b(https:\/\/\S+)\b/g,
        '<a href="$1" target="_blank" rel="noopener noreferrer" style="text-decoration: underline;">$1</a>'
      );

      return boldURLs;
    };

    return <div dangerouslySetInnerHTML={{ __html: boldWords(text) }} />;
  };

  return (
    <div className='bg-slate-900 bg-opacity-30 rounded-3xl text-white p-4'>
      <h2 className='text-2xl mb-4'>Comment Section</h2>
      <form onSubmit={handleCommentSubmit} className='mt-4'>
        <label className='block mb-2 text-sm'>Add a comment:</label>
        <textarea
          className='w-full p-2 border rounded text-white'
          rows='1'
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder='Write Something....'
          style={{
            background: "transparent",
            border: "none",
            borderBottom: "2px solid white",
            outline: "none",
          }}
        />
        <button
          type='submit'
          className={`mt-2 bg-indigo-500 hover:opacity-50 text-white p-2 rounded${
            isLoggedIn ? "" : " cursor-not-allowed"
          }`}
          disabled={!isLoggedIn}
        >
          {isLoggedIn ? "Comment" : "Login to Comment"}
        </button>
      </form>
      <h5 className='text-slate-200 text-3xl my-4 font-semibold'>Comments:</h5>
      <ul>
        {comments.length === 0 ? (
          <li className='mb-4 font-bold text-4xl text-white'>
            Be the First to Comment !!!
          </li>
        ) : (
          comments.map((comment) => (
            <li key={comment.commentId} className='mb-4'>
              <div>
                <span className='font-bold'>
                  <img
                    src={user}
                    alt='User Avatar'
                    className='mr-2 rounded-full h-6 w-6 inline-block'
                  />
                  {comment.userName}

                </span>
                :<span className='ml-3'>{comment.createdAt}</span>
                <BoldAtWords
                  className='ml-7 mb-2'
                  text={comment.commentText}
                ></BoldAtWords>
                <div className="flex items-center mt-2">
                 
                  <button
                    onClick={() => handleReplyButton(comment.commentId)}
                    className='text-blue-500'
                  >
                    {replyToCommentId === comment.commentId
                      ? "Cancel Reply"
                      : "Reply"}
                  </button>
                </div>
                {comment.replies && comment.replies.length > 0 && (
                  <ul className='ml-8'>
                    {comment.replies.map((reply, replyIndex) => (
                      <li key={replyIndex} className='mb-2'>
                        <span className='font-bold'>
                          <img
                            src={user}
                            alt='User Avatar'
                            className='mr-2 rounded-full h-6 w-6 inline-block'
                          />
                          {reply.username}
                        </span>
                        <span className='ml-3'>{reply.createdAt}</span>
                        <div className="mt-2">
                          <BoldAtWords
                            text={reply.replyText}
                            className='ml-5'
                          ></BoldAtWords>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {replyToCommentId === comment.commentId && (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleReplySubmit(comment.commentId);
                    }}
                    className='ml-4 mt-2'
                  >
                    <div className='flex flex-col'>
                      <label className='block mb-2 text-sm'>Add a reply:</label>
                      <textarea
                        className='p-2 border rounded text-white'
                        rows='1'
                        value={newReply}
                        onChange={(e) => setNewReply(e.target.value)}
                        style={{
                          background: "transparent",
                          border: "none",
                          borderBottom: "2px solid white",
                          outline: "none",
                        }}
                      />
                      <button
                        type='submit'
                        className={`mt-2 bg-indigo-500 hover:opacity-50 w-fit text-white p-2 rounded${
                          isLoggedIn ? "" : " cursor-not-allowed"
                        }`}
                        disabled={!isLoggedIn}
                      >
                        {isLoggedIn ? "Submit reply" : "Login to Reply"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default CommentsComponent;
