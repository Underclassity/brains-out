<template lang="pug">
.controls(v-show="showFlag")
    .controls--columns
        .controls--column
            .controls--columns
                .controls--column
                    //- W
                    .controls--button.controls--button--s(v-on:click="$emit('w-click')")
                        .material-symbols-outlined switch_access_shortcut
                    //- A
                    .controls--button.controls--button--a(v-on:click="$emit('a-click')")
                        .material-symbols-outlined switch_access_shortcut
                    //- Q
                    .controls--button.controls--button--q(v-on:click="$emit('q-click')")
                        .material-symbols-outlined forward_media
                .controls--column
                    //- S
                    .controls--button.controls--button--w(v-on:click="$emit('s-click')")
                        .material-symbols-outlined switch_access_shortcut
                    //- D
                    .controls--button.controls--button--d(v-on:click="$emit('d-click')")
                        .material-symbols-outlined switch_access_shortcut
                    //- E
                    .controls--button.controls--button--e(v-on:click="$emit('e-click')")
                        .material-symbols-outlined forward_media

        .controls--column.controls--column--buttons
            .controls--button(v-on:click="$emit('up-click')")
                .material-symbols-outlined arrow_upward
            .controls--buttons
                .controls--button(v-on:click="$emit('left-click')")
                    .material-symbols-outlined arrow_back
                .controls--button(v-on:click="$emit('right-click')")
                    .material-symbols-outlined arrow_forward
            .controls--button(v-on:click="$emit('down-click')")
                .material-symbols-outlined arrow_downward

    .controls--spacebar
        .controls--button.controls--button--spacebar(v-on:click="$emit('spacebar-click')")
            span {{ $t('drop') }}

    //- .control-item.control-item-left(v-on:click="moveLeft" v-if="isControls")
    //-     .material-symbols-outlined west
    //- .control-item.control-item-right(v-on:click="moveRight" v-if="isControls")
    //-     .material-symbols-outlined east

    //- .control-item.control-item-top--first(v-on:click="moveUp" v-if="isControls")
    //-     .material-symbols-outlined north
    //- .control-item.control-item-bottom--first(v-on:click="moveDown" v-if="isControls")
    //-     .material-symbols-outlined south

    //- .control-item.control-item-left.control-item-left--first(v-on:click="rotateXMinus" v-if="isControls")
    //-     .material-symbols-outlined north_west
    //- .control-item.control-item-left.control-item-left--last(v-on:click="rotateYMinus" v-if="isControls")
    //-     .material-symbols-outlined south_west

    //- .control-item.control-item-right.control-item-right--first(v-on:click="rotateXPlus" v-if="isControls")
    //-     .material-symbols-outlined north_east
    //- .control-item.control-item-right.control-item-right--last(v-on:click="rotateYPlus" v-if="isControls")
    //-     .material-symbols-outlined south_east

    //- .control-item.control-item-top--last(v-on:click="rotateZPlus" v-if="isControls")
    //-     .material-symbols-outlined north_east
    //- .control-item.control-item-bottom--last(v-on:click="rotateZMinus" v-if="isControls")
    //-     .material-symbols-outlined south_east

    //- .control-item.control-item--drop(v-on:click="drop" v-if="isControls")
    //-     .material-symbols-outlined water_drop
</template>

<script src="./ControlsBlock.js"></script>
<style src="./ControlsBlock.styl" lang="stylus"></style>