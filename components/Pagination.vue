<template>
  <b-pagination
    align="center"
    v-model="pagination.current_page"
    :total-rows="pagination.total"
    :per-page="pagination.per_page"
    @input="get"
  >
    <template #next-text>
      <i class="simple-icon-arrow-right"></i>
    </template>
    <template #prev-text>
      <i class="simple-icon-arrow-left"></i>
    </template>
    <template #first-text>
      <i class="simple-icon-control-start"></i>
    </template>
    <template #last-text>
      <i class="simple-icon-control-end"></i>
    </template>
  </b-pagination>
</template>

<script>
export default {
  data() {
    return {
      pagination: {
        current_page: 1,
        per_page: 10,
        total: 0,
        to: 0,
        from: 0,
        last_page: 0,
      },
    }
  },
  methods: {
    get() {
      this.$emit('input')
    }
  }
}
</script>

<style>
</style>
