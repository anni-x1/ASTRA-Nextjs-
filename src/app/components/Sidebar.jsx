import React from 'react';
import style from './styles/sidebar.module.css';

export default function Sidebar({ isOpen, onClose }) {
  return (
    <div className={`${style.sidebarContainer} ${isOpen ? style.active : ''}`}>
      <div
        className={style.overlay}
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0, visibility: isOpen ? 'visible' : 'hidden' }}
      ></div>
      <div className={`${style.sidebar} ${isOpen ? style.open : ''}`}>
        <div className={style.sidebarContent}>
          <div className={style.menuIcon} onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
            </svg>
          </div>
          <h2>ASTRA</h2>
          <ul>
            <li>Home</li>
            <li>Profile</li>
            <li>Settings</li>
            <li>Help</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 