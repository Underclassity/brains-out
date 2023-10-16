<template lang="pug">
Transition(name="controls")
    .controls-info(v-if="show")
        .controls-info--columns
            .controls-info--column.controls-info--images
                img.controls-info--levels(:src="levels")
                img.controls-info--pit(:src="pit")

            .controls-info--column
                p Place falling zombies (light green cube in the scheme) as tight and accurate as possible in the pit (brown in the scheme).
                p Zombies starts to fall in the foreground and flies away from you to the bottom of the pit. You can rotate falling zombies in all 3 axes and move them horizontally and vertically with keyboard or controller (see layouts below) or with on screen buttons on mobile. Zombies can be fast dropped down with special key or button.
                p When falling zombie drops to the bottom of the pit (or on other zombie`s bodies in the pit), he is painted to color according to the level of pit. Each color represent different level of the pit (color gradient on the left of the scheme) - from bottom (purple) to top (red). Don`t let zombies fall higher than top of the pit (red) or the game will be over.
                p To reduce amount of dropped zombies in the pit, they must be aligned at the same layer parallel to the level of the pit. When falling zombie (light green cube in the scheme) fits to the last empty hole in layer (purple square with hole in the scheme) - he closes the layer and the layer removed from the pit. All other dropped zombie`s bodies, that was above that layer - drops down.

        .controls-info--columns
            .controls-info--column
                img.controls-info--levels(:src="keyboard")

            .controls-info--column
                img.controls-info--controller(:src="controller")

        .controls-info--columns
            .controls-info--column
                .controls-info--columns
                    .controls-info--column
                        .controls-info--key(v-for="{ img, title, id } of keyboardKeys.slice(0, 6)" :key="id")
                            .controls-info--key--img
                                img(:src="img")
                            .controls-info--key--title {{ title }}
                    .controls-info--column
                        .controls-info--key(v-for="{ img, title, id } of keyboardKeys.slice(6)" :key="id")
                            .controls-info--key--img
                                img(:src="img")
                            .controls-info--key--title {{ title }}

            .controls-info--column
                .controls-info--key(v-for="{ img, title, id } of controllerKeys" :key="id")
                    .controls-info--key--img
                        img(:src="img" v-if="!Array.isArray(img)")
                        img(:src="img[0]" v-if="Array.isArray(img)")
                        span(v-if="Array.isArray(img)") or
                        img(:src="img[1]" v-if="Array.isArray(img)")
                    .controls-info--key--title {{ title }}

        .controls-info--buttons
            .controls-info--button(v-on:click="backClick" ref="back") Back
</template>

<script src="./ControlsInfoScreen.js"></script>
<style src="./ControlsInfoScreen.styl" lang="stylus"></style>