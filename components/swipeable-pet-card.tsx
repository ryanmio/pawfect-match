"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Palette, Info, Heart, X } from "lucide-react"
import type { Pet } from "@/lib/petfinder-api"

interface SwipeablePetCardProps {
  pet: Pet
  onSwipe: (direction: "left" | "right") => void
  onShowDetails: () => void
  isAnimating: boolean
}

export function SwipeablePetCard({ pet, onSwipe, onShowDetails, isAnimating }: SwipeablePetCardProps) {
  const [imageError, setImageError] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const primaryPhoto = pet.primary_photo_cropped || pet.photos[0]
  const imageUrl = primaryPhoto?.large || primaryPhoto?.medium || primaryPhoto?.small

  const getAgeDisplay = (age: string) => {
    switch (age) {
      case "Baby":
        return "🍼 Baby"
      case "Young":
        return "🐾 Young"
      case "Adult":
        return "🦴 Adult"
      case "Senior":
        return "👴 Senior"
      default:
        return age
    }
  }

  const getSizeDisplay = (size: string) => {
    switch (size) {
      case "Small":
        return "🐕 Small"
      case "Medium":
        return "🐕‍🦺 Medium"
      case "Large":
        return "🐕‍🦺 Large"
      case "Extra Large":
        return "🐕‍🦺 XL"
      default:
        return size
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimating) return
    setIsDragging(true)
    setStartPos({ x: e.clientX, y: e.clientY })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || isAnimating) return
    const deltaX = e.clientX - startPos.x
    const deltaY = e.clientY - startPos.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleMouseUp = () => {
    if (!isDragging || isAnimating) return
    setIsDragging(false)

    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? "right" : "left")
    }

    setDragOffset({ x: 0, y: 0 })
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return
    const touch = e.touches[0]
    setIsDragging(true)
    setStartPos({ x: touch.clientX, y: touch.clientY })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || isAnimating) return
    const touch = e.touches[0]
    const deltaX = touch.clientX - startPos.x
    const deltaY = touch.clientY - startPos.y
    setDragOffset({ x: deltaX, y: deltaY })
  }

  const handleTouchEnd = () => {
    if (!isDragging || isAnimating) return
    setIsDragging(false)

    const threshold = 100
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? "right" : "left")
    }

    setDragOffset({ x: 0, y: 0 })
  }

  const rotation = dragOffset.x * 0.1
  const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) / 300)

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Swipe Indicators */}
      {isDragging && (
        <>
          <div
            className={`absolute top-1/2 left-4 -translate-y-1/2 z-10 transition-opacity duration-200 ${
              dragOffset.x < -50 ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="bg-destructive text-destructive-foreground rounded-full p-3 shadow-lg">
              <X className="w-6 h-6" />
            </div>
          </div>
          <div
            className={`absolute top-1/2 right-4 -translate-y-1/2 z-10 transition-opacity duration-200 ${
              dragOffset.x > 50 ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg">
              <Heart className="w-6 h-6 fill-current" />
            </div>
          </div>
        </>
      )}

      <Card
        ref={cardRef}
        className={`overflow-hidden shadow-lg cursor-grab active:cursor-grabbing transition-all duration-200 ${
          isDragging ? "scale-105" : "hover:scale-[1.02]"
        } ${isAnimating ? "pointer-events-none" : ""}`}
        style={{
          transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y * 0.1}px) rotate(${rotation}deg)`,
          opacity: opacity,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-96 bg-muted">
          {imageUrl && !imageError ? (
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={pet.name}
              className="w-full h-full object-cover transition-transform duration-300"
              onError={() => setImageError(true)}
              draggable={false}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <div className="text-center">
                <div className="text-6xl mb-2">🐾</div>
                <p className="text-muted-foreground">No photo available</p>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm transition-all duration-200"
            onClick={(e) => {
              e.stopPropagation()
              onShowDetails()
            }}
          >
            <Info className="w-4 h-4" />
          </Button>

          {/* Overlay with basic info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
            <h2 className="text-2xl font-bold text-white mb-1 drop-shadow-lg">{pet.name}</h2>
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm drop-shadow">
                {pet.contact.address.city}, {pet.contact.address.state}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Key Details */}
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge variant="secondary" className="text-xs transition-colors hover:bg-secondary/80">
              <Calendar className="w-3 h-3 mr-1" />
              {getAgeDisplay(pet.age)}
            </Badge>
            <Badge variant="secondary" className="text-xs transition-colors hover:bg-secondary/80">
              {getSizeDisplay(pet.size)}
            </Badge>
            <Badge variant="secondary" className="text-xs transition-colors hover:bg-secondary/80">
              {pet.gender}
            </Badge>
            {pet.breeds.primary && (
              <Badge variant="outline" className="text-xs transition-colors hover:bg-accent/10">
                {pet.breeds.primary}
              </Badge>
            )}
          </div>

          {/* Colors */}
          {pet.colors.primary && (
            <div className="flex items-center gap-2 mb-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {pet.colors.primary}
                {pet.colors.secondary && `, ${pet.colors.secondary}`}
              </span>
            </div>
          )}

          {/* Description */}
          {pet.description && (
            <p className="text-sm text-muted-foreground line-clamp-3 mb-3 leading-relaxed">{pet.description}</p>
          )}

          {/* Special Attributes */}
          <div className="flex flex-wrap gap-1">
            {pet.attributes.house_trained && (
              <Badge variant="outline" className="text-xs transition-colors hover:bg-green-50">
                🏠 House Trained
              </Badge>
            )}
            {pet.attributes.spayed_neutered && (
              <Badge variant="outline" className="text-xs transition-colors hover:bg-blue-50">
                ✂️ Spayed/Neutered
              </Badge>
            )}
            {pet.attributes.shots_current && (
              <Badge variant="outline" className="text-xs transition-colors hover:bg-purple-50">
                💉 Vaccinated
              </Badge>
            )}
            {pet.attributes.special_needs && (
              <Badge variant="outline" className="text-xs transition-colors hover:bg-orange-50">
                💝 Special Needs
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
