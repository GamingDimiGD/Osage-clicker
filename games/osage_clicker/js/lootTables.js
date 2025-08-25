import { rng, chance, alertModal } from "../../../shared/shared.js"
import { increment } from "./incrementalDisplay.js"
import { addScore, removeScore, save } from "./index.js"
import { durationMultiplier } from "./music road/musicData.js"
import { getMultiplier } from "./upgrades.js"

const lootTable = [
    {
        id: 'lost_umbrella',
        loot: [
            {
                id: 'oge',
                base: 100, // only 1 loot can have no chance property
            },
            {
                id: 'multiplier',
                durationBase: 60, // seconds
                chance: 10, // 1 in 10
            },
            {
                id: 'clickPower',
                durationBase: 60,
                chance: 10,
            }
        ]
    },
    {
        id: 'panties',
        loot: [
            {
                id: 'oge',
                base: 500,
            },
            {
                id: 'multiplier',
                durationBase: 60,
                chance: 10,
                multiplier: 3,
            },
            {
                id: 'clickPower',
                durationBase: 60,
                chance: 10,
                multiplier: 3,
            }
        ]
    },
    {
        id: 'Kaai_Yuki_plush',
        loot: [
            {
                id: 'oge',
                base: 543,
            },
            {
                id: 'multiplier',
                durationBase: 30,
                chance: 10,
                multiplier: 5,
            },
            {
                id: 'clickPower',
                durationBase: 10,
                chance: 10,
                multiplier: 10,
            }
        ]
    },
    {
        id: 'a_letter',
        loot: [
            {
                id: 'letter',
                good: 1000,
                bad: 500,
            },
            {
                id: 'multiplier',
                durationBase: 50,
                chance: 10,
                multiplier: 2.5,
            },
            {
                id: 'clickPower',
                durationBase: 10,
                chance: 10,
                multiplier: 10,
            }
        ]
    },
    {
        id: 'Miku_plush',
        loot: [
            {
                id: 'oge',
                base: 543,
            },
            {
                id: 'multiplier',
                durationBase: 30,
                chance: 10,
                multiplier: 5,
            },
            {
                id: 'clickPower',
                durationBase: 10,
                chance: 10,
                multiplier: 10,
            },
            {
                id: 'clickPower',
                durationBase: 5,
                chance: 5,
                multiplier: 20,
            }
        ]
    },
    {
        id: 'snow_pile',
        loot: [
            {
                id: 'oge',
                base: 432,
            }
        ]
    },
    {
        id: 'cake',
        loot: [
            {
                id: 'cake'
            }
        ]
    },
    {
        id: 'branch',
        loot: [
            {
                id: 'oge',
                base: 1000
            }
        ]
    }
]

export let multiplier = 1, lootClickPower = 1

const letterQuestions = [
    {
        question: 'When did Lagtrain release?',
        answers: [
            '2020/7/16',
            '2020/8/12',
        ],
        correct: 0,
    },
    {
        question: 'When did the Weather Station Album release?',
        answers: [
            '2022/3/12',
            '2022/3/23',
        ],
        correct: 1,
        goodMessage: 'great! i wanna buy one!!!',
    },
    {
        question: 'When did the Anti Cyclone Album release?',
        answers: [
            '2019/11/11',
            '2019/11/17',
        ],
        correct: 1,
        goodMessage: 'great! i wanna buy one!!!',
    },
    {
        question: 'am i stupid',
        answers: [
            'yes',
            'no',
        ],
        correct: 1,
        goodMessage: 'good',
        badMessage: 'why'
    },
    {
        question: 'When did Post Shelter release?',
        answers: [
            '2022/1/29',
            '2021/1/29',
        ],
        correct: 0,
    },
    {
        question: 'Which one is sung by Yuki?',
        answers: [
            'Kitai Avenue',
            'Hadal Abyss Zone',
        ],
        correct: 1,
    },
    {
        question: 'Which one is NOT sung by Yuki?',
        answers: [
            'Kitai Avenue',
            'Hadal Abyss Zone',
        ],
        correct: 0,
    },
    {
        question: 'Which one was sung by Yuki and Miku?',
        answers: [
            'Kimi ni Kaikisen',
            'Hello Marina',
        ],
        correct: 1,
    },
    {
        question: 'gimme credit card for oges',
        answers: [
            'hand credit card',
            'burn this letter',
        ],
        correct: 1,
        goodMessage: 'noo!!! you didnt get scammed!!!!!!',
        badMessage: 'get scammed lmao',
    },
    {
        question: "What's the maximum amount of oges that could be exploded out every time you click the big osage in the center?",
        answers: [
            '7',
            '10',
        ],
        correct: 0,
    },
    {
        question: 'Who is the illustrator of Lagtrain?',
        answers: [
            'Nukunuku Nigirimeshi',
            'Inabakumori',
        ],
        correct: 0,
    },
]

export const getCenter = () => {
    return {
        clientX: window.innerWidth / 2,
        clientY: window.innerHeight / 2
    }
}

export const displayTimer = (time, text = "") => {
    if (time <= 0 || typeof time !== 'number') return;
    let timerElement = $(`<div><h2>${text}: ${time--}s</h2></div>`)
    $('.timers.widget>.timer').append(timerElement)
    setInterval(() => {
        timerElement.find('h2').html(`${text}: ${time--}s`)
        if (time <= 0) {
            timerElement.remove()
        }
    }, 1000)
    return timerElement
}

export const getLootTable = (id, ogeMultiplier = 1, timeMultiplier = 1) => {
    let table = lootTable.find(t => t.id == id)
    if (typeof id === 'number') table = lootTable[id]
    if (!table) throw new Error('No loot table found for id: ' + id)
    let loot = table.loot[rng(table.loot.length - 1)]
    if (loot.chance && !chance(loot.chance)) loot = table.loot.find(l => !l.chance)
    if (loot.id == 'oge') {
        addScore(loot.base * getMultiplier() * ogeMultiplier)
    } else if (loot.id == 'multiplier') {
        multiplier *= loot.multiplier ?? 2
        setTimeout(() => {
            multiplier /= loot.multiplier ?? 2
        }, loot.durationBase * 1000 * timeMultiplier * durationMultiplier)
        console.log(displayTimer(loot.durationBase * timeMultiplier * durationMultiplier, (loot.multiplier ?? 2) + 'x ' + 'Multiplier'))
    } else if (loot.id == 'clickPower') {
        lootClickPower *= loot.multiplier ?? 2
        setTimeout(() => {
            lootClickPower /= loot.multiplier ?? 2
        }, loot.durationBase * 1000 * timeMultiplier * durationMultiplier)
        console.log(displayTimer(loot.durationBase * timeMultiplier * durationMultiplier, (loot.multiplier ?? 2) + 'x ' + 'Click Power'))
    } else if (loot.id === 'letter') {
        let q = letterQuestions[rng(letterQuestions.length - 1)]
        alertModal(q.question, [
            ...q.answers.map(a => {
                return {
                    text: a,
                    onclick: () => {
                        if (q.correct == q.answers.indexOf(a)) {
                            increment(getCenter(), `+ ${loot.good * ogeMultiplier * getMultiplier()} $oge` + (q.goodMessage ?? 'Correct answer!'), 3)
                            addScore(loot.good * ogeMultiplier * getMultiplier())
                        } else {
                            let removeAmount = loot.bad * ogeMultiplier * getMultiplier()
                            if (save.musicRoad.currentPower === "Post Shelter") removeAmount = 0
                            increment(getCenter(), `- ${removeAmount}$oge` + (q.badMessage ?? 'Wrong answer!'), 3)
                            removeScore(removeAmount)
                        }
                    }
                }
            })
        ])
    } else if (loot.id === 'cake') {
        // it's a lie
    }
    return loot
}