<script setup lang="ts">
const router = useRouter()
</script>

<template>
  <main p="x4 y10" text="center red-700 dark:gray-200">
    <h1>SuperMon</h1>
    <div text-4xl>
      <div i-carbon-warning inline-block />
    </div>
    <div>Page not found</div>
    <div mt-8>
      <a-button @click="router.back()">
        Home
      </a-button>
    </div>
  </main>
</template>
