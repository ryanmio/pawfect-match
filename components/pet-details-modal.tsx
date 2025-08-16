"use client"

import { useState } from "react"
import { X, MapPin, Calendar, Palette, Phone, Mail, ExternalLink, Heart, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Pet } from "@/lib/types"

interface PetDetailsModalProps {
  pet: Pet | null
  isOpen: boolean
  onClose: () => void
  onAddToFavorites: (pet: Pet) => void
  isFavorited: boolean
}

export function PetDetailsModal({ pet, isOpen, onClose, onAddToFavorites, isFavorited }: PetDetailsModalProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)

  if (!pet) return null

  const photos = pet.photos.length > 0 ? pet.photos : []
  const currentPhoto = photos[currentPhotoIndex]

  const getAgeDisplay = (age: string) => {
    switch (age) {
      case "Baby":
        return "Baby"
      case "Young":
        return "Young"
      case "Adult":
        return "Adult"
      case "Senior":
        return "Senior"
      default:
        return age
    }
  }

  const nextPhoto = () => {
    if (photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)
      setImageLoading(true)
    }
  }

  const prevPhoto = () => {
    if (photos.length > 1) {
      setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)
      setImageLoading(true)
    }
  }

  const handleAddToFavorites = () => {
    onAddToFavorites(pet)
    // Add a subtle success animation or feedback here
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-0 animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="relative">
          {/* Photo Gallery */}
          <div className="relative h-80 bg-muted overflow-hidden">
            {currentPhoto ? (
              <div className="relative w-full h-full">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                <img
                  src={currentPhoto.large || currentPhoto.medium || currentPhoto.small}
                  alt={pet.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoading ? "opacity-0" : "opacity-100"
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={() => setImageLoading(false)}
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-muted">
                <div className="text-center">
                  <div className="text-6xl mb-2">🐾</div>
                  <p className="text-muted-foreground">No photo available</p>
                </div>
              </div>
            )}

            {/* Photo Navigation */}
            {photos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white transition-all duration-200 hover:scale-110"
                  onClick={prevPhoto}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white transition-all duration-200 hover:scale-110"
                  onClick={nextPhoto}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>

                {/* Photo Indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {photos.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentPhotoIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"
                      }`}
                      onClick={() => {
                        setCurrentPhotoIndex(index)
                        setImageLoading(true)
                      }}
                    />
                  ))}
                </div>
              </>
            )}

            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white transition-all duration-200 hover:scale-110"
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Pet Information */}
          <div className="p-6">
            <DialogHeader className="mb-4">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-2xl font-bold mb-2">{pet.name}</DialogTitle>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {pet.contact.address.city}, {pet.contact.address.state}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleAddToFavorites}
                  variant={isFavorited ? "default" : "outline"}
                  className={`flex items-center gap-2 transition-all duration-200 hover:scale-105 ${
                    isFavorited ? "animate-pulse" : ""
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
                  {isFavorited ? "Favorited" : "Add to Favorites"}
                </Button>
              </div>
            </DialogHeader>

            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">Age</span>
                  </div>
                  <p className="text-lg">{getAgeDisplay(pet.age)}</p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Size</span>
                  </div>
                  <p className="text-lg">{pet.size}</p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Gender</span>
                  </div>
                  <p className="text-lg">{pet.gender}</p>
                </CardContent>
              </Card>

              <Card className="transition-all duration-200 hover:shadow-md">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Breed</span>
                  </div>
                  <p className="text-lg">{pet.breeds.primary}</p>
                  {pet.breeds.secondary && (
                    <p className="text-sm text-muted-foreground">Mixed with {pet.breeds.secondary}</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Colors */}
            {pet.colors.primary && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">Colors</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="transition-colors hover:bg-accent/10">
                    {pet.colors.primary}
                  </Badge>
                  {pet.colors.secondary && (
                    <Badge variant="outline" className="transition-colors hover:bg-accent/10">
                      {pet.colors.secondary}
                    </Badge>
                  )}
                  {pet.colors.tertiary && (
                    <Badge variant="outline" className="transition-colors hover:bg-accent/10">
                      {pet.colors.tertiary}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Special Attributes */}
            <div className="mb-6">
              <h3 className="font-medium mb-3">Special Attributes</h3>
              <div className="flex flex-wrap gap-2">
                {pet.attributes.house_trained && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 transition-all hover:scale-105">
                    House Trained
                  </Badge>
                )}
                {pet.attributes.spayed_neutered && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 transition-all hover:scale-105">
                    Spayed/Neutered
                  </Badge>
                )}
                {pet.attributes.shots_current && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 transition-all hover:scale-105">
                    Vaccinated
                  </Badge>
                )}
                {pet.attributes.special_needs && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 transition-all hover:scale-105">
                    Special Needs
                  </Badge>
                )}
              </div>
            </div>

            {/* Environment */}
            {(pet.environment.children || pet.environment.dogs || pet.environment.cats) && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Good With</h3>
                <div className="flex flex-wrap gap-2">
                  {pet.environment.children && (
                    <Badge variant="outline" className="bg-yellow-50 transition-all hover:scale-105">
                      Children
                    </Badge>
                  )}
                  {pet.environment.dogs && (
                    <Badge variant="outline" className="bg-blue-50 transition-all hover:scale-105">
                      Dogs
                    </Badge>
                  )}
                  {pet.environment.cats && (
                    <Badge variant="outline" className="bg-pink-50 transition-all hover:scale-105">
                      Cats
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {pet.description && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">About {pet.name}</h3>
                <p className="text-muted-foreground leading-relaxed">{pet.description}</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Contact for Adoption</h3>
              <div className="flex flex-wrap gap-3">
                {pet.contact.phone && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent transition-all hover:scale-105"
                  >
                    <Phone className="w-4 h-4" />
                    Call
                  </Button>
                )}
                {pet.contact.email && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 bg-transparent transition-all hover:scale-105"
                  >
                    <Mail className="w-4 h-4" />
                    Email
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent transition-all hover:scale-105"
                >
                  <ExternalLink className="w-4 h-4" />
                  View on Petfinder
                </Button>
              </div>

              {pet.contact.address && (
                <div className="mt-4 p-4 bg-muted rounded-lg transition-all hover:shadow-sm">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {pet.contact.address.address1}
                        {pet.contact.address.address2 && `, ${pet.contact.address.address2}`}
                        <br />
                        {pet.contact.address.city}, {pet.contact.address.state} {pet.contact.address.postcode}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
