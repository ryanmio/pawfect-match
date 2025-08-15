"use client"

import { ArrowLeft, MapPin, Phone, Mail, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Pet } from "@/lib/petfinder-api"

interface FavoritesListProps {
  favorites: Pet[]
  onBack: () => void
  onRemoveFavorite: (petId: number) => void
}

export function FavoritesList({ favorites, onBack, onRemoveFavorite }: FavoritesListProps) {
  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="flex items-center gap-4 p-4 border-b border-border">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold">My Favorites</h1>
        </header>

        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">💔</div>
          <h2 className="text-xl font-semibold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-4">Start swiping right on pets you'd like to adopt!</p>
          <Button onClick={onBack}>Start Swiping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center gap-4 p-4 border-b border-border">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-semibold">My Favorites ({favorites.length})</h1>
      </header>

      <div className="p-4 space-y-4">
        {favorites.map((pet) => (
          <Card key={pet.id} className="overflow-hidden">
            <div className="flex">
              <div className="w-24 h-24 bg-muted flex-shrink-0">
                {pet.primary_photo_cropped?.medium || pet.photos[0]?.medium ? (
                  <img
                    src={pet.primary_photo_cropped?.medium || pet.photos[0]?.medium}
                    alt={pet.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-2xl">🐾</span>
                  </div>
                )}
              </div>

              <div className="flex-1 p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-lg">{pet.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3" />
                      {pet.contact.address.city}, {pet.contact.address.state}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveFavorite(pet.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    Remove
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {pet.age}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {pet.size}
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

                <div className="flex flex-wrap gap-2">
                  {pet.contact.phone && (
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      <Phone className="w-3 h-3 mr-1" />
                      Call
                    </Button>
                  )}
                  {pet.contact.email && (
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
