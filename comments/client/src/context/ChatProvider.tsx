import { useRef, useState, useEffect, ReactNode } from 'react';
import io from 'socket.io-client';
import ChatContext from './ChatContext';
import dayjs from '../dayjsConfig';
import { Comment as CommentType, ContextValues } from '../types';

const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const storedName = localStorage.getItem('USERNAME');
  const initialUsername = storedName ? JSON.parse(storedName) : '';

  const initialState: CommentType[] = [];
  const [commentData, setCommentData] = useState<CommentType[]>(initialState);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>();
  const [username, setUsername] = useState<string>(initialUsername);

  // const serverUrl = 'https://comment-section-pk6h.onrender.com/comments';
  const serverUrl = 'http://localhost:5000/comments';
  const modalRef = useRef<HTMLDialogElement>(null);
  const authRef = useRef<HTMLDialogElement>(null);
  // const socket = io(serverUrl, {
  //   transports: ['websocket'],
  // });

  useEffect(() => {
    const socket = io(serverUrl, {
      transports: ['websocket'],
    });
    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on('disconnect', () => {
      console.log('disconnected');
    });

    socket.on('commentCreated', (newComment) => {
      setCommentData((prevComments) => [...prevComments, newComment]);
    });

    socket.on('commentUpdated', (updatedComment) => {
      setCommentData((prevComments) =>
        prevComments.map((comment) =>
          comment._id === updatedComment._id ? updatedComment : comment
        )
      );
    });

    socket.on('commentDeleted', (deletedCommentId) => {
      setCommentData((prevComments) =>
        prevComments.filter((comment) => comment._id !== deletedCommentId)
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(serverUrl);
      const data = await response.json();
      if (response.ok) {
        setCommentData(data.comments);
        console.log(data.comments);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getComments();
  }, []);

  const formatTime = (time: string) => {
    // Get the relative time from now to when comment/reply was created, e.g. 2 hours ago
    return dayjs(time).fromNow();
  };

  useEffect(() => {
    username ? setAuthenticated(true) : authRef.current?.showModal();
  }, [username]);

  const setUser = (username: string) => {
    localStorage.setItem('USERNAME', JSON.stringify(username));
    setAuthenticated(true);
    setUsername(username);
    authRef.current?.close();
  };

  const addComment = async (text: string) => {
    const newComment = {
      text: text,
      score: 0,
      createdAt: new Date().toISOString(),
      user: {
        avatar: 'https://i.pravatar.cc/100?u=1',
        username: username,
      },
    };
    try {
      const response = await fetch(serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newComment),
      });
      if (response.ok) {
        // socket.emit('createComment', newComment);
        console.log(response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const addReply = async (text: string, id: string, replyingTo: string) => {
    try {
      const response = await fetch(`${serverUrl}${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          text: text,
          createdAt: new Date().toISOString(),
          replyingTo: replyingTo,
          score: 0,
          user: {
            avatar: 'https://i.pravatar.cc/100?u=1',
            username: username,
          },
        }),
      });

      if (!response.ok) {
        console.error(
          'Failed to post reply:',
          response.status,
          response.statusText
        );
      } else {
        console.log('Reply posted successfully');
      }
    } catch (error) {
      console.error('Error posting reply:', error);
    }
  };

  const updateComment = async (text: string, id: string) => {
    try {
      const response = await fetch(`${serverUrl}${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id,
          text: text,
        }),
      });
      if (!response.ok) {
        console.error(
          'Failed to put comment:',
          response.status,
          response.statusText
        );
      } else {
        console.log('Comment updated successfully');
      }
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const showModal = (id: string) => {
    setDeleting(true);
    setCommentToDelete(id);
  };

  // ensure showModal() is only called when the modal component is available in the DOM
  useEffect(() => {
    if (deleting && modalRef.current && !modalRef.current.open) {
      modalRef.current.showModal();
    }
  }, [deleting]);

  const cancelDelete = () => {
    modalRef.current?.close();
    setDeleting(false);
  };

  const deleteComment = async () => {
    console.log(commentToDelete);
    try {
      const response = await fetch(`${serverUrl}${commentToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        console.log(
          'Failed to delete comment:',
          response.status,
          response.statusText
        );
      } else {
        console.log(response.status, response.statusText);
      }
    } catch (error) {
      console.error('failed to delete ' + error);
    }

    modalRef.current?.close();
    setCommentToDelete(null);
    setDeleting(false);
  };

  const contextValues: ContextValues = {
    posts: commentData,
    setUser: setUser,
    loading: loading,
    authRef: authRef,
    modalRef: modalRef,
    addReply: addReply,
    deleting: deleting,
    username: username,
    showModal: showModal,
    cancel: cancelDelete,
    formatTime: formatTime,
    addComment: addComment,
    authenticated: authenticated,
    deleteComment: deleteComment,
    updateComment: updateComment,
  };

  return (
    <ChatContext.Provider value={contextValues}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatProvider;
