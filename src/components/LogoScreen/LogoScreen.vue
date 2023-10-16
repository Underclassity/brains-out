<template lang="pug">
.logo(v-show="show")
    Transition(name="logo" :duration="1500" mode="out")
        img(:src="logoSrc" v-if="show")
</template>

<script src="./LogoScreen.js"></script>
<style src="./LogoScreen.styl" lang="stylus" scoped></style>