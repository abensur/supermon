import { acceptHMRUpdate, defineStore } from 'pinia'
import type { Pokedex } from 'pokeapi-js-wrapper'
import type { PokemonDetail, Sprite } from '~/types/pokemon'

export const useDeckStore = defineStore('deck', () => {
  const { $dex } = useNuxtApp()
  const savedDeck = ref(new Set<PokemonDetail>())
  const deckArr = computed(() => Array.from(savedDeck.value))

  async function addPokemon(name: string) {
    const details = await ($dex as Pokedex).getPokemonByName(name)
    const spriteVersions = details.sprites.versions

    if (spriteVersions) {
      const sprites = extractSprites(spriteVersions)
      details.flatSprites = sprites
    }

    const entry: PokemonDetail = createPokemonEntry(details)
    savedDeck.value.add(entry)
  }

  function extractSprites(spriteVersions: any): Sprite[] {
    const sprites: Sprite[] = []
    Object.entries(spriteVersions).forEach(([gen, games]: any) => {
      Object.entries(games).forEach(([game, variants]: any) => {
        if (gen !== 'generation-viii' && game.match(/icons/))
          return
        if (game.match(/crystal|gold|ruby-sapphire|firered-leafgreen|diamond-pearl|heartgold-soulsilver|x-y/))
          return
        Object.entries(variants).forEach(([variant, image]: any) => {
          if (variant.match(/animated|back/) || !image)
            return
          const sprite: Sprite = { version: gen, game, image, variant }
          sprites.push(sprite)
        })
      })
    })

    return sprites
  }

  function createPokemonEntry(details: any): PokemonDetail {
    return {
      id: details.id,
      name: details.name,
      types: details.types.map((t: any) => t.type.name),
      stats: {
        hp: details.stats[0].base_stat,
        atk: details.stats[1].base_stat,
        def: details.stats[2].base_stat,
        spatk: details.stats[3].base_stat,
        spdef: details.stats[4].base_stat,
        spd: details.stats[5].base_stat,
      },
      sprites: details.flatSprites,
      defaultSprite: details.sprites.front_default,
    }
  }

  function removePokemons(pokemons: Set<PokemonDetail>) {
    Array.from(pokemons).map(pokemon =>
      savedDeck.value.delete(pokemon),
    )
  }

  async function addPokemons(pokemons: string[]) {
    pokemons.forEach((p) => {
      addPokemon(p)
    })
  }

  return {
    savedDeck,
    addPokemons,
    removePokemons,
    deckArr,
  }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useDeckStore, import.meta.hot))
