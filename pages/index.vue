<script setup lang="ts">
import { DeleteOutlined, PlusCircleOutlined, PrinterOutlined } from '@ant-design/icons-vue'
import type { Pokedex, Pokemon } from 'pokeapi-js-wrapper'
import type { PokemonDetail } from '~/types/pokemon'

const deckStore = useDeckStore()
const DECK_SIZE = 8

const deck = ref<string[]>([])

const options = ref<any>([])

function filterOption(input: string, option: any) {
  return option.value.toLowerCase().includes(input.toLowerCase())
}

const loading = ref(false)

const debouncedFunc = useDebounceFn(async (value) => {
  const toRemove = Array.from(deckStore.savedDeck).filter(pokemon => !value.includes(pokemon.name))
  const toAdd = value.filter((name: string) => !Array.from(deckStore.savedDeck).some(pokemon => pokemon.name === name))
  deckStore.removePokemons(new Set(toRemove))
  loading.value = true
  await deckStore.addPokemons(toAdd)
  loading.value = false
}, 200)

watch(() => deck.value, async (value) => {
  debouncedFunc(value)
  if (value.length > DECK_SIZE) {
    deck.value = value.slice(0, DECK_SIZE)
  }
})

function clearDeck() {
  deck.value = []
  deckStore.removePokemons(deckStore.savedDeck)
}

function removePokemon(pokemon: PokemonDetail) {
  deck.value.splice(deck.value.indexOf(pokemon.name), 1)
  deckStore.removePokemons(new Set([pokemon]))
}

onMounted(async () => {
  const { $dex } = useNuxtApp()

  const list = await ($dex as Pokedex).getPokemonsList()

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  options.value = list.results.map((pokemon: any, index: number) => {
    return {
      value: pokemon.name,
      label: pokemon.name.split('-').map(capitalize).join(' '),
      number: index + 1,
    }
  })
})

const printPreview = ref(false)
const selectEl = ref()
const openState = ref(false)

watch(() => deckStore.deckArr.length, (deckSize) => {
  if (deckSize === DECK_SIZE) {
    openState.value = false
  }
})
</script>

<template>
  <div h-full w-full>
    <ClientOnly>
      <div
        class="mx-auto container" :class="{
          'print-mode': printPreview,
        }"
      >
        <div flex flex-row flex-wrap items-center justify-center gap-4 px-4 pt-4 sm-px-0>
          <a-select
            ref="selectEl"
            v-model:value="deck"
            v-model:open="openState"
            :filter-option="filterOption"
            :loading="loading"
            :max-tag-count="1"
            :max-tag-text-length="15"
            :options="options"
            :disabled="deckStore.savedDeck.size >= DECK_SIZE"
            autofocus
            class="select w-240px"
            mode="multiple"
            placeholder="Select your favorite Pokemon!"
            show-search
            size="large"
            @focus="openState = true"
            @blur="openState = false"
          />
          <a-button
            danger type="primary" size="large" :disabled="!deck.length" :icon="h(DeleteOutlined)"
            @click="clearDeck"
          />
          <h1 mx-auto>
            SuperMon
          </h1>
          <a-switch v-model:checked="printPreview" class="ml-auto">
            <template #checkedChildren>
              <PrinterFilled />
            </template>
            <template #unCheckedChildren>
              <PrinterOutlined />
            </template>
          </a-switch>
        </div>

        <div class="deck mt-4 gap-4 sm-grid md-grid-cols-2 sm-grid-cols-2 xl-grid-cols-4">
          <div
            v-for="pokemon in DECK_SIZE"
            :key="pokemon"
            relative
          >
            <template v-if="deckStore.deckArr[pokemon - 1]">
              <Card class="mx-auto mb-4 sm-mb-0" :pokemon="deckStore.deckArr[pokemon - 1]" />
              <a-button
                class="absolute bottom-1 right-50% z-10 translate-x-[3.1cm] opacity-60 hover:opacity-100"
                danger
                type="primary"
                shape="circle"
                :icon="h(DeleteOutlined)"
                @click="removePokemon(deckStore.deckArr[pokemon - 1])"
              />
            </template>
            <div v-else class="card mx-auto h-8.8cm w-6.3cm flex flex-row flex-wrap">
              <a-button v-if="pokemon - 1 === deckStore.deckArr.length" ma-auto :icon="h(PlusCircleOutlined)" shape="circle" @click="selectEl.focus(); openState = true;" />
            </div>
          </div>
        </div>
      </div>

      <template #fallback>
        <div ma-auto italic op50>
          <span animate-pulse>Loading Client</span>
        </div>
      </template>
    </ClientOnly>
  </div>
</template>

<style>
.deck {
  border: 1px solid transparent;
}
.print-mode {
  .deck {
    .cursor-pointer,
    & button {
      visibility: hidden;
    }
  }
  & h1,
  & .select,
  & .select + button {
    display: none;
  }
}

@media print {
  .ant-switch {
    display: none;
  }
  .deck {
    grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
    .cursor-pointer,
    & button {
      visibility: hidden;
    }
  }
  & h1,
  & .select,
  & .select + button {
    display: none;
  }
}

h1 {
  font-family: Honk;
  color: #444;
  font-size: 50px;
  line-height: 1;
  margin: 0;
}
</style>
