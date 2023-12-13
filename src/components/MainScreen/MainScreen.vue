<template lang="pug">
.main
    .container(ref="container" :class="{ 'container--controls': (isControls || isMobile) }")

    .navigation(v-show="!isPractice")
        .navigation--item(
            v-bind:class="{ 'navigation--item--score-blinking': score > maxScore }"
        ) {{ $t('best') }}: {{ score > maxScore ? score : maxScore }}

        .navigation--item {{ $t('score') }}: {{ showScore }}
            Transition(
                :duration="150"
                name="slide-up"
            )
                .navigation--item--inc(
                    v-show="scoreIncrement > 0"
                    v-bind:class="{ 'navigation--item--inc--yellow':  scoreIncrementType == 'levels', 'navigation--item--inc--red':  scoreIncrementType == 'levels-max' }"
                ) {{ scoreIncrement > 0 ? `+${scoreIncrement}` : '' }}

        .navigation--item {{ $t('speed') }}: {{ showSpeed }}
        .navigation--item(
            v-if="isTimeless"
            v-bind:class="{ 'navigation--item--blinking': timelessTime <= 10 * 1000 }"
        ) {{ $t('time') }}: {{ timelessTimeString }}

    .navigation--item.navigation--menu(v-on:click="openMenu")
        span.material-symbols-outlined menu

    v-tweakpane.dev-menu(
        v-if="isDev"
        :pane="{ title: 'Controls', expanded: isDevControlsOpened }"
        @on-pane-created="initTweakPane"
    )

    .dev-buttons
        span.dev-button.material-symbols-outlined(v-on:click="pauseCall" v-if="!isPause && isDev") pause
        span.dev-button.material-symbols-outlined(v-on:click="playCall" v-if="isPause && isDev") play_arrow

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
    :playButton="isControlsInfoPlay"
    :show="isControlsInfo"
    v-on:back="closeControlsInfo"
)

.levels(v-show="!isMenu" :style="levelsOffsetStyle" v-bind:class="{ 'levels--flip': isControls }")
    .level-item(v-for="(value, index) of layers.slice().reverse()" :key="index" :style="isLayerVisible(index) ? `background-color: #${colorPalette[index].getHexString()}` : ''")

.error-overlay(v-if="error")
    .error-text {{ error }}
</template>

<script src="./MainScreen.js"></script>
<style src="./MainScreen.styl" lang="stylus"></style>
<i18n src="./MainScreen.json"></i18n>