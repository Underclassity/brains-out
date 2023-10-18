<template lang="pug">
.main
    .container(ref="container" :class="{ 'container--controls': (isControls || isMobile) }")

    .navigation
        .navigation--item(v-bind:class="{ 'navigation--item--blinking': score > maxScore }") Best Score: {{ score > maxScore ? score : maxScore }}

        .navigation--item Score: {{ showScore }}
            Transition(
                :duration="150"
                name="slide-up"
            )
                .navigation--item--inc(
                    v-show="scoreIncrement > 0"
                    v-bind:class="{ 'navigation--item--inc--yellow':  scoreIncrementType == 'levels', 'navigation--item--inc--red':  scoreIncrementType == 'levels-max' }"
                ) {{ scoreIncrement > 0 ? `+${scoreIncrement}` : '' }}

        .navigation--item Speed: {{ showSpeed }}

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
                option(
                    v-for="typeItem of blocksTypeOptions"
                    :key="typeItem"
                    :value="typeItem"
                ) {{ typeItem }}

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
            input(type="number" min="1" max="10" v-model="maxRotate")
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
            input(type="number" min=1 max=10 v-model="randomFormsCount")
            button(v-on:click="addRandomFigures") Add random forms

        .dev-menu--item
            span.material-symbols-outlined timer
            label(for="endless") Endless mode
            input#endless(type="checkbox" v-model="isEndless")

        .dev-menu--item
            span.material-symbols-outlined tactic
            label(for="practice") Practice mode
            input#practice(type="checkbox" v-model="isPractice")

        // .dev-menu--item
        //     span.material-symbols-outlined stroke_full
        //     label(for="glitch") Glitch
        //     input#glitch(type="checkbox" v-model="isGlitch")

        // .dev-menu--item
        //     span.material-symbols-outlined stroke_full
        //     label(for="technicolor") Technicolor
        //     input#technicolor(type="checkbox" v-model="isTechnicolor")

        // .dev-menu--item
        //     span.material-symbols-outlined stroke_full
        //     label(for="DotScreenPass") DotScreenPass
        //     input#DotScreenPass(type="checkbox" v-model="isDotScreenPass")

        // .dev-menu--item
        //     span.material-symbols-outlined stroke_full
        //     label(for="FilmPass") FilmPass
        //     input#FilmPass(type="checkbox" v-model="isFilmPass")

        // .dev-menu--item
        //     span.material-symbols-outlined stroke_full
        //     label(for="SAOPass") SAOPass
        //     input#SAOPass(type="checkbox" v-model="isSAOPass")

        // .dev-menu--item
        //     span.material-symbols-outlined stroke_full
        //     label(for="SSAOPass") SSAOPass
        //     input#SSAOPass(type="checkbox" v-model="isSSAOPass")

        // .dev-menu--item
        //     span.material-symbols-outlined stroke_full
        //     label(for="SSRPass") SSRPass
        //     input#SSRPass(type="checkbox" v-model="isSSRPass")

        // .dev-menu--item
        //     span.material-symbols-outlined stroke_full
        //     label(for="UnrealBloomPass") UnrealBloomPass
        //     input#UnrealBloomPass(type="checkbox" v-model="isUnrealBloomPass")

    .dev-buttons
        span.dev-button.material-symbols-outlined(v-on:click="pauseCall" v-if="!isPause && isDev") pause
        span.dev-button.material-symbols-outlined(v-on:click="playCall" v-if="isPause && isDev") play_arrow

        span.dev-button.material-symbols-outlined(v-on:click="layersCheck(true)" v-if="isDev") layers_clear

        span.dev-button.material-symbols-outlined(v-on:click="shuffle" v-if="isDev") shuffle
        span.dev-button.material-symbols-outlined(v-on:click="shuffleLayers" v-if="isDev") shuffle_on

        span.dev-button.material-symbols-outlined(v-on:click="rotatePit" v-if="isDev") 360

    ControlsBlock(
        :showFlag="isControls || isMobile"
        @w-click="controlsCallHelper('rotateXPlus')"
        @a-click="controlsCallHelper('rotateYMinus')"
        @s-click="controlsCallHelper('rotateXMinus')"
        @d-click="controlsCallHelper('rotateYPlus')"
        @q-click="controlsCallHelper('rotateZPlus')"
        @e-click="controlsCallHelper('rotateZMinus')"
        @up-click="controlsCallHelper('moveUp')"
        @down-click="controlsCallHelper('moveDown')"
        @left-click="controlsCallHelper('moveLeft')"
        @right-click="controlsCallHelper('moveRight')"
        @spacebar-click="controlsCallHelper('drop')"
    )

AcceptBugsScreen(v-if="!isAccepted" v-on:accept="acceptedCall")
LogoScreen(:show="isLogo")
MenuScreen(
    :isLogo="isLogo"
    :isAccepted="isAccepted"
    v-on:new-game="newGameCall"
    v-on:back-to-game="backToGameCall"
)
LoadingScreen(:show="isLoading" :percent="loadPercent")
ControlsInfoScreen(
    :show="isControlsInfo"
    v-on:back="closeControlsInfo"
)

.levels(v-show="!isMenu" :style="levelsOffsetStyle" v-bind:class="{ 'levels--flip': isControls }")
    .level-item(v-for="(value, index) of layers.slice().reverse()" :key="index" :style="getLayerColor(index)")

.error-overlay(v-if="error")
    .error-text {{ error }}
</template>

<script src="./MainScreen.js"></script>
<style src="./MainScreen.styl" lang="stylus"></style>