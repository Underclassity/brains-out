<template lang="pug">
.main
    .container(ref="container")

    span.menu-button.link.material-symbols-outlined(v-on:click="openMenu") menu
    div.score-button
        span Score: {{ score }}
        span Speed: {{ speed }}

    span.pause-button.link.material-symbols-outlined(v-on:click="pauseCall" v-if="!isPause && helpers") pause
    span.play-button.link.material-symbols-outlined(v-on:click="playCall" v-if="isPause && helpers") play_arrow

    .control-item.control-item-left(v-on:click="moveLeft" v-if="isControls")
        .material-symbols-outlined west
    .control-item.control-item-right(v-on:click="moveRight" v-if="isControls")
        .material-symbols-outlined east

    .control-item.control-item-top--first(v-on:click="moveUp" v-if="isControls")
        .material-symbols-outlined north
    .control-item.control-item-bottom--first(v-on:click="moveDown" v-if="isControls")
        .material-symbols-outlined south

    .control-item.control-item-left.control-item-left--first(v-on:click="rotateXMinus" v-if="isControls")
        .material-symbols-outlined north_west
    .control-item.control-item-left.control-item-left--last(v-on:click="rotateYMinus" v-if="isControls")
        .material-symbols-outlined south_west

    .control-item.control-item-right.control-item-right--first(v-on:click="rotateXPlus" v-if="isControls")
        .material-symbols-outlined north_east
    .control-item.control-item-right.control-item-right--last(v-on:click="rotateYPlus" v-if="isControls")
        .material-symbols-outlined south_east

    .control-item.control-item-top--last(v-on:click="rotateZPlus" v-if="isControls")
        .material-symbols-outlined north_east
    .control-item.control-item-bottom--last(v-on:click="rotateZMinus" v-if="isControls")
        .material-symbols-outlined south_east

    .control-item.control-item--drop(v-on:click="drop" v-if="isControls")
        .material-symbols-outlined water_drop

MenuComponent(
    :isMenu="isMenu"
    :isEnd="isEnd"
    :isControls="isControls"
    :isSimple="isSimple"
    :isInstanced="isInstanced"
    :inputSound="sound"
    :inputVolume="volume"
    :inputFxVolume="fxVolume"
    :inputBlocksType="blocksType"
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
    v-on:update-instanced="updateInstanced"
    v-on:update-simple="updateSimple"
    v-on:update-controls="updateControls"
    v-on:update-sound="updateSound"
    v-on:update-volume="updateVolume"
    v-on:update-fx-volume="updateFxVolume"
    v-on:update-blocks-type="updateBlocksType"
    v-on:new-game="newGame"
)
</template>

<script src="./MainScreen.js"></script>
<style src="./MainScreen.styl" lang="styl"></style>