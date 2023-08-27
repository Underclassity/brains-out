<template lang="pug">
.main
    .container(ref="container")

    span.menu-button.link.material-symbols-outlined(v-on:click="openMenu") menu

MenuComponent(
    :isMenu="isPause"
    :pitSize="pitSize"
    :speed="speed"
    v-on:close-menu="closeMenu"
    v-on:change-pit-size="changePitSize"
    v-on:change-speed="changeSpeed"
)
</template>

<script src="./MainScreen.js"></script>
<style src="./MainScreen.styl" lang="styl"></style>