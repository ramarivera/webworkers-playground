/// <reference types="vite/client" />

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare interface OffscreenCanvas {
  transferControlToOffscreen(): MessagePort;
}

interface Window {
  fonts: {
    add(font: FontFace): void;
  };
}
