<template lang="pug">
Transition(name="loading" :duration="300")
    .loading(v-show="show")
        .loading--title Loading(ETA: {{ getEstimate() }} sec)
            .loading--dots {{ new Array(count).join('.') }}

        .loading--bar--container.loading--glare
            .loading--bar--line.loading--glare(:style="`transform: translateX(${ percent ? 100 * percent : 0 }%)`")
</template>

<script src="./LoadingScreen.js"></script>
<style src="./LoadingScreen.styl" lang="stylus" scoped></style>