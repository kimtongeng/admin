<template>
  <b-modal
    v-model="modal"
    scrollable
    centered
    no-close-on-esc
    hide-footer
    hide-header
    size="lg"
    @hidden="clearForm"
  >
    <div class="mb-3">
      <glide-component-thumbs
        :settingsImages="{ bound: true, rewind: false, focusAt: 0, startAt: 0, gap: 5, perView: 1, data: assetItem.gallery_photo}"
        :settingsThumbs="{ bbound: true, rewind: false, focusAt: 0, startAt: 0, gap: 5, perView: 5, data: assetItem.gallery_photo, breakpoints: { 576: { perView: 4 }, 420: { perView: 3 } } }"
      />
    </div>
  </b-modal>
</template>
<script>
import GlideComponentThumbs from "~/components/Carousel/GlideComponentThumbs";

export default {
  components: {
    GlideComponentThumbs
  },
  props: {
    formItem: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      modal: false,
      apiUrl: process.env.API_URL,
      imageThumbnailPath: '',
      imageGalleryPath: '',
      assetItem: {}
    }
  },
  computed: {
    modalHeader() {
      return this.$t('image_gallery')
    },
  },
  created() {
    this.setData()
  },

  methods: {
    setData() {
      if (this.$helpers.nullToVoid(this.formItem.image) != '' || !this.$helpers.isEmpty(this.formItem.gallery_photo)) {
        this.imageThumbnailPath = this.apiUrl + 'images/real_estate/property/thumbnail/'
        this.imageGalleryPath = this.apiUrl + 'images/real_estate/property/gallery/'

        this.assetItem = JSON.parse(JSON.stringify(this.formItem))
        this.setImageGallery()
        this.modal = true
      }
    },
    setImageGallery() {
      //alias with image path
      this.assetItem.gallery_photo.map(obj => {
        obj.image = `${this.imageGalleryPath}${obj.image}`
        return obj
      })

      //push thumbnail image
      this.assetItem.gallery_photo.unshift({
        id: this.assetItem.id,
        image: `${this.imageThumbnailPath}${this.assetItem.image}`
      })
    },
    /**
     * Clear Form
     */
    clearForm() {
      this.modal = false
      this.assetItem = {}
      this.imageThumbnailPath = ''
      this.imageGalleryPath = ''

      this.$emit('closeModal', this.modal)
    },
  },
}
</script>
<style scoped>
:deep(.modal-body) {
  overflow: hidden;
}
</style>
