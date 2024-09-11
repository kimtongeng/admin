import Vue from 'vue'
import VeeValidateKH from '@/lang/veeValidation/kh'
import VeeValidateEN from '@/lang/veeValidation/en'
import VeeValidate, {Validator} from 'vee-validate'

Vue.use(VeeValidate, {
  errorBagName: 'veeErrors',
  // This is the default
  inject: true,
  // Important to name this something other than 'fields'
  fieldsBagName: 'veeFields',
})

Validator.localize('kh', VeeValidateKH)
Validator.localize('en', VeeValidateEN)

Validator.extend('strong_password', {
  validate: (value) => {
    var strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])')
    return strongRegex.test(value)
  },
})

Validator.extend('url_http_or_https', {
  validate: (value) => {
    var httpRegex = new RegExp(
      '^(http://|https://?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$)'
    )
    return httpRegex.test(value)
  },
})

Validator.extend('url_youtube', {
  validate: value => {
    var ytRegex = new RegExp(
      '^(https\:\/\/)?((www\.|m\.)?((youtube\.com\/watch[\?]v=)|(youtube\.com\/embed\/)|(youtu.be\/))).+$'
    )
    return ytRegex.test(value)
  }
})
