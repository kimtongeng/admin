<template>
	<div>
		<nuxt />
	</div>
</template>
<script>
export default {
	middleware: false,
}
</script>
<style >
#chat {
	position: fixed;
	bottom: 10px;
	left: 10px;
	display: inline-flex;
}
#chat .body-1 {
	padding-top: 13px;
}
.v-stepper,
.v-stepper__header {
	box-shadow: unset !important;
}
#recaptcha-container div {
	margin: 0 auto !important;
}
</style>
