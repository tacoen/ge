function addBodyClassBasedOnMediaWidth() {
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

function displayJayapuraClock() {
	const jayapuraDateTime = new Date().toLocaleString("en-US", {
		timeZone: "Asia/Jayapura",
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12:false
	});

//	console.log(jayapuraDateTime)

	dateTimeArray = jayapuraDateTime.replace(",", "/").split("/ ");

//	console.log(dateTimeArray);

	const dateString = dateTimeArray[0];
	const timeString = dateTimeArray[1];

	const dateElement = document.querySelector(".date");
	const clockElement = document.querySelector(".clock");

	dateElement.textContent = dateString;
	clockElement.textContent = timeString;
	
}

function goto(what) {
    document.querySelector('.w3.' + what).scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest"
    });
}
function enableline_delete() {
    document.querySelectorAll('span.count.delete').forEach((s)=>{
        s.removeEventListener('click', dummy());
        s.addEventListener('click', (e)=>{
            s.closest('div.line').remove();
        }
        );
    }
    );
}

function addnewline(li=false) {
    if (li == false) {
        var li = document.createElement('li');
        li.dataset.muatan = "";
        li.dataset.satuan = "";
        li.dataset.volume = 0;
    }
    var details = document.querySelector('div.details');
    var nl = document.createElement('div');
    nl.className = 'line';
    nl.innerHTML = "<div><span class='entry muatan' contenteditable='true'>" + li.dataset.muatan + "</span></div>" + "<div><span class='entry volume' contenteditable='true'>" + li.dataset.volume + "</span></div>" + "<div><span class='entry satuan' contenteditable='true'>" + li.dataset.satuan + "</span></div>" + "<div><span class='count delete'></span></div>";
    details.append(nl);
    enableline_delete();

    if (document.body.classList.contains('unpad')) {
        var ph = pan.offsetHeight;
        document.body.style.marginTop = ph + "px";
    }
}

function lsq(what='', cmd, data=[]) {

    res = [];

    switch (cmd) {
    case 'append':
        const existingData = localStorage.getItem(what) || '[]';
        const parsedData = JSON.parse(existingData);

        if (!parsedData.some(item=>item[0] === data[0] && item[1] === data[1])) {
            parsedData.push(data);
        }

        localStorage.setItem(what, JSON.stringify(parsedData));

        break;

    case 'keep':
        localStorage.setItem(what, JSON.stringify(data));

    default:
        res = JSON.parse(localStorage.getItem(what));
    }

    return res;

}

function collect() {

    var submitdata = {};
	var n = 0;
	
    document.querySelectorAll('.entry.muatan').forEach((i)=>{

		if (i.innerText != "") {
            data = []
            data.seed = document.body.dataset.seed;

            data.muatan = i.innerText;

            data.datetime = i.closest('#inputpanel').querySelector('.date').innerText + " " + i.closest('#inputpanel').querySelector('.clock').innerText;
            data.driver_name = i.closest('#inputpanel').querySelector('.driver_name').innerText;
            data.driver_id = i.closest('#inputpanel').querySelector('.driver_id').innerText;
            data.volume = i.closest('div.line').querySelector('.volume').innerText;
            data.satuan = i.closest('div.line').querySelector('.satuan').innerText;

            lsq('items', 'append', [data.muatan, data.volume, data.satuan])
            lsq('doers', 'append', [data.driver_name, data.driver_id])

            // console.log(data.muatan);

            submitdata[n]=Object.assign({},data);
			n = n +1;
		}
        
    }
    );

	if (Object.keys(submitdata).length > 0 ) {
		console.log(typeof(submitdata),submitdata)
		submitdata.cmd = 'submit';
		res = json_submit(submitdata);
		console.log(res);		
	} else {
		console.log('No Entries...');
	}
}

async function json_submit(data) {

	(async () => {
		const rawResponse = await fetch('json.php?'+ta.ltm, {
			method: 'POST',
			headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		
		const content = await rawResponse.json();
		
		console.log(content);
	})();			
}			

function dummy() {  }

/* mimi */
