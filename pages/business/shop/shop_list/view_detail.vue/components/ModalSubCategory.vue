<template>
  <b-modal
      id="modal"
      v-model="modal"
      centered
      :size="formData.sub_category.length > 4 ? 'xl' : 'lg'"
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
      :title="modalHeader"
    >
      <div class="d-flex flex-wrap p-3">
        <div v-for="subcategory in formData.sub_category" :key="'SUBCATEGORY_'+subcategory.id"
          class="card my-3 mx-4" style="width: 150px;">
          <center>
            <b-img
              v-if="$helpers.nullToVoid(subcategory.image) == ''"
              src="/default.jpg"
              style="
                width: 100%;
                height: 110px;
                border-radius: 0.75rem;
              "
            ></b-img>
            <b-img
              v-else
              :src="imagePath + 'sub_category/' + subcategory.image"
              alt="thumbnail"
              class="border-0"
              onerror="this.src='/default.jpg'"
              style="
                  width: 100%;
                  height: 110px;
                  border-radius: 0.75rem;
              "
            ></b-img>
            <p>{{ subcategory.name }}</p>
          </center>
        </div>
      </div>
      <template slot="modal-footer">
        <b-button size="xs" variant="outline-danger" @click="closeModal"
        >{{ $t('close') }}
        </b-button>
      </template>
    </b-modal>
</template>

<script>
export default {
  props: {
    formData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  created() {
    this.modal = true
  },
  data() {
    return {
      modal: false,
      apiUrl: process.env.API_URL,
      imagePath: process.env.API_URL + 'images/shop/profile/',
    }
  },
  computed: {
    modalHeader() {
      return this.$t('sub_category')
    },
  },
  methods: {
    closeModal() {
      this.modal = false
      this.$emit('closeModal', this.modal)
    }
  }
}
</script>
