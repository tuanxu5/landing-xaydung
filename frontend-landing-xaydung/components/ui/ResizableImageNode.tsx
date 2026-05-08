'use client';

import { NodeViewWrapper } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';

export default function ResizableImageNode({ node, updateAttributes, selected }: any) {
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: node.attrs.width || 'auto',
    height: node.attrs.height || 'auto',
  });
  const imgRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 });

  useEffect(() => {
    if (node.attrs.width) {
      setDimensions({
        width: node.attrs.width,
        height: node.attrs.height || 'auto',
      });
    }
  }, [node.attrs.width, node.attrs.height]);

  const handleMouseDown = (e: React.MouseEvent, corner: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    
    const img = imgRef.current;
    if (!img) return;

    const rect = img.getBoundingClientRect();
    startPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: rect.width,
      height: rect.height,
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!img) return;

      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      let newWidth = startPos.current.width;
      let newHeight = startPos.current.height;

      // Calculate based on corner
      if (corner.includes('e')) {
        newWidth = startPos.current.width + deltaX;
      } else if (corner.includes('w')) {
        newWidth = startPos.current.width - deltaX;
      }

      if (corner.includes('s')) {
        newHeight = startPos.current.height + deltaY;
      } else if (corner.includes('n')) {
        newHeight = startPos.current.height - deltaY;
      }

      // Maintain aspect ratio
      const aspectRatio = startPos.current.width / startPos.current.height;
      newHeight = newWidth / aspectRatio;

      // Min size
      if (newWidth < 50) newWidth = 50;
      if (newHeight < 50) newHeight = 50;

      setDimensions({
        width: `${Math.round(newWidth)}px`,
        height: `${Math.round(newHeight)}px`,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);

      // Update attributes
      updateAttributes({
        width: dimensions.width,
        height: dimensions.height,
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <NodeViewWrapper className="resizable-image-wrapper" data-drag-handle>
      <div
        ref={wrapperRef}
        className={`relative inline-block group ${selected ? 'is-selected' : ''}`}
        style={{
          width: dimensions.width !== 'auto' ? dimensions.width : undefined,
          height: dimensions.height !== 'auto' ? dimensions.height : undefined,
        }}
      >
        <img
          ref={imgRef}
          src={node.attrs.src}
          alt={node.attrs.alt || ''}
          className="rounded-lg max-w-full h-auto block"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />

        {/* Always show handles on hover or when selected */}
        <div className={`resize-handles ${selected ? 'visible' : ''}`}>
          {/* Resize handles */}
          <div
            className="resize-handle nw"
            onMouseDown={(e) => handleMouseDown(e, 'nw')}
          />
          <div
            className="resize-handle ne"
            onMouseDown={(e) => handleMouseDown(e, 'ne')}
          />
          <div
            className="resize-handle sw"
            onMouseDown={(e) => handleMouseDown(e, 'sw')}
          />
          <div
            className="resize-handle se"
            onMouseDown={(e) => handleMouseDown(e, 'se')}
          />

          {/* Selection border */}
          <div className="selection-border" />
        </div>
      </div>

      <style jsx>{`
        .resizable-image-wrapper {
          display: inline-block;
          max-width: 100%;
          user-select: none;
        }
        
        .resizable-image-wrapper > div {
          position: relative;
        }

        .resize-handles {
          opacity: 0;
          transition: opacity 0.2s;
        }

        .resizable-image-wrapper:hover .resize-handles,
        .resize-handles.visible {
          opacity: 1;
        }
        
        .resize-handle {
          position: absolute;
          width: 12px;
          height: 12px;
          background: #3b82f6;
          border: 2px solid white;
          border-radius: 50%;
          z-index: 10;
          transition: transform 0.1s;
        }

        .resize-handle:hover {
          transform: scale(1.3);
        }

        .resize-handle.nw {
          top: -6px;
          left: -6px;
          cursor: nw-resize;
        }

        .resize-handle.ne {
          top: -6px;
          right: -6px;
          cursor: ne-resize;
        }

        .resize-handle.sw {
          bottom: -6px;
          left: -6px;
          cursor: sw-resize;
        }

        .resize-handle.se {
          bottom: -6px;
          right: -6px;
          cursor: se-resize;
        }

        .selection-border {
          position: absolute;
          inset: -2px;
          border: 2px solid #3b82f6;
          border-radius: 0.5rem;
          pointer-events: none;
        }

        .is-selected img {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
      `}</style>
    </NodeViewWrapper>
  );
}
