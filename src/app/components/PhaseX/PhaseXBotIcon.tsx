import React from "react";

export const PhaseXBotIcon = ({ size = 26, color = "currentColor", className = "", style = {} }: any) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
        <path d="M12 4v4" />
        <path d="M10 4h4" />
        <rect x="5" y="8" width="14" height="10" rx="3" />
        <path d="M9 12v2" />
        <path d="M15 12v2" />
        <path d="M2 13h3" />
        <path d="M19 13h3" />
    </svg>
);
