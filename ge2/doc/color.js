function csscolorcontainer() {
    // Get the computed style for the root element
    let rootStyle = getComputedStyle(document.documentElement);
    // Get the values of the CSS variables
    const orangeColor = rootStyle.getPropertyValue('--orange');
    console.log('orangeColor', orangeColor);
    const redColor = rootStyle.getPropertyValue('--red');
    const blueColor = rootStyle.getPropertyValue('--blue');
    const greenColor = rootStyle.getPropertyValue('--green');
    const magentaColor = rootStyle.getPropertyValue('--magenta');
    const cyanColor = rootStyle.getPropertyValue('--cyan');
    const bgColor = rootStyle.getPropertyValue('--bg');
    const fgColor = rootStyle.getPropertyValue('--fg');
    const nbgColor = rootStyle.getPropertyValue('--nbg');
    // Create the HTML elements
    let colorInputsContainer = document.createElement('div');
    var createColorInput = (id,labelv,value)=>{
        var inputContainer = document.createElement('p');
        var input = document.createElement('input');
        input.type = 'color';
        input.id = id;
        input.value = value;
        var label = document.createElement('label');
        label.for = id;
        label.textContent = labelv;
        inputContainer.appendChild(input);
        inputContainer.appendChild(label);
        return inputContainer;
    }
    ;
    colorInputsContainer.appendChild(createColorInput('orange-input', 'Orange', orangeColor));
    colorInputsContainer.appendChild(createColorInput('red-input', 'Red', redColor));
    colorInputsContainer.appendChild(createColorInput('blue-input', 'Blue', blueColor));
    colorInputsContainer.appendChild(createColorInput('green-input', 'Green', greenColor));
    colorInputsContainer.appendChild(createColorInput('magenta-input', 'Magenta', magentaColor));
    colorInputsContainer.appendChild(createColorInput('cyan-input', 'Cyan', cyanColor));
    colorInputsContainer.appendChild(createColorInput('bg-input', 'Background', bgColor));
    colorInputsContainer.appendChild(createColorInput('fg-input', 'Foreground', fgColor));
    colorInputsContainer.appendChild(createColorInput('nbg-input', 'Navbar', nbgColor));
    // Append the color inputs container to the DOM
    document.querySelector("div.color-inputs").innerHTML = '';
    document.querySelector("div.color-inputs").appendChild(colorInputsContainer);
}
function regenerateCSSStyles() {
    const colorInputs = document.querySelectorAll('.color-inputs input[type="color"]');
    const cssOutput = document.getElementById('css-styles');
    function formatHexColor(hexColor) {
        // Remove the '#' character
        hexColor = hexColor.replace('#', '');
        // Ensure the color is 6 characters long
        if (hexColor.length === 3) {
            hexColor = hexColor.split('').map(char=>char + char).join('');
        }
        return hexColor;
    }
    function generateCSSStyles() {
        let cssStyles = '';
        if (document.documentElement.getAttribute('theme') == 'dark') {
            cssStyles = '[theme="dark"]:root {\n';
        } else {
            cssStyles = ':root,[theme="light"]:root {\n';
        }
        colorInputs.forEach(input=>{
            const id = input.id.replace('-input', '');
            const value = formatHexColor(input.value);
            cssStyles += `  --${id}: #${value};\n`;
        }
        );
        cssStyles += '}';
        cssOutput.textContent = cssStyles;
        const generatedStyles = document.getElementById('generated-styles');
        generatedStyles.innerHTML = cssStyles;
    }
    colorInputs.forEach(input=>{
        input.addEventListener('input', generateCSSStyles);
    }
    );
    // Set the initial color values
    colorInputs.forEach(input=>{
        input.value = `#${formatHexColor(input.value)}`;
    }
    );
    // Generate initial CSS styles
    generateCSSStyles();
}
csscolorcontainer();
regenerateCSSStyles();

document.querySelectorAll('.drawer').forEach((b) =>{

    b.addEventListener('click', function(e) {
        ta.class.toggle(b,'active')
    })
})