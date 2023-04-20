import { useState } from 'react';

// import Plus from '../../assets/icon-plus.svg';
// import Minus from '../../assets/icon-minus.svg';
import Reply from '../../assets/icon-reply.svg';
import pfp from '../../assets/avatars/image-amyrobson.png';
import Button from '../ui/Button';
import Plus from '../ui/Plus';
import Minus from '../ui/Minus';

function Comment(props) {
	const [count, setCount] = useState(12);

	return (
		<div className='comment grid gap-3 md:gap-x-7 bg-white dark:bg-Gray p-6 rounded-lg shadow-sm'>
			<div className='user grid xsm:flex items-center xsm:gap-3'>
				{' '}
				<img src={pfp} alt='user-image' className='w-8 h-8' />
				<p className='text-DarkBlue dark:text-Username font-bold'>
					amyrobson
				</p>
				<span className='dark:text-PaleBlue'>1 month ago</span>
			</div>
			<p className='text dark:text-PaleBlue'>
				Impressive! Though it seems the drag feature could be improved. But
				overall it looks incredible. You've nailed the design and the
				responsiveness at various breakpoints works really well.
			</p>
			<div className='vote h-fit bg-LightGray dark:bg-Vote flex md:flex-col md:self-center gap-2 items-center justify-center p-2 w-fit rounded-lg'>
				<Button
					onClick={() => setCount((prevCount) => prevCount + 1)}
					className='w-6 h-6 justify-center flex items-center '
				>
					{/* <img src={Plus} alt='upvote' /> */}
					<Plus className='hover:fill-ModerateBlue' />
				</Button>
				<span className='text-ModerateBlue font-bold'>{count}</span>
				<Button
					onClick={() => setCount((prevCount) => prevCount - 1)}
					className='w-6 h-6 justify-center flex items-center'
				>
					{/* <img src={Minus} alt='downvote' /> */}
					<Minus className='hover:fill-ModerateBlue' />
				</Button>
			</div>

			<Button className='reply flex gap-2 items-center justify-self-end text-ModerateBlue hover:text-LightBlue font-bold'>
				<img src={Reply} alt='reply' />
				<span>Reply</span>
			</Button>
		</div>
	);
}

export default Comment;
