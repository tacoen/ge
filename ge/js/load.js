function tui_init(w) {

	switch(w) {

	case "buttons":

		var buttons = document.querySelectorAll("button"); buttons.forEach((button) => {

			ta.class.remove(button,'active')

			button.addEventListener('click', () => {

				var attrs = ta.attr_array(button);
				['href','data-toggle','data-modal'].forEach( (w) => {
					if (ta.notempty(attrs[w])) {
						switch(w) {
							case 'data-toggle':
								t.toggle(attrs[w]);
								t.toggleclass(button);
								break;
							case 'data-modal':
								t.modal(attrs[w],button);
								t.toggleclass(button);
								break;
							case 'href':
								window.open(attrs[w],"_self") ;
								break;
							default: console.log(w,attrs[w]);
						}
					}
				})
			})

		}); /* buttons */

	break;
	
	case 'fetch':

		var es = document.querySelectorAll("[data-fetch]"); es.forEach((e) => {
				var f = ta.get.attr(e,'data-fetch')
				ta.fetch(e,f)
		});
		
		let ticking = false;
		
		ddata = document.querySelector('body');
		
	
		ddata.addEventListener('scroll',(ev)=> {
			var t = ddata.scrollTop
			var fi = document.querySelector('.sticky');
			
			if (fi !== null) {

			ddata.style.overflow = "hidden";
			ddata.style.height = window.innerHeight - ddata.offsetTop+"px" ;
				
			console.log(fi,t);
			if ( (t > fi.offsetHeight) && (!fi.classList.contains('fixed')) ) {
				fi.style.width = fi.offsetWidth +"px"
				fi.style.height = fi.offsetHeight +"px"
				fi.style.top = fi.offsetTop +"px"
				fi.style.left = fi.offsetLeft +"px"
			}
			if (t > fi.offsetHeight) {
				fi.classList.add('fixed') 
			} else {
				fi.classList.remove('fixed') 
			}
			}
			
		});
	
	break;
		
	case 'tabnav':

		var tablis = document.querySelectorAll(".tab-nav li"); tablis.forEach((li) => {
			li.addEventListener('click', () => {
				ta.class.chained(li,'active');

				var target = ta.get.attr(li,'data-tab');
				var te = ta.elementof(target);
				var pa = te.parentElement.querySelectorAll('.tab')

				pa.forEach((tb) => { ta.class.add(tb,'hide'); });

				if ( ta.class.has(target,'hide') ) {
					ta.class.remove(target,'hide')
				} else {
					ta.class.add(target,'hide')
				}
				ta.class.toggle(li,'active');
			});

		}); /* tabnav */

	break;

	case "accordion":

		var adl = document.querySelectorAll("dl.accordion"); adl.forEach((dl) => {

			dl.querySelectorAll('dd').forEach( (dd) => {
					ta.class.add(dd,'hide');
			});
			dl.querySelectorAll('dt').forEach( (dt) => {
				dt.innerHTML = dt.innerHTML + t.htmlpart('accordion_button');
				ta.class.remove(dt,'active');
				dt.addEventListener('click', () => {
					ta.class.toggle(dt,'active');
					ta.class.toggle(dt.nextElementSibling,'hide')
				})
			});

		}); /* accordions */
	break;
	default:
		console.log('---default');

	}
}
