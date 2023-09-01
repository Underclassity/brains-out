<template lang="pug">
.main
    .container(ref="container")

    span.menu-button.link.material-symbols-outlined(v-on:click="openMenu") menu
    span.pause-button.link.material-symbols-outlined(v-on:click="pauseCall" v-if="!isPause") pause
    span.play-button.link.material-symbols-outlined(v-on:click="playCall" v-if="isPause") play_arrow

    .control-item.control-item-left(v-on:click="moveLeft")
        .material-symbols-outlined west
    .control-item.control-item-right(v-on:click="moveRight")
        .material-symbols-outlined east

    .control-item.control-item-top--first(v-on:click="moveUp")
        .material-symbols-outlined north
    .control-item.control-item-bottom--first(v-on:click="moveDown")
        .material-symbols-outlined south

    .control-item.control-item-left.control-item-left--first(v-on:click="rotateXMinus")
        .material-symbols-outlined north_west
    .control-item.control-item-left.control-item-left--last(v-on:click="rotateYMinus")
        .material-symbols-outlined south_west

    .control-item.control-item-right.control-item-right--first(v-on:click="rotateXPlus")
        .material-symbols-outlined north_east
    .control-item.control-item-right.control-item-right--last(v-on:click="rotateYPlus")
        .material-symbols-outlined south_east

    .control-item.control-item-top--last(v-on:click="rotateZPlus")
        .material-symbols-outlined north_east
    .control-item.control-item-bottom--last(v-on:click="rotateZMinus")
        .material-symbols-outlined south_east

    .control-item.control-item--drop(v-on:click="drop")
        .material-symbols-outlined water_drop

MenuComponent(
    :isMenu="isMenu"
    :isEnd="isEnd"
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