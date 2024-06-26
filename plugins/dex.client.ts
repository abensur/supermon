import { Pokedex } from 'pokeapi-js-wrapper'

export default defineNuxtPlugin({
  name: 'dex',
  enforce: 'pre',
  async setup(nuxtApp) {
    nuxtApp.$dex = new Pokedex({
      cacheImages: true,
    })
  },
  env: {
    islands: false,
  },
})
// new Pokedex({
//   cacheImages: true,
// }),
