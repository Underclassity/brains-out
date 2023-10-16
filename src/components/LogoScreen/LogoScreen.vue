<template lang="pug">
.logo(v-show="show")
    Transition(name="logo" :duration="2000")
        img(:src="logoSrc" v-if="show")
</template>

<script src="./LogoScreen.js"></script>
<style src="./LogoScreen.styl" lang="stylus"></style>