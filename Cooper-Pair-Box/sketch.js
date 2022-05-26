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

 let energyScatterChart;

 let setChargingEnergy = 70;

 let setTunnelingEnergy = 20;

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
                duration: 0 // general animation time
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
                    + " Ej: " + setTunnelingEnergy
            }
            // showLines: false // disable for all datasets
        }
    });
}


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
        " Ej: " + setTunnelingEnergy;

    energyScatterChart.data.datasets[0].data = [];
    energyScatterChart.data.datasets[1].data = [];
    energyScatterChart.data.datasets[2].data = [];
    energyScatterChart.data.datasets[3].data = [];
    energyScatterChart.data.datasets[4].data = [];

    for(let n = xMin; n < xMax; n += itt) {
        let h = hamiltonian(setChargingEnergy,
            setTunnelingEnergy,
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
 * @param      {number}  tunneling_energy  The tunneling energy - The energy
 * required for a cooper pair to transition form one energy level to another.
 * @param      {number}  [n=0]             The gate induced charge for the
 * cooper pair box.
 * @param      {number}  [states=5]        The number of states the cooper pair
 * box can take.
 * @return     {Array | Matrix}  The Hamiltonian matrix
 */
function hamiltonian(charging_energy, tunneling_energy, n=0, states=5) {
    ec = charging_energy;
    ej = tunneling_energy;
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

    chartSetup();
    noLoop();
}

/**
 * p5.js draw function, is run every frame to create the desired animation
 */
function draw() {
	background(0);
    chartUpdate();
}

