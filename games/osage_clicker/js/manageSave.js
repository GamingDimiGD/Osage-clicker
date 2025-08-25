import { alertModal } from "../../../shared/shared.js"
import { save } from "./index.js"

export const exportSave = () => {
    let e = { ...save }
    delete e.save
    const data = btoa(JSON.stringify(e))
    let blob = new Blob([data], { type: 'text/osage' })
    let url = URL.createObjectURL(blob)
    let a = document.createElement('a')
    a.href = url
    a.download = 'save.osage'
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
}

export const importSave = (data) => {
    try {
        alertModal('Warning! This will override your current save!', [
            {
                text: 'Proceed',
                onclick: async () => {
                    let e = JSON.parse(atob(data))
                    await $.jStorage.set('osageClicker', e)
                    window.location.reload()
                }
            }, 'Leave'
        ])
    } catch (error) {
        alertModal('Error importing save: ' + error.message)
    }
}

export const deleteSave = () => {
    alertModal('Are you sure you want to delete your save?', [{
        text: 'Yes',
        onclick: async () => {
            await $.jStorage.deleteKey('osageClicker');
            window.location.reload();
        }
    }, 'No'])
}