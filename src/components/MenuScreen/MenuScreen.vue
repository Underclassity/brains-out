<template lang="pug">
.menu--overlay(v-show="isShow" :class="{ 'menu--end': flags.end, 'menu--started': isStarted }")
    .menu--main
        .menu--logo
            img(:src="imgSrc")

        //- Menu items
        .menu--item.menu--item--new(
            v-show="flags.menu"
            v-on:click="newGameCall"
            ref="menu.newGame"
            v-bind:class="{ 'focused': focused === 'menu.newGame' }"
        )
            span {{ $t('newGame') }}

        .menu--item(
            v-show="flags.menu"
            v-on:click="practiceClick"
            ref="menu.practice"
            v-bind:class="{ 'focused': focused == 'menu.practice' }"
        )
            span {{ $t('practice') }}

        .menu--item(
            v-show="flags.menu"
            v-on:click="settingsCall"
            ref="menu.settings"
            v-bind:class="{ 'focused': focused == 'menu.settings' }"
        )
            span {{ $t('settings') }}
        //- .menu--item(
        //-     v-show="flags.menu"
        //-     v-on:click="controlsCall"
        //-     ref="menu.controls"
        //-     v-bind:class="{ 'focused': focused == 'menu.controls' }"
        //- ) Controls
        .menu--item(
            v-show="flags.menu"
            v-on:click="howToPlay"
            ref="menu.howTo"
            v-bind:class="{ 'focused': focused == 'menu.howTo' }"
        )
            span {{ $t('howToPlay') }}
        .menu--item(
            v-show="flags.menu"
            v-on:click="achievementsCall"
            ref="menu.achievements"
            v-bind:class="{ 'focused': focused == 'menu.achievements' }"
        )
            span {{ $t('achievements') }}
        .menu--item(
            v-show="flags.menu"
            v-on:click="creditsCall"
            ref="menu.credits"
            v-bind:class="{ 'focused': focused == 'menu.credits' }"
        )
            span {{ $t('credits') }}

        //- New game items
        .menu--title(v-show="flags.new")
            span {{ $t('gamePreferences') }}

        .menu--scroll(v-show="flags.new" v-bind:class="{ 'menu--scroll--overflow': isOverflow('new.scroll') }" ref="new.scroll")
            .menu--selector(
                v-show="flags.new"
                ref="new.pitWidth"
                v-bind:class="{ 'focused': focused == 'new.pitWidth' }"
            )
                .menu--label {{ $t('pitWidth') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="downPitWidth" ref="new.pitWidth.prev")
                    .menu--selector--value {{ pitWidth }}
                    .menu--selector--next(v-on:click="upPitWidth" ref="new.pitWidth.next")

            .menu--selector(
                v-show="flags.new"
                ref="new.pitHeight"
                v-bind:class="{ 'focused': focused == 'new.pitHeight' }"
            )
                .menu--label {{ $t('pitHeight') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="downPitHeight" ref="new.pitHeight.prev")
                    .menu--selector--value {{ pitHeight }}
                    .menu--selector--next(v-on:click="upPitHeight" ref="new.pitHeight.next")

            .menu--selector(
                v-show="flags.new"
                ref="new.pitDepth"
                v-bind:class="{ 'focused': focused == 'new.pitDepth' }"
            )
                .menu--label {{ $t('pitDepth') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="downPitDepth" ref="new.pitDepth.prev")
                    .menu--selector--value {{ pitDepth }}
                    .menu--selector--next(v-on:click="upPitDepth" ref="new.pitDepth.next")

            .menu--selector(
                v-show="flags.new"
                ref="new.blocksType"
                v-bind:class="{ 'focused': focused == 'new.blocksType' }"
            )
                .menu--label {{ $t('blockType') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="prevBlockType" v-if="blocksTypeOptions.indexOf(blocksType) != 0" ref="new.blocksType.prev")
                    .menu--selector--value(v-if="blocksType == 'flat'") {{ $t('flat') }}
                    .menu--selector--value(v-if="blocksType == 'basic'") {{ $t('basic') }}
                    .menu--selector--value(v-if="blocksType == 'extended'") {{ $t('extended') }}
                    .menu--selector--next(v-on:click="nextBlockType" v-if="blocksTypeOptions.indexOf(blocksType) != blocksTypeOptions.length - 1" ref="new.blocksType.next")

            .menu--selector(
                v-show="flags.new"
                ref="new.speed"
                v-bind:class="{ 'focused': focused == 'new.speed' }"
            )
                .menu--label {{ $t('speed') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="prevSpeed" v-if="settingsSpeed != minSpeed" ref="new.speed.prev")
                    .menu--selector--value {{ settingsSpeed }}
                    .menu--selector--next(v-on:click="nextSpeed" v-if="settingsSpeed != maxSpeed" ref="new.speed.next")

            .menu--selector(
                v-show="flags.new"
                ref="new.endless"
                v-bind:class="{ 'focused': focused == 'new.endless' }"
            )
                .menu--label {{ $t('endlessMode') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="disableEndless" v-if="isEndless" ref="new.endless.prev")
                    .menu--selector--value(v-if="isEndless") {{ $t('yes') }}
                    .menu--selector--value(v-if="!isEndless") {{ $t('no') }}
                    .menu--selector--next(v-on:click="enableEndless" v-if="!isEndless" ref="new.endless.next")

        .menu--buttons(v-show="flags.new")
            .menu--item--red.menu--button(
                v-show="flags.new"
                v-on:click="backToModes"
                ref="new.back"
                v-bind:class="{ 'focused': focused == 'new.back' }"
            )
                span {{ $t('back') }}
            .menu--item--new.menu--button(
                v-show="flags.new"
                v-on:click="playClick"
                ref="new.play"
                v-bind:class="{ 'focused': focused == 'new.play' }"
            )
                span {{ $t('play') }}

        //- Game modes
        .menu--title(v-show="flags.mode")
            span {{ $t('gameMode') }}

        .menu--selector.menu--selector--centered(
            v-show="flags.mode"
            ref="mode.modes"
            v-bind:class="{ 'focused': focused == 'mode.modes' }"
        )
            .menu--selector--prev(v-on:click="prevMode" ref="mode.modes.prev")
            .menu--selector--value(v-for="modeItem in modes" :key="modeItem" v-show="mode == modeItem") {{ $t(modeItem) }}
            .menu--selector--next(v-on:click="nextMode" ref="mode.modes.next")

        p.menu--text(v-if='flags.mode && mode == "original"') {{ $t('originalDesc') }}
        p.menu--text(v-if='flags.mode && mode == "time attack"') {{ $t('timeAttackDesc') }}
        p.menu--text(v-if='flags.mode && mode == "rotating pit"') {{ $t('rotatingPitDesc') }}
        p.menu--text(v-if='flags.mode && mode == "limited rotations"') {{ $t('limitedRotationsDesc') }}
        p.menu--text(v-if='flags.mode && mode == "random rotations"') {{ $t('randomRotationsDesc') }}
        p.menu--text(v-if='flags.mode && mode == "glitch mayhem"') {{ $t('glitchMayhemDesc') }}
        p.menu--text(v-if='flags.mode && mode == "pit mess"') {{ $t('pitMessDesc') }}
        p.menu--text(v-if='flags.mode && mode == "color madness"') {{ $t('colorMadnessDesc') }}

        .menu--empty(v-if="flags.mode && mode != 'time attack' && mode != 'limited rotations' && mode != 'pit mess' && mode != 'color madness'")

        .menu--selector.menu--selector--centered(
            v-show="flags.mode && mode == 'time attack'"
            ref="mode.time"
            v-bind:class="{ 'focused': focused == 'mode.time' }"
        )
            .menu--selector--prev(v-on:click="prevTimeTimeless" ref="mode.time.prev")
            .menu--selector--value(v-if="timelessMaxTime == 2 * 60 * 1000") 2 {{ $t('min') }}
            .menu--selector--value(v-if="timelessMaxTime == 60 * 1000") 1 {{ $t('min') }}
            .menu--selector--value(v-if="timelessMaxTime == 30 * 1000") 30 {{ $t('sec') }}
            .menu--selector--value(v-if="timelessMaxTime == 10 * 1000") 10 {{ $t('sec') }}
            .menu--selector--next(v-on:click="nextTimeTimeless" ref="mode.time.next")

        .menu--selector.menu--selector--centered(
            v-show="flags.mode && mode == 'limited rotations'"
            ref="mode.rotates"
            v-bind:class="{ 'focused': focused == 'mode.rotates' }"
        )
            .menu--selector--prev(v-on:click="prevRotates" ref="mode.rotates.prev")
            .menu--selector--value(v-if="maxRotate == 3") {{ maxRotate }} {{ $t('rotations3') }}
            .menu--selector--value(v-if="maxRotate == 5") {{ maxRotate }} {{ $t('rotations5') }}
            .menu--selector--next(v-on:click="nextRotates" ref="mode.rotates.next")

        .menu--selector.menu--selector--centered(
            v-show="flags.mode && mode == 'pit mess'"
            ref="mode.mess"
            v-bind:class="{ 'focused': focused == 'mode.mess' }"
        )
            .menu--selector--prev(v-on:click="changeRandomFigures" ref="mode.mess.prev")
            .menu--selector--value {{ randomFiguresCount }} {{ $t('figures') }}
            .menu--selector--next(v-on:click="changeRandomFigures" ref="mode.mess.next")

        .menu--selector.menu--selector--centered(
            v-show="flags.mode && mode == 'color madness'"
            ref="mode.colorless"
            v-bind:class="{ 'focused': focused == 'mode.colorless' }"
        )
            .menu--selector--prev(v-on:click="prevColorlessMode" ref="mode.colorless.prev")
            .menu--selector--value(
                v-for="item of colorlessModes"
                :key="item"
                v-show="item == colorlessMode"
            ) {{ $t(item) }}
            .menu--selector--next(v-on:click="nextColorlessMode" ref="mode.colorless.next")

        .menu--buttons(v-show="flags.mode")
            .menu--item--red.menu--button(
                v-on:click="back"
                ref="mode.back"
                v-bind:class="{ 'focused': focused == 'mode.back' }"
            ) {{ $t('back') }}

            .menu--item--new.menu--button(
                v-on:click="nextClick"
                ref="mode.next"
                v-bind:class="{ 'focused': focused == 'mode.next' }"
            ) {{ $t('next') }}

        //- Credits items
        .menu--version(v-show="flags.credits") {{ $t('version') }}: {{ appVersion }}-{{ version }}

        .menu--assets--title(v-show="flags.credits") {{ $t('authors') }}

        a.menu--link(v-show="flags.credits" href="https://www.linkedin.com/in/ivan-gornovskiy-a1a290282/" target="_blank") Ivan Gornovskiy
        a.menu--link(v-show="flags.credits" href="https://www.linkedin.com/in/nikolai-gavrev-6010ba215/" target="_blank") Nikolai Gavrev

        .menu--assets--title(v-show="flags.credits") {{ $t('assets') }}

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
            ) {{ $t('back') }}

        //- Settings items
        .menu--title(v-show="flags.settings") {{ $t('settings') }}

        hr.menu--divider(v-show="flags.settings")

        .menu--scroll(v-show="flags.settings" v-bind:class="{ 'menu--scroll--overflow': isOverflow('settings.scroll') }" ref="settings.scroll")
            .menu--subtitle {{ $t('graphics') }}

            .menu--selector(
                v-show="flags.settings"
                ref="settings.pixelRatio"
                v-bind:class="{ 'focused': focused == 'settings.pixelRatio' }"
            )
                .menu--label {{ $t('quality') }}
                .menu--dots
                    .menu--dotline
                    .menu--dot(v-bind:class="{ 'menu--dot--active': pixelRatio <= 1 }" v-on:click="setPixelRatio(1)")
                    .menu--dot(v-bind:class="{ 'menu--dot--active': pixelRatio > 1 && pixelRatio <= 2 }" v-on:click="setPixelRatio(2)")
                    .menu--dot(v-bind:class="{ 'menu--dot--active': pixelRatio > 2 && pixelRatio <= 3 }" v-on:click="setPixelRatio(3)")
                    .menu--dot(v-bind:class="{ 'menu--dot--active': pixelRatio > 3 }" v-on:click="setPixelRatio(4)")
                //- .menu--selector--prev(v-on:click="prevPixelRatio" v-if="pixelRatio != 1" ref="settings.pixelRatio.prev")
                //- input.menu--range(type="range" min="50" max="400" v-model="resolution" ref="settings.pixelRatio.slider")
                .menu--selector--value {{ graphicsMode }}
                //- .menu--selector--next(v-on:click="nextPixelRatio" v-if="pixelRatio != 4" ref="settings.pixelRatio.next")

            .menu--selector(
                v-show="flags.settings"
                ref="settings.fpsLock"
                v-bind:class="{ 'focused': focused == 'settings.fpsLock' }"
            )
                .menu--label {{ $t('fpsLock') }}
                .menu--dots
                    .menu--dotline
                    .menu--dot(v-bind:class="{ 'menu--dot--active': fpsLockValue == 30 && isFpsLock }" v-on:click="setFpsLock(30)")
                    .menu--dot(v-bind:class="{ 'menu--dot--active': fpsLockValue == 60 && isFpsLock }" v-on:click="setFpsLock(60)")
                    .menu--dot(v-bind:class="{ 'menu--dot--active': !isFpsLock }" v-on:click="setFpsLock(false)")
                .menu--selector--value {{ isFpsLock ? fpsLockValue : $t('no') }}

            .menu--selector(
                v-show="flags.settings"
                ref="settings.antialias"
                v-bind:class="{ 'focused': focused == 'settings.antialias' }"
            )
                .menu--label {{ $t('antialiasing') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="disableAntialias" v-if="antialias" ref="settings.antialias.prev")
                    .menu--selector--value(v-if="antialias") {{ $t('yes') }}
                    .menu--selector--value(v-if="!antialias") {{ $t('no') }}
                    .menu--selector--next(v-on:click="enableAntialias" v-if="!antialias" ref="settings.antialias.next")

            .menu--selector(
                v-show="flags.settings"
                ref="settings.grid"
                v-bind:class="{ 'focused': focused == 'settings.grid' }"
            )
                .menu--label {{ $t('pitGrid') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="disablePitGrid" v-if="isPitGrid" ref="settings.grid.prev")
                    .menu--selector--value(v-if="isPitGrid") {{ $t('yes') }}
                    .menu--selector--value(v-if="!isPitGrid") {{ $t('no') }}
                    .menu--selector--next(v-on:click="enablePitGrid" v-if="!isPitGrid" ref="settings.grid.next")

            .menu--selector(
                v-show="flags.settings"
                ref="settings.color"
                v-bind:class="{ 'focused': focused == 'settings.color' }"
            )
                .menu--label {{ $t('color') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="prevColorPalette" v-if="colorPaletteTypes.indexOf(colorPaletteType) != 0" ref="settings.color.prev")
                    .menu--selector--value(v-if="colorPaletteType == 'complex'") {{ $t('complex') }}
                    .menu--selector--value(v-if="colorPaletteType == 'flat'") {{ $t('flat') }}
                    .menu--selector--next(v-on:click="nextColorPalette" v-if="colorPaletteTypes.indexOf(colorPaletteType) != colorPaletteTypes.length - 1" ref="settings.color.next")

            .menu--subtitle {{ $t('theme') }}

            .menu--selector.menu--selector--mobile(
                v-show="flags.settings"
                ref="settings.theme"
                v-bind:class="{ 'focused': focused == 'settings.theme' }"
            )
                .menu--selector--container
                    .menu--selector--prev(v-on:click="prevTheme" v-if="theme != themes[0]" ref="settings.theme.prev")
                    .menu--selector--value(v-if="theme == 'simple'") {{ $t('simple') }}
                    .menu--selector--value(v-if="theme == 'standard'") {{ $t('standard') }}
                    .menu--selector--value(v-if="theme == 'halloween'") {{ $t('halloween') }}
                    .menu--selector--next(v-on:click="nextTheme" v-if="theme != themes[themes.length - 1]" ref="settings.theme.next")

            .menu--subtitle {{ $t('sound') }}

            .menu--selector(
                v-show="flags.settings"
                ref="settings.volume"
                v-bind:class="{ 'focused': focused == 'settings.volume' }"
            )
                .menu--label {{ $t('volume') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="prevVolume" v-if="volume != 0" ref="settings.volume.prev")
                    .menu--selector--value {{ volume }}
                    .menu--selector--next(v-on:click="nextVolume" v-if="volume != 1" ref="settings.volume.next")

            .menu--selector(
                v-show="flags.settings"
                ref="settings.fxVolume"
                v-bind:class="{ 'focused': focused == 'settings.fxVolume' }"
            )
                .menu--label {{ $t('fxVolume') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="prevFxVolume" v-if="fxVolume != 0" ref="settings.fxVolume.prev")
                    .menu--selector--value {{ fxVolume }}
                    .menu--selector--next(v-on:click="nextFxVolume" v-if="fxVolume != 1" ref="settings.fxVolume.next")

            .menu--subtitle {{ $t('other') }}

            .menu--selector(
                v-show="flags.settings"
                ref="settings.language"
                v-bind:class="{ 'focused': focused == 'settings.language' }"
            )
                .menu--label {{ $t('language') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="prevLanguage" v-if="locale != 'ru'" ref="settings.language.prev")
                    .menu--selector--value(v-if="locale == 'ru'") Рус
                    .menu--selector--value(v-if="locale == 'en'") Eng
                    .menu--selector--next(v-on:click="nextLanguage" v-if="locale != 'en'" ref="settings.language.next")

            .menu--selector(
                v-show="flags.settings && isDevApproved"
                ref="settings.dev"
                v-bind:class="{ 'focused': focused == 'settings.dev' }"
            )
                .menu--label {{ $t('devMode') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="disableDevMode" v-if="isDev" ref="settings.dev.prev")
                    .menu--selector--value(v-if="isDev") {{ $t('yes') }}
                    .menu--selector--value(v-if="!isDev") {{ $t('no') }}
                    .menu--selector--next(v-on:click="enableDevMode" v-if="!isDev" ref="settings.dev.next")

            .menu--selector(
                v-show="flags.settings"
                ref="settings.vibration"
                v-bind:class="{ 'focused': focused == 'settings.vibration' }"
            )
                .menu--label {{ $t('vibration') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="disableVibration" v-if="isVibration" ref="settings.vibration.prev")
                    .menu--selector--value(v-if="isVibration") {{ $t('yes') }}
                    .menu--selector--value(v-if="!isVibration") {{ $t('no') }}
                    .menu--selector--next(v-on:click="enableVibration" v-if="!isVibration" ref="settings.vibration.next")

            .menu--selector(
                v-show="flags.settings"
                ref="settings.controls"
                v-bind:class="{ 'focused': focused == 'settings.controls' }"
            )
                .menu--label {{ $t('controls') }}

                .menu--selector--container
                    .menu--selector--prev(v-on:click="disableControls" v-if="isControls" ref="settings.controls.prev")
                    .menu--selector--value(v-if="isControls") {{ $t('yes') }}
                    .menu--selector--value(v-if="!isControls") {{ $t('no') }}
                    .menu--selector--next(v-on:click="enableControls" v-if="!isControls" ref="settings.controls.next")

        hr.menu--divider(v-show="flags.settings")

        .menu--buttons(v-show="flags.settings")
            .menu--item--red.menu--button(
                v-on:click="back"
                ref="settings.back"
                v-bind:class="{ 'focused': focused == 'settings.back' }"
            ) {{ $t('back') }}

        .menu--subtitle(v-show="flags.end && !isPractice") {{ $t('score') }}: {{ score }}
        .menu--subtitle(v-show="flags.end && !isPractice") {{ $t('best') }}: {{ maxScore }}

        //- End items
        .menu--buttons(v-show="flags.end && !isPractice")
            .menu--item--green.menu--button(
                v-on:click="newGameCall"
                ref="end.new"
                v-bind:class="{ 'focused': focused == 'end.new' }"
            ) {{ $t('newGame') }}

        .menu--buttons(v-show="flags.end && isPractice")
            .menu--item--green.menu--button(
                v-on:click="startAgainCall"
                ref="end.startAgain"
                v-bind:class="{ 'focused': focused == 'end.startAgain' }"
            ) {{ $t('startAgain') }}

        .menu--buttons(v-show="flags.end")
            .menu--item--red.menu--button(
                v-on:click="backToMenu"
                ref="end.back"
                v-bind:class="{ 'focused': focused == 'end.back' }"
            ) {{ $t('backToMenu') }}

        .menu--item(
            v-show="flags.end && isShare"
            v-on:click="shareCall"
            ref="end.share"
            v-bind:class="{ 'focused': focused == 'end.share' }"
        )
            .menu--item--icon.material-symbols-outlined share
            | {{ $t('shareResults') }}

        //- Continue items
        .menu--buttons(v-show="flags.continue && !isPractice")
            .menu--item--green.menu--button(
                v-on:click="newGameCallForce"
                ref="continue.new"
                v-bind:class="{ 'focused': focused == 'continue.new' }"
            ) {{ $t('newGame') }}

        .menu--buttons(v-show="flags.continue && isPractice")
            .menu--item--green.menu--button(
                v-on:click="startAgainCall"
                ref="continue.startAgain"
                v-bind:class="{ 'focused': focused == 'continue.startAgain' }"
            ) {{ $t('startAgain') }}

        .menu--buttons(v-show="flags.continue")
            .menu--item--green.menu--button(
                v-on:click="closeMenu"
                ref="continue.continue"
                v-bind:class="{ 'focused': focused == 'continue.continue' }"
            ) {{ $t('continue') }}

        .menu--buttons(v-show="flags.continue")
            .menu--button(
                v-on:click="howToPlay"
                ref="continue.howTo"
                v-bind:class="{ 'focused': focused == 'continue.howTo' }"
            ) {{ $t('howToPlay') }}

        .menu--buttons(v-show="flags.continue")
            .menu--item--red.menu--button(
                v-on:click="backToMenu"
                ref="continue.back"
                v-bind:class="{ 'focused': focused == 'continue.back' }"
            ) {{ $t('backToMenu') }}

        //- Achiements items
        .menu--title(v-show="flags.achievements") {{ $t('achievements') }}

        .menu--scroll(v-show="flags.achievements" v-bind:class="{ 'menu--scroll--overflow': isOverflow('achievements.scroll') }" ref="achievements.scroll")
            .menu--columns(v-show="flags.achievements")
                .menu--achievement(
                    v-for="(item, name) in achievements"
                    :key="name"
                    v-bind:class="{ 'menu--achievement--earned': userAchievements.includes(name) }"
                    v-on:click="achievementClick(name)"
                )
                    .menu--achievement--row
                        .menu--achievement--icon.material-symbols-outlined(v-if="!userAchievements.includes(name)") lock
                        .menu--achievement--icon.material-symbols-outlined(v-if="userAchievements.includes(name)") {{ getAchiementItem(name).icon }}
                        .menu--achievement--title {{ getAchiementItem(name).title }}
                    .menu--achievement--desc(v-if="userAchievements.includes(name)") {{ getAchiementItem(name).desc }}

        .menu--buttons(v-show="flags.achievements")
            .menu--item--red.menu--button(
                v-on:click="back"
                ref="achievements.back"
                v-bind:class="{ 'focused': focused == 'achievements.back' }"
            ) {{ $t('back') }}
</template>

<script src="./MenuScreen.js"></script>
<style src="./MenuScreen.styl" lang="stylus"></style>
<i18n src="./MenuScreen.json"></i18n>