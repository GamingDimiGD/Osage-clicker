import { osage, removeScore, save } from "./index.js"
export const loadCosmetics = (skin = '', hat = '') => {
    if (!save.upgrades.find(u => u.id == 'Cosmetics') || !save.upgrades.find(u => u.id == 'Cosmetics').amount) return;
    if (!skin) osage.attr('src', 'osagery/big.png');
    if (!hat) $('.hat img').attr('hidden', true);
    save.cosmetics.currentSkin = skin;
    save.cosmetics.currentHat = hat;
    let skinClass = skins.find(s => s.name == skin)
    let hatClass = hats.find(h => h.name == hat)
    if (skin) osage.attr('src', `osagery/cosmetics/skins/${skin}.${skinClass ? skinClass.fileExtention : 'png'}`);
    if (hat) $('.hat img').attr('src', `osagery/cosmetics/hats/${hat}.png`).attr('hidden', false);
    $('.hat img').attr('style', '')
    if (skinClass?.hatOffSet?.style) Object.keys(skinClass.hatOffSet.style).forEach(key => $('.hat img').css(key, skinClass.hatOffSet.style[key]))
    $('.hat img').css('transform', `translate(calc( ${skinClass?.hatOffSet?.x ?? "-50%"} + ${hatClass?.hatOffSet?.x ?? '0px'} ), calc( ${skinClass?.hatOffSet?.y ?? "-60%"} + ${hatClass?.hatOffSet?.y ?? '0px'} ))`).css('z-index', hatClass?.hatOffSet?.z ?? 1)
    save.save()
}

export let skins = [],
    hats = []

export class Skin {
    /**
     * 
     * @param {string} name Name of skin
     * @param {string} description Description of skin
     * @param {number} price Number of oge's needed to buy
     * @param {object} hatOffSet basically translate(x,y), use { x, y } and REMEMBER THE UNITS (and secret custom styles)
     * @param {function} onBuy When the player buys the skin or when the skin is already bought while the player logs on, what will happen?
     * @param {string} fileExtention no need for dots, default: png
     * @param {function} onEquip When the player equips the skin, what will happen?
     */
    constructor(name, description, price, hatOffSet, onBuy = () => void 0, fileExtention = 'png', onEquip = () => void 0) {
        this.name = name
        this.description = description
        this.price = price
        this.hatOffSet = hatOffSet
        this.onBuy = onBuy
        this.fileExtention = fileExtention
        this.onEquip = onEquip

        this.element = $(`<div class="cosmetic shop-item">
                    <img src="osagery/cosmetics/skins/${name}.${fileExtention}" alt="smol">
                    <div>
                        <h3>${name}</h3>
                        <p>${description}</p>
                        <button><div class="smol"></div>${price}</button>
                    </div>
                </div>`)

        $('.cosmetic-display').append(this.element)
    }
    init() {
        this.element.addClass('skin')
        const own = () => {
            if (!save.upgrades.find(u => u.id == 'Cosmetics').amount) return;
            this.onBuy(this)
            this.element.find('button').text('Equip')
            this.element.find('button').off('click').on('click', () => {
                const isEquipped = save.cosmetics.currentSkin
                const hat = save.cosmetics.currentHat
                if (isEquipped && isEquipped == this.name) {
                    loadCosmetics('', hat)
                    this.element.find('button').text('Equip')
                    return
                } else if (isEquipped) {
                    loadCosmetics(this.name, hat)
                    this.element.find('button').text('Unequip')
                    skins.find(s => s.name == isEquipped).element.find('button').text('Equip')
                    return
                }
                loadCosmetics(this.name, hat)
                this.element.find('button').text('Unequip')
            })
            if (save.cosmetics.currentSkin == this.name) this.element.find('button').text('Unequip')
        }
        this.own = own

        this.element.find('button').on('click', () => {
            if (save.upgrades.find(u => u.id == 'Cosmetics').amount) {
                if (!removeScore(this.price)) return;
                save.cosmetics.skins.push(this.name)
                own()
            }
        })
        skins.push(this)
        return this
    }
}


export const showSkins = () => {
    $('.cosmetic.skin').show()
    $('.cosmetic.hat-item').hide()
}

export const showHats = () => {
    $('.cosmetic.skin').hide()
    $('.cosmetic.hat-item').show()
}

export class Hat extends Skin {
    constructor(name, description, price, hatOffSet, onBuy = () => void 0, fileExtention = 'png', onEquip = () => void 0) {
        super(name, description, price, hatOffSet, onBuy, fileExtention, onEquip)
    }
    init() {
        this.element.addClass('hat-item')
        this.element.find('img').attr('src', 'osagery/cosmetics/hats/' + this.name + `.${this.fileExtention}`)
        const own = () => {
            if (!save.upgrades.find(u => u.id == 'Cosmetics').amount) return;
            this.onBuy(this)
            this.element.find('button').text('Equip')
            this.element.find('button').off('click').on('click', () => {
                const isEquipped = save.cosmetics.currentHat
                const skin = save.cosmetics.currentSkin
                if (isEquipped && isEquipped == this.name) {
                    loadCosmetics(skin)
                    this.element.find('button').text('Equip')
                    return
                } else if (isEquipped) {
                    loadCosmetics(skin, this.name)
                    this.element.find('button').text('Unequip')
                    hats.find(s => s.name == isEquipped).element.find('button').text('Equip')
                    return
                }
                loadCosmetics(skin, this.name)
                this.element.find('button').text('Unequip')
            })
            if (save.cosmetics.currentHat == this.name) this.element.find('button').text('Unequip')
        }
        this.own = own
        this.element.find('button').on('click', () => {
            if (save.upgrades.find(u => u.id == 'Cosmetics').amount) {
                if (!removeScore(this.price)) return;
                save.cosmetics.hats.push(this.name)
                own()
            }
        })
        hats.push(this)
        return this
    }
}


new Skin('smol', 'smol osage plush', 500).init()
new Skin('bald', 'osage but no hair', 1000, {
    x: '-50%', y: '-40%'
}).init()
new Skin('phone', 'osage on the bed with a phone', 2000, {
    x: '-55%', y: '-50%'
}).init()
new Skin('waffle', 'osage with waffle', 5000, {
    x: '-63%', y: '-80%', style: {
        scale: '0.8'
    }
}).init()
new Skin('eepy', 'osage eepying in bed', 20000, {
    x: '-7%', y: '0%', style: {
        rotate: '77deg', scale: '0.8'
    }
}).init()
new Skin('art masterpiece', 'this beautiful textage art masterpiece<br>(by u/primekisser)', 25000, {}).init()
new Skin('spin', 'osage spinning', 50000, {}, () => { }, 'gif').init()

new Hat('chimken', 'this chicken thing', 5e3, {
    z: -1
}).init()
new Hat('Magic Tophat', 'a very magical hat that doesnt do anything', 10000).init()
new Hat('Post shelter hat', 'the hat from Post shelter\'s cover art', 20000, {
    y: '35%'
}).init()
new Hat('Christmas hat', 'just a christmas hat', 30000).init()

$('.cosmetic-selection button:nth-child(1)').on('click', showSkins)
$('.cosmetic-selection button:nth-child(2)').on('click', showHats)