import { useReducer, useRef, useState, useEffect } from 'react';
import ChatContext from './ChatContext';
import chatReducer from './chatReducer';
import dayjs from '../dayjsConfig';
import { Comment as CommentType } from '../types';

function ChatProvider({ children }) {
  const initialState: CommentType[] = [];
  const [chatData, setChatData] = useState<CommentType[]>(initialState);
  const [chatState, dispatch] = useReducer(chatReducer, chatData);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [loading, setLoading] = useState(false);

  const modalRef = useRef();

  useEffect(() => {
    const getComments = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/comments');
        const data = await res.json();
        setChatData(data.comments);
        console.log(data.comments);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    getComments();
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const formatTime = (time: string | object) => {
    // because the json timestamps are strings calling the dayjs methods would display NaN
    // so i first need to check if its from the data.json file || local storage

    // check if time is a string (from local storage or JSON)
    if (typeof time === 'string') {
      // check if the string can be parsed as a date
      const parsedTime = Date.parse(time);
      if (!isNaN(parsedTime)) {
        // if so, convert to dayjs object
        return dayjs(parsedTime).fromNow();
      }
      // otherwise, return the original string
      return time;
    }
    // if time is already a Date or dayjs object, format it using fromNow
    return dayjs(time).fromNow();
  };

  useEffect(() => {
    localStorage.setItem('COMMENTS', JSON.stringify(chatState));
  }, [chatState]);

  const addComment = async (text: string) => {
    if (text.trim().length !== 0) {
      try {
        const response = await fetch('http://localhost:5000/comments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Corrected headers object
          },
          body: JSON.stringify({
            id: crypto.randomUUID(),
            text: text,
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
    } else return;
  };

  const addReply = async (text: string, id: string, replyingTo: string) => {
    try {
      const response = await fetch('http://localhost:5000/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Corrected headers object
        },
        body: JSON.stringify({
          id: id,
          text: text,
          replyingTo: replyingTo,
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
      const response = await fetch(`http://localhost:5000/comments/${id}`, {
        method: 'PUT',
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

  const showModal = (id) => {
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
    modalRef.current.close();
    setDeleting(false);
  };

  const deleteComment = async (id: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/comments/${props.id}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application.json',
          },
          body: JSON.stringify({
            id: id,
          }),
        }
      );
      if (!response.ok) {
        console.log(
          'Failed to delete comment:',
          response.status,
          response.statusText
        );
      } else {
        console.log('created successfully');
      }
    } catch (error) {
      console.error('failed to delete' + error);
    }

    modalRef.current.close();
    setCommentToDelete(null);
    setDeleting(false);
  };

  const chatContext = {
    loading: loading,
    posts: chatData,
    addReply: addReply,
    modalRef: modalRef,
    showModal: showModal,
    cancel: cancelDelete,
    delete: deleteComment,
    formatTime: formatTime,
    addComment: addComment,
    updateComment: updateComment,
    deleting: deleting,
  };

  return (
    <ChatContext.Provider value={chatContext}>{children}</ChatContext.Provider>
  );
}

export default ChatProvider;