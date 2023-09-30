<template lang="pug">
.main
    .container(ref="container" :class="{ 'container--controls': (isControls || isMobile) }")

    .navigation
        .navigation--item Best Score: {{ score > maxScore ? score : maxScore }}
        .navigation--item Score: {{ score }}

    .navigation--item.navigation--menu(v-on:click="openMenu")
        span.material-symbols-outlined menu

    //- span.menu-button.link.material-symbols-outlined(v-on:click="openMenu") menu

    div.dev-menu(v-if="isDev")
        span Score {{ score }} / Avg {{ avgScore.toFixed(2) }}
        span Min {{ minScore }} / Max {{ maxScore }}
        span Speed: {{ Math.round(speed * 100) / 100 }}
        span FPS: {{ fps }}

        .dev-menu--item
            span.material-symbols-outlined format_bold
            span.label Blocks type
            select(v-model="blocksType" v-on:change="updateBlocksType")
                option(v-for="type of blocksTypeOptions" :key="type" :value="type") {{ type }}

        .dev-menu--item
            span.material-symbols-outlined package_2
            label(for="simple") Simple view
            input#simple(type="checkbox" v-model="isSimple" v-on:change="updateSimple(isSimple)")

        .dev-menu--item
            span.material-symbols-outlined line_curve
            label(for="instanced") Is instanced
            input#instanced(type="checkbox" v-model="isInstanced" v-on:change="updateInstanced(isInstanced)")

        .dev-menu--item
            span.material-symbols-outlined line_curve
            label(for="smooth") Smooth
            input#smooth(type="checkbox" v-model="isSmooth" v-on:change="updateSmooth(isSmooth)")

        .dev-menu--item
            span.material-symbols-outlined format_color_fill
            label(for="colorize") Is colorize level
            input#colorize(type="checkbox" v-model="isColorizeLevel")

        .dev-menu--item
            span.material-symbols-outlined floor
            label(for="levelHelpers") Is level helpers
            input#levelHelpers(type="checkbox" v-model="isLevelHelpers")

        .dev-menu--item
            span.material-symbols-outlined dropdown
            label(for="fastdrop") Fast drop
            input#fastdrop(type="checkbox" v-model="isFastDrop")

        .dev-menu--item
            span.material-symbols-outlined switch_access
            label(for="levels") Change speed by levels
            input#levels(type="checkbox" v-model="changeSpeedByLevels")

        .dev-menu--item
            span.material-symbols-outlined settings_backup_restore
            label(for="rotateRestrain") Restrain rotates by {{ maxRotate }}
            input#rotateRestrain(type="checkbox" v-model="isRotateRestrain")

        .dev-menu--item
            span.material-symbols-outlined screen_rotation_alt
            label(for="rotateAnimation") Rotate animation
            input#rotateAnimation(type="checkbox" v-model="isRotateAnimation")

        .dev-menu--item
            span.material-symbols-outlined stroke_full
            label(for="shaders") Shaders
            input#shaders(type="checkbox" v-model="isShaders")

        .dev-menu--item
            span.material-symbols-outlined stroke_full
            label(for="glitch") Glitch
            input#glitch(type="checkbox" v-model="isGlitch")

        .dev-menu--item
            span.material-symbols-outlined stroke_full
            label(for="technicolor") Technicolor
            input#technicolor(type="checkbox" v-model="isTechnicolor")

        .dev-menu--item
            span.material-symbols-outlined stroke_full
            label(for="DotScreenPass") DotScreenPass
            input#DotScreenPass(type="checkbox" v-model="isDotScreenPass")

        .dev-menu--item
            span.material-symbols-outlined stroke_full
            label(for="FilmPass") FilmPass
            input#FilmPass(type="checkbox" v-model="isFilmPass")

        .dev-menu--item
            span.material-symbols-outlined stroke_full
            label(for="SAOPass") SAOPass
            input#SAOPass(type="checkbox" v-model="isSAOPass")

        .dev-menu--item
            span.material-symbols-outlined stroke_full
            label(for="SSAOPass") SSAOPass
            input#SSAOPass(type="checkbox" v-model="isSSAOPass")

        .dev-menu--item
            span.material-symbols-outlined stroke_full
            label(for="SSRPass") SSRPass
            input#SSRPass(type="checkbox" v-model="isSSRPass")

        .dev-menu--item
            span.material-symbols-outlined stroke_full
            label(for="UnrealBloomPass") UnrealBloomPass
            input#UnrealBloomPass(type="checkbox" v-model="isUnrealBloomPass")

    .dev-buttons
        span.dev-button.material-symbols-outlined(v-on:click="pauseCall" v-if="!isPause && isDev") pause
        span.dev-button.material-symbols-outlined(v-on:click="playCall" v-if="isPause && isDev") play_arrow

        span.dev-button.material-symbols-outlined(v-on:click="layersCheck(true)" v-if="isDev") layers_clear

    .controls(v-show="isControls || isMobile")
        .controls--columns
            .controls--column
                .controls--columns
                    .controls--column
                        //- W
                        .controls--button.controls--button--s(v-on:click="rotateXPlus")
                            .material-symbols-outlined switch_access_shortcut
                        //- A
                        .controls--button.controls--button--a(v-on:click="rotateYMinus")
                            .material-symbols-outlined switch_access_shortcut
                        //- Q
                        .controls--button.controls--button--q(v-on:click="rotateZPlus")
                            .material-symbols-outlined forward_media
                    .controls--column
                        //- S
                        .controls--button.controls--button--w(v-on:click="rotateXMinus")
                            .material-symbols-outlined switch_access_shortcut
                        //- D
                        .controls--button.controls--button--d(v-on:click="rotateYPlus")
                            .material-symbols-outlined switch_access_shortcut
                        //- E
                        .controls--button.controls--button--e(v-on:click="rotateZMinus")
                            .material-symbols-outlined forward_media

            .controls--column.controls--column--buttons
                .controls--button(v-on:click="moveUp")
                    .material-symbols-outlined arrow_upward
                .controls--buttons
                    .controls--button(v-on:click="moveLeft")
                        .material-symbols-outlined arrow_back
                    .controls--button(v-on:click="moveRight")
                        .material-symbols-outlined arrow_forward
                .controls--button(v-on:click="moveDown")
                    .material-symbols-outlined arrow_downward

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

AcceptBugsScreen(v-if="!isAccepted" v-on:accept="acceptedCall")
LogoScreen(v-if="isLogo")
MenuScreen(
    :isLogo="isLogo"
    :isAccepted="isAccepted"
    v-on:new-game="newGameCall"
    v-on:back-to-game="backToGameCall"
)
LoadingScreen(v-if="isLoading" :percent="loadPercent")

.levels(v-show="!isMenu")
    .level-item(v-for="(value, index) of layers.slice().reverse()" :key="index" :style="getLayerColor(index)")

.error-overlay(v-if="error")
    .error-text {{ error }}
</template>

<script src="./MainScreen.js"></script>
<style src="./MainScreen.styl" lang="stylus"></style>