<template lang="pug">
.overlay(v-if="isMenu")
    .menu
        h1 Menu
        hr

        .menu-item
            span Pit size:
            select(v-model="currentPitSize" v-on:change="changePitSize")
                option(value='5x5x12') 5x5x12
                option(value='10x10x12') 10x10x12
                option(value='7x4x12') 7x4x12

        h3.link(v-on:click="closeMenu") Back to game
</template>

<script src="./MenuComponent.js"></script>
<style src="./MenuComponent.styl" lang="styl"></style>