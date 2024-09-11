<template>
    <b-container>
        <b-row
            class="justify-content-center align-items-center"
            style="height: 100vh"
        >
            <b-col md="10" class="mx-auto my-auto">
                <b-card class="auth-card shadow-lg" no-body>
                    <div class="position-relative image-side"></div>
                    <div class="form-side">
                        <span class="logo-single" style="margin-left: -20px" />
                        <b-form class="mt-3">
                            <b-form-group
                                :invalid-feedback="veeErrors.first('user_name')"
                                :state="!veeErrors.has('user_name')"
                                :label="$t('user_name')"
                                label-for="user_name"
                            >
                                <b-form-input
                                    v-model="form.username"
                                    v-validate="'required|max:50'"
                                    :state="
                                        veeErrors.has('user_name')
                                            ? false
                                            : null
                                    "
                                    data-vv-name="user_name"
                                    :data-vv-as="$t('user_name')"
                                    type="text"
                                    size="lg"
                                    required
                                    :readonly="inProgress"
                                    :placeholder="$t('enter_user_name')"
                                    @keydown.enter="login"
                                />
                            </b-form-group>
                            <b-form-group
                                :invalid-feedback="veeErrors.first('password')"
                                :state="!veeErrors.has('password')"
                                :label="$t('password')"
                                label-for="password"
                            >
                                <b-form-input
                                    v-model="form.password"
                                    v-validate="'required|max:255'"
                                    :state="
                                        veeErrors.has('password') ? false : null
                                    "
                                    data-vv-name="password"
                                    :data-vv-as="$t('password')"
                                    type="password"
                                    size="lg"
                                    required
                                    :readonly="inProgress"
                                    :placeholder="$t('enter_password')"
                                    @keydown.enter="login"
                                />
                            </b-form-group>
                            <b-row class="mt-3">
                                <b-col>
                                    <div class="text-primary float-left">
                                        {{ $t('forget_password') }}
                                    </div>
                                    <!-- <b-dropdown no-caret variant="link">
                                        <template slot="button-content">
                                            <p class="h5">
                                                <b-icon icon="globe"></b-icon>
                                            </p>
                                        </template>
                                        <b-dropdown-item
                                            v-for="locale in $i18n.locales"
                                            :key="locale.code"
                                            @click="changeLang(locale.code)"
                                            >{{ locale.name }}</b-dropdown-item
                                        >
                                    </b-dropdown> -->
                                </b-col>
                                <b-col class="text-right">
                                    <b-skeleton-wrapper :loading="inProgress">
                                        <template #loading>
                                            <b-skeleton
                                                type="button"
                                                width="100px"
                                                class="float-right"
                                            ></b-skeleton>
                                        </template>

                                        <b-button
                                            variant="primary"
                                            size="lg"
                                            :disabled="
                                                inProgress ? true : false
                                            "
                                            @click="login"
                                            >{{ $t('login') }}</b-button
                                        >
                                    </b-skeleton-wrapper>
                                </b-col>
                            </b-row>
                            <b-row class="text-center">
                                <b-col> </b-col>
                            </b-row>
                        </b-form>
                    </div>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>
<script>
import { mapGetters } from 'vuex'
import swal from 'sweetalert2'
import Cookies from 'js-cookie'
import {sidebar} from '~/data/sidebar.js'
export default {
    layouts: 'default',
    data: () => ({
        form: {
            username: null,
            password: null,
        },
        inProgress: false,
        device_id: null,
        isShowLeftImage: true,
    }),
    created() {
        if (this.$store.state.lang.locale == 'en') {
            this.$validator.localize('en')
        } else if (this.$store.state.lang.locale == 'kh') {
            this.$validator.localize('kh')
        }
    },
    computed: {
        ...mapGetters({
            role_modules_auth: 'auth/roleModules',
        }),
    },
    methods: {
        login(evt) {
            // prevent close popup
            evt.preventDefault()

            // check validation
            let vm = this

            vm.$validator.validateAll().then((result) => {
                if (result) {
                    vm.inProgress = true

                    const input = {
                        username: vm.form.username,
                        password: vm.form.password,
                    }
                    vm.$axios
                        .$post('login', input)
                        .then((response) => {
                            vm.inProgress = false

                            vm.$store.dispatch('auth/login', {
                                token: response.data.token,
                                user: response.data.user,
                                role_modules: response.data.role_modules,
                                auth_level: response.data.auth_level,
                            })
                            vm.$store.dispatch(
                                'enums/setAllEnum',
                                response.data.enums
                            )

                            /**
                             * Check and Generate Device Id
                             */
                            vm.device_id = Cookies.get(
                                'super-app-admin-browser-id'
                            )
                            if (vm.$helpers.nullToVoid(vm.device_id) == '') {
                                vm.device_id = vm.generateUUID()
                                Cookies.set(
                                    'super-app-admin-browser-id',
                                    vm.device_id,
                                    { expires: 365 }
                                )
                            }

                            // vm.$router.push({
                            //     path: vm.makeLink('/dashboard'),
                            // })
                            var role = response.data.role_modules
                            if(role.length>0 && !this.isSuper()){
                              var redirect = ''
                              var allow_view = ''

                              sidebar.forEach(obj => {
                                if(redirect == ''){
                                  if (this.$helpers.nullToVoid(obj.subs) == '') {
                                      role.find(el => {
                                        allow_view = el.permissions.find(res => res.permission_name == 'view')
                                        if(obj.key == el.module_key && this.$helpers.nullToVoid(allow_view)!=''){
                                          redirect = obj.to
                                          Cookies.set('redirect', redirect, {expires: 365})
                                        }
                                      })
                                  }else{
                                    obj.subs.forEach(subs => {
                                      if(redirect == ''){
                                        role.find(el => {
                                          allow_view = el.permissions.find(res => res.permission_name == 'view')
                                          if(subs.key == el.module_key && this.$helpers.nullToVoid(allow_view)!=''){
                                            redirect = subs.to
                                            Cookies.set('redirect', redirect, {expires: 365})
                                          }
                                        })
                                      }
                                    })
                                  }
                                }
                              })
                            }else{
                              redirect = '/dashboard'
                            }

                            vm.$router.push({
                              // path: vm.makeLink('/dashboard'),
                              path: vm.makeLink(redirect),
                            })

                            var iOS =
                                !!navigator.platform &&
                                /iPad|iPhone|iPod/.test(navigator.platform)
                            if (!iOS) {
                                vm.requestPermission()
                            }
                        })
                        .catch(function (error) {
                            swal.fire({
                                icon: 'warning',
                                title: vm.$t('login'),
                                text: vm.$t('invalid_credential'),
                                confirmButtonText: vm.$t('ok')
                            })
                            vm.inProgress = false
                        })
                } else {
                    vm.$notify(
                        'warning',
                        vm.$t('login'),
                        vm.$t('validation_failed')
                    )
                }
            })
        },
        async requestPermission() {
            try {
                const permission = await Notification.requestPermission()
                /** If allow notification */
                if (permission === 'granted') {
                    let token = await this.$fire.messaging.getToken()
                    this.updateUserToken(token)
                    this.$store.dispatch('auth/setUserAuthToken', token)
                }
            } catch (e) {
                console.error(e)
            }
        },
        async updateUserToken(token) {
            const input = {
                token: token,
                device_id: this.device_id,
                loading: false,
            }
            await this.$axios.$post('user/update_fcm_token', input)
        },
        onTokenRefresh() {
            this.$fire.messaging.onTokenRefresh(async () => {
                try {
                    const refreshedToken = await this.$fire.messaging.getToken()
                    this.updateUserToken(refreshedToken)
                    this.$store.dispatch(
                        'auth/setUserAuthToken',
                        refreshedToken
                    )
                } catch (e) {
                    this.$notify(
                        'warning',
                        this.$t('Notification'),
                        'Unable to retrieve refreshed token',
                        { duration: 5000 }
                    )
                }
            })
        },
        async getIdToken() {
            let currentToken = ''
            try {
                currentToken = await this.$fire.messaging.getToken()
            } catch (e) {
                this.$notify(
                    'warning',
                    this.$t('Notification'),
                    'An error occurred while retrieving token. ',
                    { duration: 5000 }
                )
            }
            return currentToken
        },
    },
}
</script>
<style>
.card {
    border-radius: 15px;
}
.auth-card .image-side {
    border-radius: inherit !important;
    width: 58%;
}
</style>
