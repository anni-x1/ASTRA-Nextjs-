'use client'
import React, { useEffect, useRef } from 'react'
import { AppContext } from '../context'
import style from './styles/profilePanel.module.css'
import { useRouter } from 'next/navigation'

export default function ProfilePanel({ isOpen, onClose }) {
  const { user, setUser, setAuthenticated } = React.useContext(AppContext)
  const panelRef = useRef(null)
  const router = useRouter()
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
    router.push('/');
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
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm440-80h120v-560H640v560Zm-80 0v-560H200v560h360Zm80 0h120-120Z" /></svg>
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
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
              <path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z" />
            </svg>
            Settings
          </button>
          <button className={style.actionButton}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
              <path d="M480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm40-83q119-15 199.5-104.5T800-480q0-123-80.5-212.5T520-797v634Z" />
            </svg>
            Theme
          </button>
          <button className={style.logoutButton} onClick={handleLogout}>
            <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#ffffff">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M17 8l-1.41 1.41L17.17 11H9v2h8.17l-1.58 1.58L17 16l4-4-4-4zM5 5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h7v-2H5V5z" />
            </svg>
            Log Out
          </button>
        </div>
      </div>
    </>
  )
} 