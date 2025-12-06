"use client";
import React from "react";
export function SlideIn({ children, from="20px", delay=0, duration=260 }:{children:React.ReactNode; from?:string; delay?:number; duration?:number}) {
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const style = reduced ? {} : { opacity: 0, transform: `translateY(${from})`, animation: `slidein ${duration}ms ease ${delay}ms forwards` };
  return (
    <>
      <style jsx>{`
        @keyframes slidein { to { opacity:1; transform: translateY(0); } }
      `}</style>
      <div style={style}>{children}</div>
    </>
  );
}
