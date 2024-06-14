
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
	
	document.querySelectorAll(query).forEach((line) => {
		
		if ((what=='css') && (line.href)) {

			var p = document.createElement('p');
			const cb = document.createElement('input');
			cb.type = 'checkbox';
			const Label = document.createElement('label');
			Label.textContent = line.href.split('/').pop();
			if (Label.textContent === 'maker.css') { cb.checked = false; } else { cb.checked = true; }	
			cb.name = "css"
			cb.value = ta.getrel(line.href);
			list.push(cb.value);
			p.appendChild(cb); p.appendChild(Label);
			
		} else if ((what=='js') && (line.src)) {
			
			var p = document.createElement('p');
			const cb = document.createElement('input');
			cb.type = 'checkbox';
			cb.value = ta.getrel(line.src);
			
			list.push(cb.value);
			
			const Label = document.createElement('label');
			Label.textContent = line.src.split('/').pop();
			if (Label.textContent == 'maker.js') { cb.checked = false; } else { cb.checked = true; }			
			cb.name = "js"
			p.appendChild(cb); p.appendChild(Label);
		}

		cb_container.appendChild(p);
	
	});

	var inputq = cb_container.querySelector('textarea');
	inputq.value = '/ge2/minify.php?'+what+"="+list.toString();	

	console.log(inputq);
	
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
				if (el.checked) { list.push(el.value) }
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
