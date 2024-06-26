<script setup lang="ts">
const color = useColorMode()

useHead({
  meta: [{
    id: 'theme-color',
    name: 'theme-color',
    content: () => color.value === 'dark' ? '#222222' : '#ffffff',
  }],
})

function toggleDark() {
  color.preference = color.value === 'dark' ? 'light' : 'dark'
}

const state = ref({
  color: color.value,
})
</script>

<template>
  <a-switch v-model:checked="state.color" checked-value="dark" un-checked-value="light" @click="toggleDark">
    <template #checkedChildren>
      <span class="i-carbon-moon" relative top-2px inline-block h-14px w-14px />
    </template>
    <template #unCheckedChildren>
      <span class="i-carbon-sun" relative top-2px inline-block h-14px w-14px />
    </template>
  </a-switch>
</template>
