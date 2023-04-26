import { useContext } from 'react';
import Comment from './chat/Comment';
import TextField from './ui/TextField';
import ChatContext from '../context/ChatContext';

function CommentSection() {
	const commentCtx = useContext(ChatContext);
	
	const commentThread =  commentCtx.posts.map((comment) => (
		<Comment
			id={comment.id}
			score={comment.score}
			key={crypto.randomUUID()}
			content={comment.content}
			replies={comment.replies}
			src={comment.user.image.png}
			createdAt={comment.createdAt}
			username={comment.user.username}
			hasReplies={comment.replies.length > 0}
			currentUser={comment.user.username === 'juliusomo'}
		/>
	));

	return (
		<section className='flex flex-col gap-5 mx-auto text-GrayBlue max-w-screen-md min-h-screen bg-LightGray dark:bg-DarkGray px-4 md:px-5 py-10 md:py-16 transition-all'>
				<h1 className='sr-only'>Comments</h1>
				{commentThread}
				<TextField />
		</section>
	);
}

export default CommentSection;
