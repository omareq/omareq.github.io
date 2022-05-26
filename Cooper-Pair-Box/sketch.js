/*******************************************************************************
 *
 *	@file sketch.js Calculate the energy levels of a cooper pair box Quantum Bit (Qubit)
 *
 *	@author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *	@version 1.0
 *	@date 25-May-2022
 *	@link https://omareq.github.io/Cooper-Pair-Box/
 *	@link https://omareq.github.io/Cooper-Pair-Box/docs/
 *
 *****************************************************************************/

/**
 * Handler for the chart js canvas context.
 *
 * @type       {Chart}
 */
 let energyScatterChart;

/**
 * The charging energy set by the slider in the control panel.
 *
 * @type       {number}
 */
 let setChargingEnergy = 70;

 /**
 * Handler for the charging energy slider.
 *
 * @type       {p5.element}
 */
let chargingEnergySlider = undefined;

/**
 * Handler for the paragraphs that displays the current charging energy.
 *
 * @type       {p5.element}
 */
let chargingEnergyDisplay = undefined;

/**
 * The tunnelling energy set by the slider in the control panel.
 *
 * @type       {number}
 */
let setTunnellingEnergy = 20;

/**
 * Handler for the tunnelling energy slider.
 *
 * @type       {p5.element}
 */
let tunnellingEnergySlider = undefined;

/**
 * Handler for the paragraphs that displays the current tunnelling energy.
 *
 * @type       {p5.element}
 */
let tunnellingEnergyisplay = undefined;

/**
 * Function to setup chart js canvases to plot the energy levels of the cooper
 * pair box.
 */
function chartSetup() {
    let ctx = document.getElementById('EnergyChart');
    energyScatterChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: '|0>',
                    data: [],
                    pointRadius: 0,
                    backgroundColor: 'rgba(255, 0, 0, 0.2)',
                    borderColor: 'rgba(255, 0, 0, 0.65)',
                    fill: false
                },
                {
                    label: '|1>',
                    data: [],
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 255, 0, 0.2)',
                    borderColor: 'rgba(0, 255, 0, 0.65)',
                    fill: false
                },
                {
                    label: '|2>',
                    data: [],
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 0, 255, 0.2)',
                    borderColor: 'rgba(0, 0, 255, 0.65)',
                    fill: false,
                    hidden: true
                },
                {
                    label: '|3>',
                    data: [],
                    pointRadius: 0,
                    backgroundColor: 'rgba(255, 0, 255, 0.2)',
                    borderColor: 'rgba(255, 0, 255, 0.65)',
                    fill: false,
                    hidden: true
                },
                {
                    label: '|4>',
                    data: [],
                    pointRadius: 0,
                    backgroundColor: 'rgba(0, 255, 255, 0.2)',
                    borderColor: 'rgba(0, 255, 255, 0.65)',
                    fill: false,
                    hidden: true
                }
            ]
        },
        options: {
            animation: {
                duration: 500 // general animation time
            },
            elements: {
                line: {
                    tension: 0 // disables bezier curves float value 0 to 1
                }
            },
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    scaleLabel: {
                        display: true,
                        labelString: 'Gate Induced Charge'
                      }
                }],
                yAxes: [{
                    // min: -10,
                    // max: 100,
                    scaleLabel: {
                        display: true,
                        labelString: 'Energy'
                    },
                    tooltips: {
                        mode: 'x'
                    }
                }]
            },
            title: {
                display: true,
                text: 'Energy Levels Ec:' + setChargingEnergy
                    + " Ej: " + setTunnellingEnergy
            }
            // showLines: false // disable for all datasets
        }
    });
}

/**
 * Function to plot the energy levels of the cooper pair box.
 */
function chartUpdate() {
    let numEigenVals = 5;
    let x = [];
    let xMin = 0;
    let xMax = 1.2 * numEigenVals;
    let num_elements = 30 * numEigenVals;
    let itt = (xMax - xMin) / num_elements;
    let eigValues = [];
    let i = 0;

    energyScatterChart.options.title.text = 'Energy Levels Ec:' +
        setChargingEnergy +
        " Ej: " + setTunnellingEnergy;

    energyScatterChart.data.datasets[0].data = [];
    energyScatterChart.data.datasets[1].data = [];
    energyScatterChart.data.datasets[2].data = [];
    energyScatterChart.data.datasets[3].data = [];
    energyScatterChart.data.datasets[4].data = [];

    for(let n = xMin; n < xMax; n += itt) {
        let h = hamiltonian(setChargingEnergy,
            setTunnellingEnergy,
            n,
            numEigenVals);

        let ans = math.eigs(h);
        let eig = ans.values;
        let vec = ans.vectors;
        eigValues.push(eig);
        energyScatterChart.data.datasets[0].data.push({
            x:n,
            y:eigValues[i].get([0])
        });
        energyScatterChart.data.datasets[1].data.push({
            x:n,
            y:eigValues[i].get([1])
        });
        energyScatterChart.data.datasets[2].data.push({
            x:n,
            y:eigValues[i].get([2])
        });
        energyScatterChart.data.datasets[3].data.push({
            x:n,
            y:eigValues[i].get([3])
        });
        energyScatterChart.data.datasets[4].data.push({
            x:n,
            y:eigValues[i].get([4])
        });
        i++;
    }
    energyScatterChart.update(0);
    return eigValues;
}

/**
 * Function to calculate the Hamiltonian matrix for a cooper pair box qubit with
 * a given charging energy and tunnelling energy
 *
 * @param      {number}  charging_energy   The charging energy - The energy
 * reuired to either add or subtract a cooper pair from the system
 * @param      {number}  tunnelling_energy  The tunnelling energy - The energy
 * required for a cooper pair to transition form one energy level to another.
 * @param      {number}  [n=0]             The gate induced charge for the
 * cooper pair box.
 * @param      {number}  [states=5]        The number of states the cooper pair
 * box can take.
 * @return     {Array | Matrix}  The Hamiltonian matrix
 */
function hamiltonian(charging_energy, tunnelling_energy, n=0, states=5) {
    ec = charging_energy;
    ej = tunnelling_energy;
    matrix = [];

    for(let y = 0; y < states; y++) {
        row = [];
        for(let x = 0; x < states; x++) {
            if(x ==y) {
                row.push(ec * pow(states - x - n, 2));
            } else if (x == (y + 1) || y == (x + 1)) {
                row.push(-0.5 * ej);
            } else {
                row.push(0);
            }
        }
        matrix.push(row);
    }
    return math.matrix(matrix);
}

/**
 * p5.js setup function, creates canvas.
 */
function setup() {
	let cnvSize;
	if(windowWidth > windowHeight) {
		cnvSize = windowHeight;
	} else {
		cnvSize = windowWidth;
	}
	let cnv = createCanvas(0,0);//cnvSize, 0.7 * cnvSize);
	cnv.parent('sketch');

    chargingEnergyDisplay = createP("Charging Energy (Ec): " +
        str(setChargingEnergy));
    chargingEnergyDisplay.parent("charging-energy-val");

    chargingEnergySlider = createSlider(5, 1000, setChargingEnergy, 5);
    chargingEnergySlider.parent("charging-energy");

    tunnellingEnergyDisplay = createP("Tunnelling Energy (Ej): " +
        str(setTunnellingEnergy));
    tunnellingEnergyDisplay.parent("tunnelling-energy-val");

    tunnellingEnergySlider = createSlider(0, 1000, setTunnellingEnergy, 5);
    tunnellingEnergySlider.parent("tunnelling-energy");

    chartSetup();
    chartUpdate();
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(0);

    let sliderVal = chargingEnergySlider.value();
    if(sliderVal != setChargingEnergy && sliderVal > setTunnellingEnergy) {
        setChargingEnergy = sliderVal;
        chargingEnergyDisplay.elt.innerText = "Charging Energy (Ec): " +
            str(setChargingEnergy);
        chartUpdate();
    }

    sliderVal = tunnellingEnergySlider.value();
    if(sliderVal != setTunnellingEnergy && sliderVal < setChargingEnergy) {
        setTunnellingEnergy = sliderVal;
        tunnellingEnergyDisplay.elt.innerText = "Tunnelling (Ej): " +
            str(setTunnellingEnergy);
        chartUpdate();
    }

}

