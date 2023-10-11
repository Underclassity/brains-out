<template lang="pug">
.menu--overlay(v-show="isShow" :class="{ 'menu--end': flags.end, 'menu--started': isStarted }")
    .menu--main
        .menu--logo
            img(:src="logoSrc")

        //- Menu items
        .menu--item.menu--item--new(
            v-show="flags.menu"
            v-on:click="newGameCall"
            ref="menu.newGame"
            v-bind:class="{ 'focused': focused === 'menu.newGame' }"
        ) New Game
        .menu--item(
            v-show="flags.menu"
            v-on:click="settingsCall"
            ref="menu.settings"
            v-bind:class="{ 'focused': focused == 'menu.settings' }"
        ) Settings
        .menu--item(
            v-show="flags.menu"
            v-on:click="controlsCall"
            ref="menu.controls"
            v-bind:class="{ 'focused': focused == 'menu.controls' }"
        ) Controls
        .menu--item(
            v-show="flags.menu"
            v-on:click="achievementsCall"
            ref="menu.achievements"
            v-bind:class="{ 'focused': focused == 'menu.achievements' }"
        ) Achievements
        .menu--item(
            v-show="flags.menu"
            v-on:click="creditsCall"
            ref="menu.credits"
            v-bind:class="{ 'focused': focused == 'menu.credits' }"
        ) Credits

        //- New game items
        .menu--title(v-show="flags.new") Game Preferences

        .menu--selector(
            v-show="flags.new"
            ref="new.pit"
            v-bind:class="{ 'focused': focused == 'new.pit' }"
        )
            .menu--label Pit Size
            .menu--selector--prev(v-on:click="prevPitSize" v-if="pitSizes.indexOf(pitSize) != 0" ref="new.pit.prev")
            .menu--selector--value {{ pitSize }}
            .menu--selector--next(v-on:click="nextPitSize" v-if="pitSizes.indexOf(pitSize) != pitSizes.length - 1" ref="new.pit.next")

        .menu--selector(
            v-show="flags.new"
            ref="new.blocksType"
            v-bind:class="{ 'focused': focused == 'new.blocksType' }"
        )
            .menu--label Block Type
            .menu--selector--prev(v-on:click="prevBlockType" v-if="blocksTypeOptions.indexOf(blocksType) != 0" ref="new.blocksType.prev")
            .menu--selector--value {{ blocksType }}
            .menu--selector--next(v-on:click="nextBlockType" v-if="blocksTypeOptions.indexOf(blocksType) != blocksTypeOptions.length - 1" ref="new.blocksType.next")

        .menu--selector(
            v-show="flags.new"
            ref="new.speed"
            v-bind:class="{ 'focused': focused == 'new.speed' }"
        )
            .menu--label Speed
            .menu--selector--prev(v-on:click="prevSpeed" v-if="settingsSpeed != minSpeed" ref="new.speed.prev")
            .menu--selector--value {{ settingsSpeed }}
            .menu--selector--next(v-on:click="nextSpeed" v-if="settingsSpeed != maxSpeed" ref="new.speed.next")

        .menu--buttons(v-show="flags.new")
            .menu--item--red.menu--button(
                v-show="flags.new"
                v-on:click="back"
                ref="new.back"
                v-bind:class="{ 'focused': focused == 'new.back' }"
            ) Back
            .menu--item--new.menu--button(
                v-show="flags.new"
                v-on:click="playClick"
                ref="new.play"
                v-bind:class="{ 'focused': focused == 'new.play' }"
            ) Play

        //- Controls items
        .menu--title(v-show="flags.controls") Controls

        .menu--label(v-show="flags.controls") Arrows - Move
        .menu--label(v-show="flags.controls") W S - Z axis
        .menu--label(v-show="flags.controls") A D - X axis
        .menu--label(v-show="flags.controls") Q E - Y axis
        .menu--label(v-show="flags.controls") Space - Drop

        .menu--buttons(v-show="flags.controls")
            .menu--item--red.menu--button(
                v-on:click="back"
                ref="controls.back"
                v-bind:class="{ 'focused': focused == 'controls.back' }"
            ) Back

        //- Credits items
        .menu--version(v-show="flags.credits") Version: {{ appVersion }}-{{ version }}

        .menu--assets--title(v-show="flags.credits") Authors

        a.menu--link(v-show="flags.credits" href="https://www.linkedin.com/in/ivan-gornovskiy-a1a290282/" target="_blank") Ivan Gornovskiy
        a.menu--link(v-show="flags.credits" href="https://www.linkedin.com/in/nikolai-gavrev-6010ba215/" target="_blank") Nikolai Gavrev

        .menu--assets--title(v-show="flags.credits") Assets

        .menu--assets(v-show="flags.credits" v-for="asset of assets" :key="asset.title")
            a.menu--assets--link(:href="asset.link" target="_blank") {{ asset.title }}
            .menu--assets--author - {{ asset.author }}
            a.menu--assets--link(v-if="asset.authorLink" :href="asset.authorLink" target="_blank") ({{ asset.authorLink }})
            a(:href="asset.licenseLink" target="_blank")
                img.menu--assets--license(:src="asset.licenseImage")

        .menu--buttons(v-show="flags.credits")
            .menu--item--red.menu--button(
                v-on:click="back"
                ref="credits.back"
                v-bind:class="{ 'focused': focused == 'credits.back' }"
            ) Back

        //- Settings items
        .menu--title(v-show="flags.settings") Settings

        .menu--selector(
            v-show="flags.settings"
            ref="settings.volume"
            v-bind:class="{ 'focused': focused == 'settings.volume' }"
        )
            .menu--label Volume
            .menu--selector--prev(v-on:click="prevVolume" v-if="volume != 0" ref="settings.volume.prev")
            .menu--selector--value {{ volume }}
            .menu--selector--next(v-on:click="nextVolume" v-if="volume != 1" ref="settings.volume.next")

        .menu--selector(
            v-show="flags.settings"
            ref="settings.fxVolume"
            v-bind:class="{ 'focused': focused == 'settings.fxVolume' }"
        )
            .menu--label FX Volume
            .menu--selector--prev(v-on:click="prevFxVolume" v-if="fxVolume != 0" ref="settings.fxVolume.prev")
            .menu--selector--value {{ fxVolume }}
            .menu--selector--next(v-on:click="nextFxVolume" v-if="fxVolume != 1" ref="settings.fxVolume.next")

        .menu--selector(
            v-show="flags.settings && isDevApproved"
            ref="settings.dev"
            v-bind:class="{ 'focused': focused == 'settings.dev' }"
        )
            .menu--label Dev mode
            .menu--selector--prev(v-on:click="disableDevMode" v-if="isDev" ref="settings.dev.prev")
            .menu--selector--value(v-if="isDev") Yes
            .menu--selector--value(v-if="!isDev") No
            .menu--selector--next(v-on:click="enableDevMode" v-if="!isDev" ref="settings.dev.next")

        .menu--selector(
            v-show="flags.settings"
            ref="settings.vibration"
            v-bind:class="{ 'focused': focused == 'settings.vibration' }"
        )
            .menu--label Vibration
            .menu--selector--prev(v-on:click="disableVibration" v-if="isVibration" ref="settings.vibration.prev")
            .menu--selector--value(v-if="isVibration") Yes
            .menu--selector--value(v-if="!isVibration") No
            .menu--selector--next(v-on:click="enableVibration" v-if="!isVibration" ref="settings.vibration.next")

        .menu--selector(
            v-show="flags.settings"
            ref="settings.controls"
            v-bind:class="{ 'focused': focused == 'settings.controls' }"
        )
            .menu--label Controls
            .menu--selector--prev(v-on:click="disableControls" v-if="isControls" ref="settings.controls.prev")
            .menu--selector--value(v-if="isControls") Yes
            .menu--selector--value(v-if="!isControls") No
            .menu--selector--next(v-on:click="enableControls" v-if="!isControls" ref="settings.controls.next")

        .menu--buttons(v-show="flags.settings")
            .menu--item--red.menu--button(
                v-on:click="back"
                ref="settings.back"
                v-bind:class="{ 'focused': focused == 'settings.back' }"
            ) Back

        //- End items
        .menu--buttons(v-show="flags.end")
            .menu--item--green.menu--button(
                v-on:click="newGameCall"
                ref="end.new"
                v-bind:class="{ 'focused': focused == 'end.new' }"
            ) New Game

        //- .menu--buttons(v-show="flags.end")
        //-     .menu--item--green.menu--button(v-on:click="startAgainCall") Start Again

        .menu--buttons(v-show="flags.end")
            .menu--item--red.menu--button(
                v-on:click="backToMenu"
                ref="end.back"
                v-bind:class="{ 'focused': focused == 'end.back' }"
            ) Back to menu

        .menu--item(
            v-show="flags.end && isShare"
            v-on:click="shareCall"
            ref="end.share"
            v-bind:class="{ 'focused': focused == 'end.share' }"
        )
            .menu--item--icon.material-symbols-outlined share
            | Share results

        //- Continue items
        .menu--buttons(v-show="flags.continue")
            .menu--item--green.menu--button(
                v-on:click="newGameCallForce"
                ref="continue.new"
                v-bind:class="{ 'focused': focused == 'continue.new' }"
            ) New Game

        //- .menu--buttons(v-show="flags.continue")
        //-     .menu--item--green.menu--button(v-on:click="startAgainCall") Start Again

        .menu--buttons(v-show="flags.continue")
            .menu--item--green.menu--button(
                v-on:click="closeMenu"
                ref="continue.continue"
                v-bind:class="{ 'focused': focused == 'continue.continue' }"
            ) Continue

        .menu--buttons(v-show="flags.continue")
            .menu--item--red.menu--button(
                v-on:click="backToMenu"
                ref="continue.back"
                v-bind:class="{ 'focused': focused == 'continue.back' }"
            ) Back to menu

        //- Achiements items
        .menu--title(v-show="flags.achievements") Achievements

        .menu--columns(v-show="flags.achievements")
            .menu--achievement(v-for="(item, name) in achievements" :key="name")
                .menu--achievement--row
                    .menu--achievement--icon.material-symbols-outlined(v-if="!userAchievements.includes(name)") lock
                    .menu--achievement--icon.material-symbols-outlined(v-if="userAchievements.includes(name)") {{ item.icon }}
                    .menu--achievement--title {{ item.title }}
                .menu--achievement--desc(v-if="userAchievements.includes(name)") {{ item.desc }}

        .menu--buttons(v-show="flags.achievements")
            .menu--item--red.menu--button(
                v-on:click="back"
                ref="achievements.back"
                v-bind:class="{ 'focused': focused == 'achievements.back' }"
            ) Back
</template>

<script src="./MenuScreen.js"></script>
<style src="./MenuScreen.styl" lang="stylus"></style>