<template>
  <nuxt-link
    v-if="isAuthorize"
    style="padding: 4px 10px;"
    :variant="variant"
    :to="to"
    no-prefetch
    class="btn btn-sm btn-primary"
    :class="{ disabled: disabled }"
  >
    <b-spinner v-if="inProgress && spinner" small/>
       <i v-else-if="icon != null" :class="icon"></i>
    <span>
      <slot/>
    </span>
  </nuxt-link>
</template>
<script>
export default {
  name: 'AuthLinkButton',
  props: {
    icon: {
      type: String,
      default: null,
    },
    variant: {
      type: String,
      default: 'link',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    inProgress: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'md',
    },
    isAuthorize: {
      type: Boolean,
      default: false,
    },
    spinner: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      default: 'button',
    },
  },
  computed: {
    hasAuthorize() {
      return this.checkAuthorize(this.action)
    },
  },
}
</script>
<style scoped>
a.disabled {
  pointer-events: none;
  cursor: default;
}
</style>
