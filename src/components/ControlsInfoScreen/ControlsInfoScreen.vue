<template lang="pug">
Transition(name="controls")
    .controls-info(v-if="show")
        .controls-info--content
            .controls-info--columns
                .controls-info--column.controls-info--images
                    img(:src="levelsPit")
                    //- .controls-info--image
                    //-     img.controls-info--levels(:src="levels")
                    //- .controls-info--image
                    //-     img.controls-info--pit(:src="pit")

                .controls-info--column.controls-info--text
                    p Zombies (light green cube) occur in the front and flies away to the bottom of the pit (brown). You can rotate the falling zombie in all 3 axes and move it horizontally and vertically. Zombies can be fast dropped down with the special key.

                    p When a zombie drops to the bottom of the pit or on other zombies, it is painted according to the level of the pit - from purple (bottom) to red (top). Don`t let zombies fall higher than the top of the pit (red) or the game will be over.

                    p To reduce the number of zombies in the pit, they must be aligned at the same layer on the level of the pit. When the falling zombie fits to the last empty space in a layer - it closes the layer and the layer removed from the pit. All other zombie`s parts, that was above that removed layer - drops down.

            .controls-info--columns
                .controls-info--column
                    img.controls-info--keyboard(:src="keyboard")

                    .controls-info--keys
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
                    img.controls-info--controller(:src="controller")

                    .controls-info--keys
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