class TaJsFunc {

	constructor() {
		this.version = "0.1a";
		this.ltm = Date.now();
		this.host = window.location.pathname.toLowerCase().replace(/\W/g, "");
		this.lsd = JSON.parse(localStorage.getItem(this.host));
		this.ckies = JSON.parse(localStorage.getItem("ckies")) || {};
	};

	randomnumber(minVal=1000,maxVal=9999) {
		var randVal = minVal+(Math.random()*(maxVal-minVal));
		return Math.round(randVal);		
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
		chained: (e,c,m='remove') => { 
			e.parentNode.querySelectorAll(e.tagName).forEach( (el) => {
				if (m == 'remove') { this.class.remove(el,c); }
				else { this.class.add(el,c); }
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

let ta = new TaJsFunc();
