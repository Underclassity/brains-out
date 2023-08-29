<template lang="pug">
Transition(:duration="{ enter: 500, leave: 800 }")
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

            .menu-item
                span Speed:
                select(v-model="currentSpeed" v-on:change="changeSpeed")
                    option(value=1) 1
                    option(value=2) 2
                    option(value=3) 3
                    option(value=4) 4

            .menu-item
                input#smooth(type="checkbox" v-model="isSmooth" v-on:change="updateSmooth")
                label(for="smooth") Smooth

            h3.link(v-on:click="closeMenu") Back to game
</template>

<script src="./MenuComponent.js"></script>
<style src="./MenuComponent.styl" lang="styl"></style>