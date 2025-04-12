'use client'
import React, { useState } from 'react'
import style from './styles/navbar.module.css'
import Sidebar from './Sidebar'
import ProfilePanel from './ProfilePanel'
import { AppContext } from '../context'
import Link from 'next/link'

export default function Navbar() {
  const { authenticated, user } = React.useContext(AppContext)
  const [SideBar, setSideBar] = useState(false);
  const [profilePanel, setProfilePanel] = useState(false);

  const toggleSidebar = () => {
    setSideBar(!SideBar);
    // Close profile panel if open
    if (profilePanel) setProfilePanel(false);
  };

  const toggleProfilePanel = () => {
    setProfilePanel(!profilePanel);
    // Close sidebar if open
    if (SideBar) setSideBar(false);
  };

  const closeSidebar = () => {
    setSideBar(false);
  };

  const closeProfilePanel = () => {
    setProfilePanel(false);
  };

  return (
    <>
      <Sidebar isOpen={SideBar} onClose={closeSidebar} />
      <ProfilePanel isOpen={profilePanel} onClose={closeProfilePanel} />
      <div className={style.navbar}>
        {authenticated ? (
          // Authenticated layout: menu (left), title (center), profile (right)
          <>
            <div className={style.menuIcon} onClick={toggleSidebar}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
            <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm440-80h120v-560H640v560Zm-80 0v-560H200v560h360Zm80 0h120-120Z"/>
            </svg>
            </div>
            <h1 className={style.title}>ASTRA</h1>
            <div className={style.profileIcon} onClick={toggleProfilePanel}>{user.username.charAt(0).toUpperCase()}</div>
          </>
        ) : (
          // Non-authenticated layout: title (left), login/register (right)
          <>
            <Link className={style.title} href="/">ASTRA</Link>
            <div className={style.authButtons}>
              <button className={style.loginButton}>
                <Link style={{ textDecoration: 'none', color: 'white' }} href="/login">Login</Link>
              </button>
              <button className={style.registerButton}>
                <Link style={{ textDecoration: 'none', color: 'black' }} href="/register">Register</Link>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}