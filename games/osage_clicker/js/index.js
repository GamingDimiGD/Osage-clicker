console.log('hello osage!')
import { alertModal, rng, sfx } from "../../../shared/shared.js"
import { rain, spawnOsage } from "./particles.js"
import { onLoad } from "./onload.js"
import { getMultiplier } from "./upgrades.js"
import { chance } from "../../../shared/shared.js"
import { flyingObjects, generateFlyingObject, generateLostUmbrella, generatePanties } from "./flyingObjects.js"
import { increment } from "./incrementalDisplay.js"
import { clickPower, getMusicData, musicData } from "./music road/musicData.js"
import { lootClickPower } from "./lootTables.js"
import { loadCosmetics } from "./cosmetics.js"

export const emptySave = {
    score: 0,
    scoreEver: 0,
    hiScore: 0,
    options: {
        "SFX Volume": 1,
        "Music Volume": 1,
        Rain: true,
        "Rain Angle": 100,
        "Scary Ahh Jumpscare": true,
        Particles: true,
        "Osage running around with fish": true
    },
    upgrades: [],
    cosmetics: {
        skins: [],
        hats: [],
        currentSkin: '',
        currentHat: ''
    },
    musicRoad: {
        unlocks: [],
        nowPlaying: '',
        currentPower: '',
        nowPlayingDisplay: false,
    }
}

const temp = $.jStorage.get('osageClicker') || emptySave

export const save = {
    ...temp,
    save: () => {
        let e = { ...save }
        delete e.save
        score.text(save.score)
        $.jStorage.set('osageClicker', save)
    },
}

if (Object.keys(save).length - 1 < Object.keys(emptySave).length) {
    Object.keys(emptySave).forEach(key => {
        if (!save.hasOwnProperty(key)) {
            save[key] = emptySave[key]
        }
    })
}
if (Object.keys(save).length - 1 > Object.keys(emptySave).length) {
    Object.keys(save).forEach(key => {
        if (!emptySave.hasOwnProperty(key)) {
            delete save[key]
        }
    })
}

if (Object.keys(save.options).length < Object.keys(emptySave.options).length) {
    Object.keys(emptySave.options).forEach(key => {
        if (!save.options.hasOwnProperty(key)) {
            save.options[key] = emptySave.options[key]
        }
    })
}
if (Object.keys(save.options).length < Object.keys(emptySave.options).length) {
    Object.keys(save.options).forEach(key => {
        if (!emptySave.options.hasOwnProperty(key)) {
            delete save.options[key]
        }
    })
}
if (!save.cosmetics.skins) save.cosmetics.skins = []
if (!save.cosmetics.hats) save.cosmetics.hats = []
if (!save.cosmetics.currentSkin) save.cosmetics.currentSkin = ''
if (!save.cosmetics.currentHat) save.cosmetics.currentHat = ''


export const osage = $('#osag')
export const score = $('#score')
export const showAtScore = () => {
    $('*[data-shows-at]').each((_, b) => {
        let score = parseInt($(b).attr('data-shows-at'))
        if (save.hiScore >= score) {
            $(b).addClass('show')
        } else {
            $(b).removeClass('show')
        }
    })
}

export const addScore = (score) => {
    save.score += score
    save.scoreEver += score
    if (save.score > save.hiScore) save.hiScore = save.score
    save.save()
    showAtScore()
}

export const removeScore = (score, alertForTooMuchScore = true) => {
    if (score > save.score) {
        if (alertForTooMuchScore) alertModal("You don't have enough<i class=\"smol\">oge</i>!");
        return false
    }
    save.score -= score
    save.save()
    return true
}

export const rainEffect = await rain()


if (save.options.Rain) rainEffect.start()

$.each($('.out'), (_, b) => {
    $(b).on("click", () => {
        $(b.parentNode).removeClass("show")
    })
})

let lastClickTime = 0
osage.on('click', e => {
    if (save.musicRoad.currentPower === "Rainy Boots") {
        if (Date.now() - lastClickTime < 200) {
            $('.rainy-boots img').css('animation', 'shake 0.2s linear')
            setTimeout(() => $('.rainy-boots img').css('animation', ''), 200)
            return;
        };
        lastClickTime = Date.now()
    };
    let addThis = Math.round(getMultiplier() * clickPower * lootClickPower)
    if (save.musicRoad.currentPower === "NON-USE") addThis = 0
    addScore(addThis)
    if(!document.hidden) spawnOsage(e, Math.min(7, addThis))
    sfx('osag-hm', save.options['SFX Volume'])
    increment(e, "+" + addThis + '$oge')
    if (chance(10000)) {
        osage.attr('src', 'osagery/bald2.png')
        setTimeout(() => loadCosmetics(save.cosmetics.currentSkin, save.cosmetics.currentHat), 1000)
    }
    if (chance(10000) && save.options['Scary Ahh Jumpscare']) {
        let widget = $(`<div class="scary-ahh-jumpscare widget active"><img src="osagery/non-osagery/jumpscare.gif" alt="VERY EVIL!!!!"></div>`)
        $('body').append(widget)
        sfx('scary', save.options['SFX Volume'])
        setTimeout(() => {
            widget.remove()
        }, 800)
    }
})

setInterval(() => {
    generateLostUmbrella()
    getMusicData('kimi ni kaikisen').power()
}, 3e5)

setInterval(() => {
    generatePanties()
}, 5e5)

setInterval(() => {
    let o = { ...flyingObjects[rng(flyingObjects.length - 1, 0)] }
    if (!save.musicRoad.unlocks.includes(o.musicReq)) return;
    generateFlyingObject(o.id, o.durationRange, o.animationType)
    if (o.id === 'Miku_plush' && save.musicRoad.currentPower === "Journey's Prequels, Journey's Traces (tabitabi Remix)") {
        setTimeout(() => {
            generateFlyingObject(o.id, o.durationRange, o.animationType)
        }, 125000)
    } else if (o.id === 'Kaai_Yuki_plush' && save.musicRoad.currentPower === "Secret Elementary School Student") {
        setTimeout(() => {
            generateFlyingObject(o.id, o.durationRange, o.animationType)
        }, 125000)
    };
}, 250000)



onLoad()