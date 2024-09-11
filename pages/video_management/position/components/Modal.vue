<template>
  <b-modal
    id="modal"
    v-model="modal"
    scrollable
    centered
    size="xxl"
    no-close-on-backdrop
    no-close-on-esc
    :title="$t('video_list')"
  >
    <!-- Video Form-->
    <div v-if="modalVideoShow">
      <modal-video
        :modalType="modalVideoType"
        @closeModal="closeVideoModal"
      ></modal-video>
    </div>

    <template #modal-header="{ close }">
      <h5 style="margin-top: 3px">
        <span>{{ $t('video_list') }}</span>
        <i
          v-if="checkModuleAuthorize('video', 'create')"
          class="iconsminds-folder-add-- text-primary"
          style="cursor: pointer; font-size: 20px"
          @click="openVideoModal"
        ></i>
      </h5>
      <div class="search-sm">
        <b-input
          v-model="filter.txt_src"
          :placeholder="$t('search')"
          @input="getVideoList(false)"
        />
      </div>
    </template>

    <b-row v-if="videoList.length > 0">
      <b-col cols="12">
        <div
          v-for="(video, index) in videoList"
          :key="index"
          class="video-list-selected-item mr-4 mb-3"
        >
          <b-card class="shadow" :class="video.selected == true ? 'selected-item' : ''" @click="selectItem(index)">
            <b-card-title>{{ video.name }}</b-card-title>
            <iframe :src="`https://www.youtube.com/embed/${getYouTubeVideoId(video.url)}`"
                    title="YouTube video player" frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen></iframe>
          </b-card>
        </div>
      </b-col>
    </b-row>
    <b-row class="text-center" v-else>
      <b-col cols="12">
        <span class="text-muted">{{ $t('no_data') }}</span>
      </b-col>
    </b-row>

    <template slot="modal-footer">
      <b-button size="xs" variant="outline-secondary" @click="clearForm"
      >{{ $t('cancel') }}
      </b-button>
      <b-button size="xs" variant="primary" @click="saveSelect">{{
          $t('select')
        }}
      </b-button>
    </template>
  </b-modal>
</template>
<script>
import swal from 'sweetalert2'

export default {
  props: {
    videoSelected: {
      type: Array,
      default: () => {
        return []
      },
    },
    modalType: {
      type: Number,
      default: 0,
    },
  },
  components: {
    ModalVideo: () => import('../../video/components/Modal'),
  },
  data() {
    return {
      modal: false,
      apiUrl: process.env.API_URL,
      listItemSelected: [],
      videoList: [],
      filter: {
        text_src: null,
      },
      modalVideoShow: false,
      modalVideoType: 0,
    }
  },
  watch: {
    modalType: {
      handler(val) {
        if (val) {
          this.modal = true
        }
      },
      immediate: true,
    },
  },
  created() {
    this.filter.platform_type = this.platformType
    this.filter.image_type = this.imageType
    this.getVideoList()
  },
  methods: {
    getVideoList(loading = true) {
      let vm = this
      let input = {
        filter: this.filter,
        loading: loading,
      }

      vm.videoList = []
      vm.$axios
        .$post('position_video/get_video_list', input)
        .then(({data}) => {
          //Form Add
          vm.videoList = data
          vm.videoList.map((obj) => {
            obj.video_position_id = null
            obj.position_id = null
            obj.selected = JSON.parse(obj.selected) //Convert string to boolean
            return obj
          })

          //Set Auto select when Form Update
          if (vm.modalType == 2) {
            vm.setData()
          }
        })
    },
    saveSelect(evt) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      let vm = this

      // Set Selected Video
      vm.listItemSelected = vm.videoList.filter(
        (obj) => obj.selected == true
      )

      //Check if selected list is empty
      if (vm.listItemSelected.length < 1) {
        let message = ''
        if (vm.$i18n.locale == 'en') {
          message = 'Please select at least one banner.'
        } else if (vm.$i18n.locale == 'kh') {
          message = 'សូមជ្រើសរើសេវីដេអូយ៉ាងហោចណាស់មួយ។'
        }
        vm.$notify('warning', vm.$t('video_list'), message, {
          duration: 4500,
        })
        return
      } else {
        vm.clearForm()
      }
    },
    clearForm() {
      this.modal = false
      this.$nextTick().then(() => {
        this.veeErrors.clear()
      })
      this.$emit('closeModal', this.listItemSelected)
      this.listItemSelected = []
    },
    setData() {
      this.videoList.map((obj) => {
        this.videoSelected.map((item) => {
          if (obj.id == item.id) {
            obj.video_position_id = item.video_position_id
            obj.position_id = item.position_id
            obj.selected = JSON.parse(item.selected) //Convert string to boolean
            return obj
          }
        })
      })
    },
    selectItem(index) {
      this.videoList[index].selected = !this.videoList[index].selected
    },
    openVideoModal() {
      this.modalVideoType = 1
      this.modalVideoShow = true
    },
    closeVideoModal(data) {
      this.modalVideoType = 0
      this.modalVideoShow = false

      if (!this.$helpers.isEmpty(data)) {
        this.getVideoList(false)
      }
    },
  },
}
</script>
<style lang="scss" scoped>

.selected-item {
  border: 2px solid #2fc0f3;
  opacity: 0.6;
}
</style>
