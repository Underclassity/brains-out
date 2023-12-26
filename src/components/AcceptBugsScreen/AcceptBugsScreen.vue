<template lang="pug">
Transition(duration="300" name="accept")
    .popup--overlay
        .popup--main.popup--glare
            .popup--title {{ $t('title') }}
            .popup--scroll(v-bind:class="{ 'menu--scroll--overflow': isOverflow('scroll') }" ref="scroll")
                .popup--desc {{ $t('desc1') }}
                .popup--desc {{ $t('desc2') }}

            //- .popup--checkbox
            //-     .popup--checkbox--title Don't show again
            //-     input.popup--checkbox--input(
            //-         type="checkbox"
            //-         v-model="save"
            //-         ref="checkbox"
            //-     )

            .popup--selector(
                ref="language"
                v-bind:class="{ 'focused': focused == 'screen.language' }"
            )
                .popup--label {{ $t('language') }}
                .popup--selector--prev(v-on:click="prevLanguage" v-if="locale != 'ru'" ref="screen.language.prev")
                .popup--selector--value(v-if="locale == 'ru'") Рус
                .popup--selector--value(v-if="locale == 'en'") Eng
                .popup--selector--next(v-on:click="nextLanguage" v-if="locale != 'en'" ref="screen.language.next")

            .popup--buttons
                .popup--button.popup--button--green.popup--glare(
                    v-on:click="yesClick"
                    ref="screen.back"
                ) {{ $t('play') }}
</template>

<script src="./AcceptBugsScreen.js"></script>
<style src="./AcceptBugsScreen.styl" lang="stylus"></style>
<i18n src="./AcceptBugsScreen.json"></i18n>