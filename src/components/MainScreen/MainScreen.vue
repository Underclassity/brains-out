<template lang="pug">
.main
    .container(ref="container" :class="{ 'container--full': !isControls }")

    .navigation
        .navigation--item Best Score: {{ maxScore }}
        .navigation--item Score: {{ score }}

    .navigation--item.navigation--menu(v-on:click="openMenu")
        span.material-symbols-outlined menu

    //- span.menu-button.link.material-symbols-outlined(v-on:click="openMenu") menu

    div.score-button(v-if="isDev")
        span(:title="`Min ${minScore} - Max ${maxScore} - Avg ${avgScore} - Length ${lsScore.length}`") Score: {{ score }}
        span Speed: {{ Math.round(speed * 100) / 100 }}
        span FPS: {{ fps }}

    span.pause-button.link.material-symbols-outlined(v-on:click="pauseCall" v-if="!isPause && isDev") pause
    span.play-button.link.material-symbols-outlined(v-on:click="playCall" v-if="isPause && isDev") play_arrow

    .controls(v-show="isControls")
        .controls--columns
            .controls--column
                .controls--columns
                    .controls--column
                        .controls--button(v-on:click="rotateYMinus")
                            span -Y
                        .controls--button(v-on:click="rotateZPlus")
                            span +Z
                        .controls--button(v-on:click="rotateYPlus")
                            span +Y

                    .controls--column
                        .controls--button(v-on:click="rotateXMinus")
                            span -X
                        .controls--button(v-on:click="rotateZMinus")
                            span -Z
                        .controls--button(v-on:click="rotateXPlus")
                            span +X

            .controls--column.controls--column--buttons
                .controls--button(v-on:click="moveUp")
                    span Up
                .controls--buttons
                    .controls--button(v-on:click="moveLeft")
                        span Left
                    .controls--button(v-on:click="moveRight")
                        span Right
                .controls--button(v-on:click="moveDown")
                    span Down

        .controls--spacebar
            .controls--button.controls--button--spacebar(v-on:click="drop")
                span Drop

        //- .control-item.control-item-left(v-on:click="moveLeft" v-if="isControls")
        //-     .material-symbols-outlined west
        //- .control-item.control-item-right(v-on:click="moveRight" v-if="isControls")
        //-     .material-symbols-outlined east

        //- .control-item.control-item-top--first(v-on:click="moveUp" v-if="isControls")
        //-     .material-symbols-outlined north
        //- .control-item.control-item-bottom--first(v-on:click="moveDown" v-if="isControls")
        //-     .material-symbols-outlined south

        //- .control-item.control-item-left.control-item-left--first(v-on:click="rotateXMinus" v-if="isControls")
        //-     .material-symbols-outlined north_west
        //- .control-item.control-item-left.control-item-left--last(v-on:click="rotateYMinus" v-if="isControls")
        //-     .material-symbols-outlined south_west

        //- .control-item.control-item-right.control-item-right--first(v-on:click="rotateXPlus" v-if="isControls")
        //-     .material-symbols-outlined north_east
        //- .control-item.control-item-right.control-item-right--last(v-on:click="rotateYPlus" v-if="isControls")
        //-     .material-symbols-outlined south_east

        //- .control-item.control-item-top--last(v-on:click="rotateZPlus" v-if="isControls")
        //-     .material-symbols-outlined north_east
        //- .control-item.control-item-bottom--last(v-on:click="rotateZMinus" v-if="isControls")
        //-     .material-symbols-outlined south_east

        //- .control-item.control-item--drop(v-on:click="drop" v-if="isControls")
        //-     .material-symbols-outlined water_drop

//- MenuComponent(
//-     :isMenu="isMenu"
//-     :isEnd="isEnd"
//-     :isControls="isControls"
//-     :isSimple="isSimple"
//-     :isInstanced="isInstanced"
//-     :inputSound="sound"
//-     :inputVolume="volume"
//-     :inputFxVolume="fxVolume"
//-     :inputBlocksType="blocksType"
//-     :pitSize="pitSize"
//-     :speed="speed"
//-     :minSpeed="minSpeed"
//-     :maxSpeed="maxSpeed"
//-     :speedStep="speedStep"
//-     :smooth="isSmooth"
//-     :score="score"
//-     v-on:close-menu="closeMenu"
//-     v-on:change-pit-size="changePitSize"
//-     v-on:change-speed="changeSpeed"
//-     v-on:update-smooth="updateSmooth"
//-     v-on:update-instanced="updateInstanced"
//-     v-on:update-simple="updateSimple"
//-     v-on:update-controls="updateControls"
//-     v-on:update-sound="updateSound"
//-     v-on:update-volume="updateVolume"
//-     v-on:update-fx-volume="updateFxVolume"
//-     v-on:update-blocks-type="updateBlocksType"
//-     v-on:new-game="newGame"
//- )

AcceptBugsScreen(v-if="!isAccepted" v-on:accept="acceptedCall")
LogoScreen(v-if="isLogo")
MenuScreen(
    v-on:new-game="newGameCall"
    v-on:back-to-game="backToGameCall"
)
</template>

<script src="./MainScreen.js"></script>
<style src="./MainScreen.styl" lang="styl"></style>