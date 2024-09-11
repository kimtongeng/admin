<template>
  <b-button
    v-if="hasAuthorize"
    :variant="variant"
    :size="size"
    :disabled="inProgress || disabled"
    @click="handleClick"
  >
    <b-spinner v-if="inProgress && spinner" small/>
    <!--    <b-icon v-else-if="icon != null" :icon="icon"></b-icon>-->
    <span>
      <slot/>
    </span>
  </b-button>
</template>
<script>
export default {
  name: 'authButton',
  props: {
    icon: {
      type: String,
      default: null,
    },
    variant: {
      type: String,
      default: 'primary',
    },
    inProgress: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Number,
      default: 1,
    },
    permission: {
      type: String,
      default: null,
    },
    size: {
      type: String,
      default: 'md',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isAuthorize: {
      type: Boolean,
      default: true,
    },
    spinner: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    hasAuthorize() {
      if (this.isAuthorize) {
        return this.checkAuthorize(this.permission)
      } else {
        return true
      }
    },
  },
  methods: {
    handleClick(evt) {
      this.$emit('click', evt)
    },
  },
}
</script>
