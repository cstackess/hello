function toggleAnswer(el) {
    var detail = el.nextElementSibling;
    var arrow = el.querySelector('.arrow');
    if (!detail || !arrow) return;
    detail.classList.toggle('open');
    arrow.classList.toggle('open');
}
