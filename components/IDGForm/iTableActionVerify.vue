<template>
  <button
    :class="verify ? 'btn btn-primary btn-sm m-2' : 'btn btn-secondary btn-sm m-2'"
    @click="handleVerify(!verify)"
  >
    {{ verify ? $t('verify') : $t('un_verify')}}
  </button>
</template>

<script>
export default {
  name: 'action-verify',
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    verify: {
      type: [Boolean, Number],
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  methods: {
    handleVerify(switchTo) {
      this.$emit('updateVerify', switchTo);
    }
  }
};
</script>

<style scoped>
.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 12px;
}
</style>
