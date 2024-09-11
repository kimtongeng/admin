<template>
  <vue-perfect-scrollbar
    :settings="{ suppressScrollX: true, wheelPropagation: false }"
    class="scroll"
  >
    <div class="pt-0 spaced-content pb-0">
      <swipe-list
        ref="list"
        :items="conversationList"
        :revealed.sync="revealed"
        item-key="id"
      >
        <template v-slot="{ item, index, revealed}">
          <div
            :class="{
                                'current-select': currentContact && currentContact.id == item.document_id,
                                'current-swipe': revealed == 'right'
                                }"
            class="d-flex border-bottom pt-2 pb-2 pl-2 conversation-item"
            @click="selectConversation(item)"
          >
            <div class="conversation-profile">
              <img
                :alt="item.name"
                :src="getPhoto(item.photo_url)"
                class="img-thumbnail border-0 rounded-circle mr-3 list-thumbnail align-self-center xsmall"
                onerror="this.src='/no-profile.png';"
              />
              <div
                v-if="
                                    !item.is_read &&
                                    item.last_message_type ==
                                        enums.chat_type.CUSTOMER
                                "
                class="new-chat-badge"
              ></div>
            </div>
            <div class="d-flex flex-grow-1 min-width-zero">
              <div
                class="pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero"
              >
                <div
                  :id="'popover-conversation-' + item.document_id"
                  class="min-width-zero"
                >
                  <p class="mb-0 truncate">
                    {{
                      getConversationNameById(item.document_id)
                    }}
                  </p>

                  <p
                    :class="
                                            !item.is_read &&
                                            item.last_message_type ==
                                                enums.chat_type.CUSTOMER
                                                ? 'new-chat-text'
                                                : 'text-muted'
                                        "
                    class="mb-1 text-small"
                  >
                    {{
                      getLastConversationSubText(
                        item.last_message_type,
                        item.last_message_text
                      )
                    }}
                  </p>
                </div>
                <b-tooltip
                  :target="
                                        'popover-conversation-' + item.document_id
                                    "
                  placement="left"
                  triggers="hover"
                  variant="dark"
                >
                  {{
                    getConversationNameById(
                      item.document_id,
                      'full'
                    )
                  }}
                </b-tooltip>
              </div>
            </div>
          </div>
        </template>
        <template v-slot:right="{ item }">
          <div class="swipeout-action danger" @click="deleteConversation(item)">
            <i class="simple-icon-trash" style="font-size: 16px;"></i>
          </div>
        </template>
      </swipe-list>
      <template v-if="conversationList.length == 0">
        <div v-for="obj in 15" :key="obj" class="mb-3">
          <div class="d-flex">
            <b-skeleton type="avatar"></b-skeleton>
            <b-skeleton
              class="ml-3 mt-2"
              height="10px"
              width="100%"
            ></b-skeleton>
          </div>
          <div class="border-bottom mt-2"></div>
        </div>
      </template>
    </div>
  </vue-perfect-scrollbar>
</template>

<script>
import {SwipeList} from 'vue-swipe-actions';
import 'vue-swipe-actions/dist/vue-swipe-actions.css';
import swal from "sweetalert2";
import Cookies from 'js-cookie';
import firebase from 'firebase';

export default {
  props: {
    conversationList: {
      type: Array,
      default: () => {
        return []
      },
    },
    currentContact: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  components: {
    SwipeList
  },
  data() {
    return {
      revealed: {},
      contactList: []
    }
  },
  created() {
    this.getCustomerList()
  },
  methods: {
    selectConversation(conversation) {
      this.$emit('select-conversation', conversation.document_id)
    },
    getPhoto(photo) {
      if (this.$helpers.nullToVoid(photo) != '') {
        return photo
      } else {
        return '/no-profile.png'
      }
    },
    getCustomerList(loading = false) {
      let input = {
        loading: loading,
      }

      this.$axios
        .$post('chat/get_customer_list', input)
        .then(({data}) => {
          if (!this.$helpers.isEmpty(data)) {
            this.contactList = []
            data.map((obj) => {
              this.contactList.push({
                id: obj.id,
                name: this.getContactNameOrPhone(obj),
                photo_url: obj.profile_image
                  ? `${this.apiUrl}images/account/${obj.profile_image}`
                  : '',
              })
            })
          }
        })
    },
    getConversationNameById(contactId, type = 'sub') {
      let name = ''
      let data = this.contactList.find((obj) => obj.id == contactId)

      if (this.$helpers.nullToVoid(data) != '') {
        if (type == 'sub') {
          name = data.name.substring(0, 25)
        } else {
          name = data.name
        }
      }
      return name
    },
    getLastConversationSubText(type, text) {
      let resultText = ''

      if (type == this.enums.chat_type.CUSTOMER) {
        resultText = text
      } else if (type == this.enums.chat_type.ADMIN) {
        resultText = `${this.$t('you')}: ${text}`
      }

      if (text.length > 20) {
        return resultText.substring(0, 20) + '...'
      }

      return resultText
    },
    async deleteConversation(item) {
      let vm = this

      swal.fire({
        title: vm.$t('are_you_sure'),
        text: vm.$t('cannot_revert_this'),
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: vm.$t('ok'),
        cancelButtonText: vm.$t('cancel'),
        reverseButtons: true,
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          return new Promise(async (resolve) => {

            if (vm.$helpers.nullToVoid(item.document_id) != '') {
              await vm.$fire.firestore
                .collection('customers')
                .where(firebase.firestore.FieldPath.documentId(), '==', `${item.document_id}`)
                .get()
                .then(async (snapshot) => {
                  await snapshot.docs.forEach((doc) => {
                    //Delete Sub
                    doc.ref.collection('messages').get().then((subSnapshot) => {
                      subSnapshot.docs.forEach((subDoc) => {
                        subDoc.ref.delete();
                      })
                    });

                    //Delete Main
                    doc.ref.delete();
                  });

                  Cookies.remove('super-app-current-chat-contact')
                  vm.$notify(
                    'success',
                    vm.$t('chat'),
                    vm.$t('done')
                  )
                });
            } else {
              swal.fire({
                icon: 'error',
                text: vm.$t('error_alert_text'),
                allowOutsideClick: false,
              })
            }
            swal.close()

          })
        },
        allowOutsideClick: () => !swal.isLoading(),
      })

    },
  },
}
</script>

<style lang="scss" scoped>
.current-select {
  background-color: #008ecc;

  p {
    color: #fff !important;
  }
}

.current-swipe {
  background-color: #6caecb;

  p {
    color: #fff !important;
  }
}

.conversation-item {
  cursor: pointer;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
  &:active, &:hover {
    background-color: #008ecc;

    p {
      color: #fff !important;
    }
  }
}

.swipeout-action {
  display: flex;
  align-items: center;
  padding: 0 3rem;
  margin-bottom: 1px;
  cursor: pointer;
  left: 0;

  &.danger {
    color: white;
    background-color: #fd4c4cb4;

    &:hover {
      background-color: #ed3232b4;
    }
  }
}

.list-thumbnail {
  width: 40px !important;
}

.conversation-profile {
  position: relative;
}

.new-chat-badge {
  position: absolute;
  background-color: #007bff;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  top: 15px;
  right: -160px;
}

.text-small {
  font-size: 12px !important;
}

.new-chat-text {
  color: #007bff !important;
}

.b-skeleton-avatar {
  width: 3.5em !important;
}
</style>
