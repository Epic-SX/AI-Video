import React from 'react';

export default function Spinner() {
    return (
        <div className="relative w-1 h-1 animate-rotateSpinner">
            <div
                className="absolute w-full h-full bg-indigo-200 rounded-full animate-spinner"
                style={{ '--rotation': '90deg' } as React.CSSProperties}
            ></div>
            <div
                className="absolute w-full h-full bg-indigo-200 rounded-full animate-spinner"
                style={{ '--rotation': '180deg' } as React.CSSProperties}
            ></div>
            <div
                className="absolute w-full h-full bg-indigo-200 rounded-full animate-spinner"
                style={{ '--rotation': '270deg' } as React.CSSProperties}
            ></div>
            <div
                className="absolute w-full h-full bg-indigo-200 rounded-full animate-spinner"
                style={{ '--rotation': '360deg' } as React.CSSProperties}
            ></div>
        </div>
    );
}
