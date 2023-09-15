<template lang="pug">
.menu--overlay(v-show="isShow" :class="{ 'menu--end': flags.end, 'menu--started': isStarted }")
    .menu--main
        .menu--logo
            img(:src="logoSrc")

        //- Menu items
        .menu--item.menu--item--new(v-show="flags.menu" v-on:click="newGameCall") New Game
        .menu--item(v-show="flags.menu" v-on:click="settingsCall") Settings
        .menu--item(v-show="flags.menu" v-on:click="controlsCall") Controls
        .menu--item(v-show="flags.menu" v-on:click="creditsCall") Credits

        //- New game items
        .menu--title(v-show="flags.new") Game Preferences

        .menu--selector(v-show="flags.new")
            .menu--label Pit Size
            .menu--selector--prev(v-on:click="prevPitSize" v-if="pitSizes.indexOf(pitSize) != 0")
            .menu--selector--value {{ pitSize }}
            .menu--selector--next(v-on:click="nextPitSize" v-if="pitSizes.indexOf(pitSize) != pitSizes.length - 1")

        .menu--selector(v-show="flags.new")
            .menu--label Block Type
            .menu--selector--prev(v-on:click="prevBlockType" v-if="blocksTypeOptions.indexOf(blockType) != 0")
            .menu--selector--value {{ blockType }}
            .menu--selector--next(v-on:click="nextBlockType" v-if="blocksTypeOptions.indexOf(blockType) != blocksTypeOptions.length - 1")

        .menu--selector(v-show="flags.new")
            .menu--label Speed
            .menu--selector--prev(v-on:click="prevSpeed" v-if="speed != minSpeed")
            .menu--selector--value {{ speed }}
            .menu--selector--next(v-on:click="nextSpeed" v-if="speed != maxSpeed")

        .menu--buttons(v-show="flags.new")
            .menu--item--red.menu--button(v-on:click="back") Back
            .menu--item--new.menu--button(v-on:click="playClick") Play

        //- Controls items
        .menu--title(v-show="flags.controls") Controls

        .menu--label(v-show="flags.controls") Arrows - Move
        .menu--label(v-show="flags.controls") W S - Z axis
        .menu--label(v-show="flags.controls") A D - X axis
        .menu--label(v-show="flags.controls") Q E - Y axis
        .menu--label(v-show="flags.controls") Space - Drop

        .menu--buttons(v-show="flags.controls")
            .menu--item--red.menu--button(v-on:click="back") Back

        //- Credits items
        .menu--version(v-show="flags.credits") Commit: {{ version }}

        .menu--title(v-show="flags.credits") Credits

        .menu--label(v-show="flags.credits") "Two Dudes - One Game" Studio
        .menu--label(v-show="flags.credits") Ivan
        .menu--label(v-show="flags.credits") Nikolai

        .menu--buttons(v-show="flags.credits")
            .menu--item--red.menu--button(v-on:click="back") Back

        //- Settings items
        .menu--title(v-show="flags.settings") Settings

        .menu--selector(v-show="flags.settings")
            .menu--label Volume
            .menu--selector--prev(v-on:click="prevVolume" v-if="volume != 0")
            .menu--selector--value {{ volume }}
            .menu--selector--next(v-on:click="nextVolume" v-if="volume != 1")

        .menu--selector(v-show="flags.settings")
            .menu--label FX Volume
            .menu--selector--prev(v-on:click="prevFxVolume" v-if="fxVolume != 0")
            .menu--selector--value {{ fxVolume }}
            .menu--selector--next(v-on:click="nextFxVolume" v-if="fxVolume != 1")

        .menu--selector(v-show="flags.settings")
            .menu--label Dev mode
            .menu--selector--prev(v-on:click="disableDevMode" v-if="isDev")
            .menu--selector--value(v-if="isDev") Yes
            .menu--selector--value(v-if="!isDev") No
            .menu--selector--next(v-on:click="enableDevMode" v-if="!isDev")

        .menu--selector(v-show="flags.settings")
            .menu--label Controls
            .menu--selector--prev(v-on:click="disableControls" v-if="isControls")
            .menu--selector--value(v-if="isControls") Yes
            .menu--selector--value(v-if="!isControls") No
            .menu--selector--next(v-on:click="enableControls" v-if="!isControls")

        .menu--buttons(v-show="flags.settings")
            .menu--item--red.menu--button(v-on:click="back") Back

        //- End items
        .menu--buttons(v-show="flags.end")
            .menu--item--green.menu--button(v-on:click="newGameCall") New Game

        .menu--buttons(v-show="flags.end")
            .menu--item--green.menu--button(v-on:click="startAgainCall") Start Again

        .menu--buttons(v-show="flags.end")
            .menu--item--red.menu--button(v-on:click="backToMenu") Back to menu

        //- Continue items
        .menu--buttons(v-show="flags.continue")
            .menu--item--green.menu--button(v-on:click="newGameCallForce") New Game

        .menu--buttons(v-show="flags.continue")
            .menu--item--green.menu--button(v-on:click="startAgainCall") Start Again

        .menu--buttons(v-show="flags.continue")
            .menu--item--green.menu--button(v-on:click="closeMenu") Continue

        .menu--buttons(v-show="flags.continue")
            .menu--item--red.menu--button(v-on:click="backToMenu") Back to menu
</template>

<script src="./MenuScreen.js"></script>
<style src="./MenuScreen.styl" lang="styl"></style>