function dummy() {}

class TaJSFunc {
	constructor() {
		this.version = "0.1a";
		this.ltm = Date.now();
		this.host = window.location.pathname.toLowerCase().replace(/\W/g, "");
		this.lsd = JSON.parse(localStorage.getItem(this.host));
		this.kukis = JSON.parse(localStorage.getItem("kukis")) || {};
	};
	rndtext() {
		const rc = ['0123456789', 'aeiou', 'bcdfghjklmnpqrstvwxyz'];
		return (rc[2][Math.floor(Math.random() * rc[2].length)] + rc[1][Math.floor(Math.random() * rc[1].length)] + rc[2][Math.floor(Math.random() * rc[2].length)] + rc[1][Math.floor(Math.random() * rc[1].length)] + rc[0][Math.floor(Math.random() * rc[0].length)] + rc[0][Math.floor(Math.random() * rc[0].length)]);
	}
	rndnum(minVal = 1000, maxVal = 9999) {
		var randVal = minVal + (Math.random() * (maxVal - minVal));
		return Math.round(randVal);
	}; /* unique sort */
	uniq(value, index, self) {
		return self.indexOf(value) === index;
	};
	uniqsort = {
		string: (retArray, way = true) => {
			if (way) {
				retArray.sort((b, a) => a.localeCompare(b));
			} else {
				retArray.sort((b, a) => b.localeCompare(a));
			}
			return retArray.filter(this.uniq);
		},
		number: (retArray, way = true) => {
			if (way) {
				retArray.sort((b, a) => a - b);
			} else {
				retArray.sort((b, a) => b - a);
			}
			return retArray.filter(this.uniq);
		}
	};
	notempty(w) {
		if (typeof w !== 'undefined') {
			if (w === null) {
				return false;
			}
			if (w.trim() === '') {
				return false;
			}
			return w.trim()
		} else {
			return false;
		}
	};

	getrel(url) {
		var str = window.location.protocol +"\/\/"+ window.location.hostname;
		return url.replace(str, "");
	};
	
	elementof(e) {
		if (typeof e == 'string') {
			e = document.querySelector(e)
		}
		return e
	}; /* xhr.fetch */
	fetch(e, url = null, chains, cvar = {}) {
		e = this.elementof(e)
		if (url == null) {
			url = e.getAttribute("data-fetch");
		}
		fetch(url + "?nocache=" + this.ltm).then((response) => response.text()).then((html) => {
			e.classList.add("fetched");
			e.innerHTML = html.trim();
			if (typeof chains !== "undefined") {
				window[chains](e, cvar);
			}
		}).catch((error) => {
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
			return null;
			// or throw the error
		}
	};

	json_submit(data,url='json.php') {
		//console.log(data);
		return (async () => {
			const rawResponse = await fetch(url+'?'+ta.ltm, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(data)
			});
		const res = await rawResponse.json();
		//console.log( res);
		return res;
		})();
	}	

	contentedit_json(id,chain=false) {
		var sre = ta.elementof(id);
		let data={}
		sre.querySelectorAll('[contenteditable]').forEach(
			(s)=>{
				var el_name = s.getAttribute('name');
				if (! this.notempty(el_name)) {
					el_name = sre.id+"_"+s.tagName.toLowerCase()+"_"+this.rndnum();
					console.log('contentedit_json require name, so random: '+el_name )
					s.setAttribute('name', el_name); 
				}
				data[el_name] = s.innerHTML;
			}
		);

		this.json_submit(data,sre.dataset.post);

	}

	
	attr_array(e) {
		const aa = [...this.elementof(e).attributes];
		const attrs = aa.reduce((attrs, attribute) => {
			attrs[attribute.name] = attribute.value;
			return attrs;
		}, {})
		return attrs;
	}; /* localstorage */
	ls = {
		init: (data = {}) => {
			if (this.lsd == null) {
				localStorage.setItem(this.host, JSON.stringify(data))
			}
			this.lsd = JSON.parse(localStorage.getItem(this.host));
		},
		save: (w, v) => {
			if (this.lsd == null) {
				this.lsd = {};
			}
			this.lsd[w] = JSON.stringify(v);
			localStorage.setItem(this.host, JSON.stringify(this.lsd));
		},
		get: (w) => {
			return JSON.parse(this.lsd[w]);
		}
	};
	is_elementExists(obj) {
		return document.querySelector(obj) !== null;
	}
}
/* eof tajsfunc */
class TaUIFunc extends TaJSFunc {
	getQueryString(qs) {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(qs) || null;
	}
	updateTitle(obj) {
		if (this.is_elementExists(obj)) {
			var title = document.querySelector(obj).innerText;
			document.title = title;
		}
	}
	class = {
		value: (e) => {
			return this.elementof(e).classList.value;
		},
		add: (e, c) => {
			this.elementof(e).classList.add(c);
		},
		remove: (e, c) => {
			this.elementof(e).classList.remove(c);
		},
		has: (e, c) => {
			return this.elementof(e).classList.contains(c) || false;
		},
		rewrite: (e, c) => {
			this.elementof(e).className = c;
		},
		toggle: (e, c) => {
			this.elementof(e).classList.toggle(c);
		},
		chained: (e, c, m = 'remove') => {
			e.parentNode.querySelectorAll(e.tagName).forEach((el) => {
				if (m == 'remove') {
					this.class.remove(el, c);
				} else {
					this.class.add(el, c);
				}
			});
		}
	};
	theme_switch() {
		var h = document.getElementsByTagName('html')[0]
		var t = h.getAttribute('theme') || false
		if (t == 'dark') {
			h.setAttribute('theme', 'light')
			//this.class.remove(obj,'dark')
		} else {
			h.setAttribute('theme', 'dark')
			//this.class.add(obj,'dark')
		}
	};
	htmlpart(w) {
		return document.querySelector('#htmlpart [index="' + w + '"').innerHTML || "<!-- hp: " + w + "-->";
	}
	mediaWidth() {
		const body = document.querySelector('body');
		const mediaWidth = window.innerWidth;
		if (mediaWidth < 600) {
			body.classList.add('small-screen');
		} else if (mediaWidth >= 600 && mediaWidth < 1200) {
			body.classList.add('medium-screen');
		} else {
			body.classList.add('large-screen');
		}
	}
	/* */
	allowDrop(ev) {
		ev.preventDefault();
	}
	drag(ev) {
		if (!ta.notempty(ev.target.id)) {
			ev.target.id = ev.target.tagName + "_" + ev.target.innerText.substring(0, 3) + "_" + ta.rndnum();
		}
		ev.dataTransfer.setData("text", ev.target.id);
	}
	drop(ev, w = 'move') {
		var dt = ev.dataTransfer;
		dt.dropEffect = w;
		ev.preventDefault();
		//var obj = document.getElementById(ev.dataTransfer.getData("text"))
		// console.log(ev.dataTransfer.dropEffect);
		if (w == 'copy') {
			var obj = document.getElementById(ev.dataTransfer.getData("text")).cloneNode(true);
		} else {
			var obj = document.getElementById(ev.dataTransfer.getData("text"))
		}
		if (ev.target.classList.contains('dropable')) {
			ev.target.append(obj);
		} else {
			var dropable = ev.target.closest('.dropable');
			var nexto = ev.target.closest(obj.tagName);
			dropable.insertBefore(obj, nexto)
		}
	}
	generateTOC(from='.tocindex', ele = '#toc .toc', query = 'h2,h3') {
		const maine = document.querySelector(from);
		const headings = maine.querySelectorAll(query);
		const tocContainer = document.querySelector(ele);
		const tocList = document.createElement('ul');
		headings.forEach((heading) => {
			// console.log(heading);
			// Check if the heading is not under an element with the '.no-toc' class
			if (!heading.closest('.no-toc')) {
				const tocItem = document.createElement('li');
				tocItem.classList.add('toc_' + heading.tagName.toLowerCase());
				const tocLink = document.createElement('a');
				const headingId = this.generateHeadingId(heading);
				tocLink.href = `#${headingId}`;
				tocLink.textContent = heading.textContent;
				tocItem.appendChild(tocLink);
				tocList.appendChild(tocItem);
			}
		});
		tocContainer.appendChild(tocList);
	}
	generateHeadingId(heading) {
		var nid = heading.id
		if ((nid === null) || (nid == "")) {
			var nid = `heading-${Array.from(heading.parentElement.children).indexOf(heading) + 1}`;
			heading.id = nid;
		}
		return nid;
	}
};

let ta = new TaUIFunc();

class taLoad extends TaUIFunc {
	modal() {
		document.querySelectorAll('[data-modal]').forEach((el) => {
			el.addEventListener('click', async (e) => {
				var part = el.dataset.modal;
				var overlay = document.getElementById('overlay');
				ta.class.toggle(overlay, 'active');
				var htmlpart = document.querySelector('#htmlpart [data-part="' + part + '"').cloneNode(true);
				var closebtn = htmlpart.querySelector('button.closer');
				closebtn.addEventListener('click', () => {
					htmlpart.remove();
					ta.class.toggle(overlay, 'active');
				});
				ta.class.toggle(htmlpart, 'show');
				overlay.appendChild(htmlpart);
			});
		});
	}
	toggle() {
		document.querySelectorAll('[data-toggle]').forEach((el) => {
			el.addEventListener('click', async (e) => {
				var obj = el.dataset.toggle;
				ta.class.toggle(obj, 'hide');
				ta.class.toggle(el, 'active');
			});
		});
		document.querySelectorAll('.msg').forEach(msg => {
			msg.addEventListener('click', (e) => {
				msg.remove()
			});
		});
	}
	scrollfix() {
		if (ta.is_elementExists('nav[topnav]')) {
			var anchors = document.querySelectorAll('a[href^="#"]');
			// Add click event listener to each anchor link
			anchors.forEach(function(anchor) {
				anchor.addEventListener('click', function(event) {
					event.preventDefault();
					// Prevent the default anchor link behavior
					// Get the target element
					var targetElement = document.querySelector(this.getAttribute('href'));
					if (targetElement) {
						// Calculate the scroll position with a 46px offset
						var nh = document.querySelector('nav[topnav]').offsetHeight + 1;
						var scrollPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - nh;
						// Scroll to the target element with a smooth animation
						window.scrollTo({
							top: scrollPosition,
							behavior: 'smooth'
						});
					}
				});
			});
		}
	}
	accordion() {
		document.querySelectorAll('dl.accordion dt').forEach((el) => {
			el.addEventListener('click', async (e) => {
				ta.class.toggle(el, 'open')
			})
		})
	}
	markdown() {
		// ../js/marked.min.js
		document.querySelectorAll('[markdown]').forEach((el) => {
			var mdtext = el.innerHTML;
			el.innerHTML = marked.parse(mdtext)
		});
	}
};

document.addEventListener("DOMContentLoaded", function() {
	let ena = new taLoad();
	ena.modal();
	ena.toggle();
	ena.scrollfix();
	ena.accordion();
});