<template lang="pug">
.menu--overlay(v-if="isShow" :class="{ 'menu--end': isEnd }")
    .menu--main
        .menu--logo
            img(src="/img/logo-cut.png")

        //- Menu items
        .menu--item.menu--item--new(v-if="isMenu" v-on:click="newGameCall") New Game
        .menu--item(v-if="isMenu" v-on:click="settingsCall") Settings
        .menu--item(v-if="isMenu" v-on:click="controlsCall") Controls
        .menu--item(v-if="isMenu" v-on:click="creditsCall") Credits

        //- New game items
        .menu--title(v-if="isNewGame") Game Preferences

        .menu--selector(v-if="isNewGame")
            .menu--label Pit Size
            .menu--selector--prev(v-on:click="prevPitSize" v-if="pitSizes.indexOf(pitSize) != 0")
            .menu--selector--value {{ pitSize }}
            .menu--selector--next(v-on:click="nextPitSize" v-if="pitSizes.indexOf(pitSize) != pitSizes.length - 1")

        .menu--selector(v-if="isNewGame")
            .menu--label Block Type
            .menu--selector--prev(v-on:click="prevBlockType" v-if="blocksTypeOptions.indexOf(blockType) != 0")
            .menu--selector--value {{ blockType }}
            .menu--selector--next(v-on:click="nextBlockType" v-if="blocksTypeOptions.indexOf(blockType) != blocksTypeOptions.length - 1")

        .menu--selector(v-if="isNewGame")
            .menu--label Speed
            .menu--selector--prev(v-on:click="prevSpeed" v-if="speed != minSpeed")
            .menu--selector--value {{ speed }}
            .menu--selector--next(v-on:click="nextSpeed" v-if="speed != maxSpeed")

        .menu--buttons(v-if="isNewGame")
            .menu--item--red.menu--button(v-on:click="back") Back
            .menu--item--new.menu--button(v-on:click="playClick") Play

        //- Controls items
        .menu--title(v-if="isControls") Controls

        .menu--label(v-if="isControls") Arrows - Move
        .menu--label(v-if="isControls") W S - Z axis
        .menu--label(v-if="isControls") A D - X axis
        .menu--label(v-if="isControls") Q E - Y axis
        .menu--label(v-if="isControls") Space - Drop

        .menu--buttons(v-if="isControls")
            .menu--item--red.menu--button(v-on:click="back") Back

        //- Credits items
        .menu--title(v-if="isCredits") Credits

        .menu--label(v-if="isCredits") "Two Dudes - One Game" Studio
        .menu--label(v-if="isCredits") Ivan
        .menu--label(v-if="isCredits") Nikolai

        .menu--buttons(v-if="isCredits")
            .menu--item--red.menu--button(v-on:click="back") Back

        //- Settings items
        .menu--title(v-if="isSettings") Settings

        .menu--selector(v-if="isSettings")
            .menu--label Volume
            .menu--selector--prev(v-on:click="prevVolume" v-if="volume != 0")
            .menu--selector--value {{ volume }}
            .menu--selector--next(v-on:click="nextVolume" v-if="volume != 1")

        .menu--selector(v-if="isSettings")
            .menu--label FX Volume
            .menu--selector--prev(v-on:click="prevFxVolume" v-if="fxVolume != 0")
            .menu--selector--value {{ fxVolume }}
            .menu--selector--next(v-on:click="nextFxVolume" v-if="fxVolume != 1")

        .menu--selector(v-if="isSettings")
            .menu--label Dev mode
            .menu--selector--prev(v-on:click="disableDevMode" v-if="isDev")
            .menu--selector--value(v-if="isDev") Yes
            .menu--selector--value(v-if="!isDev") No
            .menu--selector--next(v-on:click="enableDevMode" v-if="!isDev")

        .menu--buttons(v-if="isSettings")
            .menu--item--red.menu--button(v-on:click="back") Back

        //- End items
        .menu--buttons(v-if="isEnd")
            .menu--item--green.menu--button(v-on:click="newGameCall") New Game

        .menu--buttons(v-if="isEnd")
            .menu--item--green.menu--button(v-on:click="startAgainCall") Start Again

        .menu--buttons(v-if="isEnd")
            .menu--item--red.menu--button(v-on:click="backToMenu") Back to menu

        //- Continue items
        .menu--buttons(v-if="isContinue")
            .menu--item--green.menu--button(v-on:click="newGameCallForce") New Game

        .menu--buttons(v-if="isContinue")
            .menu--item--green.menu--button(v-on:click="startAgainCall") Start Again

        .menu--buttons(v-if="isContinue")
            .menu--item--green.menu--button(v-on:click="closeMenu") Continue

        .menu--buttons(v-if="isContinue")
            .menu--item--red.menu--button(v-on:click="backToMenu") Back to menu
</template>

<script src="./MenuScreen.js"></script>
<style src="./MenuScreen.styl" lang="styl"></style>