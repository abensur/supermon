<script setup lang="ts">
import { theme } from 'ant-design-vue'

const themeConfig = {
  // token: {
  //   colorPrimary: '#722ed1',
  // },
}
</script>

<template>
  <a-config-provider :theme="themeConfig">
    <main h-full flex flex-col flex-nowrap>
      <div flex-1>
        <slot />
      </div>
    </main>
  </a-config-provider>
</template>
