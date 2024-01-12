<template lang="pug">
.logo(v-show="show")
    Transition(name="logo" :duration="1500")
        img(:src="imgSrc" v-if="show")
</template>

<script src="./LogoScreen.js"></script>
<style src="./LogoScreen.styl" lang="stylus" scoped></style>