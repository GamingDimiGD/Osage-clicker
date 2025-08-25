import { rng } from "../../../shared/shared.js"
import { rainEffect, emptySave, save } from "./index.js"
import { deleteSave, exportSave, importSave } from "./manageSave.js"

const settingsDisplay = $('.settings.modal .content')

export const optionsOnUpdate = {
    "Music Volume": (val) => {
        $('#music-road-audio-player').prop('volume', val)
    },
    "Rain": (val) => {
        if (val) {
            rainEffect.reload()
            rainEffect.start()
        } else {
            rainEffect.stop()
        }
    },
    "Rain Angle": (val) => {
        if (!save.options.Rain) return;
        rainEffect.reload()
        if (val) rainEffect.start()
        else rainEffect.stop()
    },
    "Osage running around with fish": (val) => {
        if (val) {
            let amount = save.upgrades.find(u => u.id == 'Osage chan with fish').amount
            if (amount === 0) return;
            $('.silly-thing-that-walks-around.widget').empty()
            let sillyAmount = $('.silly-thing-that-walks-around.widget img').length
            while (sillyAmount < Math.min(amount, 10)) {
                $('.silly-thing-that-walks-around.widget').addClass('active').append(`<img src="osagery/fish.gif" alt="shovel" width="100px" style="animation-duration: ${rng(200, 50) / 10}s;">`)
                sillyAmount = $('.silly-thing-that-walks-around.widget img').length
            }
        } else {
            $('.silly-thing-that-walks-around.widget').empty()
        }
    }
}

export const loadOptions = () => {
    const { options } = save
    Object.keys(options).forEach(key => {
        let val = options[key]
        let defaultVal = emptySave.options[key]
        if (defaultVal === 1) {
            let label = $(`<label>${key}</label>`)
            let slider = $(`<input type="range" min="0" max="1" step="0.05">`)
            slider.val(val)
            slider.on('input', () => {
                save.options[key] = parseFloat(slider.val())
                save.save()
                if (!optionsOnUpdate[key]) return;
                optionsOnUpdate[key](save.options[key])
            })
            settingsDisplay.append(label, slider)
        } else if (typeof defaultVal === 'boolean') {
            let button = $(`<button>${key}: ${val ? "ON" : "OFF"}</button>`)
            button.on('click', () => {
                val = !val
                save.options[key] = val
                save.save()
                button.text(`${key}: ${val ? "ON" : "OFF"}`)
                if (!optionsOnUpdate[key]) return;
                optionsOnUpdate[key](val)
            })
            settingsDisplay.append(button)
        } else if (key === 'Rain Angle') {
            let label = $(`<label>${key}</label>`)
            let slider = $(`<input type="range" min="0" max="180" step="1">`)
            slider.val(val)
            slider.on('input', () => {
                save.options[key] = parseInt(slider.val())
                save.save()
                if (!optionsOnUpdate[key]) return;
                optionsOnUpdate[key](save.options[key])
            })
            settingsDisplay.append(label, slider)
        }
    })
    save.save()
    let importButton = $(`<button>Import Save</button>`)
    importButton.on('click', () => {
        let input = $('<input type="file" accept=".osage">')
        input.on('change', () => {
            let file = input.prop('files')[0]
            let reader = new FileReader()
            reader.onload = () => {
                importSave(reader.result)
            }
            reader.readAsText(file)
        })
        input[0].click()
    })
    let exportButton = $(`<button>Export Save</button>`)
    exportButton.on('click', exportSave)
    let deleteButton = $(`<button>Delete Save</button>`).css('background', 'red')
    deleteButton.on('click', deleteSave)
    settingsDisplay.append(importButton, exportButton, deleteButton)
}