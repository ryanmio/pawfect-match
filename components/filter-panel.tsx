"use client"

import { useState, useEffect, useCallback } from "react"
import { Filter, X, Check, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export interface FilterOptions {
  type: string | null
  age: string | null
  size: string | null
  gender: string | null
  hasPhotos: boolean
  goodWithKids: boolean | null
  goodWithDogs: boolean | null
  goodWithCats: boolean | null
  location: string | null
  distance: number | null
}

interface FilterPanelProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onApplyFilters: () => void
}

const ANIMAL_TYPES = [
  { value: "dog", label: "Dogs", emoji: "🐕" },
  { value: "cat", label: "Cats", emoji: "🐱" },
  { value: "rabbit", label: "Rabbits", emoji: "🐰" },
  { value: "bird", label: "Birds", emoji: "🐦" },
  { value: "horse", label: "Horses", emoji: "🐴" },
  { value: "small-furry", label: "Small & Furry", emoji: "🐹" },
  { value: "scales-fins-other", label: "Scales, Fins & Other", emoji: "🐠" },
  { value: "barnyard", label: "Barnyard", emoji: "🐷" },
]

const AGE_OPTIONS = [
  { value: "baby", label: "Baby" },
  { value: "young", label: "Young" },
  { value: "adult", label: "Adult" },
  { value: "senior", label: "Senior" },
]

const SIZE_OPTIONS = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "xlarge", label: "Extra Large" },
]

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
]

const DISTANCE_OPTIONS = [
  { value: 25, label: "25 miles" },
  { value: 50, label: "50 miles" },
  { value: 100, label: "100 miles" },
  { value: 250, label: "250 miles" },
  { value: 500, label: "500 miles" },
]

export function FilterPanel({ filters, onFiltersChange, onApplyFilters }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localLocation, setLocalLocation] = useState(filters.location || "")

  const debouncedLocationUpdate = useCallback(
    debounce((value: string) => {
      updateFilter("location", value || null)
    }, 500),
    [],
  )

  useEffect(() => {
    setLocalLocation(filters.location || "")
  }, [filters.location])

  const updateFilter = <K extends keyof FilterOptions>(key: K, value: FilterOptions[K]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearAllFilters = () => {
    onFiltersChange({
      type: null,
      age: null,
      size: null,
      gender: null,
      hasPhotos: false,
      goodWithKids: null,
      goodWithDogs: null,
      goodWithCats: null,
      location: null,
      distance: null,
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.type) count++
    if (filters.age) count++
    if (filters.size) count++
    if (filters.gender) count++
    if (filters.hasPhotos) count++
    if (filters.goodWithKids !== null) count++
    if (filters.goodWithDogs !== null) count++
    if (filters.goodWithCats !== null) count++
    if (filters.location) count++
    if (filters.distance) count++
    return count
  }

  const handleApplyFilters = () => {
    onApplyFilters()
    setIsOpen(false)
  }

  const activeFilterCount = getActiveFilterCount()

  const handleLocationChange = (value: string) => {
    setLocalLocation(value)
    debouncedLocationUpdate(value)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative transition-all duration-200 hover:scale-105 bg-transparent"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-primary text-primary-foreground"
            >
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Pets
          </SheetTitle>
          <SheetDescription>Find your perfect match by filtering pets based on your preferences.</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Location */}
          <div>
            <Label className="text-base font-semibold mb-3 block flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Location
            </Label>
            <div className="space-y-3">
              <div>
                <Label htmlFor="location" className="text-sm text-muted-foreground">
                  Zip Code or City, State
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. 90210 or Los Angeles, CA"
                  value={localLocation}
                  onChange={(e) => handleLocationChange(e.target.value)}
                  className="mt-1"
                />
                {localLocation && !isValidLocation(localLocation) && (
                  <p className="text-xs text-muted-foreground mt-1">Enter a 5-digit zip code or "City, State" format</p>
                )}
              </div>
              {filters.location && isValidLocation(filters.location) && (
                <div>
                  <Label htmlFor="distance" className="text-sm text-muted-foreground">
                    Search Radius
                  </Label>
                  <Select
                    value={filters.distance?.toString() || ""}
                    onValueChange={(value) => updateFilter("distance", value ? Number.parseInt(value) : null)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select distance" />
                    </SelectTrigger>
                    <SelectContent>
                      {DISTANCE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Animal Type */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Animal Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {ANIMAL_TYPES.map((type) => (
                <Button
                  key={type.value}
                  variant={filters.type === type.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter("type", filters.type === type.value ? null : type.value)}
                  className="justify-start h-auto p-3"
                >
                  <span className="mr-2">{type.emoji}</span>
                  {type.label}
                  {filters.type === type.value && <Check className="w-4 h-4 ml-auto" />}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Photos Filter */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="has-photos" className="text-base font-semibold">
                Only pets with photos
              </Label>
              <p className="text-sm text-muted-foreground mt-1">Show only pets that have pictures available</p>
            </div>
            <Switch
              id="has-photos"
              checked={filters.hasPhotos}
              onCheckedChange={(checked) => updateFilter("hasPhotos", checked)}
            />
          </div>

          <Separator />

          {/* Age */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Age</Label>
            <div className="grid grid-cols-2 gap-2">
              {AGE_OPTIONS.map((age) => (
                <Button
                  key={age.value}
                  variant={filters.age === age.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter("age", filters.age === age.value ? null : age.value)}
                  className="justify-start"
                >
                  {age.label}
                  {filters.age === age.value && <Check className="w-4 h-4 ml-auto" />}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Size */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Size</Label>
            <div className="grid grid-cols-2 gap-2">
              {SIZE_OPTIONS.map((size) => (
                <Button
                  key={size.value}
                  variant={filters.size === size.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter("size", filters.size === size.value ? null : size.value)}
                  className="justify-start"
                >
                  {size.label}
                  {filters.size === size.value && <Check className="w-4 h-4 ml-auto" />}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Gender */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Gender</Label>
            <div className="grid grid-cols-2 gap-2">
              {GENDER_OPTIONS.map((gender) => (
                <Button
                  key={gender.value}
                  variant={filters.gender === gender.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter("gender", filters.gender === gender.value ? null : gender.value)}
                  className="justify-start"
                >
                  {gender.label}
                  {filters.gender === gender.value && <Check className="w-4 h-4 ml-auto" />}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Environment Preferences */}
          <div>
            <Label className="text-base font-semibold mb-3 block">Good With</Label>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="good-with-kids" className="text-sm">
                  Children
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.goodWithKids === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("goodWithKids", filters.goodWithKids === true ? null : true)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={filters.goodWithKids === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("goodWithKids", filters.goodWithKids === false ? null : false)}
                  >
                    No
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="good-with-dogs" className="text-sm">
                  Dogs
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.goodWithDogs === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("goodWithDogs", filters.goodWithDogs === true ? null : true)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={filters.goodWithDogs === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("goodWithDogs", filters.goodWithDogs === false ? null : false)}
                  >
                    No
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="good-with-cats" className="text-sm">
                  Cats
                </Label>
                <div className="flex gap-2">
                  <Button
                    variant={filters.goodWithCats === true ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("goodWithCats", filters.goodWithCats === true ? null : true)}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={filters.goodWithCats === false ? "default" : "outline"}
                    size="sm"
                    onClick={() => updateFilter("goodWithCats", filters.goodWithCats === false ? null : false)}
                  >
                    No
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-8 pt-6 border-t">
          <Button
            variant="outline"
            onClick={clearAllFilters}
            className="flex-1 bg-transparent"
            disabled={activeFilterCount === 0}
          >
            <X className="w-4 h-4 mr-2" />
            Clear All
          </Button>
          <Button onClick={handleApplyFilters} className="flex-1">
            <Check className="w-4 h-4 mr-2" />
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function debounce<T extends (...args: any[]) => any>(func: T, wait: number): T {
  let timeout: NodeJS.Timeout
  return ((...args: any[]) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }) as T
}

function isValidLocation(location: string): boolean {
  if (!location || location.trim().length === 0) return false

  const zipRegex = /^\d{5}$/
  if (zipRegex.test(location.trim())) return true

  const cityStateRegex = /^[a-zA-Z\s]+,\s*[a-zA-Z\s]+$/
  if (cityStateRegex.test(location.trim())) return true

  return false
}
