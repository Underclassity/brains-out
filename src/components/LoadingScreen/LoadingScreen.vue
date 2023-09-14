<template lang="pug">
Transition(:duration="{ enter: 500, leave: 800 }")
    .loading
        .loading--title Loading
            .loading--dots {{ new Array(count).join('.') }}

        .loading--bar--container.loading--glare
            .loading--bar--line.loading--glare(:style="`transform: translateX(${ percent ? 100 * percent : 0 }%)`")
</template>

<script src="./LoadingScreen.js"></script>
<style src="./LoadingScreen.styl" lang="styl"></style>