import { save } from "./index.js"
import { chance, rng, sfx } from "../../../shared/shared.js"
import { getMultiplier } from "./upgrades.js"
import { increment } from "./incrementalDisplay.js"
import { durationMultiplier, getMusicData } from "./music road/musicData.js"
import { getLootTable } from "./lootTables.js"
import { spawnOsage } from "./particles.js"

export const generateLostUmbrella = () => {
    let umbrella = $(`<img src="osagery/non-osagery/umbrella.png" alt="lost umbrella" draggable="false">`)
    let duration = rng(15, 5)
    umbrella.css('top', `calc(${rng(100, 5)}% - 50px)`).css('animation-duration', duration + (save.musicRoad.currentPower === "COOLER GIRL" ? 5 : 0) + 's')
    umbrella.on('click', (e) => {
        sfx('flying objects/lost_umbrella', save.options['SFX Volume'])
        if (save.musicRoad.currentPower === "I'm The Rain" && chance(200)) {
            spawnOsage(e, 10)
            increment(e, 'Umbrella storm! Spawning 10 Umbrellas!', 10)
            let i = 10
            let interval = setInterval(() => {
                generateLostUmbrella()
                i--
                if (i === 0) clearInterval(interval)
            }, 60 / 144 * 1e3)
            $.each($('.music-select>div .music-power'), (_, e) => {
                if (e.innerText === "Unpower") e.click()
            })
            return;
        };
        let loot = getLootTable(0, 20 - duration, 1)
        if (loot.id === 'oge') {
            increment(e, 'Found lost umbrella! +' + loot.base * getMultiplier() * (20 - duration) + '$oge', 3)
            spawnOsage(e, 20 - duration)
        }
        if (loot.id === 'clickPower') increment(e, 'Found lost umbrella! Click power just got multiplied by ' + (loot.multiplier ?? 2) + ' for ' + loot.durationBase * durationMultiplier + ' seconds!', 3)
        if (loot.id === 'multiplier') increment(e, 'Found lost umbrella! All ogeins just got multiplied by ' + (loot.multiplier ?? 2) + ' for ' + loot.durationBase * durationMultiplier + ' seconds!', 3)
        umbrella.remove()
    })
    $('.umbrella.widget').append(umbrella)
    setTimeout(() => umbrella.remove(), duration * 1000)
    getMusicData('radar').power()
    if (save.musicRoad.currentPower === "Copy and Pastime" && chance(10)) generateLostUmbrella()
}

export const generatePanties = () => {
    if (!save.musicRoad.unlocks.includes('Tears Radar')) return;
    let panties = $(`<img src="osagery/non-osagery/panties/panties1.png" alt="panties" draggable="false">`)
    let pantiesAnimationIndex = 0
    let pantiesAnimation = setInterval(() => panties.attr('src', `osagery/non-osagery/panties/panties${pantiesAnimationIndex++ % 2 + 1}.png`), 1000)
    let duration = rng(10, 3)
    panties.css('top', `calc(${rng(100, 5)}% - 50px)`).css('animation-duration', duration + 's')
    panties.on('click', (e) => {
        let loot = getLootTable(1, 20 - duration, 1)
        if (loot.id === 'oge') {
            increment(e, 'Found panties! +' + loot.base * getMultiplier() * (20 - duration) + '$oge', 3)
            spawnOsage(e, 20 - duration)
        }
        if (loot.id === 'clickPower') increment(e, 'Found panties! Click power just got multiplied by ' + (loot.multiplier ?? 2) + ' for ' + loot.durationBase * durationMultiplier + ' seconds!', 3)
        if (loot.id === 'multiplier') increment(e, 'Found panties! All ogeins just got multiplied by ' + (loot.multiplier ?? 2) + ' for ' + loot.durationBase * durationMultiplier + ' seconds!', 3)
        panties.remove()
        clearInterval(pantiesAnimation)
    })
    $('.panties.widget').append(panties)
    setTimeout(() => {
        panties.remove()
        clearInterval(pantiesAnimation)
    }, duration * 1000)
    getMusicData('radar').power()
}

export const generateFlyingObject = (id, durationRange = { min: 5, max: 15 }, animationType = "fly", onMiss = () => { }) => {
    let name = id.replaceAll('_', ' ')
    let object = $(`<img src="osagery/flying-objects/${id}.png" alt="${id}" draggable="false" width="100px">`)
    let duration = typeof durationRange === "number" ? durationRange : rng(durationRange.max, durationRange.min)
    let max = typeof durationRange === "number" ? durationRange : durationRange.max
    object.css('top', `calc(${rng(100, 5)}% - 50px)`).css('right', `calc(${rng(100, 5)}% - 50px)`).css('animation-duration', duration + 's').css('animation-name', animationType).css('animation-timing-function', 'ease')
    if (animationType === 'fly' || animationType === 'flySpin') object.css('right', 0).css('animation-timing-function', 'linear')
    let miss = setTimeout(() => {
        object.remove()
        onMiss()
    }, duration * 1000)
    object.on('click', (e) => {
        sfx(`flying objects/${id}`, save.options['SFX Volume'])
        let loot = getLootTable(id, max + 5 - duration, 1)
        if (loot.id === 'oge') {
            increment(e, `Found ${name}! +` + loot.base * getMultiplier() * (max - duration + 5) + '$oge', 3)
            spawnOsage(e, max - duration + 5)
        }
        if (loot.id === 'clickPower') increment(e, 'Found ' + name + ' Click power just got multiplied by ' + (loot.multiplier ?? 2) + ' for ' + loot.durationBase * durationMultiplier + ' seconds!', 3)
        if (loot.id === 'multiplier') increment(e, 'Found ' + name + ' All ogeins just got multiplied by ' + (loot.multiplier ?? 2) + ' for ' + loot.durationBase * durationMultiplier + ' seconds!', 3)
        if (loot.id === 'cake') spawnOsage(e, max - duration + 5)
        object.remove()
        clearTimeout(miss)
    })
    $('.flying-objects.widget').append(object)
    getMusicData('radar').power()
}

export const flyingObjects = [
    {
        id: 'Kaai_Yuki_plush',
        durationRange: 10,
        animationType: 'floatUp',
        musicReq: 'Relayouter'
    },
    {
        id: 'a_letter',
        durationRange: { min: 10, max: 25 },
        animationType: 'floatUp',
        musicReq: 'Post Shelter'
    },
    {
        id: 'Miku_plush',
        durationRange: { min: 10, max: 25 },
        animationType: 'floatUp',
        musicReq: 'Denki Yohou'
    },
    {
        id: 'branch',
        durationRange: { min: 3, max: 7 },
        animationType: 'flySpin',
        musicReq: 'A Flower Waiting for the Wind'
    }
] 