<template lang="pug">
MainScreen
AchievementPopup
</template>

<script lang="ts">
import AchievementPopup from './components/AchievementPopup/AchievementPopup.vue';
import MainScreen from './components/MainScreen/MainScreen.vue';

export default {
  name: "App",

  components: {
    AchievementPopup,
    MainScreen,
  }
}
</script>