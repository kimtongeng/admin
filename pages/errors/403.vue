<template>
    <div class="centered">
        <h1>{{ $t('no_permission') }}</h1>
    </div>
</template>
<script>
export default {
    layout: 'app',
}
</script>
<style scoped>
.centered {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
