/*******************************************************************************
 *
 *  @file projectile.js A file with the dynamics of projectiles
 *
 *  @author Omar Essilfie-Quaye <omareq08+githubio@gmail.com>
 *  @version 1.0
 *  @date 12-February-2025
 *  @link https://omareq.github.io/tanks/
 *  @link https://omareq.github.io/tanks/docs/
 *
 *******************************************************************************
 *
 *                   GNU General Public License V3.0
 *                   --------------------------------
 *
 *   Copyright (C) 2025 Omar Essilfie-Quaye
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

var TankGame = TankGame || {};

const Struct = (...keys) => ((...v) => keys.reduce((o, k, i) => {o[k] = v[i]; return o} , {}));

TankGame.ProjectileParam = Struct(
    "damage",
    "projectileRadius",
    "explosionRadius",
);

TankGame.ProjectileParamList = {};
TankGame.ProjectileParamList.SmallMissile =  TankGame.ProjectileParam(25, 5, 50);
TankGame.ProjectileParamList.MediumMissile = TankGame.ProjectileParam(50, 5, 75);
TankGame.ProjectileParamList.LargeMissile =  TankGame.ProjectileParam(75, 5, 150);


TankGame.Projectile = class {
    constructor(startPos, starVel, projectileParam) {
        this.pos = startPos.copy();
        this.vel = starVel.copy();
        this.projectileParam = projectileParam;
        this.radius = this.projectileParam.projectileRadius;
        this.mass = PI * this.radius**2;
    };

    isOffScreen() {
        const horizontal = this.pos.x > width || this.pos.x < 0;
        const vertical = this.pos.y > height || this.pos.y < 0;
        return horizontal || vertical;
    }

    update(dt) {
        if(this.isOffScreen()) {
            return;
        }

        this.vel = this.vel.copy().add(tanksGameEngine.gravity.copy().div(dt));
        this.pos = this.pos.copy().add(this.vel.copy());
    };

    draw() {
        push();
        fill(255, 0, 0);
        ellipse(this.pos.x, this.pos.y, 2 * this.radius);
        pop();
    };
};