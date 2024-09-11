<template>
    <div />
</template>
<script>
export default {
    created() {
        let vm = this
        this.$router.push({ path: vm.makeLink('/dashboard') })
    },
}
</script>
