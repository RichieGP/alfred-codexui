<template>
  <header class="content-header" :class="{ 'is-compact': isCompactMode }">
    <div class="content-leading">
      <slot name="leading" />
    </div>
    <h1 class="content-title">{{ title }}</h1>
    <div class="content-actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  isCompactMode?: boolean
}>()
</script>

<style scoped>
@reference "tailwindcss";

.content-header {
  @apply relative z-10 w-full min-h-12 sm:min-h-14 flex items-center gap-2 sm:gap-3 px-2 sm:px-3 pt-3 sm:pt-4 pb-2 bg-white;
}

.content-header.is-compact {
  @apply sticky top-0 border-b border-stone-200/70 bg-[#f7f3eb]/92 px-3 pt-3 pb-2 backdrop-blur supports-[backdrop-filter]:bg-[#f7f3eb]/82;
}

.content-title {
  @apply m-0 min-w-0 flex-1 truncate text-sm font-medium leading-6 text-slate-900 max-sm:text-xs;
}

.content-header.is-compact .content-title {
  @apply text-[13px] font-semibold tracking-[0.01em] text-stone-900;
}

.content-actions {
  @apply flex items-center justify-end gap-1;
}

.content-leading {
  @apply flex items-center gap-1;
}
</style>
