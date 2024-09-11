<template>
  <div>
    <!-- Page Heading -->
    <div class="page-header-nav">
      <b-row class="mt-2">
        <b-col cols="12" xl="6">
          <div class="page-title">
            <div>{{ titleCase(getNameByLang(form.title)) }}</div>
          </div>
        </b-col>

        <b-col cols="12" xl="6" class="text-right mb-2">
          <b-button variant="primary" size="xs" @click="clearForm">
            <i class="iconsminds-repeat-2"></i>
            {{ $t('refresh') }}
          </b-button
          >
          <b-button
            v-if="checkModuleAuthorize('privacy_policy', 'update')"
            variant="primary"
            size="xs"
            @click="update"
          ><i class="simple-icon-pencil"></i>
            {{ $t('update') }}
          </b-button
          >
        </b-col>
      </b-row>
      <div class="separator mb-4"></div>
    </div>

    <b-card class="shadow">
      <b-row>
        <!--description_latin-->
        <b-col cols="12" xl="6">
          <label>{{ $t('description_latin') }}</label>
          <quill-editor
            ref="quillDescLatin"
            v-model="form.latin_description"
            :options="editorOptionDescLatin"
          ></quill-editor>
          <input
            ref="imageDescLatin"
            type="file"
            @change="uploadImageDescLatin"
            id="imageDescLatin"
            hidden
          />
        </b-col>

        <!--description_local-->
        <b-col cols="12" xl="6">
          <label>{{ $t('description_local') }}</label>
          <quill-editor
            ref="quillDescLocal"
            v-model="form.local_description"
            :options="editorOptionDescLocal"
          ></quill-editor>
          <input
            ref="imageDescLocal"
            type="file"
            @change="uploadImageDescLocal"
            id="imageDescLocal"
            hidden
          />
        </b-col>
      </b-row>
    </b-card>
  </div>
</template>
<script>
import swal from 'sweetalert2'
import {mapGetters} from 'vuex'

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'privacy_policy',
  head() {
    return {
      title: this.$t('privacy_policy'),
    }
  },
  data() {
    return {
      form: {
        id: null,
        title: null,
        latin_title: 'privacy policy',
        local_title: 'ព័ត៌មានឯកជន',
        description: null,
        latin_description: null,
        local_description: null,
      },
      defaultForm: {
        id: null,
        title: null,
        latin_title: 'privacy policy',
        local_title: 'ព័ត៌មានឯកជន',
        description: null,
        latin_description: null,
        local_description: null,
      },
      editorOptionDescLocal: {
        theme: 'snow',
        placeholder: '',
        modules: {
          toolbar: {
            container: [
              'bold',
              'underline',
              'italic',
              'strike',
              'blockquote',
              'image',
              {list: 'ordered'},
              {list: 'bullet'},
              {script: 'sub'},
              {script: 'super'},
              {indent: '-1'},
              {indent: '+1'},
              {direction: 'rtl'},
              {header: [1, 2, 3, 4, 5, 6, false]},
              {color: []},
              {background: []},
              {font: []},
              {align: []},
              'clean',
              'link',
              'video',
            ],
            handlers: {
              image: function () {
                document
                  .getElementById('imageDescLocal')
                  .click()
              },
            },
          },
        },
      },
      editorOptionDescLatin: {
        theme: 'snow',
        placeholder: '',
        modules: {
          toolbar: {
            container: [
              'bold',
              'underline',
              'italic',
              'strike',
              'blockquote',
              'image',
              {list: 'ordered'},
              {list: 'bullet'},
              {script: 'sub'},
              {script: 'super'},
              {indent: '-1'},
              {indent: '+1'},
              {direction: 'rtl'},
              {header: [1, 2, 3, 4, 5, 6, false]},
              {color: []},
              {background: []},
              {font: []},
              {align: []},
              'clean',
              'link',
              'video',
            ],
            handlers: {
              image: function () {
                document
                  .getElementById('imageDescLatin')
                  .click()
              },
            },
          },
        },
      },
      apiUrl: process.env.API_URL,
      show: false,
      mediaPath: null,
    }
  },
  created() {
    this.mediaPath = this.apiUrl + 'images/media/'
    this.get()
  },
  methods: {
    get() {
      let vm = this

      let input = this.form

      this.form.title = this.getFullLocalName(
        this.form.local_title,
        this.form.latin_title
      )

      this.$axios.$post('privacy_policy/get', input).then(({data}) => {
        if (this.$helpers.nullToVoid(data) == '') {
          this.show = true
        } else {
          this.show = false
          vm.setData(data)
        }
      })
    },
    /**
     * Set data
     */
    setData(data) {
      this.form = Object.assign({}, data)

      // Start: Fomat title
      this.form.latin_title = this.$helpers.getNameByLocal(
        data.title,
        'latin_name'
      )
      this.form.local_title = this.$helpers.getNameByLocal(data.title)

      // Start: Fomat description
      this.form.latin_description = this.$helpers.getNameByLocal(
        data.description,
        'latin_name'
      )
      this.form.local_description = this.$helpers.getNameByLocal(
        data.description
      )
    },
    /**
     * Insert or Update privacy_policy
     */
    update(evt) {
      // prevent close popup
      evt.preventDefault()
      // check validation
      this.$validator.validateAll().then((result) => {
        if (result) {
          let url = 'privacy_policy/update'

          let input = this.form

          this.form.title = this.getFullLocalName(
            this.form.local_title,
            this.form.latin_title
          )

          this.form.description = this.getFullLocalName(
            this.form.local_description,
            this.form.latin_description
          )

          this.$axios.$post(url, input).then(({data}) => {
            this.setData(data)
            this.$notify(
              'success',
              this.$t('privacy_policy'),
              this.$t('done')
            )
          })
        } else {
          this.$notify(
            'warning',
            this.$t('privacy_policy'),
            this.$t('validation_failed')
          )
        }
      })
    },
    titleCase(str) {
      var splitStr = str.toLowerCase().split(' ')
      for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] =
          splitStr[i].charAt(0).toUpperCase() +
          splitStr[i].substring(1)
      }
      return splitStr.join(' ')
    },
    clearForm() {
      this.form = Object.assign({}, this.defaultForm)

      this.get()
    },

    uploadImageDescLatin($event) {
      let vm = this
      const files = $event.target.files || $event.dataTransfer.files

      if (files[0]) {
        var reader = new FileReader()
        reader.onload = function (e) {
          let input = {
            image: e.target.result,
          }

          //upload image to server
          vm.$axios
            .$post('media/upload_media', input)
            .then((response) => {
              let imageResponse = response.data

              //this code to set your position cursor
              const range = vm.$refs.quillDescLatin.quill.getSelection()
              //this code to set image on your server to quill editor
              vm.$refs.quillDescLatin.quill.insertEmbed(
                range.index,
                'image',
                `${vm.mediaPath}${imageResponse}`
              )

              //Clear file and can upload the same image again
              vm.$refs.imageDescLatin.value = ''
            })
            .catch((e) => {
              console.log('error')
            })
        }
        reader.readAsDataURL(files[0])
      }
    },
    uploadImageDescLocal($event) {
      let vm = this
      const files = $event.target.files || $event.dataTransfer.files

      if (files[0]) {
        var reader = new FileReader()
        reader.onload = function (e) {
          let input = {
            image: e.target.result,
          }

          //upload image to server
          vm.$axios
            .$post('media/upload_media', input)
            .then((response) => {
              let imageResponse = response.data

              //this code to set your position cursor
              const range = vm.$refs.quillDescLocal.quill.getSelection()
              //this code to set image on your server to quill editor
              vm.$refs.quillDescLocal.quill.insertEmbed(
                range.index,
                'image',
                `${vm.mediaPath}${imageResponse}`
              )

              //Clear file and can upload the same image again
              vm.$refs.imageDescLocal.value = ''
            })
            .catch((e) => {
              console.log('error')
            })
        }
        reader.readAsDataURL(files[0])
      }
    },
  },
}
</script>
<style>
.ql-editor {
  height: 500px !important;
}
</style>
