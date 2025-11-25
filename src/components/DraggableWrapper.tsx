import React, { useState, useEffect, useRef } from "react";

interface DraggableWrapperProps {
    children: React.ReactNode;
    defaultPosition?: { x: number; y: number };
}

const DraggableWrapper: React.FC<DraggableWrapperProps> = ({
    children,
    defaultPosition = { x: window.innerWidth - 412, y: window.innerHeight - 600 }
}) => {
    const [position, setPosition] = useState(defaultPosition);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging) return;
            setPosition({
                x: e.clientX - dragOffset.current.x,
                y: e.clientY - dragOffset.current.y
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging]);

    const handleMouseDown = (e: React.MouseEvent) => {
        if (wrapperRef.current) {
            const rect = wrapperRef.current.getBoundingClientRect();
            dragOffset.current = {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            };
            setIsDragging(true);
        }
    };

    return (
        <div
            ref={wrapperRef}
            style={{
                position: "fixed",
                left: position.x,
                top: position.y,
                cursor: isDragging ? "grabbing" : "grab",
                zIndex: 9999
            }}
            onMouseDown={handleMouseDown}
        >
            {children}
        </div>
    );
};

export default DraggableWrapper;
