
document.addEventListener("DOMContentLoaded", (e) => {
	
	var a = document.querySelectorAll(".incode"); a.forEach((d) => {
			d.addEventListener('click', () => {	
				if  ( d.classList.contains('coded') ) {
					var xmp = d.querySelector('xmp');
					d.innerHTML = xmp.innerText
					d.classList.remove('coded')
				} else {
					var html = d.innerHTML
					d.classList.add('coded')
					d.innerHTML = '';
					var xmp = document.createElement('xmp')
					xmp.innerText = html
					d.append(xmp);
				}
			})
	})


})