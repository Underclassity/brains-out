<template lang="pug">
Transition(name="controls")
    .controls-info(v-if="show")
        .controls-info--content
            .controls-info--columns
                .controls-info--column.controls-info--images
                    //- img(:src="levelsPit")
                    //- .controls-info--image
                    //-     img.controls-info--levels(:src="levels")
                    //- .controls-info--image
                    //-     img.controls-info--pit(:src="pit")

                    svg(width='375' height='336' viewbox='0 0 375 336' fill='none' xmlns='http://www.w3.org/2000/svg')
                        path(d='M125 86H289V250H125V86Z' fill='url(#paint0_radial_294_602)')
                        path(d='M117 78H297V258H116.5L117 78Z' fill='url(#paint1_radial_294_602)')
                        path(d='M40 1.00052H374V335.001H40V1.00052Z' fill='url(#paint2_radial_294_602)')
                        path(d='M108.391 69.391H304.55V265.55H108.391V69.391Z' fill='url(#paint3_radial_294_602)')
                        path(d='M96.7271 57.7275H316.213V277.213H96.7271V57.7275Z' fill='url(#paint4_radial_294_602)')
                        path(d='M82.4128 43.4131H330.527V291.528H82.4128V43.4131Z' fill='url(#paint5_radial_294_602)')
                        path(d='M63.327 24.3274H349.613V310.614H63.327V24.3274Z' fill='url(#paint6_radial_294_602)')
                        path(d='M108.391 69.391L125 86M108.391 69.391H304.55M108.391 69.391V265.55M108.391 69.391L40 1.00052M125 86H289M125 86V250M304.55 69.391L289 86M304.55 69.391V265.55M304.55 69.391L374 1.00052M289 86V250M304.55 265.55L289 250M304.55 265.55H108.391M304.55 265.55L374 335.001M289 250H125M108.391 265.55L40 335.001M108.391 265.55L116.5 258M125 250L116.5 258M116.5 258H297V78H117L116.5 258ZM40 1.00052H374M40 1.00052V335.001M374 1.00052V335.001M374 335.001H40M40 67.8001L108.391 111L125 121H289L304.55 111L374 67.8001M40 134.6L108.391 149.5L125 153H289L304.55 149.5L374 134.6M40 201.4L108.391 187.086L125 184H289L304.55 187.086L374 201.4M40 268.2L108.391 226.318L125 216H289L304.55 226.318L374 268.2M107.33 1.00052L148.683 69.391L160 86V250L150 265.55L106.8 335M173.6 1.00052L187.915 69.391L192 86V250L188.5 265.55L173.6 335.001M240.4 1L226.086 69.391L223 86V250L226.086 265.55L240.4 335M307.2 1L266 69.391L255 86V250L265 265.55L307.731 335.001M96.7271 57.7275H316.213V277.213H96.7271V57.7275ZM82.4128 43.4131H330.527V291.528H82.4128V43.4131ZM63.327 24.3274H349.613V310.614H63.327V24.3274Z' stroke='#441A00' stroke-width='2')
                        path(d='M154.127 220.324V256L158 250.5V220.324H154.127Z' :fill='colors[11]')
                        path(d='M189.399 220.324V256H295V80H118V256H154.127V220.324H158H189.399Z' :fill='colors[11]')
                        path(d='M154.127 256V220.324H158M154.127 256L158 250.5V220.324M154.127 256H118V80H295V256H189.399V220.324H158' stroke='#9B69CC' stroke-width='2')
                        path(d='M122.174 309.553L122.174 252.736L133.308 241.162L183.143 241.162V290.614L178.902 309.553H122.174Z' fill='#9BA911')
                        path(d='M122.174 252.736L122.174 309.553H178.901M122.174 252.736H178.901M122.174 252.736L133.308 241.162L183.143 241.162M178.901 309.553L178.901 252.736M178.901 309.553L183.143 290.614V241.162M178.901 252.736L183.143 241.162' stroke='#C9D64F' stroke-width='2')
                        path(d='M107.065 267.14L121.909 252.561H179.167L173.029 267.67L107.065 267.14Z' fill='url(#paint7_linear_294_602)')
                        path(d='M106.8 335L121.644 310.083H179.316L173.6 335H106.8Z' fill='url(#paint8_linear_294_602)')
                        path(d='M121.644 252.561L107.065 267.239L106.8 335L121.644 310.083L121.644 252.561Z' fill='url(#paint9_linear_294_602)')
                        path(d='M179.167 252.561L173.07 267.405L173.6 335L179.167 310.083L179.167 252.561Z' fill='url(#paint10_linear_294_602)')
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 335)' :fill="colors[11]")
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 307.167)' :fill="colors[10]")
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 279.333)' :fill="colors[9]")
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 251.5)' :fill="colors[8]")
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 223.667)' :fill="colors[7]")
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 195.833)' :fill="colors[6]")
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 168)' :fill="colors[5]")
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 140.167)' :fill="colors[4]")
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 112.333)' :fill="colors[3]")
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 84.5)' :fill="colors[2]")
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 56.667)' :fill="colors[1]")
                        rect(width='27.8333' height='27.8333' transform='matrix(0 -1 -1 0 27.8334 28.833)' :fill="colors[0]")
                        | <defs><radialGradient id="paint0_radial_294_602" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(207 168) rotate(90) scale(167 167)"><stop stop-color="#5A2804"/><stop offset="1" stop-color="#773201" stop-opacity="0.81"/></radialGradient><radialGradient id="paint1_radial_294_602" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(207 168) rotate(90) scale(167 167)"><stop stop-color="#5A2804"/><stop offset="1" stop-color="#773201" stop-opacity="0.81"/></radialGradient><radialGradient id="paint2_radial_294_602" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(207 168) rotate(90) scale(167 167)"><stop stop-color="#5A2804"/><stop offset="1" stop-color="#773201" stop-opacity="0.81"/></radialGradient><radialGradient id="paint3_radial_294_602" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(207 168) rotate(90) scale(167 167)"><stop stop-color="#5A2804"/><stop offset="1" stop-color="#773201" stop-opacity="0.81"/></radialGradient><radialGradient id="paint4_radial_294_602" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(207 168) rotate(90) scale(167 167)"><stop stop-color="#5A2804"/><stop offset="1" stop-color="#773201" stop-opacity="0.81"/></radialGradient><radialGradient id="paint5_radial_294_602" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(207 168) rotate(90) scale(167 167)"><stop stop-color="#5A2804"/><stop offset="1" stop-color="#773201" stop-opacity="0.81"/></radialGradient><radialGradient id="paint6_radial_294_602" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(207 168) rotate(90) scale(167 167)"><stop stop-color="#5A2804"/><stop offset="1" stop-color="#773201" stop-opacity="0.81"/></radialGradient><linearGradient id="paint7_linear_294_602" x1="144.706" y1="252.826" x2="144.495" y2="267.67" gradientUnits="userSpaceOnUse"><stop stop-color="#C9D64F" stop-opacity="0.5"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><linearGradient id="paint8_linear_294_602" x1="144.494" y1="310.083" x2="144.494" y2="335.001" gradientUnits="userSpaceOnUse"><stop stop-color="#C9D64F" stop-opacity="0.5"/><stop offset="1" stop-color="white" stop-opacity="0"/></linearGradient><linearGradient id="paint9_linear_294_602" x1="106.8" y1="298.949" x2="121.644" y2="298.95" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0"/><stop offset="1" stop-color="#C9D64F" stop-opacity="0.5"/></linearGradient><linearGradient id="paint10_linear_294_602" x1="173.07" y1="299.003" x2="179.432" y2="299.003" gradientUnits="userSpaceOnUse"><stop stop-color="white" stop-opacity="0"/><stop offset="1" stop-color="#C9D64F" stop-opacity="0.5"/></linearGradient></defs>

                .controls-info--column.controls-info--text
                    p {{ $t('desc1') }}
                    p {{ $t('desc2') }}
                    p {{ $t('desc3') }}

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
                                span(v-if="Array.isArray(img)") {{ $t('or') }}
                                img(:src="img[1]" v-if="Array.isArray(img)")
                            .controls-info--key--title {{ title }}

            .controls-info--buttons
                .controls-info--button(v-on:click="backClick" ref="back" v-if="!playButton") {{ $t('back') }}
                .controls-info--button.controls-info--button--green(v-on:click="backClick" ref="back" v-if="playButton") {{ $t('play') }}
</template>

<script src="./ControlsInfoScreen.js"></script>
<style src="./ControlsInfoScreen.styl" lang="stylus"></style>
<i18n src="./ControlsInfoScreen.json"></i18n>