function pagesm() {
	document.getElementById('clone_sitemenu').innerHTML = document.querySelector("[data-fetch='_sitemenu.html']").innerHTML;

	taicon.delay();		
		
}

document.addEventListener("DOMContentLoaded", function() {
    
    ta.fetch('#sitemenu .container',null,'pagesm');

});