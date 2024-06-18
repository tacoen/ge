function create_cbox(w,line,voided=false,list=[]) {
	var p = document.createElement('p');
	const cb = document.createElement('input');
	cb.type = 'checkbox';
	const Label = document.createElement('label');
	cb.name = w; 
	if (w == 'js'){
		if (typeof line === 'object') {
			cb.value = ta.getrel(line.src);
			Label.textContent = line.src.split('/').pop();
		} else {
			Label.textContent = line;
			cb.value = "/ge2/js/"+line
		}
	} else {
		if (typeof line === 'object') {
			cb.value = ta.getrel(line.href);
			Label.textContent = line.href.split('/').pop();
		} else {
			Label.textContent = line;
			cb.value = "ge2/css/"+line
		}
	}
	if (voided) {
		if (voided.includes(Label.textContent)) { cb.checked = false; } else { cb.checked = true; }	
	} else {
		cb.checked = false;
	}
	if (cb.checked) { list.push(cb.value); }
	p.appendChild(cb); p.appendChild(Label);
	var span = document.createElement('span');
	span.className='fz';
	getFileSize(cb.value).then(size => {
		span.innerHTML = (size/1000).toFixed(2)+" kb";
	})
	p.appendChild(span);
	p.className ='esta';
		p.addEventListener('click', function(e) {
			var cb = p.querySelector('input[type="checkbox"]');
			if (cb.checked) { cb.checked=false }
			else { cb.checked=true }
		});
	return [ p,list];
}
function getFileSize(url) {
  return new Promise((resolve, reject) => {
    fetch(url, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          const fileSize = parseInt(response.headers.get('Content-Length'), 10);
          resolve(fileSize);
        } else {
          reject(new Error('Error fetching file size'));
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}
function create_cblist (what='css',query='head link[rel="stylesheet"]') {
	var cb_container = document.createElement('div');
	cb_container.className = "flex vertical ps1 w50 pr5";
	cb_container.dataset.file = what;
	var pi = document.createElement('p');
	var inputq = document.createElement('textarea');
	inputq.className = "w100 pa"
	pi.appendChild(inputq);
	cb_container.appendChild(pi);
	cb_container.innerHTML += '<h5>Select '+what+' files to include:</h5>';
	let list = [];
	var voided = ['maker.css','maker.js','func.js','style.css','entypo.js','microns.js'];
	document.querySelectorAll(query).forEach((line) => {
		var p = document.createElement('p');
		//console.log('list',list);
		if ((what=='js') && (line.src)) {
			rtar = create_cbox(what,line,voided,list);
			p = rtar[0]; list = rtar[1];
		} else if ((what=='css') && (line.href)) {
			rtar = create_cbox(what,line,voided,list);
			p = rtar[0]; list = rtar[1];
		}
		cb_container.appendChild(p);
	});
	if (what=='js') {
		rtar = create_cbox('js','microns.js',false,list);
		p = rtar[0]; list = rtar[1];
		cb_container.appendChild(p);
	}
	var inputq = cb_container.querySelector('textarea');
	inputq.value = '/ge2/minify.php?'+what+"="+list.toString();	
	//console.log(inputq);
	var p2 = document.createElement('p');
	var link = document.createElement('a');
	link.className='button small'
	link.href = inputq.value 
	link.innerHTML = "<i data-icon='save' class='mr'></i> minified"
	p2.appendChild(link);
	cb_container.appendChild(p2);
	cb_container.querySelectorAll("input[type='checkbox']").forEach ((el) => {
		el.addEventListener("change", (e)=>{
			var par = el.closest('div[data-file]')
			var w = par.dataset.file;
			var list = [];
			par.querySelectorAll("input[type='checkbox']").forEach ((el) => {
				if (el.checked) { 
					list.push(el.value);
				}
			});
			var ta = par.querySelector('textarea');
			ta.value = '/minify.php?'+what+"="+list.toString();
		});
	});
	return cb_container;
}
function packFiles() {
	const container = document.createElement('div');
	container.className = 'w100 flex warp';
	container.appendChild ( create_cblist('css','head link[rel="stylesheet"]') );
	container.appendChild ( create_cblist('js','head script[src]') );
	document.querySelector('main').appendChild(container);
}
