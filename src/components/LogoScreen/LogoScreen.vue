<template lang="pug">
Transition(:duration="{ enter: 500, leave: 800 }")
    .logo
        img(:src="logoSrc")
</template>

<script src="./LogoScreen.js"></script>
<style src="./LogoScreen.styl" lang="styl"></style>