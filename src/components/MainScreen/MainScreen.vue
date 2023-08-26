<template lang="pug">
.main
    .container(ref="container")

MenuComponent(:isMenu="isPause" :pitSize="pitSize" v-on:close-menu="closeMenu" v-on:change-pit-size="changePitSize")
</template>

<script src="./MainScreen.js"></script>
<style src="./MainScreen.styl" lang="styl"></style>