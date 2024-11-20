export interface RawgGame {
  id: number
  slug: string
  name: string
  description: string
  released: string
  tba: boolean
  background_image: string
  rating: number
  rating_top: number
  ratings: Rating[]
  ratings_count: number
  reviews_text_count: number
  added: number
  added_by_status: AddedByStatus
  metacritic: number
  playtime: number
  suggestions_count: number
  updated: string
  user_game: any
  reviews_count: number
  saturated_color: string
  dominant_color: string
  platforms: Platform[]
  parent_platforms: ParentPlatform[]
  genres: Genre[]
  stores: Store[]
  clip: any
  tags: Tag[]
  detail?: string
  redirect?: boolean
}

export interface RawgGamesList {
  count: number
  next?: string
  previous?: string
  results: RawgGame[]
}

interface Rating {
  id: number
  title: string
  count: number
  percent: number
}

interface AddedByStatus {
  yet: number
  owned: number
  beaten: number
  toplay: number
  dropped: number
  playing: number
}

interface Platform {
  platform: PlatformDetails
  released_at: string
  requirements_en?: Requirements
  requirements_ru?: any
}

interface PlatformDetails {
  id: number
  name: string
  slug: string
  image: string | null
  year_end: number | null
  year_start: number | null
  games_count: number
  image_background: string
}

interface Requirements {
  minimum: string
  recommended: string
}

interface ParentPlatform {
  platform: ParentPlatformDetails
}

interface ParentPlatformDetails {
  id: number
  name: string
  slug: string
}

interface Genre {
  id: number
  name: string
  slug: string
  games_count: number
  image_background: string
}

interface Store {
  id: number
  store: StoreDetails
}

interface StoreDetails {
  id: number
  name: string
  slug: string
  domain: string
  games_count: number
  image_background: string
}

interface Tag {
  id: number
  name: string
  slug: string
  language: string
  games_count: number
  image_background: string
}
