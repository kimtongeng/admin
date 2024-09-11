<template>
  <div>
    <b-img
      :src="getImage()"
      onerror="this.src='/thume-default.jpg'"
      rounded
      :width="imageWidth"
      :height="imageHeight"
      :id="targetPopover"
    />
    <b-popover
      v-if="$helpers.nullToVoid(image) != '' && isPopover"
      :target="targetPopover"
      placement="right"
      triggers="hover"
      custom-class="image-popover"
    >
      <b-img
        :src="getImage()"
        onerror="this.src='/thume-default.jpg'"
        :width="popoverImageWidth"
        :height="popoverImagHeight"
        rounded
      />
    </b-popover>
  </div>
</template>
<script>
export default {
  name: 'image-viewer',
  props: {
    image: {
      type: String,
      default: ''
    },
    path: {
      type: String,
      default: ''
    },
    imageWidth: {
      type: Number,
      default: 50
    },
    imageHeight: {
      type: Number,
      default: 50
    },
    isPopover: {
      type: Boolean,
      default: true
    },
    popoverImageWidth: {
      type: Number,
      default: 300
    },
    popoverImagHeight: {
      type: Number,
      default: 300
    },
  },
  data() {
    return {
      apiUrl: process.env.API_URL,
      targetPopover: 'image'
    }
  },
  mounted() {
    this.targetPopover = this.generateUUID()
  },
  methods: {
    getImage() {
      if (this.$helpers.nullToVoid(this.image) != '') {
        return `${this.apiUrl}images/${this.path}/${this.image}`
      } else {
        return '/thume-default.jpg'
      }
    },
  }
}
</script>
