export interface Sprite {
  version: string
  game: string
  image: string
  variant: string
}

export interface PokemonDetail {
  id: number
  name: string
  types: string[]
  defaultSprite: string | null
  sprites: Sprite[]
  stats: {
    hp: number
    atk: number
    def: number
    spatk: number
    spdef: number
    spd: number
  }
}
