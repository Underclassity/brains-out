<template lang="pug">
Transition(name="fade")
    .achievement-popup(v-if="isShow && id")
        .achievement-popup--icon.material-symbols-outlined(v-if="item.icon") {{ item.icon }}
        .achievement-popup--title(v-if="item.title") {{ item.title }}
        .achievement-popup--desc(v-if="item.desc") {{ item.desc }}
</template>

<script src="./AchievementPopup.js"></script>
<style src="./AchievementPopup.styl" lang="stylus"></style>