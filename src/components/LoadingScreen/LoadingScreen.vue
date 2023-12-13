<template lang="pug">
Transition(name="loading" :duration="150")
    .loading(v-show="show")
        .loading--title {{ $t('title') }}(ETA: {{ getEstimate() }} {{ $t('sec') }})
            .loading--dots {{ new Array(count).join('.') }}

        .loading--bar--container.loading--glare
            .loading--bar--line.loading--glare(:style="`transform: translateX(${ percent ? 100 * percent : 0 }%)`")
</template>

<script src="./LoadingScreen.js"></script>
<style src="./LoadingScreen.styl" lang="stylus" scoped></style>
<i18n src="./LoadingScreen.json"></i18n>