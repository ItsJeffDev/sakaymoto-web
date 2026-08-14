<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary', // primary | outline | navy | ghost
    validator: (v) => ['primary', 'outline', 'navy', 'ghost'].includes(v)
  },
  size: {
    type: String,
    default: 'md' // md | sm
  },
  block: { type: Boolean, default: false },
  tag: { type: String, default: 'button' }, // 'button' | 'a'
  href: { type: String, default: '#' }
})

defineEmits(['click'])

const variantClass = {
  primary: 'btn-primary',
  outline: 'btn-outline',
  navy: 'btn-navy',
  ghost: 'btn-ghost-blue'
}
</script>

<template>
  <component
    :is="tag"
    :href="tag === 'a' ? href : undefined"
    class="btn"
    :class="[variantClass[variant], size === 'sm' && 'btn-sm', block && 'btn-block']"
    @click="$emit('click', $event)"
  >
    <slot />
  </component>
</template>
