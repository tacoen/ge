function precancopy(ele = 'pre') {
  document.querySelectorAll(ele).forEach((el) => {
    const span = document.createElement('span');
    span.className = 'copy';
    span.innerText = 'copy';
    el.appendChild(span);

    span.addEventListener('click', () => {
      const text = ele === 'pre' ? span.closest(ele).querySelector('code').innerText : span.closest(ele).innerText;
      const textarea = document.createElement('textarea');
      textarea.classList.add('hide');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      textarea.setSelectionRange(0, 99999);
      document.execCommand('copy');
      document.body.removeChild(textarea);
      span.innerText = 'copied';
      span.closest(ele).classList.add('copied');
      setTimeout(() => {
        span.closest(ele).classList.remove('copied');
        span.innerText = 'copy';
      }, 3000);
    });
  });
}

document.addEventListener("DOMContentLoaded", function() {

    ta.fetch('#sitemenu .container');
    taicon.delay();

    if (ta.is_elementExists('.tocindex')) {

        ta.generateTOC('.tocindex');
    }

    precancopy();



});
