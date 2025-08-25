import { musicData } from "./music road/musicData.js";

let lastKeys = [], timeoutID;
const theAlphabet = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", ' ']; // yeah the ai entered it for me so uhhh
export const loadKeybinds = () => {
    addEventListener("keydown", (e) => {
        if (e.key === "z" && !lastKeys) {
            $('.modal').removeClass('show')
            $('.main-game-contents button')[0].click();
            return;
        }
        if (e.key === "x" && !lastKeys) {
            $('.modal').removeClass('show')
            $('.main-game-contents button')[1].click();
            return;
        }
        if (e.key === "c" && !$('.music-road-unlocks.modal').hasClass('show')) {
            $('.modal').removeClass('show')
            $('.main-game-contents button')[2].click();
            return;
        }
        if ($('.music-road-unlocks.modal').hasClass('show') && (theAlphabet.includes(e.key.toLowerCase()) || e.key === 'Backspace')) {
            if (e.key === 'Backspace' && lastKeys) lastKeys.pop()
            lastKeys.push(e.key.toLowerCase())
            let findMusic = musicData.find(d => d.title.toLowerCase().startsWith(lastKeys.join('')))
            if (!findMusic) return;
            if (timeoutID) clearTimeout(timeoutID)
            timeoutID = setTimeout(() => lastKeys = [], 2000)
            let index = musicData.indexOf(findMusic)
            $('.music-select>div')[index].scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }
        if (e.key === "Escape") return $('.modal').removeClass('show')
    });
}