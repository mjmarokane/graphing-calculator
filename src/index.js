/*jshint esversion: 6*/

//error codes
const ERR_DOMAIN = 1;

let numFunctions = 1;
let colors = ['#0000ff', '#cc00cc', '#1aff1a', '#ff6600', '#3399ff', '#ff0000', '#182844'];

let defaultData = () => {
    let functionExp = math.compile("");
    let xValues = math.range(-6, 6, 0.01).toArray();
    let yValues = xValues.map( (x) => functionExp.evaluate({x: x}));

    return [{
        x: xValues,
        y: yValues,
        type: 'scatter'
    }];
};

let layout = {
    autosize: false,
    width: 900,
    height: 550,
    margin: {
      l: 50,
      r: 50,
      b: 35,
      t: 10,
      pad: 4
    }
  };

let init = () => {
    Plotly.newPlot("graph", defaultData(), layout);
};

let checkFuncErrs = (mathFunction) => {
    //check domain errors
    let domainMin = mathFunction.querySelector(".domain-min");
    let domainMax = mathFunction.querySelector(".domain-max");
    if (parseFloat(domainMin.value) >= parseFloat(domainMax.value)){
        domainMin.setAttribute("data-error", `${ERR_DOMAIN}`);
        domainMax.setAttribute("data-error", `${ERR_DOMAIN}`);
    }
};

let resetFuncErrs = (mathFunction) => {
    //clear domain errors
    mathFunction.querySelector(".domain-min").setAttribute("data-error", `0`);
    mathFunction.querySelector(".domain-max").setAttribute("data-error", `0`);
    //clear function validity erros
    mathFunction.querySelector(".func-exp").setAttribute("data-valid", "true");
};

let matchFuncColors = (mathFunction, color) => {
    mathFunction.querySelectorAll("input").forEach((input) => {
        input.style = "border: 1px solid " + color + ";";
    });
};

let draw = (functions) => {
    functions.forEach( (mathFunction, i) => {
        resetFuncErrs(mathFunction);
        try {
        let functionExp = math.compile(mathFunction.querySelector(`.func-exp`).value);
        let domainMin = mathFunction.querySelector(`.domain-min`).value;
        let domainMax = mathFunction.querySelector(`.domain-max`).value;

        checkFuncErrs(mathFunction);

        let xValues = math.range(domainMin, domainMax, 0.01).toArray();
        let yValues = xValues.map( (x) => functionExp.evaluate({x: x}));

        let graphData = [{
            x: xValues,
            y: yValues,
            name: "",
            marker: {
            color: colors[i % colors.length]
            },
            type: 'scatter'
        }];

        Plotly.plot("graph", graphData);
        matchFuncColors(mathFunction, colors[i % colors.length]);
        }
        catch (err) {
            console.log(err);
            mathFunction.querySelector(".func-exp").setAttribute("data-valid", "false");
        }
    });
    
};

document.querySelector("#functions").onsubmit = (e) => {
    e.preventDefault();
    replotAll();
};

replotAll = () => {
    Plotly.newPlot("graph", layout);
    let functions = document.querySelectorAll(".function");
    draw(functions);
};

document.querySelector("#add-more").onclick = () => {
    numFunctions++;

    let newFunction = document.createElement("div");
    let existingFunctions = document.querySelector("#functions");

    newFunction.setAttribute("class", "function");
    newFunction.setAttribute("id", "function-" + numFunctions);
    newFunction.innerHTML = `<i class="remove-func" id="remove-func-${numFunctions}" aria-hidden="true">&times;</i>
                            <label for="func-exp-${numFunctions}" >y=</label><input type="text" data-valid="true" 
                            class="func-exp" id="func-exp-${numFunctions}">
                            <input type="number" value="-6" class="domain domain-min" id="domain-min-${numFunctions}">
                            <span>&le;x&le;</span>
                            <input type="number" value="6" class="domain domain-max" id="domain-max-${numFunctions}">`;
    existingFunctions.insertBefore(newFunction, document.querySelector("#add-more"));
    newFunction.querySelector("#remove-func-" + numFunctions).addEventListener("click", removeFunction);
};

removeFunction = (event) => {
    if (numFunctions <= 1) { return; }
    numFunctions--;
    let allFunctions = document.querySelector("#functions");
    let thisFunction = document.querySelector("#" + event.target.parentNode.getAttribute("id"));
    allFunctions.removeChild(thisFunction);
    replotAll();
};

init();