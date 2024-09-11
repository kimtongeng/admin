<template>
  <b-dropdown size="xs" :text="$t('action')" right variant="primary">
    <template #button-content>
      <i class="simple-icon-settings"></i>
    </template>
    <slot></slot>
    <!--Action Edit-->
    <template v-if="enableEditAction && checkModuleAuthorize(moduleKey, 'update')">
      <b-dropdown-item
        @click="editClick">
        <i class="simple-icon-pencil"></i>
        <span class="ml-3">{{ $t('edit') }}</span>
      </b-dropdown-item>
    </template>

    <!--Action Delete-->
    <template v-if="enableDeleteAction && checkModuleAuthorize(moduleKey, 'delete')">
      <b-dropdown-item
        @click="deleteClick"
      >
        <i class="simple-icon-trash"></i>
        <span class="ml-3">{{ $t('delete') }}</span>
      </b-dropdown-item>
    </template>
  </b-dropdown>
</template>
<script>
export default {
  props: {
    moduleKey: {
      type: String,
      default: '',
    },
    enableEditAction: {
      type: Boolean,
      default: true
    },
    enableDeleteAction: {
      type: Boolean,
      default: true
    },
  },
  name: 'action-dropdown',
  methods: {
    editClick() {
      this.$emit('editClick')
    },
    deleteClick() {
      this.$emit('deleteClick')
    }
  }
}
</script>
