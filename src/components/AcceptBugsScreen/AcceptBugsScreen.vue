<template lang="pug">
Transition(duration="300" name="accept")
    .popup--overlay
        .popup--main.popup--glare
            .popup--desc {{ $t('acceptedBugsDesc') }}

            //- .popup--checkbox
            //-     .popup--checkbox--title Don't show again
            //-     input.popup--checkbox--input(
            //-         type="checkbox"
            //-         v-model="save"
            //-         ref="checkbox"
            //-     )

            .popup--buttons
                .popup--button.popup--button--green.popup--glare(
                    v-on:click="yesClick"
                    ref="button"
                ) {{ $t('play') }}
</template>

<script src="./AcceptBugsScreen.js"></script>
<style src="./AcceptBugsScreen.styl" lang="stylus"></style>