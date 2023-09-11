<template lang="pug">
Transition(:duration="{ enter: 500, leave: 800 }")
    .popup--overlay
        .popup--main.popup--glare
            .popup--desc Accept that this game contain bugs and can hurt your pc? Otherwise close this page immediately.
            .popup--buttons
                .popup--button.popup--button--green.popup--glare(v-on:click="yesClick") Yes
</template>

<script src="./AcceptBugsScreen.js"></script>
<style src="./AcceptBugsScreen.styl" lang="styl"></style>