/*******************************************************************************
 *
 *  @file string.js A quick simulation to test elasticity
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 02-July-2024
 *  @link https://omareq.github.io/elastic-string/
 *  @link https://omareq.github.io/elastic-string/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2024 Omar Essilfie-Quaye
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of the GNU General Public License as published by
 *   the Free Software Foundation, either version 3 of the License, or
 *   (at your option) any later version.
 *
 *   This program is distributed in the hope that it will be useful,
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *   GNU General Public License for more details.
 *
 *   You should have received a copy of the GNU General Public License
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *****************************************************************************/
"use strict";

/**
 * Elastic Namespace Object
 */
var Elastic = Elastic || {};

Elastic.Algorithm = Object.freeze({
  Euler: "Euler",
  VelocityVerlet: "VelocityVerlet"
});

Elastic.String = class {
    /**
     * Constructor for the String object.
     */
    constructor(length, posArray, massArray, hookesConstArray,
        algorithm=Elastic.Algorithm.Euler) {
        this.length = length;
        this.numParticles = posArray.length;
        this.interParticleRestLen = this.length / this.numParticles;
        this.posArray = posArray;
        this.velArray = [];
        for(let i = 0; i < this.numParticles; i++) {
            this.velArray.push(createVector(0, 0));
        }

        this.massArray = massArray;
        this.hookesConstArray = hookesConstArray;
        this.algorithm = algorithm;
    }

    updateEuler(dt) {
        let nextPosArray = [];
        this.epe = 0;
        for (let i = 0; i < this.numParticles; i++) {
                // get force from both directions
                // f = -kx
                let force = createVector(0, 0);
                const gravitationalAcc = createVector(0, 5);
                const gravityForce = gravitationalAcc.copy().mult(this.massArray[i]);

                force.add(gravityForce);
                // console.log("Gravity Force: ", gravityForce);

                // get force between particle and previous one
                if(i > 0) {
                    const direction = this.posArray[i-1].copy().sub(this.posArray[i]);
                    const dist = direction.copy().mag();
                    const x = this.interParticleRestLen - dist;
                    const forceMag = -this.hookesConstArray[i-1] * x;
                    const newForce = direction.copy().setMag(forceMag);
                    // console.log("Elastic Force 1: ", newForce);
                    force.add(newForce.copy());

                    this.epe += 0.5 *this.hookesConstArray[i-1] * x*x;
                }

                // get force between particle and next one
                if(i < this.massArray.length - 2) {
                    const direction = this.posArray[i+1].copy().sub(this.posArray[i]);
                    const dist = direction.copy().mag();
                    const x = this.interParticleRestLen - dist;
                    const forceMag = -this.hookesConstArray[i] * x;
                    const newForce = direction.copy().setMag(forceMag);
                    // console.log("Elastic Force 2: ", newForce);
                    force.add(newForce.copy());
                }

                // a = f/m
                const acc = force.copy().div(this.massArray[i]);

                // v = v + a * dt
                this.velArray[i].add(acc.copy().mult(dt));

                // p = p + v * dt
                nextPosArray.push(
                    this.posArray[i].copy().add(this.velArray[i].copy().mult(dt))
                    );
            }

            for(let i = 0; i < this.numParticles; i++) {
                if(i == 0 || i == this.numParticles-1) {
                    continue;
                }
                this.posArray[i] = nextPosArray[i];
            }
            return;
    }

    update(dt) {
        if(this.algorithm == Elastic.Algorithm.Euler) {
            this.updateEuler(dt);
        }

        if(this.algorithm == Elastic.Algorithm.VelocityVerlet) {
            this.updateVelocityVerlet(dt);
        }
    }

    calcGravityPotentialEnergy() {
        this.gpe = 0;
        for(let i = 0; i < this.numParticles; i++) {
            this.gpe += (- this.posArray[i].y) * this.massArray[i];
        }
        console.log("GPE: ", this.gpe);
    }

    calcKineticEnergy() {
        this.ke = 0;
        for(let i = 0; i < this.numParticles; i++) {
            this.ke += (0.5 * this.massArray[i] * this.velArray[i].magSq());
        }
        console.log("KE: ", this.ke);
    }

    draw() {
        push();
        noFill();
        stroke(255);
        strokeWeight(4);
        beginShape();
        for(let i = 0; i < this.numParticles; i++) {
            vertex(this.posArray[i].x, this.posArray[i].y);
        }
        endShape();
        pop();

        this.calcGravityPotentialEnergy();
        this.calcKineticEnergy();

        console.log("Total Energy: ", this.gpe + this.ke + this.epe);
    }
};

// Elastic.UniformString = class {
//     /**
//      * Constructor for the Uniform String object.
//      */
//     constructor() {

//     }
// };

