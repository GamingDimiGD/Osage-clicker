import { alertModal } from "../../../../shared/shared.js";
import { removeScore, save } from "../index.js";
import { getMusicData, musicData } from "./musicData.js";

export const loadMusicData = () => {
    $('#music-road-audio-player').prop('volume', save.options['Music Volume'])
    musicData.forEach((music, i) => {
        music.play = () => {
            let { title, vocals, album } = music
            $('#music-road-audio-player').attr('src', `js/music road/music/${title}.mp3`).attr('loop', true)
            $('#music-road-audio-player')[0].play()
            $('.music-road .progress-container h3').text(`Now playing: ${title}`)
            $('.music-road .progress-container h4').text(`Vo. ${vocals}`)
            $('.music-road .progress-container img').attr('src', `js/music road/cover/${album ? 'album/' + albumNames[album - 1] : title}.jpg`)
            save.musicRoad.nowPlaying = music.title
            save.save()
        }
        if (!music.unlockRequirement && music.unlockRequirement !== 0) music.unlockRequirement = (i - 1) * 1e4 + 1e4
        let albumNames = ['Anti Cyclone', 'Weather Station']
        let e = $(`<div>
            <div>
                <h2><a href="${music.link}" target="_blank">${music.title}</a></h2>
                <h3>Vo. ${music.vocals}</h3>
                <h4>Buff: ${music.buffs ?? "No buff"}<br>Power: ${music.powers ?? "No powers"}</h4>
            </div>
            <div>
                <img src="js/music road/cover/${music.album ? 'album/' + albumNames[music.album - 1] : music.title}.jpg" alt="${music.title}">
                <button class="music-power">Power</button>
                <button class="music-play">${save.musicRoad.unlocks.includes(music.title) ? 'Play' : '<i class="smol">oge</i>' + music.unlockRequirement}</button>
            </div></div>`)
        $('.music-select').append(e)
        if (save.musicRoad.nowPlaying === music.title) music.play()
        else if (music.variants?.find(v => save.musicRoad.nowPlaying === music.title + '_' + v.name)) {
            let v = music.variants?.find(va => save.musicRoad.nowPlaying === music.title + '_' + va.name)
            let { title, vocals, album } = music
            title += '_' + v.name
            if (v.vocals) vocals = v.vocals
            if (v.album) album = v.album
            $('#music-road-audio-player').attr('src', `js/music road/music/${title}.mp3`).attr('loop', true)
            $('#music-road-audio-player')[0].play()
            $('.music-road .progress-container h3').text(`Now playing: ${music.title} (${v.name})`)
            $('.music-road .progress-container h4').text(`Vo. ${vocals}`)
            $('.music-road .progress-container img').attr('src', `js/music road/cover/${album ? 'album/' + albumNames[album - 1] : title}.jpg`)
        }
        e.find('.music-play').on('click', () => {
            if (!save.upgrades.find(u => u.id === 'Music Road')) return;
            if (!save.musicRoad.unlocks.includes(music.title)) {
                if (i !== 0 && !save.musicRoad.unlocks.includes(musicData[i - 1].title)) return alertModal('Unlock the previous music first!');
                alertModal('Unlock music for ' + music.unlockRequirement + '<i class="smol">oge</i>?', [
                    {
                        text: 'Yes', onclick: () => {
                            if (removeScore(music.unlockRequirement)) {
                                save.musicRoad.unlocks.push(music.title)
                                save.save()
                                e.find('.music-play').text('Play')
                                music.play()
                                if (music.buff) music.buff()
                            };
                        }
                    },
                    'No'
                ])
                return;
            }
            if (music.variants) return alertModal('Which version?', [
                'Original', ...music.variants.map(v => {
                    return {
                        text: v.name,
                        onclick: () => {
                            let { title, vocals, album } = music
                            title += '_' + v.name
                            if (v.vocals) vocals = v.vocals
                            if (v.album) album = v.album
                            $('#music-road-audio-player').attr('src', `js/music road/music/${title}.mp3`).attr('loop', true)
                            $('#music-road-audio-player')[0].play()
                            $('.music-road .progress-container h3').text(`Now playing: ${music.title} (${v.name})`)
                            $('.music-road .progress-container h4').text(`Vo. ${vocals}`)
                            $('.music-road .progress-container img').attr('src', `js/music road/cover/${album ? 'album/' + albumNames[album - 1] : title}.jpg`)
                            save.musicRoad.nowPlaying = title
                            save.save()
                        }
                    }
                }),
            ]);
            music.play()
        })
        if (music.powers) e.find('.music-power').on('click', () => {
            if (!save.upgrades.find(u => u.id === 'Music Road')) return alertModal('Unlock the upgrade first!');
            if (!save.musicRoad.unlocks.includes(music.title)) return alertModal('Unlock the music first!')
            if (save.musicRoad.currentPower === music.title) {
                if (music.onUnpower) music.onUnpower()
                save.musicRoad.currentPower = ''
                e.find('.music-power').text('Power')
                return save.save();
            };
            if (music.onPower) music.onPower()
            let otherPower = getMusicData(save.musicRoad.currentPower)
            if (otherPower && otherPower.onUnpower) otherPower.onUnpower()
            save.musicRoad.currentPower = music.title
            $('.music-power').text('Power')
            e.find('.music-power').text('Unpower')
            save.save()
        }); else e.find('.music-power').remove()
        if (save.musicRoad.currentPower === music.title) {
            if (music.onPower) music.onPower()
            e.find('.music-power').text('Unpower')
        }
        let temp = music.power
        if (music.power) music.power = () => {
            if (!save.musicRoad.unlocks.includes(music.title) || save.musicRoad.currentPower !== music.title || !save.upgrades.find(u => u.id === 'Music Road')) return;
            temp()
        }
        if (save.musicRoad.unlocks.includes(music.title) && music.buff) music.buff()
    });
}

$('.nowplaying-toggle').on('click', () => {
    $('.music-road.widget').toggleClass('active')
    save.musicRoad.nowPlayingDisplay = !save.musicRoad.nowPlayingDisplay
    save.save()
})