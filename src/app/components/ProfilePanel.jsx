'use client'
import React, { useEffect, useRef } from 'react'
import { AppContext } from '../context'
import style from './styles/profilePanel.module.css'

export default function ProfilePanel({ isOpen, onClose }) {
  const { user, setUser, setAuthenticated } = React.useContext(AppContext)
  const panelRef = useRef(null)

  // Handle escape key press to close the panel
  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [isOpen, onClose])

  // Handle click outside to close the panel
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleLogout = () => {
    setAuthenticated(false)
    setUser(null)
    onClose()
  }

  return (
    <>
      {/* Overlay */}
      <div 
        className={`${style.overlay} ${isOpen ? style.active : ''}`} 
        onClick={onClose}
      />
      
      {/* Profile Panel */}
      <div 
        ref={panelRef}
        className={`${style.profilePanel} ${isOpen ? style.open : ''}`}
      >
        <button className={style.closeButton} onClick={onClose}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
            <path d="M0 0h24v24H0V0z" fill="none"/>
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
          </svg>
        </button>

        {/* Top Section - User Overview */}
        <div className={style.userSection}>
          <div className={style.userAvatar}>{user?.username?.charAt(0).toUpperCase()}</div>
          <h2 className={style.userName}>{user?.username}</h2>
          <p className={style.userEmail}>{user?.email}</p>
        </div>

        {/* Middle Section - Quick Actions */}
        <div className={style.actionsSection}>
          <button className={style.actionButton}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#000000">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73-.25 1.64-1.67 2.9-3.39 2.9-1.72 0-3.15-1.27-3.39-2.9-.03-.31-.05-.54-.05-.73 0-.21.02-.43.05-.73.25-1.64 1.67-2.9 3.39-2.9 1.72 0 3.14 1.27 3.39 2.9zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"/>
            </svg>
            Settings
          </button>
          <button className={style.actionButton}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#000000">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zm-2 5.79V18h-3.52L12 20.48 9.52 18H6v-3.52L3.52 12 6 9.52V6h3.52L12 3.52 14.48 6H18v3.52L20.48 12 18 14.48zM12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79-4-4-4z"/>
            </svg>
            Theme
          </button>
          <button className={style.logoutButton} onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#ffffff">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M17 8l-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4-4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5z"/>
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </>
  )
} 