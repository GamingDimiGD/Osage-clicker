export const loadingModal = () => {
    $('.loading-modal').addClass('show')
    return {
        hide: () => {
            $('.loading-modal').removeClass('show')
        }
    }
}

export const alertModal = (text, options) => {
    const modal = document.createElement("div");
    modal.classList.add("modal");
    modal.classList.add('alert-modal')
    modal.innerHTML = `
    <div class="content">
        <h3>${text}</h3>
        <button>OK</button>
    </div>
    `;
    let content = modal.querySelector('.content')
    let b = content.querySelector('button')
    if (typeof options === 'string' || options instanceof String) {
        b.innerHTML = options;
        b.addEventListener("click", () => {
            modal.classList.remove('show')
            setTimeout(() => modal.remove(), 1000)
        });
    } else if (typeof options === 'array' || options instanceof Array) {
        b.remove()
        b = document.createElement('div')
        b.classList.add('buttons')
        options.forEach(e => {
            let eb = document.createElement('button')
            if (typeof e === 'string' || e instanceof String) {
                eb.innerHTML = e
                eb.addEventListener("click", () => {
                    modal.classList.remove('show')
                    setTimeout(() => modal.remove(), 1000)
                });
            } else if (typeof e === 'object' || e instanceof Object) {
                eb.innerHTML = e.text
                const hide = () => {
                    modal.classList.remove('show')
                    setTimeout(() => modal.remove(), 1000)
                }
                eb.addEventListener("click", () => {
                    hide()
                    e.onclick(eb)
                })
            }
            b.appendChild(eb)
        })
        content.appendChild(b)
    } else if (!options) {
        b.addEventListener("click", () => {
            modal.classList.remove('show')
            setTimeout(() => modal.remove(), 1000)
        });
    }
    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add("show"), 1)
}

export const rng = (max, min = 0) => Math.floor(Math.random() * (max + 1 - min) + min)

export const chance = (chance) => rng(chance - 1) === 0

export const sfx = (src, volume = 1, onEnd = () => null) => {
    src = `./sfx/${src}.mp3`
    const audio = new Audio(src)
    audio.volume = volume
    audio.play()
    audio.onended = () => {
        audio.remove()
        onEnd()
    }
    return audio
}