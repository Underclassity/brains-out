<template lang="pug">
.main
    .container(ref="container")

    span.menu-button.link.material-symbols-outlined(v-on:click="openMenu") menu
    span.pause-button.link.material-symbols-outlined(v-on:click="pauseCall" v-if="!isPause") pause
    span.play-button.link.material-symbols-outlined(v-on:click="playCall" v-if="isPause") play_arrow

MenuComponent(
    :isMenu="isMenu"
    :pitSize="pitSize"
    :speed="speed"
    :minSpeed="minSpeed"
    :maxSpeed="maxSpeed"
    :speedStep="speedStep"
    :smooth="isSmooth"
    :score="score"
    v-on:close-menu="closeMenu"
    v-on:change-pit-size="changePitSize"
    v-on:change-speed="changeSpeed"
    v-on:update-smooth="updateSmooth"
    v-on:new-game="newGame"
)
</template>

<script src="./MainScreen.js"></script>
<style src="./MainScreen.styl" lang="styl"></style>