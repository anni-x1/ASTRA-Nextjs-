// PulsatingCore.jsx
'use client'
import React from "react";
import { AppContext } from "../context";
import core from "../assets/core.png";
import style from "./styles/core.module.css";
import Image from "next/image";
import AudioStream from "./AudioStream";
import ChatWindow from "./ChatWindow";
const Core = () => {
  const { size, listening, setListening } = React.useContext(AppContext);

  return (
    <div className={style.mainContainer}>
      <div className={style.pulsatingCoreContainer}>
      {listening ?
        <div
          className={style.coreDiv}
          style={{ transform: `scale(${size})`, transition: 'transform 0.1s ease-out' }}
        >
          <Image src={core} alt="core" priority />
        </div> :
        <div
          className={style.pulsateCore}
        >
          <Image src={core} alt="core" priority />
        </div>
      }
      {listening && <AudioStream />}
    </div>
    <div className={style.chatWindowContainer}>
      <ChatWindow />
    </div>
    </div>
  );
};

export default Core;