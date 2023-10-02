<template lang="pug">
Transition(:duration="{ enter: 500, leave: 800 }")
    .logo
        picture
            source(:srcset="logoWebpSrc" type="image/webp")
            img(:src="logoSrc")
</template>

<script src="./LogoScreen.js"></script>
<style src="./LogoScreen.styl" lang="stylus"></style>