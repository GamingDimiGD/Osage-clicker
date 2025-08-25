import { chance, rng } from "../../../shared/shared.js"
import { addScore, removeScore, save, showAtScore } from "./index.js"
import { alertModal } from "../../../shared/shared.js"
import { musicPower } from "./music road/musicData.js"
import { multiplier } from "./lootTables.js"
import { generateLostUmbrella } from "./flyingObjects.js"
const shop = $('.shop.modal .content')
const upgrades = []

export class Upgrade {
    /**
     * @param {string} name Name for the upgrade
     * @param {number} cost How much oge's will it cost
     * @param {number} amount Amount of oge's that will be given every second
     * @param {number} multiplier Multiplier for basically everything
     * @param {string} description Describe the item
     * @param {function} onBuy When the player buys the item or when the item is already bought while the player logs on, what will happen?
     * @param {number} max Maximum amount of the upgrade
     * @param {number} priceGrowthRate default: 1.4, the cost multiplies by this number every time bought
     * @param {string} id Needed if the name uses stupid characters
     */
    constructor(name, cost, amount, multiplier, description, onBuy = () => void 0, max, priceGrowthRate = 1.4, id = name) {
        this.name = name
        this.cost = cost // wont change
        this.amount = amount
        this.multiplier = multiplier
        this.description = description
        this.onBuy = onBuy
        this.max = max
        this.priceGrowthRate = priceGrowthRate
        this.id = id

        this.price = cost // will fluctuate

        let findUpg = save.upgrades.find(u => u.id == this.id)
        if (!findUpg) {
            save.upgrades.push({
                id: this.id,
                amount: 0
            })
            findUpg = save.upgrades.find(u => u.id == this.id)
        }
        this.element = $(`<div class="shop-item">
            <img src="osagery/upgrades/${id}.png">
            <div>
            <h3>${name} ${this.max ?
                (this.max === 1 ? '' : `(${findUpg ? findUpg.amount : '0'}/${this.max})`)
                :
                (findUpg && findUpg.amount > 0 ? `(${findUpg.amount})` : '')
            }</h3>
            <p>
            ${description}${amount > 0 ? `<br>(${amount.toFixed(2)}<i class="smol">oge</i>'s per second)` : ''}
            </p>
            <button><div class="smol"></div>${cost}</button>
            </div>
            </div>`)

        shop.append(this.element)

        const own = (amount = 1) => {
            this.price = Math.floor(this.cost * this.priceGrowthRate ** (amount))
            this.element.find('button').html(`<div class="smol"></div>${this.price}`)
            this.element.find('h3').html(`${name} ${this.max ?
                (this.max === 1 ? '' : `(${findUpg ? findUpg.amount : '0'}/${this.max})`)
                :
                (findUpg && findUpg.amount > 0 ? `(${findUpg.amount})` : '')
                }`)
            if (this.max && amount >= this.max) {
                this.element.find('button').attr('disabled', true)
                this.element.find('button').text('Maxed out')
                if (this.max === 1) this.element.find('button').text('Bought')
            }
            this.onBuy(this, amount)
        }

        if (findUpg && findUpg.amount > 0) own(findUpg.amount)

        this.element.find('button').on('click', () => {
            if (this.max && findUpg.amount >= this.max) return;
            if (removeScore(this.price)) {
                if (save.musicRoad.currentPower === 'Secret Music') addScore(Math.ceil(this.price / 10))
                let findUpg = save.upgrades.find(u => u.id == this.id)
                if (!findUpg) save.upgrades.push({
                    id,
                    amount: 1
                });
                else findUpg.amount++
                own(findUpg.amount)
                save.save()
            }
        })
        upgrades.push(this)
    }
}

export const getMultiplier = () => upgrades.filter(a => a.multiplier > 1 && save.upgrades.find(b => b.id == a.id).amount).map(a => a.multiplier).reduce((a, b) => a * b, 1) * musicPower * multiplier


let lagtrainQueuedAmount = 0
// new Upgrade().amount (oge/s) and findUpg.amount (owned amount) are different
export const loadUpgrades = () => {
    new Upgrade('Shovel', 30, .1, 1, 'A shovel that could dig to the hadal abyss zone to find oges', (_, amount) => {
        $('.shovel.widget').addClass('active')
        $('.shovel.widget img').css('animation-duration', `${10 / amount}s`)
    })
    new Upgrade('Osage chan with fish', 300, .5, 2, 'Silly thing that runs around, will give x2<i class="smol">oge</i>multiplier when bought the first time', (_, amount) => {
        if (!save.options["Osage running around with fish"]) return;
        let sillyAmount = $('.silly-thing-that-walks-around.widget img').length - $('.silly-thing-that-walks-around.widget img.item').length
        while (sillyAmount < Math.min(amount, 10)) {
            let d = rng(200, 50) / 10
            if (save.musicRoad.currentPower === 'Katamusubi') d = 0;
            $('.silly-thing-that-walks-around.widget').addClass('active').append(`<img src="osagery/fish.gif" alt="fish" width="100px" style="animation-duration: ${d}s;"><img class="item" src="js/music road/cover/Ipace.jpg" style="animation-duration: ${d}s; opacity: 0;">`)
            $('.silly-thing-that-walks-around.widget img.item').css('opacity', save.musicRoad.currentPower === 'Ipace' ? 1 : 0)
            sillyAmount = $('.silly-thing-that-walks-around.widget img').length - $('.silly-thing-that-walks-around.widget img.item').length
        }
    })
    new Upgrade('Cosmetics', 1e3, 0, 1, 'silly cosmetics for osager', () => {
        $('.cosmetics-button').addClass('show')
        $('.modal').removeClass('show')
    }, 1)
    new Upgrade('Music Road', 5e3, 0, 2, 'can unlock music that plays in the background (with buffs!), and will multiply your<i class="smol">oge</i> by another 2 after being bought first time', () => {
        $('.music-road-button').addClass('show')
        $('.modal').removeClass('show')
    }, 1)
    upgrades.forEach(upg => {
        let findUpg = save.upgrades.find(u => u.id == upg.id)
        if (!findUpg) {
            save.upgrades.push({
                id: upg.id, amount: 0
            })
            findUpg = save.upgrades.find(u => u.id == upg.id)
        }
        save.save()
        let amountInQueue = 0
        if (!upg.amount) return;
        setInterval(() => {
            if (save.musicRoad.currentPower !== 'Float Play') $('.main-game-contents>div.trail-effect>img').css('opacity', 0)
            if (!findUpg.amount) return;
            let veryUglyMultiplier = getMultiplier()
            if (upg.id === 'Osage chan with fish' && save.musicRoad.currentPower === 'The Stars Get Dark') {
                veryUglyMultiplier *= 4
            } else if (upg.id === 'Osage chan with fish' && save.musicRoad.currentPower === 'Ipace') {
                veryUglyMultiplier *= rng(75, 15) / 10
            } else if (upg.id === 'Osage chan with fish' && save.musicRoad.currentPower === 'Katamusubi') {
                veryUglyMultiplier = 0
            } else if (upg.id === 'Shovel' && save.musicRoad.currentPower === 'Hadal Abyss Zone') {
                veryUglyMultiplier *= 5
            } else if (upg.id === 'Osage chan with fish' && save.musicRoad.currentPower === 'Kitai Avenue') {
                if (chance(200 - Math.min(50, findUpg.amount))) generateLostUmbrella()
            }
            amountInQueue += upg.amount * findUpg.amount * veryUglyMultiplier
            amountInQueue = Math.floor(amountInQueue * 100) / 100
            if (amountInQueue >= 1) {
                let magicNumber = Math.floor(amountInQueue)
                amountInQueue -= magicNumber
                if (save.musicRoad.currentPower === 'Lagtrain') return lagtrainQueuedAmount += magicNumber;
                addScore(magicNumber)
            }
            upg.element.find('p').html(`${upg.description}${upg.amount > 0 ? `<br>(${(upg.amount * veryUglyMultiplier).toFixed(2)}<i class="smol">oge</i>'s per second)` : ''}`)
            save.save()
        }, 1000)
    })
}

setInterval(() => {
    addScore(Math.floor(lagtrainQueuedAmount * 1.5))
}, 3e4)

export { upgrades }