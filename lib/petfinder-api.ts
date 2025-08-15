interface PetfinderToken {
  access_token: string
  expires_in: number
  token_type: string
}

interface PetfinderPhoto {
  small: string
  medium: string
  large: string
  full: string
}

interface PetfinderBreed {
  primary: string
  secondary?: string
  mixed: boolean
  unknown: boolean
}

interface PetfinderAttributes {
  spayed_neutered: boolean
  house_trained: boolean
  declawed?: boolean
  special_needs: boolean
  shots_current: boolean
}

interface PetfinderContact {
  email: string
  phone: string
  address: {
    address1: string
    address2?: string
    city: string
    state: string
    postcode: string
    country: string
  }
}

interface PetfinderOrganization {
  id: string
  name: string
  email: string
  phone: string
  address: {
    address1: string
    address2?: string
    city: string
    state: string
    postcode: string
    country: string
  }
  url: string
  website: string
  mission_statement?: string
}

export interface Pet {
  id: number
  organization_id: string
  url: string
  type: string
  species: string
  breeds: PetfinderBreed
  colors: {
    primary: string
    secondary?: string
    tertiary?: string
  }
  age: string
  gender: string
  size: string
  coat?: string
  name: string
  description?: string
  photos: PetfinderPhoto[]
  primary_photo_cropped?: PetfinderPhoto
  videos: any[]
  status: string
  attributes: PetfinderAttributes
  environment: {
    children?: boolean
    dogs?: boolean
    cats?: boolean
  }
  tags: string[]
  contact: PetfinderContact
  published_at: string
  distance?: number
  _links: {
    self: {
      href: string
    }
    type: {
      href: string
    }
    organization: {
      href: string
    }
  }
}

interface PetfinderResponse {
  animals: Pet[]
  pagination: {
    count_per_page: number
    total_count: number
    current_page: number
    total_pages: number
    _links: {
      next?: {
        href: string
      }
    }
  }
}

const PETFINDER_API_KEY = "BNdz3RD8xUmKUMEDhDNd3m8xGJA0LpdIN0dAmAL1kXYEV0PJmF"
const PETFINDER_SECRET = "Xa0lbh7Iq74ufczscNMtH9MnVUPclzERCKkNpvfX"
const PETFINDER_BASE_URL = "https://api.petfinder.com/v2"

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const response = await fetch(`${PETFINDER_BASE_URL}/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: PETFINDER_API_KEY,
      client_secret: PETFINDER_SECRET,
    }),
  })

  if (!response.ok) {
    throw new Error("Failed to get access token")
  }

  const tokenData: PetfinderToken = await response.json()

  // Cache the token with expiration time (subtract 5 minutes for safety)
  cachedToken = {
    token: tokenData.access_token,
    expiresAt: Date.now() + (tokenData.expires_in - 300) * 1000,
  }

  return tokenData.access_token
}

export async function fetchPets(page = 1, limit = 20): Promise<PetfinderResponse> {
  const token = await getAccessToken()

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    status: "adoptable",
  })

  const response = await fetch(`${PETFINDER_BASE_URL}/animals?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch pets")
  }

  return response.json()
}

export async function fetchPetById(id: number): Promise<{ animal: Pet }> {
  const token = await getAccessToken()

  const response = await fetch(`${PETFINDER_BASE_URL}/animals/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch pet details")
  }

  return response.json()
}

export async function searchPets(params: {
  type?: string
  breed?: string
  size?: string
  gender?: string
  age?: string
  location?: string
  distance?: number
  page?: number
  limit?: number
}): Promise<PetfinderResponse> {
  const token = await getAccessToken()

  const searchParams = new URLSearchParams({
    status: "adoptable",
    page: (params.page || 1).toString(),
    limit: (params.limit || 20).toString(),
  })

  // Add optional parameters
  if (params.type) searchParams.append("type", params.type)
  if (params.breed) searchParams.append("breed", params.breed)
  if (params.size) searchParams.append("size", params.size)
  if (params.gender) searchParams.append("gender", params.gender)
  if (params.age) searchParams.append("age", params.age)
  if (params.location) searchParams.append("location", params.location)
  if (params.distance) searchParams.append("distance", params.distance.toString())

  const response = await fetch(`${PETFINDER_BASE_URL}/animals?${searchParams}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to search pets")
  }

  return response.json()
}

export async function fetchPetsWithFilters(
  page = 1,
  limit = 20,
  filters: {
    type?: string | null
    age?: string | null
    size?: string | null
    gender?: string | null
    hasPhotos?: boolean
    goodWithKids?: boolean | null
    goodWithDogs?: boolean | null
    goodWithCats?: boolean | null
  } = {},
): Promise<PetfinderResponse> {
  const token = await getAccessToken()

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    status: "adoptable",
  })

  // Add filter parameters
  if (filters.type) params.append("type", filters.type)
  if (filters.age) params.append("age", filters.age)
  if (filters.size) params.append("size", filters.size)
  if (filters.gender) params.append("gender", filters.gender)

  const response = await fetch(`${PETFINDER_BASE_URL}/animals?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })

  if (!response.ok) {
    throw new Error("Failed to fetch pets")
  }

  const data: PetfinderResponse = await response.json()

  // Apply client-side filters that aren't supported by the API
  let filteredAnimals = data.animals

  if (filters.hasPhotos) {
    filteredAnimals = filteredAnimals.filter((pet) => pet.photos && pet.photos.length > 0)
  }

  if (filters.goodWithKids !== null) {
    filteredAnimals = filteredAnimals.filter((pet) => pet.environment.children === filters.goodWithKids)
  }

  if (filters.goodWithDogs !== null) {
    filteredAnimals = filteredAnimals.filter((pet) => pet.environment.dogs === filters.goodWithDogs)
  }

  if (filters.goodWithCats !== null) {
    filteredAnimals = filteredAnimals.filter((pet) => pet.environment.cats === filters.goodWithCats)
  }

  return {
    ...data,
    animals: filteredAnimals,
  }
}
