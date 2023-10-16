<template lang="pug">
Transition(:duration="{ enter: 500, leave: 800 }")
    .popup--overlay
        .popup--main.popup--glare
            .popup--desc This game is in a state of early development and may contain bugs, that can lead to some unexpected behavior. By pressing "Play", you accept any scenario that can happen. Otherwise, close this page.

            .popup--checkbox
                .popup--checkbox--title Don't show again
                input.popup--checkbox--input(
                    type="checkbox"
                    v-model="save"
                    ref="checkbox"
                )

            .popup--buttons
                .popup--button.popup--button--green.popup--glare(
                    v-on:click="yesClick"
                    ref="button"
                ) Play
</template>

<script src="./AcceptBugsScreen.js"></script>
<style src="./AcceptBugsScreen.styl" lang="stylus"></style>