
class TaUIFunc {

	constructor() {
		const ta = new TaJsFunc();
	};
	
	theme_switch(obj) {
		var h = document.getElementsByTagName('html')[0]
		var t = h.getAttribute('theme') || false
		if (t == 'dark') {
			h.setAttribute('theme','light')
			ta.class.remove(obj,'dark')
		} else {
			h.setAttribute('theme','dark')
			ta.class.add(obj,'dark')
		}
	};
	
	dele(obj) {
		obj.remove();
	}
	
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


	allowDrop(ev) {
		ev.preventDefault();
		console.log(ev.dataTransfer);
	}

	drag(ev) {
  
		if (! ta.notempty(ev.target.id) ) {
			ev.target.id = ev.target.tagName +"_"+ev.target.innerText.substring(0,3)+"_"+ta.randomnumber();
		}
		
		ev.dataTransfer.setData("text/plain",ev.target.id);

	}

	drop(ev,w='move') {
		var dt =  ev.dataTransfer;
		dt.dropEffect = w;
	
		ev.preventDefault();
  
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
			dropable.insertBefore(obj,nexto)
		}

	}



}


/*--- begin of ui loader --- */

let t = new TaUIFunc();