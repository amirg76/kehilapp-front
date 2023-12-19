import React, { useState } from 'react'
import { NavLink } from 'react-router-dom';
// import MenuIcon from '@mui/icons-material/Menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import NavBarLogo from './NavBarLogo';
import NavBarContact from './NavBarContact';
import NavBarButton from './NavBarButton';
import Sidebar from '../../features/sidebar/components/Sidebar';

export function Header() {

    const [open, setOpen] = useState(false)

    const onOpenNavbar = () => {
        console.log('open');
        setOpen(true)
    }

    return (
        <header className="sticky top-0 right-0 z-20 bg-white border-[#0000001a] border-solid shadow-navShadow">
            <div className={open ? 'main-screen opacity-100 pointer-events-auto' : 'main-screen'} onClick={() => setOpen(false)}></div>
            <nav className="flex h-24 items-center justify-between p-5">
                <NavLink to="/"><NavBarLogo /></NavLink>
                <div className="hidden md:flex">
                    <NavBarContact />
                    <NavBarButton />
                </div>
                {/* <div className={`max-md:flex flex-column fixed left-0 top-0 bg-white opacity-90
                   h-screen border-l-[1px]-[#ebebeb] z-30 transition-transform duration-600
                   ${open ? 'translate-x-0' : 'translate-x-[-100%] md:flex'}`}>
                </div> */}
                <Sidebar classes={`max-md:flex flex-column fixed left-0 top-0 bg-white opacity-90
                   h-screen border-l-[1px]-[#ebebeb] z-30 transition-transform duration-600
                   ${open ? 'translate-x-0' : 'translate-x-[-100%] md:flex'}`} />
                {/* <MenuIcon className="hamburger" onClick={onOpenNavbar}></MenuIcon> */}
                <FontAwesomeIcon className='md:hidden' onClick={onOpenNavbar} icon={faBars} />
            </nav>
        </header>
    )
}

// .links{
//     flex-direction  : column;
//         position        : fixed;
//         right           : 0;
//         top             : 0;
//         background-color: rgba(255, 255, 255, .9);
//         height          : 100vh;
//         border-left     : 1px solid #ebebeb;
//         box-shadow      : 0px 0px 10px rgba(0, 0, 0, .16);
//         transform       : translateX(100%);
//         transition      : transform .6s;
//         z-index         : 2;
// }