"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Calendar, Palette, Info } from "lucide-react"
import type { Pet } from "@/lib/petfinder-api"

interface PetCardProps {
  pet: Pet
  onShowDetails?: () => void
}

export function PetCard({ pet, onShowDetails }: PetCardProps) {
  const [imageError, setImageError] = useState(false)

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

  return (
    <Card className="w-full max-w-sm mx-auto overflow-hidden shadow-lg">
      <div className="relative h-96 bg-muted">
        {imageUrl && !imageError ? (
          <img
            src={imageUrl || "/placeholder.svg"}
            alt={pet.name}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <div className="text-center">
              <div className="text-6xl mb-2">🐾</div>
              <p className="text-muted-foreground">No photo available</p>
            </div>
          </div>
        )}

        {onShowDetails && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
            onClick={onShowDetails}
          >
            <Info className="w-4 h-4" />
          </Button>
        )}

        {/* Overlay with basic info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h2 className="text-2xl font-bold text-white mb-1">{pet.name}</h2>
          <div className="flex items-center gap-2 text-white/90">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              {pet.contact.address.city}, {pet.contact.address.state}
            </span>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Key Details */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            <Calendar className="w-3 h-3 mr-1" />
            {getAgeDisplay(pet.age)}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {getSizeDisplay(pet.size)}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {pet.gender}
          </Badge>
          {pet.breeds.primary && (
            <Badge variant="outline" className="text-xs">
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
        {pet.description && <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{pet.description}</p>}

        {/* Special Attributes */}
        <div className="flex flex-wrap gap-1">
          {pet.attributes.house_trained && (
            <Badge variant="outline" className="text-xs">
              🏠 House Trained
            </Badge>
          )}
          {pet.attributes.spayed_neutered && (
            <Badge variant="outline" className="text-xs">
              ✂️ Spayed/Neutered
            </Badge>
          )}
          {pet.attributes.shots_current && (
            <Badge variant="outline" className="text-xs">
              💉 Vaccinated
            </Badge>
          )}
          {pet.attributes.special_needs && (
            <Badge variant="outline" className="text-xs">
              💝 Special Needs
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
