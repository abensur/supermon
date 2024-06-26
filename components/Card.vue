<script lang="ts" setup>
import fitty from 'fitty'
import type { PokemonDetail } from '~/types/pokemon'

const props = defineProps<{
  pokemon: PokemonDetail
}>()

const activeSprite = ref(0)

const maxValues = [255, 190, 250, 194, 250, 200]

const statsLabel: Record<string, string> = {
  atk: 'attack',
  spatk: 'sp. atk',
  def: 'defense',
  spdef: 'sp. def',
  hp: 'HP',
  spd: 'speed',
}

const statsColors: Record<string, string> = {
  atk: 'bg-red-4',
  spd: 'bg-green-4',
  spdef: 'bg-pink-4',
  hp: 'bg-gray-4',
  def: 'bg-blue-4',
  spatk: 'bg-light-blue-3',
}

const sprites = computed(() => {
  const images = [{
    version: '',
    game: '',
    variant: '',
    image: '',
  }, ...props.pokemon.sprites]

  return images
})

function changeSprite(direction: number) {
  activeSprite.value += direction
  if (activeSprite.value < 0) {
    activeSprite.value = sprites.value.length - 1
  }
  else if (activeSprite.value >= sprites.value.length) {
    activeSprite.value = 0
  }
}

const chartData = computed(() => {
  return Object.entries(props.pokemon.stats).map(([key, value], index) => {
    return {
      name: statsLabel[key],
      value,
      percentage: (value / maxValues[index] * 100).toFixed(0),
      background: statsColors[key],
    }
  }).sort(

  )
})

const pokemonName = ref<HTMLElement | null>(null)
onMounted(() => {
  useTimeoutFn(() => {
    fitty(pokemonName.value as HTMLElement, {
      minSize: 1,
      maxSize: 22,
    })
  }, 1)
})
</script>

<template>
  <div
    class="card h-8.8cm w-6.3cm"
  >
    <header class="relative z-3 h-0.6cm flex flex-row flex-wrap items-center bg-white bg-opacity-75">
      <div class="ml-10px pt-4px" style="width: calc(100% - 65px)">
        <div ref="pokemonName" class="inline-block ws-nowrap color-#444 font-bold capitalize">
          {{ pokemon.name.split('-').join(' ') }}
        </div>
      </div>
      <div class="mb-auto w-55px pr-6px pt-2px text-right text-xs font-bold font-mono opacity-50">
        <small>#</small>{{ pokemon.id }}
      </div>
    </header>

    <div class="relative top--0.5cm z-2 h-3.4cm w-full b-b-1 border-black px-4px">
      <a-button v-if="sprites.length > 1" shape="circle" class="absolute left-8px top-1.4cm bg-white" @click="changeSprite(-1)">
        <span text-26px font-bold class="relative left--1px lh-[17px]">
          &lsaquo;
        </span>
      </a-button>
      <img
        v-if="pokemon.defaultSprite"
        class="mx-auto block h-full w-full object-contain"
        :src="activeSprite ? sprites[activeSprite].image : (pokemon.defaultSprite || '') " alt="pokemon"
      >
      <div
        v-else
        class="i-carbon-help relative top-25% mx-auto block h-50% w-50% object-contain color-amber opacity-50"
        alt="no image for this pokemon"
      />
      <div absolute bottom-0 left-0 w-full opacity-75>
        <div v-if="activeSprite" :key="activeSprite" class="animate-fade-out animate-forwards cursor-pointer bg-white text-center text-12px color-black font-bold hover:animate-none">
          {{ sprites[activeSprite].version.split('-').join(' ') }}
          <br>
          {{ sprites[activeSprite].game.split('-').join(' ') }}
          <br>
          {{ sprites[activeSprite].variant.split('_').join(' ') }}
        </div>
      </div>
      <a-button v-if="sprites.length > 1" shape="circle" class="absolute right-8px top-1.4cm bg-white" @click="changeSprite(1)">
        <span text-26px font-bold class="relative right--1px lh-[17px]">
          &rsaquo;
        </span>
      </a-button>
    </div>

    <div grid grid-cols-2 gap-2 px-16px class="relative top--0.3cm h-0.5cm">
      <img v-for="name in pokemon.types" :key="pokemon.id + name" w-full :src="`/images/${name}.png`" alt="type">
    </div>

    <div class="stats relative">
      <div class="grid grid-cols-2 mt-4px h-full items-stretch px-20px">
        <div
          v-for="(item, index) in chartData"
          :key="index"
          class="relative pt-3px"
          :class="index % 2 ? 'text-right' : 'text-left'"
        >
          <div class="relative z-3 text-3xl text-#444 font-bold lh-90%">
            {{ item.value }}
          </div>
          <div text-xs font-mono class="relative z-3 text-#444 lh-90%">
            {{ item.name }}
          </div>
          <div
            :class="item.background"
            class="bar absolute top-2px z-2 max-w-full opacity-50" :style="{
              width: `${item.percentage}px`,
              left: index % 2 ? 'calc(100% + 4px)' : '-4px',
              transform: index % 2 ? 'translateX(-100%)' : '',
              borderTopLeftRadius: index % 2 ? 0 : '10px',
              borderBottomLeftRadius: index % 2 ? 0 : '10px',
              borderTopRightRadius: index % 2 ? '10px' : 0,
              borderBottomRightRadius: index % 2 ? '10px' : 0,
            }"
          />
          <div
            :class="item.background"
            class="bar absolute top-2px z-1 max-w-full opacity-10" :style="{
              width: `100%`,
              left: index % 2 ? 'calc(100% + 4px)' : '-4px',
              transform: index % 2 ? 'translateX(-100%)' : '',
              borderTopLeftRadius: index % 2 ? 0 : '10px',
              borderBottomLeftRadius: index % 2 ? 0 : '10px',
              borderTopRightRadius: index % 2 ? '10px' : 0,
              borderBottomRightRadius: index % 2 ? '10px' : 0,
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.card {
  position: relative;
  box-sizing: border-box;
  border: solid 8px #ffe471;
  border-radius: 1.5rem;
  background-color: white;
}
.card header {
  border-top-left-radius: 1.5rem;
  border-top-right-radius: 1.5rem;
}

.card .stats {
  position: relative;
  height: 4.3cm;
  top: -0.3cm;
}

.card .stats > div > div,
.card .bar {
  height: calc(calc(4.3cm / 3) - 14px);
}
</style>
