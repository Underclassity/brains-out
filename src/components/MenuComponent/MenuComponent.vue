<template lang="pug">
.overlay(v-if="isMenu")
    .menu
        h1 Menu
        hr

        h3.link(v-on:click="closeMenu") Back to game
</template>

<script src="./MenuComponent.js"></script>
<style src="./MenuComponent.styl" lang="styl"></style>