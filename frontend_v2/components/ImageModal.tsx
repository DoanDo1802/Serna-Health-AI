"use client"

import React, { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

interface ImageModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  alt?: string
}

export function ImageModal({ isOpen, onClose, imageUrl, alt = "Image" }: ImageModalProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLImageElement>(null)

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev * 1.2, 5))
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev / 1.2, 0.1))
  }

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const handleReset = () => {
    setScale(1)
    setRotation(0)
    setPosition({ x: 0, y: 0 })
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    if (e.deltaY < 0) {
      handleZoomIn()
    } else {
      handleZoomOut()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] p-0 bg-black/95 border-white/20">
        <DialogHeader className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-lg font-semibold">
              {alt}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Reset
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>
        
        <div 
          className="flex-1 overflow-hidden relative bg-black"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <div className="w-full h-full flex items-center justify-center">
            <img
              ref={imageRef}
              src={imageUrl}
              alt={alt}
              className={`max-w-full max-h-full object-contain select-none ${
                scale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
              }`}
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              draggable={false}
            />
          </div>
          
          {/* Zoom indicator */}
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            {Math.round(scale * 100)}%
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ImageModal
