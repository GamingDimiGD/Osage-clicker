import { score, save, showAtScore, rainEffect } from "./index.js"
import { loadOptions } from "./options.js"
import { loadUpgrades } from "./upgrades.js"
import { loadCosmetics, showSkins, skins, hats } from "./cosmetics.js"
import { loadMusicData } from "./music road/musicRoad.js"
import { alertModal } from "../../../shared/shared.js"
import { spawnOsage } from "./particles.js"
import { loadKeybinds } from "./keybinds.js"

const wrongSongName = (wrongSong, rightSong) => {
    if (save.musicRoad.currentPower === wrongSong) save.musicRoad.currentPower = rightSong
    if (save.musicRoad.unlocks.includes(wrongSong)) save.musicRoad.unlocks = save.musicRoad.unlocks.splice(save.musicRoad.unlocks.indexOf(wrongSong), 1).push(rightSong)
    if (save.musicRoad.nowPlaying === wrongSong) save.musicRoad.nowPlaying = rightSong
    save.save()
}

export const onLoad = () => {
    try {
        wrongSongName('Harunoshiki', 'Harunanshiki')
        score.text(save.score)
        loadOptions()
        loadUpgrades()
        showAtScore()
        loadCosmetics(save.cosmetics.currentSkin, save.cosmetics.currentHat)
        if (save.options.Rain) rainEffect.reload()
        else rainEffect.stop()
        skins.forEach(skin => {
            if (save.cosmetics.skins.includes(skin.name)) skin.own()
        })
        hats.forEach(hat => {
            if (save.cosmetics.hats.includes(hat.name)) hat.own()
        })
        showSkins()
        loadMusicData()
        loadKeybinds()
        if (save.musicRoad.nowPlayingDisplay && save.upgrades.find(u => u.id === 'Music Road')) $('.music-road.widget').addClass('active')
        else $('.music-road.widget').removeClass('active')
    } catch (error) {
        alertModal('An error occured: ' + error.message)
        console.error(error)
    } finally {
        console.log('hello marina!')
    }
}

// DANGEROUS: DO NOT EXECUTE IF NOT NEEDED
export const lag = () => {
    alertModal('Are you sure you want to do this?', [
        {
            text: 'Yes',
            onclick: () => {
                const i = setInterval(() => {
                    let stop = true
                    const start = performance.now()
                    spawnOsage({ clientX: Math.random() * 100 * window.innerWidth, clientY: Math.random() * 100 * window.innerHeight }, 1000)
                    while (performance.now() - start < 300 && stop) {
                        Math.sqrt(Math.random());
                    }
                })
                return {
                    stop: () => clearInterval(i)
                }
            }
        },
        'No'
    ])
}