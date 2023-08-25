<template lang="pug">
.main
    .container(ref="container")

    select.pit-size-select(v-model="pitSize" v-on:change="changePitSize")
        option(value='5x5x12') 5x5x12
        option(value='10x10x12') 10x10x12
        option(value='7x5x12') 7x4x12
</template>

<script src="./MainScreen.js"></script>
<style src="./MainScreen.styl" lang="styl"></style>