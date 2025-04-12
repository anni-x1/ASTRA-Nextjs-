import React from 'react';
import style from './styles/sidebar.module.css';
import { useRouter } from 'next/navigation';

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();
  const handleHome = () => {
    router.push('/AstraGateway');
    onClose();
  };
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
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
              <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm120-80v-560H200v560h120Zm80 0h360v-560H400v560Zm-80 0H200h120Z" />
            </svg>
          </div>
          <ul className={style.sidebarList}>
            <li onClick={handleHome}>Home</li>
            <li>Profile</li>
            <li>Settings</li>
            <li>Help</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 