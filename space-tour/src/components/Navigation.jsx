import logo from '../assets/shared/logo.svg';
import { NavLink } from 'react-router-dom';
import NavToggle from './NavToggle';
import { useState } from 'react';

function Navigation() {
	const [showMenu, setShowMenu] = useState(false);

	return (
		<>
			<a className='skip-to-content' href='#main'>
				Skip to content
			</a>
			<header className='header'>
				<div>
					<img src={logo} alt='space tourism logo' className='logo' />
				</div>
				<NavToggle
					onToggle={showMenu}
					onClick={() => setShowMenu(!showMenu)}
				/>
				<nav>
					<ul data-visible={showMenu} className='header__nav'>
						<li>
							<NavLink
								to='/'
								className={({ isActive }) =>
									isActive ? 'link--active' : 'link'
								}
								end
								onClick={() => setShowMenu(!showMenu)}
							>
								<span aria-hidden='true' className='link-num'>
									00
								</span>
								Home
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/destination'
								className={({ isActive }) =>
									isActive ? 'link--active' : 'link'
								}
								onClick={() => setShowMenu(!showMenu)}
							>
								<span aria-hidden='true' className='link-num'>
									01
								</span>
								Destination
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/crew'
								className={({ isActive }) =>
									isActive ? 'link--active' : 'link'
								}
								onClick={() => setShowMenu(!showMenu)}
							>
								<span aria-hidden='true' className='link-num'>
									02
								</span>
								Crew
							</NavLink>
						</li>
						<li>
							<NavLink
								to='/technology'
								className={({ isActive }) =>
									isActive ? 'link--active' : 'link'
								}
								onClick={() => setShowMenu(!showMenu)}
							>
								<span aria-hidden='true' className='link-num'>
									03
								</span>
								Technology
							</NavLink>
						</li>
					</ul>
				</nav>
			</header>
		</>
	);
}

export default Navigation;
