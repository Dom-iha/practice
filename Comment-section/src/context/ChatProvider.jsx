import { useReducer, useRef, useState } from 'react';
import ChatContext from './ChatContext';
import chatReducer from './chatReducer';
import data from '../data/data.json';

function ChatProvider({ children }) {
	const chatData = data.comments
	const [chatState, dispatch] = useReducer(chatReducer, chatData);
	const [isReplying, setIsReplying] = useState(false);
	const [value, setValue] = useState('Test Value');
	const modalRef = useRef();

	const handleChange = (e) => {
		const currVal = e.target.value;
		setValue(currVal);
		console.log(currVal);
		dispatch({ type: 'TYPING' });
	};

	const showModal = () => {
		modalRef.current.showModal();
	};

	const reply = (id) => {
		setIsReplying((prevState) => !prevState);
		console.log(id);
	};

	const postComment = (e) => {
		e.preventDefault();
		dispatch({ type: 'ADDED', payload: value });
	};

	const updatePost = (e) => {
		e.preventDefault();
		dispatch({ type: 'UPDATED', payload: '' });
	};

	const cancelDelete = (id) => {
		modalRef.current.close();
	};

	const deleteComment = (id) => {
		modalRef.current.close();
		dispatch({ type: 'DELETE', payload: id });
	};


	const chatContext = {
		reply: reply,
		value: value,
		posts: chatState,
		modalRef: modalRef,
		showModal: showModal,
		cancel: cancelDelete,
		delete: deleteComment,
		updatePost: updatePost,
		isReplying: isReplying,
		addComment: postComment,
		handleChange: handleChange,
	};

	return (
		<ChatContext.Provider value={chatContext}>
			{children}
		</ChatContext.Provider>
	);
}

export default ChatProvider;
