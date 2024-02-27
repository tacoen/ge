class TaJsFunc {

	constructor() {
		this.version = "0.1a";
		this.ltm = Date.now();
		this.host = window.location.pathname.toLowerCase().replace(/\W/g, "");
		this.lsd = JSON.parse(localStorage.getItem(this.host));
		this.ckies = JSON.parse(localStorage.getItem("ckies")) || {};
	};

	randomnumber(l=9999) {
		return Math.floor(Math.random() * (l - l+1)) + 1000;
	};

	notempty(w) {
		if (typeof w !== 'undefined') {
			if ( w === null) { return false; }
			if ( w.trim() === '') { return false; }
			return w.trim()
		} else {
			return false;
		}
	};

	strim(str) {
		return str.trim().replace(/\s+/g, " ");
	};

	safestr(str) {
		return str.replace(/\s+/g, "_").replace(/\W/g, "").toLowerCase().replace(/__/g, "_").replace(/^_|_$/g, "");
	};

	attr_toString(attr = {}) {
		let str = '';
		Object.keys(attr).forEach((a) => {
			str = str + ' ' + a + "='" + attr[a] + "'";
		});
		return this.strim(str);
	};

	/* localstorage */

	ls = {
		init: (data={}) => {
			if ( this.lsd == null) { localStorage.setItem(this.host,JSON.stringify(data)) }
			this.lsd = JSON.parse(localStorage.getItem(this.host));
		},
		save: (w, v) => {
			if (this.lsd == null) { this.lsd = {}; }
			this.lsd[w] = JSON.stringify(v);
			localStorage.setItem(this.host, JSON.stringify(this.lsd));
		},
		get: (w) => {
			return JSON.parse(this.lsd[w]);
		}
	};
	
	/* localstorage - cookies */	

	cookies = {

		remove: (w) => {
			delete(this.ckies[w]);
		},
		set: (w,v) => {
			this.ckies[w] = JSON.stringify(v);
			localStorage.setItem('ckies', JSON.stringify(this.ckies));			
		},
		get: (w) => {
			var v = this.ckies[w] || null
			return JSON.parse(v);
		}
		
	};
		
	/* unique sort */

	uniq(value, index, self) {
		return self.indexOf(value) === index;
	};

	uniqsort = {
		string: (retArray,way=true) => {
			if (way) {
				retArray.sort((b, a) => a.localeCompare(b));
			} else {
				retArray.sort((b, a) => b.localeCompare(a));
			}
			return retArray.filter(this.uniq);
		},
		number: (retArray,way=true) => {
			if (way) {
				retArray.sort((b, a) => a - b);
			} else {
				retArray.sort((b, a) => b - a);
			}
			return retArray.filter(this.uniq);
		}
	};

	elementof(e) {
		if (typeof e == 'string') { e = document.querySelector(e) }
		return e
	};

	/* content */

	class = {
		value: (e) => { return this.elementof(e).classList.value; },
		add: (e,c) => { this.elementof(e).classList.add(c); },
		remove: (e,c) => { this.elementof(e).classList.remove(c); },
		has: (e,c) => { return this.elementof(e).classList.contains(c) || false; },
		rewrite: (e,c) => { this.elementof(e).className=c; },
		toggle: (e,c) => { this.elementof(e).classList.toggle(c); },
		chained: (e,c,m='remove') => { e.parentNode.querySelectorAll(e.tagName).forEach( (el) => {
			if (m == 'remove') { this.class.remove(el,c); } else { this.class.add(el,c); }
		});
}
	};

	get = {
		html: (e) => { return this.elementof(e).innerHTML || ''; },
		text: (e) => { return this.elementof(e).innerText || ''; },
		class: (e) => { return this.elementof(e).className || ''; },
		id:   (e) => { return this.elementof(e).id || null; },
		value:(e) => { return this.elementof(e).value|| null; },
		attr: (e,a) => { return this.elementof(e).getAttribute(a)|| null; }
	};

	set = {
		html: (e, html) => { this.elementof(e).innerHTML = html; },
		text: (e, html) => { this.elementof(e).innerText = html; },
		id:   (e,html) => { this.elementof(e).id=html; },
		value:(e,html) => { this.elementof(e).value=html; },
		attr: (e,a,html) =>{ this.elementof(e).setAttribute(a,html) }
	};


	/* xhr.fetch */
	fetch(e, url = null, chains, cvar = {}) {

		e = this.elementof(e)
		if (url == null) { url = e.getAttribute("data-fetch"); }
		fetch(url + "?nocache=" + this.ltm)
			.then((response) => response.text())
			.then((html) => {
				e.classList.add("fetched");
				e.innerHTML = html.trim();
				if (typeof chains !== "undefined") {
					window[chains](e, cvar);
				}
			})
			.catch((error) => {
				console.warn(error);
			});
	};

	async load_json(url) {
		try {
			const response = await fetch(url);
			const data = await response.json();
			return data;
		} catch (error) {
			console.warn(error);
		}
	};

	attr_array(e) {
		const aa = [...this.elementof(e).attributes];
		const attrs = aa.reduce((attrs, attribute) => {
			attrs[attribute.name] = attribute.value;
			return attrs;
		}, {}	)

		return attrs;

	};


}

class TaUIFunc {

	constructor() {
		const ta = new TaJsFunc();
	};

	toggle(obj) {
		var ele = ta.elementof(obj)
		if (ta.class.has(ele,'hide') ) {
			ta.class.remove(ele,'hide');
		} else {
			ta.class.add(ele,'hide');
		}
	};

	toggleclass(obj,what='active') {
		var ele = ta.elementof(obj)
		if (ta.class.has(ele,what) ) {
			ta.class.remove(ele,what);
		} else {
			ta.class.add(ele,what);
		}
	};

	button(c,attr={}) {
		var btn = document.createElement('button'); btn.innerHTML=c;
		Object.keys(attr).forEach((a) => {
			btn.setAttribute(a,attr[a])
		});
		return btn
	};

	modal(what,button) {
		if (document.body.classList.contains('modal-layer')) {
			document.querySelectorAll('.modal-layer .modal').forEach( function(e) {
				e.remove(); })
			ta.class.toggle(document.body,'modal-layer');
		} else {
			ta.class.toggle(document.body,'modal-layer');
			var div = document.createElement('div');
			var layer = document.createElement('div'); layer.className = 'layer';
			div.className = ta.get.class('#modal>'+what) + ' fix left modal';
			var eleid = ta.safestr('modal_'+ what);
			div.id = eleid;
			div.innerHTML = ta.get.html('#modal>'+what);

			div.prepend( this.button(this.htmlpart('x'),
					{ 'class': 'modal-close',
					  'onclick':'t.modalclose("'+eleid+'")'
					 })
			);

			document.body.appendChild(layer);
			document.body.appendChild(div);

		}
	}

	modalclose(obj) {
		document.querySelectorAll('.modal-layer .modal').forEach( function(e) {
				e.remove(); })
		ta.class.toggle(document.body,'modal-layer');
	}

	htmlpart(w) {
		return document.querySelector('#htmlpart [index="'+w+'"').innerHTML || "<!-- hp: "+w+"-->";
	}




}


/*--- begin of ui loader --- */

let t = new TaUIFunc();
let ta = new TaJsFunc();

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



document.addEventListener("DOMContentLoaded", (e) => {

	tui_init('buttons')
	tui_init('accordion');
	tui_init('tabnav');

});

