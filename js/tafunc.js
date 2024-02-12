
function ta_jsfunc() {
  
	const version = "0.1a";
	const ltm = Date.now();

	let host = window.location.pathname.toLowerCase().replace(/\W/g,"");
	var ls = JSON.parse( localStorage.getItem(host) )
		
	this.trim = (str) => {
		return str.trim().replace(/\s+/g," ");  
	};
	this.uniq = (value, index, self) => {
		return self.indexOf(value) === index;
	};
	this.usort= (retArray,way='dsc',type='string') => {
		switch(type) {
			case "int":
				if (way == 'asc') {
					retArray.sort((b, a) => b-a);
				} else {
					retArray.sort((b, a) => a-b);
				}
				break;
				
			default:
				if (way == 'asc') {
					retArray.sort((b, a) => b.localeCompare(a));
				} else {
					retArray.sort((b, a) => a.localeCompare(b));
				}
		}
		
		return retArray.filter(this.uniq);
	};
	this.ssusort= (retArray) => {
		retArray.sort((b, a) => b-a);
		return retArray.filter(this.uniq);
	};	
	this.safestr = (str) => {
		return str.replace(/\s+/g,"_").replace(/\W/g,"").toLowerCase().replace(/__/g,"_");
	};	
	this.attr_toString = (attr={}) => {
		let str = '';
		Object.keys(attr).forEach((a) => {
			str = str +' '+ a +"='"+attr[a]+"'"
		});
		return this.trim(str)
	};
	
	/* localstorage */
	
	this.ls_save = (w,v) => {
		if (ls == null) { ls = {} }
		ls[w] = JSON.stringify(v)
		localStorage.setItem(host,JSON.stringify(ls))
	};
	this.ls_get = (w) => {
		return JSON.parse(ls[w])
	};	
	
	/* content */
	
	this.html = (e,html) => { document.querySelector(e).innerHTML=html };
	this.text = (e,html) => { document.querySelector(e).innerText=html }

	/* xhr.fetch */
	
	this.fetch = (e,chains,cvar={}) => {
		const ltm = Date.now();
		var url = e.getAttribute('data-fetch');
		fetch(url+"?nocache="+ltm).then((response) => response.text()).then((html) => {
			e.classList.add('fetched');
			e.innerHTML = html.trim();
			if (typeof chains !== 'undefined') {
				window[chains](e,cvar);
			}
		})
		.catch((error) => {
			console.warn(error);
		});
	};
	
  
  
}; let ta = new ta_jsfunc();
