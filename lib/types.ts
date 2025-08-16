export interface PetfinderPhoto {
  small: string
  medium: string
  large: string
  full: string
}

export interface PetfinderBreed {
  primary: string
  secondary?: string
  mixed: boolean
  unknown: boolean
}

export interface PetfinderAttributes {
  spayed_neutered: boolean
  house_trained: boolean
  declawed?: boolean
  special_needs: boolean
  shots_current: boolean
}

export interface PetfinderContact {
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
    self: { href: string }
    type: { href: string }
    organization: { href: string }
  }
}

export interface PetfinderResponse {
  animals: Pet[]
  pagination: {
    count_per_page: number
    total_count: number
    current_page: number
    total_pages: number
    _links: {
      next?: { href: string }
    }
  }
}


