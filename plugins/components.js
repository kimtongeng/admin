import Vue from 'vue'
import Notifications from '~/components/Common/Notification'
import vuePerfectScrollbar from 'vue-perfect-scrollbar'
import iForm from "~/components/IDGForm/iForm";
import iTableActionDropdown from "~/components/IDGForm/iTableActionDropdown";
import iTableImageViewer from "~/components/IDGForm/iTableImageViewer";
import iTableActionVerify from "~/components/IDGForm/iTableActionVerify";

Vue.use(Notifications)
Vue.component('vue-perfect-scrollbar', vuePerfectScrollbar)
Vue.component('i-form', iForm)
Vue.component('i-table-action-dropdown', iTableActionDropdown)
Vue.component('i-table-image-viewer', iTableImageViewer)
Vue.component('i-table-action-verify', iTableActionVerify)

// Barcode Scanner
import VueBarcodeScanner from '~/components/vue-barcode-scanner'
Vue.use(VueBarcodeScanner)

import { quillEditor } from 'vue-quill-editor'
Vue.component('quill-editor', quillEditor)

// Colxx Component
import Colxx from '~/components/Common/Colxx'
Vue.component('b-colxx', Colxx)
import BDatePicker from '~/components/BDatePicker'
Vue.component('b-date-picker', BDatePicker)
