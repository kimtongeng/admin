<template>
    <div />
</template>
<script>
import Cookies from 'js-cookie'
export default {
    created() {
        // let vm = this
        // this.$router.push({ path: vm.makeLink('/dashboard') })

        let vm = this
        let redirect = Cookies.get('redirect')
        if(this.$helpers.nullToVoid(redirect)==''){
          redirect = '/login'
        }
        vm.$router.push({ path: vm.makeLink(redirect) })
    },
}
</script>
