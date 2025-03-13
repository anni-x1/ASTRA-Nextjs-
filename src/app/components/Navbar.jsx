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
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
            </div>
            <h1 className={style.title}>ASTRA</h1>
            <div className={style.profileIcon} onClick={toggleProfilePanel}>{user.username.charAt(0).toUpperCase()}</div>
          </>
        ) : (
          // Non-authenticated layout: title (left), login/register (right)
          <>
            <h1 className={style.title}>ASTRA</h1>
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