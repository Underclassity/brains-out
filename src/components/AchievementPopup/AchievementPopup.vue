<template lang="pug">
Transition(name="fade")
    .achievement-popup(v-if="isShow && id")
        .achievement-popup--icon.material-symbols-outlined {{ item.icon }}
        .achievement-popup--title {{ item.title }}
        .achievement-popup--desc {{ item.desc }}
</template>

<script src="./AchievementPopup.js"></script>
<style src="./AchievementPopup.styl" lang="stylus"></style>