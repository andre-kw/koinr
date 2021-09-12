import React from 'react';
import './styles/BackgroundOverlay.css';

export default function BackgroundOverlay(props) {

  return (
    <div id="bg-overlay" onClick={() => props.setInfoDrawerAddress(null)}></div>
  );
}