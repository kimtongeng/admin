<template>
  <div>
    <vue-perfect-scrollbar
      ref="chatArea"
      :settings="{ suppressScrollX: true, wheelPropagation: false }"
      class="scroll"
    >
      <div class="chat" style="overflow: hidden; outline: none">
        <div class="chat-body">
          <div
            v-for="(message, index) in conversationMessages"
            :key="`message${index}`"
            :class="{ right: message.type == enums.chat_type.ADMIN, left: message.type == enums.chat_type.CUSTOMER}"
            class="answer"
            @mouseleave="hideDeleteChatIcon(index)"
            @mouseover="showDeleteChatIcon(index)"
          >

            <div
              :style="index == conversationMessages.length - 1 && lastMessageType == enums.chat_type.ADMIN ? 'bottom: 47px' : 'bottom: 36px'"
              class="avatar"
            >
              <img
                :src="getPhoto(message.type == enums.chat_type.ADMIN ? message.photo_url : currentContact.photo_url)"
                alt="photo"
                class="rounded"
                onerror="this.src='/no-profile.png';"
              />
            </div>
            <div class="name">
              <template
                v-if="message.type == enums.chat_type.ADMIN"
              >{{
                  getAdminNameById(message.admin_id)
                }}
              </template
              >
              <template
                v-if="message.type == enums.chat_type.CUSTOMER"
              >{{ currentContact.name }}
              </template
              >
            </div>
            <div class="text">
              {{ message.text }}
            </div>
            <div
              v-if="message.type == enums.chat_type.ADMIN && message.is_show_delete == true"
              :style="index == conversationMessages.length - 1 ? 'bottom: 65px' : 'bottom: 50px' "
              class="delete-chat"
              @click="deleteChatItem(index)"
            >
              <i class="simple-icon-trash text-danger" style="font-size: 16px"></i>
            </div>
            <div class="time">
              {{ getTimeChatFormat(message.created_at) }}
            </div>
            <div
              v-if="index == conversationMessages.length - 1 && lastMessageType == enums.chat_type.ADMIN"
              class="seen-icon text-primary"
            >
              <i
                :class="lastMessageRead ? 'iconsminds-mail-read' : 'iconsminds-envelope'"
                style="font-size: 16px"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </vue-perfect-scrollbar>
  </div>
</template>
<script>
import swal from "sweetalert2";
import Cookies from "js-cookie";
import firebase from "firebase";

export default {
  props: {
    conversationMessages: {
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
    adminList: {
      type: Array,
      default: () => {
        return []
      },
    },

  },
  data() {
    return {
      apiUrl: process.env.API_URL,
      lastMessageType: 0,
      lastMessageRead: false,
    }
  },
  watch: {
    conversationMessages: {
      handler(val){
        if(this.$helpers.nullToVoid(val) != ''){
          this.scrollToEnd()
        }
      }
    }
  },
  mounted() {
    this.scrollToEnd()
    this.checkCustomerSeenChat()
  },
  destroyed() {
    this.scrollToEnd()
  },
  methods: {
    scrollToEnd() {
      setTimeout(() => {
        if (this.$helpers.nullToVoid(this.$refs.chatArea) != '') {
          const container = this.$refs.chatArea.$el
          container.scrollTop = container.scrollHeight
        }
      }, 0)
    },
    getPhoto(photo) {
      if (this.$helpers.nullToVoid(photo) != '') {
        return photo
      } else {
        return '/no-profile.png'
      }
    },
    getAdminNameById(adminId) {
      let name = ''
      let data = this.adminList.find((obj) => obj.id == adminId)

      if (this.$helpers.nullToVoid(data) != '') {
        name = data.name
      }
      return name
    },
    checkCustomerSeenChat() {
      let vm = this
      if (vm.$helpers.nullToVoid(vm.currentContact) != '') {
        vm.$fire.firestore
          .collection('customers')
          .where(firebase.firestore.FieldPath.documentId(), '==', `${vm.currentContact.id}`)
          .onSnapshot((snapshot) => {
            vm.lastMessageType = 0
            vm.lastMessageRead = false

            let docList = snapshot.docs
            if (docList.length > 0) {
              let data = docList[0].data()
              if (vm.$helpers.nullToVoid(data) != '') {
                vm.lastMessageType = data.last_message_type
                vm.lastMessageRead = data.is_read
              }
            }
          })
      }
    },
    showDeleteChatIcon(index) {
      this.conversationMessages[index].is_show_delete = true
    },
    hideDeleteChatIcon(index) {
      this.conversationMessages[index].is_show_delete = false
    },
    async deleteChatItem(index) {
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
            let contactDocID = vm.currentContact.id;
            let chatDocID = vm.conversationMessages[index].document_id;
            let totalConversation = vm.conversationMessages.length;

            if (vm.$helpers.nullToVoid(contactDocID) != '' && vm.$helpers.nullToVoid(chatDocID) != '') {
              if (totalConversation > 1) {
                await vm.$fire.firestore
                  .collection('customers')
                  .doc(`${contactDocID}`)
                  .collection('messages')
                  .doc(`${chatDocID}`)
                  .delete()
                  .then(async (snapshot) => {
                    vm.conversationMessages.splice(index, 1);
                    vm.$notify(
                      'success',
                      vm.$t('chat'),
                      vm.$t('done')
                    )
                    await vm.setLastChatData(contactDocID)
                  })
              } else {
                await vm.$fire.firestore
                  .collection('customers')
                  .where(firebase.firestore.FieldPath.documentId(), '==', `${contactDocID}`)
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

                    vm.conversationMessages.splice(index, 1);
                    Cookies.remove('super-app-current-chat-contact')
                    vm.$notify(
                      'success',
                      vm.$t('chat'),
                      vm.$t('done')
                    )
                  });
              }
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
    async setLastChatData(docID) {
      let vm = this
      let lastChat = vm.conversationMessages[vm.conversationMessages.length - 1]
      if (vm.$helpers.nullToVoid(lastChat) != '') {
        await this.$fire.firestore
          .collection('customers')
          .doc(`${docID}`)
          .update({
            is_read: false,
            last_message_type: lastChat.type,
            last_message_text: lastChat.text,
          })
      }
    }
  },
}
</script>
<style scoped>
.chat-body h6 {
  font-size: 20px;
  margin: 0 0 20px;
}

.chat-body .answer.left {
  padding: 0 0 0 58px;
  text-align: left;
  float: left;
}

.chat-body .answer {
  position: relative;
  max-width: 70% !important;
  clear: both;
}

.chat-body .answer.left .avatar {
  left: 0;
}

.chat .avatar {
  width: 40px !important;
  height: 40px !important;
  position: absolute;
}

.chat .avatar img {
  display: block;
  width: 100%;
  height: 100%;
}

.chat-body .answer .name {
  font-size: 14px;
  line-height: 36px;
}

.chat-body .answer.left .avatar .status {
  right: 4px;
}

.chat-body .answer .avatar .status {
  bottom: 0;
}

.chat-body .answer.left .text {
  background: #ebebeb;
  color: #333333;
  border-radius: 8px 8px 8px 0;
}

.chat-body .answer .text {
  padding: 12px;
  font-size: 16px;
  line-height: 26px;
  position: relative;
  word-wrap: break-word;
}

.chat-body .answer.left .text:before {
  left: -30px;
  border-right-color: #ebebeb;
  border-right-width: 12px;
}

.chat-body .answer .text:before {
  content: '';
  display: block;
  position: absolute;
  bottom: 0;
  border: 18px solid transparent;
  border-bottom-width: 0;
}

.chat-body .answer.left .time {
  padding-left: 12px;
  /* color: #333333; */
  color: #9d8888;
}

.chat-body .answer .time {
  font-size: 11px;
  line-height: 36px;
  position: relative;
  padding-bottom: 1px;
}

/*RIGHT*/
.chat-body .answer.right {
  padding: 0 58px 0 35px;
  /* text-align: right; */
  float: right;
}

.chat-body .answer.right .avatar {
  right: 0;
}

.chat-body .answer.right .avatar .status {
  left: 4px;
}

.chat-body .answer.right .text {
  background: #008ecc;
  color: #ffffff;
  border-radius: 8px 8px 0 8px;
}

.chat-body .answer.right .text:before {
  right: -30px;
  border-left-color: #008ecc;
  border-left-width: 12px;
}

.chat-body .answer.right .time {
  padding-right: 12px;
  /* color: #333333; */
  color: #9d8888;
}

.chat-body .answer.right .seen-icon {
  margin-top: -7px;
  margin-left: 3px;
}

.chat-body .answer.right .delete-chat {
  position: absolute;
  left: 10px;
  cursor: pointer;
}
</style>
