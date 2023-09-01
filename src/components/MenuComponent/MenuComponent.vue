<template lang="pug">
Transition(:duration="{ enter: 500, leave: 800 }")
    .overlay(v-if="isMenu")
        .menu
            h1 Menu
            hr

            .menu-item
                span.menu-icon.material-symbols-outlined fit_page
                span Pit size:
                select(v-model="currentPitSize" v-on:change="changePitSize")
                    option(value='5x5x12') 5x5x12
                    option(value='10x10x12') 10x10x12
                    option(value='7x4x12') 7x4x12

            .menu-item
                span.menu-icon.material-symbols-outlined speed
                span Speed:
                input(type='number' v-model="currentSpeed" v-on:change="changeSpeed" min=minSpeed max=maxSpeed step=speedStep)

            .menu-item
                span.menu-icon.material-symbols-outlined line_curve
                label(for="smooth") Smooth
                input#smooth(type="checkbox" v-model="isSmooth" v-on:change="updateSmooth")

            .menu-item
                span.menu-icon.material-symbols-outlined scoreboard
                span Current score: {{ score }}

            hr

            .menu-item(v-on:click="newGameCall")
                span.menu-icon.material-symbols-outlined joystick
                span.link New game

            hr

            h3.link(v-on:click="closeMenu") Back to game
</template>

<script src="./MenuComponent.js"></script>
<style src="./MenuComponent.styl" lang="styl"></style>