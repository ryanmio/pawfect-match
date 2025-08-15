"use client"

import { useState, useEffect } from "react"
import { Heart, X, Settings, User, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { fetchPetsWithFilters, type Pet } from "@/lib/petfinder-api"
import { SwipeablePetCard } from "@/components/swipeable-pet-card"
import { FavoritesList } from "@/components/favorites-list"
import { PetDetailsModal } from "@/components/pet-details-modal"
import { FilterPanel, type FilterOptions } from "@/components/filter-panel"

export function PawfectMatch() {
  const [pets, setPets] = useState<Pet[]>([])
  const [currentPetIndex, setCurrentPetIndex] = useState(0)
  const [favorites, setFavorites] = useState<Pet[]>([])
  const [loading, setLoading] = useState(true)
  const [showFavorites, setShowFavorites] = useState(false)
  const [page, setPage] = useState(1)
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null)
  const [showPetDetails, setShowPetDetails] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FilterOptions>({
    type: null,
    age: null,
    size: null,
    gender: null,
    hasPhotos: false,
    goodWithKids: null,
    goodWithDogs: null,
    goodWithCats: null,
  })

  useEffect(() => {
    loadPets()
  }, [])

  useEffect(() => {
    if (pets.length > 0) {
      // Only reload if we already have pets (not on initial load)
      loadPets(true)
    }
  }, [filters])

  const loadPets = async (resetPets = false) => {
    try {
      setLoading(true)
      setError(null)
      const currentPage = resetPets ? 1 : page
      console.log("[v0] Loading pets with filters:", filters) // Debug log
      const response = await fetchPetsWithFilters(currentPage, 20, filters)
      console.log("[v0] Received pets:", response.animals.length, "pets") // Debug log
      setPets((prev) => (resetPets || currentPage === 1 ? response.animals : [...prev, ...response.animals]))

      if (resetPets) {
        setCurrentPetIndex(0)
        setPage(1)
      }
    } catch (error) {
      console.error("Failed to load pets:", error)
      setError("Failed to load pets. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = (direction: "left" | "right") => {
    if (isAnimating) return

    setIsAnimating(true)
    const currentPet = pets[currentPetIndex]

    if (direction === "right" && currentPet) {
      // Add to favorites with animation feedback
      setFavorites((prev) => {
        if (!prev.find((pet) => pet.id === currentPet.id)) {
          return [...prev, currentPet]
        }
        return prev
      })
    }

    // Animate card exit
    setTimeout(() => {
      // Move to next pet
      if (currentPetIndex < pets.length - 1) {
        setCurrentPetIndex((prev) => prev + 1)
      } else {
        // Load more pets
        setPage((prev) => prev + 1)
        loadPets()
      }
      setIsAnimating(false)
    }, 300)
  }

  const handleShowPetDetails = (pet: Pet) => {
    setSelectedPet(pet)
    setShowPetDetails(true)
  }

  const handleAddToFavorites = (pet: Pet) => {
    setFavorites((prev) => {
      if (!prev.find((favPet) => favPet.id === pet.id)) {
        return [...prev, pet]
      }
      return prev
    })
  }

  const isPetFavorited = (pet: Pet) => {
    return favorites.some((favPet) => favPet.id === pet.id)
  }

  const handleRetry = () => {
    setError(null)
    setPage(1)
    setCurrentPetIndex(0)
    loadPets()
  }

  const handleApplyFilters = () => {
    console.log("[v0] Applying filters:", filters) // Debug log
    setPage(1)
    loadPets(true)
  }

  const currentPet = pets[currentPetIndex]

  if (showFavorites) {
    return (
      <FavoritesList
        favorites={favorites}
        onBack={() => setShowFavorites(false)}
        onRemoveFavorite={(petId) => {
          setFavorites((prev) => prev.filter((pet) => pet.id !== petId))
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-sm">
            <Heart className="w-4 h-4 text-primary-foreground fill-current" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Pawfect Match</h1>
        </div>

        <div className="flex items-center gap-2">
          <FilterPanel filters={filters} onFiltersChange={setFilters} onApplyFilters={handleApplyFilters} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowFavorites(true)}
            className="relative transition-all duration-200 hover:scale-105"
          >
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                {favorites.length}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="transition-all duration-200 hover:scale-105">
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="transition-all duration-200 hover:scale-105">
            <User className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 min-h-[calc(100vh-80px)]">
        {error ? (
          <div className="text-center max-w-sm">
            <div className="text-6xl mb-4">😿</div>
            <h2 className="text-xl font-semibold mb-2">Oops! Something went wrong</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        ) : loading && pets.length === 0 ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground animate-pulse">Finding your perfect match...</p>
          </div>
        ) : currentPet ? (
          <div className="w-full max-w-sm">
            <SwipeablePetCard
              pet={currentPet}
              onSwipe={handleSwipe}
              onShowDetails={() => handleShowPetDetails(currentPet)}
              isAnimating={isAnimating}
            />

            {/* Action Buttons */}
            <div className="flex justify-center gap-6 mt-6">
              <Button
                size="lg"
                variant="outline"
                disabled={isAnimating}
                className="rounded-full w-16 h-16 border-2 hover:bg-destructive hover:border-destructive hover:text-destructive-foreground bg-transparent transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
                onClick={() => handleSwipe("left")}
              >
                <X className="w-8 h-8" />
              </Button>

              <Button
                size="lg"
                disabled={isAnimating}
                className="rounded-full w-16 h-16 bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50 shadow-lg"
                onClick={() => handleSwipe("right")}
              >
                <Heart className="w-8 h-8 fill-current" />
              </Button>
            </div>

            {/* Swipe Hint */}
            <div className="text-center mt-4 text-sm text-muted-foreground">
              <p className="animate-fade-in">Swipe or drag to choose • Tap info for details</p>
            </div>
          </div>
        ) : (
          <div className="text-center max-w-sm">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 animate-pulse" />
            <h2 className="text-xl font-semibold mb-2">No more pets to show</h2>
            <p className="text-muted-foreground mb-4">Check back later for more adorable friends!</p>
            <Button
              onClick={() => {
                setCurrentPetIndex(0)
                setPage(1)
                loadPets()
              }}
              className="flex items-center gap-2 transition-all duration-200 hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
              Start Over
            </Button>
          </div>
        )}
      </div>

      <PetDetailsModal
        pet={selectedPet}
        isOpen={showPetDetails}
        onClose={() => setShowPetDetails(false)}
        onAddToFavorites={handleAddToFavorites}
        isFavorited={selectedPet ? isPetFavorited(selectedPet) : false}
      />
    </div>
  )
}
