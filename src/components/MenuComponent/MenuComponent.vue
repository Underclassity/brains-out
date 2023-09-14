<template lang="pug">
Transition(:duration="{ enter: 500, leave: 800 }")
    .overlay(v-if="isMenu")
        .menu
            h1 Menu

            hr(v-if="isEnd")

            h2(v-if="isEnd") Game ended with score {{ score }}

            hr

            .menu-item
                span.menu-icon.material-symbols-outlined fit_page
                span.label Pit size
                select(v-model="currentPitSize" v-on:change="changePitSize")
                    option(value='5x5x12') 5x5x12
                    option(value='10x10x12') 10x10x12
                    option(value='7x5x12') 7x5x12

            .menu-item
                span.menu-icon.material-symbols-outlined format_bold
                span.label Blocks type
                select(v-model="blocksType" v-on:change="updateBlocksType")
                    option(v-for="type of blocksTypeOptions" :key="type" :value="type") {{ type }}

            .menu-item
                span.menu-icon.material-symbols-outlined volume_up
                span.label Volume
                input(type='number' v-on:change="updateVolume" v-model="volume" min="0" max="1" step="0.1")

            .menu-item
                span.menu-icon.material-symbols-outlined volume_up
                span.label Fx Volume
                input(type='number' v-on:change="updateFxVolume" v-model="fxVolume" min="0" max="1" step="0.1")

            .menu-item
                span.menu-icon.material-symbols-outlined speed
                span.label Speed:
                input(type='number' v-model="currentSpeed" v-on:change="changeSpeed" :min="minSpeed" :max="maxSpeed" :step="speedStep")

            .menu-item
                span.menu-icon.material-symbols-outlined package_2
                label(for="simple") Simple view
                input#simple(type="checkbox" v-model="simple" v-on:change="updateSimple")

            .menu-item
                span.menu-icon.material-symbols-outlined line_curve
                label(for="instanced") Is instanced
                input#instanced(type="checkbox" v-model="instanced" v-on:change="updateInstanced")

            .menu-item
                span.menu-icon.material-symbols-outlined line_curve
                label(for="smooth") Smooth
                input#smooth(type="checkbox" v-model="isSmooth" v-on:change="updateSmooth")

            .menu-item
                span.menu-icon.material-symbols-outlined equalizer
                span.label Sound
                select(v-model="sound" v-on:change="updateSound")
                    option(v-for="item of audio" :key="item" :value="item") {{ item }}

            .menu-item
                span.menu-icon.material-symbols-outlined tune
                label(for="controls") Controls
                input#controls(type="checkbox" v-model="controls" v-on:change="updateControls")

            .menu-item
                span.menu-icon.material-symbols-outlined scoreboard
                span.label Current score: {{ score }}

            hr

            .menu-item(v-on:click="newGameCall")
                span.menu-icon.material-symbols-outlined joystick
                span.link New game

            hr(v-if="!isEnd")

            h3.link(v-if="!isEnd" v-on:click="closeMenu") Back to game
</template>

<script src="./MenuComponent.js"></script>
<style src="./MenuComponent.styl" lang="styl"></style>