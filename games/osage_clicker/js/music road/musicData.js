import { rng, sfx } from "../../../../shared/shared.js";
import { addScore, removeScore, save } from "../index.js";
import { generateFlyingObject, generateLostUmbrella } from "../flyingObjects.js";
import { spawnOsage } from "../particles.js";
import { getMultiplier, Upgrade, upgrades } from "../upgrades.js";
import { increment } from "../incrementalDisplay.js";
import { skins } from "../cosmetics.js";
import { getCenter, getLootTable } from "../lootTables.js";
import { lag } from "../onload.js";

export let clickPower = 1, musicPower = 1, umbrellaMultiplier = 1, durationMultiplier = 1
let autoclicker = false
let bootInterval, fireworkInterval, floatPlayAnimation, shovelInterval, yoyuyokuInterval, evilBeingsInterval;
export let musicData = [
    {
        title: "Radar",
        vocals: "Kaai Yuki",
        bpm: 54,
        link: "https://youtu.be/xyrUvwVpDRI",
        album: 2,
        unlockRequirement: 0,
        powers: 'You will hear Kaai Yuki sing out "radar" if there is a lost umbrella',
        power: () => {
            sfx('radar', save.options['SFX Volume'])
        },
    },
    {
        title: "Harunanshiki",
        vocals: "Asumi Shuo & Asumi Ririse",
        bpm: 72,
        link: "https://youtu.be/1nZwWpHF0mQ",
        buffs: "Gives 1.5x Multiplier",
        buff: () => musicPower *= 1.5,
        powers: "Gives 2x Multiplier instead",
        onPower: () => musicPower *= (2 / 1.5),
        onUnpower: () => musicPower /= (2 / 1.5)
    },
    {
        title: "COOLER GIRL",
        vocals: "Kaai Yuki",
        bpm: 90,
        link: "https://youtu.be/r8Lrrx6TMMY",
        buffs: "Doubles clicking power",
        buff: () => clickPower *= 2,
        powers: "Puts a comically large fan to make osage cooler and slows down lost umbrellas",
        power: () => 5,
        onPower: () => $('.fan.widget').addClass('active'),
        onUnpower: () => $('.fan.widget').removeClass('active')
    },
    {
        title: "Kimi ni Kaikisen",
        vocals: "Kaai Yuki",
        bpm: 101,
        link: "https://youtu.be/3NLsyjOH92k",
        buffs: "Doubles lost umbrella ogeins",
        buff: () => umbrellaMultiplier *= 2,
        powers: "Lost umbrellas spawn twice as often.",
        power: () => {
            setTimeout(generateLostUmbrella, 3e5 / 2)
        },
    },
    {
        title: "The Stars Get Dark",
        vocals: "Kaai Yuki",
        bpm: 109,
        link: "https://youtu.be/lYtZ5oMs3_8",
        album: 1,
        buffs: "Gives 1.5x Multiplier",
        buff: () => musicPower *= 1.5,
        powers: "Dark mode, and multiplies ogeins from osage with fish by 4",
        onPower: () => {
            $('body').css('background', 'var(--main)')
        },
        onUnpower: () => {
            $('body').css('background', 'var(--background)')
        }
    },
    {
        title: "SAKASAMA Girl Feeling",
        vocals: "Kaai Yuki",
        bpm: 109,
        link: "https://youtu.be/n8O_gZ0Ebbs",
        album: 1,
        buffs: 'x1.5 Clicking power',
        buff: () => clickPower *= 1.5,
        powers: "Makes osage upside-down",
        onPower: () => {
            $('#osag').css('rotate', '180deg')
        },
        onUnpower: () => {
            $('#osag').css('rotate', '0deg')
        }
    },
    {
        title: "Tenkyuu",
        vocals: "Kaai Yuki",
        bpm: 115,
        link: "https://youtu.be/1_8pQVYJtwQ",
        album: 2,
        buffs: "Doubles clicking power",
        buff: () => {
            clickPower *= 2
        },
        powers: "Lost umbrellas will triple clicking power for 60 seconds on top of the default effects",
        power: () => {
            clickPower *= 3
            setTimeout(() => {
                clickPower /= 3
            }, 6e4)
        }
    },
    {
        title: "Tears Radar",
        vocals: "Kaai Yuki",
        bpm: 117,
        link: "https://youtu.be/vyfNM-tIfiw",
        buffs: "Has a chance of spawning panties"
    },
    {
        title: "An Image in the Making",
        vocals: "Kaai Yuki",
        bpm: 118,
        link: "https://youtu.be/3NWuC2UF0u0",
        powers: 'Clicking power gets divided by 2, while upgrades get multiplied by 2',
        onPower: () => {
            clickPower /= 4
            musicPower *= 2
        },
        onUnpower: () => {
            clickPower *= 4
            musicPower /= 2
        }
    },
    {
        title: "Anticyclone",
        vocals: "Kaai Yuki",
        bpm: 119,
        link: "https://youtu.be/2_93SNGYgYs",
        album: 1,
        powers: "Autoclicks every other second",
        onPower: () =>
            autoclicker = setInterval(() => {
                $('#osag')[0].dispatchEvent(new MouseEvent("click", {
                    bubbles: true,
                    cancelable: true,
                    clientX: window.innerWidth / 2,
                    clientY: window.innerHeight / 2
                }))
            }, 2e3),
        onUnpower: () => {
            clearInterval(autoclicker)
        }
    },
    {
        title: "Copy and Pastime",
        vocals: "Kaai Yuki",
        bpm: 125,
        link: "https://youtu.be/MZvTr20tkro",
        buffs: "Doubles upgrade ogeins",
        buff: () => {
            clickPower /= 2
            musicPower *= 2
        },
        powers: "Lost umbrellas have a 10% chance of spawning again after finding one"
    },
    {
        title: "Secret Music",
        vocals: "Kaai Yuki",
        bpm: 128,
        link: "https://youtu.be/sXc204xHj8g",
        powers: "Buying upgrades have a 10% oge back gaurantee"
    },
    {
        title: "Ipace",
        vocals: "Kaai Yuki",
        bpm: 129,
        link: "https://youtu.be/9x7t1s4xMw4",
        powers: "Gives every osage with fish the OsageChan Ipacer Test, which multiplies ogeins from osage with fish by 1.5 to 7.5",
        onPower: () => {
            $('.silly-thing-that-walks-around.widget img.item').css('opacity', 1)
        },
        onUnpower: () => {
            $('.silly-thing-that-walks-around.widget img.item').css('opacity', 0)
        }
    },
    {
        title: "Katamusubi",
        vocals: "Kaai Yuki",
        bpm: 137,
        link: "https://youtu.be/n9xlE973OMs",
        album: 2,
        powers: "Ties osagers with fish into a square knot, making them unable to move and generate oges, but will provide energy to clicking power by multiplying it by 3.",
        onPower: () => {
            clickPower *= 3
            $('.silly-thing-that-walks-around.widget img').css('animation-duration', '0s')
        },
        onUnpower: () => {
            clickPower /= 3
            $.each($('.silly-thing-that-walks-around.widget img'), (_, el) => {
                if ($(el).hasClass('item')) return;
                let e = rng(200, 50) / 10
                $(el).css('animation-duration', e + 's').next().css('animation-duration', e + 's')
            })
        }
    },
    {
        title: "Rainy Boots",
        vocals: "Kaai Yuki",
        bpm: 144,
        link: "https://youtu.be/G5hScSFkib4",
        powers: 'Places a rainy boot in front of osage, which multiplies click power by 5, but will cap click speed at 5 clicks per second',
        onPower: () => {
            clickPower *= 5
            $('.rainy-boots img').css('opacity', 1)
            let i = 0
            bootInterval = setInterval(() => {
                $('.rainy-boots img').attr('src', 'osagery/non-osagery/rainy boots/' + (i++ % 2) + '.png')
            }, 75)
        },
        onUnpower: () => {
            clickPower /= 5
            $('.rainy-boots img').css('opacity', 0)
            clearInterval(bootInterval)
        }
    },
    {
        title: "I'm The Rain",
        vocals: "Kaai Yuki",
        bpm: 144,
        link: "https://youtu.be/EEk4JGzqoFg",
        powers: 'Lost umbrellas have a 0.5% chance of spawning 10 more lost umbrellas and will unpower itself'
    },
    {
        title: "Sinktank",
        vocals: "RIME",
        bpm: 145,
        link: "https://youtu.be/xn4qndSd3vs",
        buffs: "Places a tank, will be useful for later",
        buff: () => {
            $('.tank.widget').addClass('active')
            setInterval(() => {
                if ($('.evil.widget img').length) {
                    let evil = $('.evil.widget img')[0]
                    $(evil).attr('src', 'osagery/non-osagery/explotano.webp')
                    sfx('explotano', save.options['SFX Volume'])
                    increment({
                        clientX: evil.getBoundingClientRect().left + evil.getBoundingClientRect().width / 2,
                        clientY: evil.getBoundingClientRect().top + evil.getBoundingClientRect().height / 2
                    }, 'get sinktank\'d lmao', 3)
                    setTimeout(() => $(evil).remove(), 900)
                }
            }, 2e4)
        }
    },
    {
        title: "Lagtrain",
        vocals: "Kaai Yuki",
        bpm: 147,
        link: "https://youtu.be/UnIhRpIT7nc",
        powers: 'Lags upgrade ogeins so that they will generate in 30 second intervals with x1.5 multiplier'
    },
    {
        title: "Haru No Sekibaku",
        vocals: "Tsurumaki Maki AI",
        bpm: 150,
        link: "https://youtu.be/mFih47l1pVI",
        variants: [
            {
                name: "English",
                link: "https://youtu.be/-T8khZbEg2w"
            }
        ],
        buffs: 'All ogeins are multiplied by 1.5',
        buff: () => {
            musicPower *= 1.5
        }
    },
    {
        title: "Relayouter",
        vocals: "Kaai Yuki",
        bpm: 151,
        link: "https://youtu.be/b56xjtP6Qac",
        buffs: 'Will start spawning kaai yuki plushies',
        powers: 'Background becomes relayouter MV (css animation recreation)',
        onPower: () => {
            $('body').css('background', `url('osagery/relayouter-panorama.jpg') no-repeat 0 0`).css("background-size", "cover").css('animation', 'autoscroll 194.7s linear infinite')
        },
        onUnpower: () => {
            $('body').css('background', `var(--background)`).css("background-size", "cover").css('animation', 'none')
        }
    },
    {
        title: "Post Shelter",
        vocals: "Tsurumaki Maki",
        bpm: 152,
        link: "https://youtu.be/kYwB-kZyNU4",
        buffs: 'Will start spawning letters',
        powers: 'You will be immune to the negative effects of letters'
    },
    {
        title: "Billow of Fireworks",
        vocals: "Kaai Yuki",
        bpm: 154,
        link: "https://youtu.be/e5d-DvD55OI",
        album: 1,
        powers: 'Fireworks of oges start spawning and will give oges every second',
        onPower: () => {
            fireworkInterval = setInterval(() => {
                let sag = Math.floor(50 * getMultiplier() * rng(200, 1) / 100)
                addScore(sag)
                if (document.hidden) return;
                let somewhere = { clientX: rng(0, window.innerWidth), clientY: rng(0, window.innerHeight) }
                spawnOsage(somewhere, 5)
                increment(somewhere, `+ ${sag} $oge`, 3)
            }, 2e3)
        },
        onUnpower: () => {
            clearInterval(fireworkInterval)
        }
    },
    {
        title: "Denki Yohou",
        vocals: "Hatsune Miku",
        bpm: 166,
        link: "https://youtu.be/Imcr7rsBxsc",
        buffs: 'Starts spawning Miku plushies',
    },
    {
        title: "Float Play",
        vocals: "Kaai Yuki",
        bpm: 167,
        link: "https://youtu.be/NRQRC_0ZQ00",
        powers: 'Osager will start floating and playing, which will give 5x multiplier to click power',
        onPower: () => {
            clickPower *= 5
            let animation = $('.main-game-contents')[0].animate(
                [
                    { top: "50%", left: "50%", offset: 0 },
                    { top: "50%", left: "50%", offset: 0.25 },
                    { top: "50%", left: "10%", offset: 0.2501 },
                    { top: "30%", left: "10%", offset: 0.30 },
                    { top: "70%", left: "25%", offset: 0.40 },
                    { top: "30%", left: "40%", offset: 0.50 },
                    { top: "70%", left: "55%", offset: 0.60 },
                    { top: "30%", left: "70%", offset: 0.70 },
                    { top: "70%", left: "85%", offset: 0.80 },
                    { top: "30%", left: "100%", offset: 0.90 },
                    { top: "50%", left: "50%", offset: 1 }
                ],
                {
                    duration: 1e4,
                    iterations: Infinity,
                    easing: "linear"
                }
            );
            let animLogic = (i, el) => {
                if (save.cosmetics.currentSkin) el.src = 'osagery/cosmetics/skins/' + save.cosmetics.currentSkin + '.' + skins.find(s => s.name == save.cosmetics.currentSkin).fileExtention
                else el.src = 'osagery/big.png'
                setTimeout(() => {
                    $(el).css('opacity', 1).css('transform', `translate(calc(-50% - ${(i + 1) * 4}vw), calc(-50% - 21px))`)
                }, i * 250)
            }

            let lastCycle = -1
            const animationCycle = () => {
                const dur = animation.effect.getTiming().duration,
                    t = animation.currentTime,
                    cycle = Math.floor(t / dur),
                    dt = animation.currentTime % animation.effect.getTiming().duration;
                if (dt > 2500) {
                    $('.main-game-contents>div.trail-effect>img').css('opacity', 0)
                }
                if (cycle !== lastCycle) {
                    lastCycle = cycle
                    if (!document.hidden) $.each($('.main-game-contents>div.trail-effect>img'), animLogic)
                }
                return requestAnimationFrame(animationCycle)
            }
            const id = animationCycle()
            floatPlayAnimation = {
                stop: () => {
                    cancelAnimationFrame(id);
                    animation.cancel();
                    $.each($('.main-game-contents>div.trail-effect>img'), (i, el) => {
                        setTimeout(() => {
                            $(el).css('opacity', 0)
                        }, i * 250)
                    })
                },
            }
        },
        onUnpower: () => {
            clickPower /= 5
            floatPlayAnimation.stop()
        }
    },
    {
        title: "Loop Spinner",
        vocals: "Kaai Yuki",
        bpm: 172,
        link: "https://youtu.be/ffGcA4Kj-rk",
        powers: 'Flying objects\' (plushies, lost umbrellas etc, except cakes) effect duration get multiplied by 2',
        onPower: () => durationMultiplier *= 2,
        onUnpower: () => durationMultiplier /= 2
    },
    {
        title: "Journey's Prequels, Journey's Traces (tabitabi Remix)",
        vocals: "Hatsune Miku",
        bpm: 172,
        link: "https://youtu.be/L38M7qK1Yv4",
        powers: 'Miku plushies appear twice as often.'
    },
    {
        title: "Hello Marina",
        vocals: "Kaai Yuki",
        bpm: 176,
        link: "https://youtu.be/g6sYNwl1EWg",
        powers: 'Every time the shovel digs 1000 times, snow will spawn next to it',
        onPower: () => {
            let i = 0;
            let evilFunction = () => {
                if (i >= 1000) {
                    i = 1000
                    $('#snow').css('opacity', 1).css('pointer-events', 'all').on('click', e => {
                        $('#snow').css('opacity', 0).css('pointer-events', 'none').off('click')
                        i = 0
                        setTimeout(evilFunction, 1e4 / save.upgrades.find(u => u.id == 'Shovel').amount)
                        let loot = getLootTable('snow_pile')
                        increment(e, 'Found snow pile! +' + loot.base * getMultiplier() + '$oge', 3)
                    })
                    return;
                }
                i++
                return shovelInterval = setTimeout(evilFunction, 1e4 / save.upgrades.find(u => u.id == 'Shovel').amount)
            }
            evilFunction()
        },
        onUnpower: () => {
            clearTimeout(shovelInterval)
        }
    },
    {
        title: "Floating Moonlight City",
        vocals: "Kaai Yuki",
        bpm: 178,
        link: "https://youtu.be/Jhw7Hum-eLw",
        buffs: 'Double clicking power',
        buff: () => clickPower *= 2
    },
    {
        title: "Yoyuyoku",
        vocals: "Nagi β & Kazehiki β",
        bpm: 179,
        link: "https://youtu.be/uZdnPgDaOpk",
        powers: 'Clicking power is multiplied by 5, but you have to feed osage cake or she will be sad and eat a quarter of your oges',
        onPower: () => {
            clickPower *= 5
            yoyuyokuInterval = setInterval(() => {
                generateFlyingObject('cake', 4, 'floatUp', () => {
                    increment(getCenter(), 'NOOO!! osage is sad and ate ' + Math.floor(save.score / 4) + '$oge!', 3)
                    removeScore(Math.floor(save.score / 4))
                })
            }, 7e3)
        },
        onUnpower: () => {
            clickPower /= 5
            clearInterval(yoyuyokuInterval)
        }
    },
    {
        title: "Pascal Beats",
        vocals: "Kaai Yuki",
        bpm: 184,
        link: "https://youtu.be/M8ZGGCqJduU",
        buffs: 'Click power is multiplied by 1.5',
        buff: () => clickPower *= 1.5
    },
    {
        title: "Secret Elementary School Student",
        vocals: "Kaai Yuki",
        bpm: 185,
        link: "https://youtu.be/wdUCRDvFv3Q",
        powers: 'Kaai Yuki plushies spawn twice as often',
        power: () => {
            setTimeout(generateKaaiYukiPlushie, 3e5 / 2)
        },
    },
    {
        title: "Tokoshizume",
        vocals: "SEKAI",
        bpm: 187,
        link: "https://youtu.be/8Rq6dVpEUS4",
        buffs: 'All upgrade ogeins get multiplied by 1.5',
        buff: () => {
            musicPower *= 1.5
            clickPower /= 1.5
        }
    },
    {
        title: "NON-USE",
        vocals: "Kaai Yuki & Hatsune Miku",
        bpm: 220,
        link: "https://youtu.be/-5T-L0b43no",
        powers: 'Clicking becomes NON-USE, upgrades ogeins are multiplied by 5',
        onPower: () => {
            musicPower *= 5
        },
        onUnpower: () => {
            musicPower /= 5
        }
    },
    {
        title: "Hadal Abyss Zone",
        vocals: "Kaai Yuki",
        bpm: 225,
        link: "https://youtu.be/IJN0piNZhBE",
        powers: 'Shovels are 5 times stronger',
    },
    {
        title: "A Flower Waiting for the Wind",
        vocals: "Meika Hime",
        bpm: 230,
        link: "https://youtu.be/8_nipbC9hLk",
        variants: [
            {
                name: "Album",
                vocals: "Kaai Yuki",
                link: "https://youtu.be/qcm0un69LAk",
                album: 1
            }
        ],
        buffs: 'Will start spawning branches',
    },
    {
        title: "Kitai Avenue",
        vocals: "Otomachi Una AI",
        bpm: 240,
        link: "https://youtu.be/o14pj9CsNVY",
        powers: 'Each osage with fish will get a map to kitai avenue to find lost umbrellas, every osage with fish will make lost umbrellas spawn slightly more often',
        onPower: () => {
            $('.silly-thing-that-walks-around.widget img.item').css('opacity', 1).attr('src', 'osagery/non-osagery/map.png')
        },
        onUnpower: () => {
            $('.silly-thing-that-walks-around.widget img.item').css('opacity', 0).attr('src', 'js/music road/cover/Ipace.jpg')
        }
    },
    {
        title: "Lost Umbrella",
        vocals: "Kaai Yuki",
        bpm: 274,
        link: "https://youtu.be/DeKLpgzh-qQ",
        buffs: 'Mulltiplier x2, unlocks more upgrades, and evil beings start to show up',
        buff: () => {
            musicPower *= 2
            evilBeingsInterval = setInterval(() => {
                if ($('.evil.widget img').length > 10 || save.musicRoad.currentPower === 'Lost Umbrella') return;
                let evil = $('<img src="osagery/non-osagery/evil.png" alt="cd slur" id="evil" draggable="false">')
                const randX = Math.random() * 100, randY = Math.random() * 100
                evil.css('left', randX + '%')
                evil.css('top', randY + '%')
                $('.evil.widget').append(evil)
                let anim = evil[0].animate(
                    [
                        {
                            top: `calc(50% - 64px)`,
                            left: `calc(50% - 64px)`, offset: 1
                        }
                    ],
                    {
                        duration: 1e4,
                        iterations: 1,
                        easing: "linear",
                        fill: 'forwards'
                    })
                anim.onfinish = () => {
                    evil.attr('data-attacking', true)
                }
                let i = 0
                evil.on('click', e => {
                    i++
                    sfx('osag-hm', save.options['SFX Volume'])
                    increment(e, `${i}/5`, 3)
                    if (i < 5) return;
                    anim.cancel()
                    evil.remove()
                    sfx('explotano', save.options['SFX Volume'])
                    spawnOsage(e, 5)
                })
            }, 1e4)
            setInterval(() => {
                $.each($('.evil.widget img[data-attacking]'), (i, e) => {
                    removeScore(100, false)
                    let center = getCenter()
                    center = {
                        clientX: center.clientX + rng(100) - 50,
                        clientY: center.clientY + rng(100) - 50
                    }
                    increment(center, '-100$oge', 1)
                })
            }, 1e3)
            new Upgrade('Evil lagtrain', 1e6, 0, 1, 'the final upgrade.<br>WARNING: WILL LAG YOUR DEVICE!!', upg => {
                upg.element.find('button').attr('disabled', false).text('Activate').on('click', lag)
            }, 1)
        },
        powers: 'Stops all evil beings from showing up, but with a cost of multiplier x0.5',
        onPower: () => {
            musicPower *= 0.5
            clearInterval(evilBeingsInterval)
        },
        unlockRequirement: 5e5
    },
]

// just realized i could've used classes im so stupid

export const getMusicData = (song) => {
    return musicData.find(d => d.title.toLowerCase() === song.toLowerCase());
}