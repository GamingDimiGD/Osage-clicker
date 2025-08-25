export const increment = (e, text, seconds = 1) => {
    text = text.replaceAll('$oge', '<i class="smol">oge</i>')
    let b = $(`<b>${text}</b>`);
    b.css('animation-duration', Math.min(1, seconds) + 's').css('left', e.clientX + 'px').css('top', e.clientY + 'px');
    $('.incremental-display').append(b);
    setTimeout(() => {
        b.css('opacity', 0)
        setTimeout(() => b.remove(), 550)
    }, seconds * 1000)
}