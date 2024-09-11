<template>
  <div>
    <b-row class="app-row">
      <b-colxx class="chat-app" xxs="12">
        <conversation-header
          v-if="$helpers.nullToVoid(currentContact) != ''"
          :current-contact="currentContact"
        ></conversation-header>

        <conversation-detail
          v-if="isLoadedCurrentConversation == true"
          key="conversation"
          ref="conversation-detail"
          :admin-list="adminList"
          :conversation-messages="conversationMessages"
          :current-contact="currentContact"
        />

        <div
          v-if="$helpers.nullToVoid(currentContact) == '' && conversationMessages.length == 0 && isLoadedCurrentConversation == true"
          class="no-conversation-badge"
        >
          <div class="no-conversation-text">
            <template v-if="$i18n.locale == 'en'"
            >Select a chat to start messaging
            </template
            >
            <template v-if="$i18n.locale == 'kh'"
            >ជ្រើសរើសការជជែកដើម្បីចាប់ផ្តើមផ្ញើសារ
            </template
            >
          </div>
        </div>

        <div
          v-if="isLoadedCurrentConversation == false"
          key="conversationLoading"
          class="loading"
        ></div>
      </b-colxx>
    </b-row>
    <div
      v-if="checkModuleAuthorize('chat', 'send') && $helpers.nullToVoid(currentContact) != ''"
      class="chat-input-container d-flex justify-content-between align-items-center"
    >
      <b-input
        ref="message-input"
        v-model="message"
        :placeholder="$t('saysomething')"
        autocomplete="off"
        autofocus
        class="flex-grow-1"
        type="text"
        @keyup.enter="sendMessage"
      />
      <div>
        <b-button
          class="icon-button large ml-1"
          variant="primary"
          @click="sendMessage"
        >
          <i class="simple-icon-arrow-right"></i>
        </b-button>
      </div>
    </div>

    <chat-right-sidebar ref="chat-right-sidebar">
      <b-tabs
        v-model="tabIndex"
        class="pl-0 pr-0 h-100"
        content-class="chat-app-tab-content"
        nav-class="card-header-tabs ml-0 mr-0"
        no-fade
      >
        <b-tab
          v-show="conversationList.length > 0"
          :title="$t('messages')"
          active
          class="chat-app-tab-pane"
          no-body
          title-item-class="w-50 text-center"
          @click="onTabConversation"
        >
          <div class="pt-4 spaced-content pb-0 mt-2"></div>
          <conversation-list
            key="conversationList"
            :contact-list="contactList"
            :conversation-list="conversationList"
            :current-contact="currentContact"
            @select-conversation="selectConversation"
          />
        </b-tab>
        <b-tab
          :title="$t('contacts')"
          class="chat-app-tab-pane"
          no-body
          title-item-class="w-50 text-center"
        >
          <div class="pt-4 spaced-content pb-0 mt-2">
            <div class="form-group">
              <b-input
                v-model="searchContactValue"
                :disabled="contactList.length == 0 ? true : false"
                :placeholder="$t('search')"
                class="rounded"
                type="text"
                @input="searchCustomer()"
              />
            </div>
          </div>
          <contact-list
            key="contactList"
            :contact-list="contactList"
            @select-contact="selectContact"
          />
        </b-tab>
      </b-tabs>
    </chat-right-sidebar>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ChatRightSidebar from '~/components/Chat/ChatRightSidebar'
import ContactList from '~/components/Chat/ContactList'
import ConversationList from '~/components/Chat/ConversationList'
import ConversationHeader from '~/components/Chat/ConversationHeader'
import ConversationDetail from '~/components/Chat/ConversationDetail'
import Cookies from 'js-cookie'
import firebase from 'firebase';

export default {
  layout: 'app',
  middleware: 'acl',
  moduleKey: 'chat',
  head() {
    return {
      title: this.$t('chat'),
    }
  },
  components: {
    ChatRightSidebar,
    ContactList,
    ConversationList,
    ConversationHeader,
    ConversationDetail,
  },
  data() {
    return {
      tabIndex: 0,
      message: '',
      searchContactValue: '',
      isLoadedCurrentConversation: false,
      currentContact: null,
      contactList: [],
      conversationList: [],
      conversationMessages: [],
      currentAdmin: this.$store.state.auth.user,
      apiUrl: process.env.API_URL,
      adminList: [],
      isNewCustomerChat: false
    }
  },
  computed: {
    ...mapGetters({
      unSeenChat: 'chat_badge/getUnSeenChat',
    }),
  },
  async mounted() {
    this.startOnMessageListener()
    await this.getAdminList()
    await this.getCustomerList(false)
    await this.getCurrentContactCookie()
    await this.getConversationList()
  },
  beforeDestroy() {
    document.body.classList.remove('no-footer')
  },
  methods: {
    startOnMessageListener() {
      let vm = this

      vm.$fire.messaging.onMessage((payload) => {
        vm.$notify(
          'info',
          payload.notification.title,
          payload.notification.body,
          {
            duration: 4000,
          },
          payload.notification.click_action
        )

        // if (payload.data.type != vm.enums.notification_send_type.CHAT) {
        //   vm.$store.dispatch('notification_badge/fetchData')
        // }
      })
    },
    getAdminList() {
      this.$axios
        .$post('chat/get_admin_list', {loading: false})
        .then(({data}) => {
          if (!this.$helpers.isEmpty(data)) {
            this.adminList = []
            data.map((obj) => {
              this.adminList.push({
                id: obj.id,
                name: obj.full_name,
                photo_url: obj.image
                  ? `${this.apiUrl}images/users/${obj.image}`
                  : '',
              })
            })
          }
        })
    },
    async getCustomerList(loading = false) {
      let input = {
        search: this.searchContactValue,
        loading: loading,
      }

      await this.$axios
        .$post('chat/get_customer_list', input)
        .then(({data}) => {
          if (!this.$helpers.isEmpty(data)) {
            this.contactList = []
            data.map((obj) => {
              this.contactList.push({
                id: obj.id,
                name: this.getContactNameOrPhone(obj),
                photo_url: obj.profile_image
                  ? `${this.apiUrl}images/contact/${obj.profile_image}`
                  : '',
              })
            })
          }
        })
    },
    searchCustomer() {
      setTimeout(() => {
        this.getCustomerList(false)
      }, 1000)
    },
    async getConversationList() {
      this.isLoadedCurrentConversation = false
      await this.$fire.firestore
        .collection('customers')
        .orderBy('created_at', 'desc')
        .onSnapshot((snapshot) => {
          this.conversationList = []
          snapshot.docs.map((doc) => {
            let docData = doc.data()

            let contact = this.contactList.find((obj) => obj.id == doc.id)
            if (this.$helpers.nullToVoid(contact) != '') {
              this.conversationList.push({
                document_id: doc.id,
                created_at: docData.created_at,
                photo_url: contact.photo_url,
                is_read: docData.is_read,
                last_message_type: docData.last_message_type,
                last_message_text: docData.last_message_text,
              })
            }
          })

          if (this.conversationList.length == 0) {
            //Check when empty conversation
            this.tabIndex = 1
            this.currentContact = null
            this.conversationMessages = []
            this.clearCurrentContactCookie()
          } else {
            this.tabIndex = 0

            if (this.$helpers.nullToVoid(this.currentContact) == '') {
              //Trigger select only have one conversation
              if (this.conversationList.length == 1) {
                this.selectConversation(this.conversationList[0].document_id)
              }
            } else {
              //Trigger select when have current contact in cookie and have in firebase
              let data = this.conversationList.find((obj) => obj.document_id == this.currentContact.id)

              if (this.$helpers.nullToVoid(data) != '') {
                this.selectConversation(this.currentContact.id)
              } else {
                this.currentContact = null
                this.conversationMessages = []
                this.clearCurrentContactCookie()
              }
            }
          }

          this.isLoadedCurrentConversation = true
        })
    },
    setCurrentContactCookie(contact) {
      Cookies.set('super-app-current-chat-contact', JSON.stringify(contact), {expires: 1})
    },
    getCurrentContactCookie() {
      let contact = Cookies.get('super-app-current-chat-contact')
      if (this.$helpers.nullToVoid(contact) != '') {
        this.currentContact = JSON.parse(contact)
      }
    },
    clearCurrentContactCookie() {
      Cookies.remove('super-app-current-chat-contact')
    },
    selectConversation(documentId) {
      let vm = this
      vm.isLoadedCurrentConversation = false
      vm.conversationMessages = []
      if (vm.$helpers.nullToVoid(documentId) != '') {
        let data = vm.contactList.find((obj) => obj.id == documentId)
        if (vm.$helpers.nullToVoid(data) != '') {
          vm.currentContact = data
          vm.setCurrentContactCookie(vm.currentContact)
        }

        //Get Conversation
        vm.$fire.firestore
          .collection('customers')
          .doc(`${documentId}`)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              snapshot.ref
                .collection('messages')
                .orderBy('created_at', 'asc')
                .get()
                .then((subSnapshot) => {
                  subSnapshot.docs.map((doc) => {
                    let data = doc.data()
                    let item = {
                      document_id: doc.id,
                      admin_id: data.admin_id,
                      created_at: data.created_at,
                      text: data.text,
                      type: data.type,
                      is_show_delete: false
                    };

                    //Prevent Duplicate Data
                    if (vm.conversationMessages.findIndex((item) => item.document_id === doc.id) === -1) {
                      vm.conversationMessages.push(item)
                    }
                  })

                  vm.isNewCustomerChat = false

                  vm.isLoadedCurrentConversation = true

                  //Toggle Conversation list and contact list when on mobile screen
                  if (vm.$helpers.nullToVoid(vm.$refs['chat-right-sidebar']) != '') {
                    vm.$refs['chat-right-sidebar'].toggle()
                  }

                  //Cursor focus on message input
                  if (vm.$helpers.nullToVoid(vm.$refs['message-input']) != '') {
                    vm.$refs['message-input'].focus()
                  }


                  //Set Chat Read
                  vm.setChatRead(documentId)
                })
                .catch(function (error) {
                  vm.clearChatData()
                })
            } else {
              vm.clearChatData()
              vm.isNewCustomerChat = true;
            }
          })
          .catch(function (error) {
            vm.clearChatData()
          })
      }
    },
    async selectContact(contact) {
      let vm = this
      vm.tabIndex = 1

      if (vm.$helpers.nullToVoid(contact) != '') {
        vm.conversationMessages = []

        await vm.$fire.firestore
          .collection('customers')
          .doc(`${contact.id}`)
          .get()
          .then((snapshot) => {
            if (snapshot.exists) {
              vm.selectConversation(contact.id)
              vm.tabIndex = 0
            } else {
              vm.currentContact = contact
              vm.setCurrentContactCookie(contact)
              vm.isNewCustomerChat = true
              vm.isLoadedCurrentConversation = true
            }
          })
          .catch(function (error) {
            vm.clearChatData()
          })
      }
    },
    async createNewCustomer(createdAt = null) {
      let userInfo = {
        created_at: createdAt,
        is_read: false,
        last_message_type: this.enums.chat_type.ADMIN,
        last_message_text: this.message,
      }
      await this.$fire.firestore
        .collection('customers')
        .doc(`${this.currentContact.id}`)
        .set(userInfo)
    },
    async sendMessage() {
      let vm = this

      vm.isLoadedCurrentConversation = false

      let currentTimestamp = firebase.default.firestore.Timestamp.fromDate(new Date())

      if (vm.isNewCustomerChat == true) {
        await vm.createNewCustomer(currentTimestamp)
      }
      let documentId = vm.currentContact.id

      let text = JSON.parse(JSON.stringify(vm.message))

      let messageInfo = {
        admin_id: vm.currentAdmin.id,
        created_at: currentTimestamp,
        text: text,
        type: vm.enums.chat_type.ADMIN
      }

      vm.message = ''
      vm.isLoadedCurrentConversation = true
      vm.tabIndex = 0
      vm.$refs['message-input'].focus()

      //Set last message read
      if (vm.$helpers.nullToVoid(vm.$refs['conversation-detail']) != '') {
        vm.$refs['conversation-detail'].lastMessageRead = false
      }

      //Create Chat
      vm.$fire.firestore
        .collection('customers')
        .doc(`${documentId}`)
        .collection('messages')
        .add(messageInfo)
        .then(async (docRef) => {
          //Set Document ID and Is Show Delete Icon
          // messageInfo.document_id = docRef.id;
          // messageInfo.is_show_delete = false;
          // vm.conversationMessages.push(messageInfo)

          //Set Not Read And Last Text
          if (vm.isNewCustomerChat == false) {
            await vm.setChatNotReadAndLastText(documentId, text, currentTimestamp)
          }

          vm.isNewCustomerChat = false

          //Send Notification
          await vm.sendNotificationToContact(this.currentContact.id, text)
        })
        .catch(function (error) {
          vm.clearChatData()
        })
    },
    async setChatNotReadAndLastText(documentId, text, currentTimestamp) {
      await this.$fire.firestore
        .collection('customers')
        .doc(`${documentId}`)
        .update({
          created_at: currentTimestamp,
          is_read: false,
          last_message_type: this.enums.chat_type.ADMIN,
          last_message_text: text,
        })
    },
    async setChatRead(documentId) {
      let index = this.conversationList.findIndex(obj => obj.document_id == documentId)
      if (index > -1) {
        if (
          this.conversationList[index].last_message_type == this.enums.chat_type.CUSTOMER &&
          this.conversationList[index].is_read == false
        ) {
          this.conversationList[index].is_read = true
          await this.$fire.firestore
            .collection('customers')
            .doc(`${documentId}`)
            .update({
              is_read: true,
            })
        }
      }
    },
    async sendNotificationToContact(contactID, text = '') {
      let input = {
        id: contactID,
        text: text,
        loading: false,
      }
      await this.$axios
        .$post('chat/send_notification_to_app', input)
        .then((response) => {
        })
    },
    onTabConversation() {
      if (this.tabIndex != 0) {
        this.searchContactValue = null
        this.getCustomerList(false)
      }
    },
    clearChatData() {
      let data = this.conversationList.find((obj) => obj.document_id == this.currentContact.id)
      if (this.$helpers.nullToVoid(data) != '') {
        this.conversationList = this.conversationList.filter((item) => item.document_id != data.document_id)
      }

      this.currentContact = null
      this.conversationMessages = []
      this.clearCurrentContactCookie()
      this.isLoadedCurrentConversation = true
    }
  },
}
</script>
<style scoped>
.no-conversation-badge {
  /* background-color: #1e2c3a; */
  background-color: #1e2c3a;
  height: 23px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 100px;
}

.no-conversation-text {
  font-size: 12px;
  padding: 2px 15px 0px 15px;
  color: white;
}
</style>
