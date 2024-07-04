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
  Euler: 0,
  VelocityVerlet: 1
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
        this.accArray = [];
        this.forceArray = [];

        for(let i = 0; i < this.numParticles; i++) {
            this.velArray.push(createVector(0, 0));
            this.forceArray.push(createVector(0, 0));
            this.accArray.push(createVector(0, 0));
        }

        this.massArray = massArray;
        this.hookesConstArray = hookesConstArray;
        this.algorithm = algorithm;
    }

    calcForces() {
        const gravitationalAcc = createVector(0, 0.25);
        // const gravitationalAcc = createVector(0, 0);
        this.epe = 0;
        for(let i = 0; i <  this.numParticles; i++) {
            // get force from both directions
            // f = -kx
            let force = createVector(0, 0);
            const gravityForce = gravitationalAcc.copy().mult(this.massArray[i]);

            force.add(gravityForce.copy());
            // console.log("Particle: ", i);
            // console.log("Gravity Force: ", gravityForce);

            // get force between particle and previous one
            if(i > 0) {
                const direction = this.posArray[i-1].copy().sub(this.posArray[i].copy());
                const dist = direction.copy().mag();
                const deltaX = this.interParticleRestLen - dist;
                if(deltaX < 0) {
                    const forceMag = -this.hookesConstArray[i-1] * deltaX;
                    const newForce = direction.copy().setMag(forceMag);
                    // console.log("Elastic Force 1: ", newForce);
                    force.add(newForce.copy());
                }

                this.epe += 0.5 * this.hookesConstArray[i-1] * deltaX**2;
            }

            // get force between particle and next one
            if(i < this.massArray.length - 1) {
                const direction = this.posArray[i+1].copy().sub(this.posArray[i].copy());
                const dist = direction.copy().mag();
                const deltaX = this.interParticleRestLen - dist;
                if(deltaX < 0) {
                    const forceMag = -this.hookesConstArray[i] * deltaX;
                    const newForce = direction.copy().setMag(forceMag);
                    // console.log("Elastic Force 2: ", newForce);
                    force.add(newForce.copy());
                }
            }

            this.forceArray[i] = force.copy();
        }
    }

    updateEuler(dt) {
        this.calcForces();
        let nextPosArray = [];
        for (let i = 0; i < this.numParticles; i++) {
                let force = this.forceArray[i];
                // a = f/m
                this.accArray[i] = force.copy().div(this.massArray[i]);

                // v = v + a * dt
                this.velArray[i].add(this.accArray[i].copy().mult(dt));

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

    updateVelocityVerlet(dt) {
        // update positions
        let nextPosArray = [];
        for (let i = 0; i < this.numParticles; i++) {
            let nextPos = this.posArray[i].copy();
            nextPos.add(this.velArray[i].copy().mult(dt));
            nextPos.add(this.accArray[i].copy().mult(0.5 *dt**2));

            nextPosArray.push(nextPos);
        }

        // save the position values
        for(let i = 0; i < this.numParticles; i++) {
            if (lockFirst && (i == 0)) continue;
            if (lockLast && (i == this.numParticles-1)) continue;

            this.posArray[i] = nextPosArray[i];
        }

        //calculate acceleration from new interaction potential
        this.calcForces();
        let nextAccArray = [];
        for(let i = 0; i < this.numParticles; i++) {
            let force = this.forceArray[i];
                // a = f/m
            nextAccArray.push(force.copy().div(this.massArray[i]));
        }

        // calculate new velocity
        for(let i = 0; i < this.numParticles; i++) {
            let nextVel = this.velArray[i].copy();
            let accTerm = this.accArray[i].copy().add(nextAccArray[i]);
            accTerm.mult(0.5 * dt);
            nextVel.add(accTerm);

            // crude dampening - move to calc forces add force based on vel
            if(dampening) nextVel.mult(0.99995);

            this.velArray[i] = nextVel.copy();
        }

        // Save the acceleration values
        for(let i = 0; i < this.numParticles; i++) {
            this.accArray[i] = nextAccArray[i];
        }
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
    }

    calcKineticEnergy() {
        this.ke = 0;
        for(let i = 0; i < this.numParticles; i++) {
            this.ke += (0.5 * this.massArray[i] * this.velArray[i].magSq());
        }
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

        push();
        strokeWeight(2);
        for(let i = 0; i < this.numParticles; i++) {
            let direction = (this.forceArray[i].copy());
            let strength = direction.mag();
            stroke(int(5*strength) + 50, 0, 0);
            direction.setMag(10);
            line(this.posArray[i].x,
                this.posArray[i].y,
                this.posArray[i].x + direction.x,
                this.posArray[i].y + direction.y);

            ellipse(this.posArray[i].x, this.posArray[i].y,3, 3);
        }
        pop();

        this.calcGravityPotentialEnergy();
        this.calcKineticEnergy();

        console.debug("GPE: ", this.gpe);
        console.debug("KE: ", this.ke);
        console.debug("EPE: ", this.epe);

        console.debug("Total Energy: ", this.gpe + this.ke + this.epe);
    }
};

// Elastic.UniformString = class {
//     /**
//      * Constructor for the Uniform String object.
//      */
//     constructor() {

//     }
// };

