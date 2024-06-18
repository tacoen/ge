function serializeFormData(form) {
  var formData = new FormData(form);
  var serializedData = {};

  for (var [name, value] of formData) {
    if (serializedData[name]) {
      if (!Array.isArray(serializedData[name])) {
        serializedData[name] = [serializedData[name]];
      }
      serializedData[name].push(value);
    } else {
      serializedData[name] = value;
    }
  }

  return serializedData;
}

function jsonform(element) {
	
	//console.log(element);
	
	element.addEventListener("submit", function(event) {
		event.preventDefault(); // Prevent form submission

		// Get form values
		var sform = serializeFormData(element)
		
		console.log(sform);
		
		// Send POST request
		fetch("json.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(sform)
		})
		.then(function(response) {
			if (response.ok) {
				// alert("Data posted successfully!");
				return response.text();
			} else {
				throw new Error("Error posting data: " + response.status);
			}
		})
		.then(function(responseText) {
			element.querySelector(".json_response").innerHTML = responseText;
		})	
		.catch(function(error) {
			console.log(error);
			alert("An error occurred while posting data.");
		});
	});
	
	console.log("jsonform!")
}

document.addEventListener("DOMContentLoaded", (e) => {
	
	jsonform( document.querySelector('form[action="json.php"]') );
	
});