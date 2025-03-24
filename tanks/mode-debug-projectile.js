



/**
 * Class empty mode that doesn't do anything.
 *
 * @see TankGame.Mode
 */
TankGame.ModeList.DebugProjectile = class extends TankGame.Mode {
    /**
     * Calls super() and exits
     */
    constructor() {
        super();
        console.debug("Start the Debug Projectile Mode");
        this.startSpeed = 100;
    };

    /**
     * exits immediately
     */
    update(dt) {
        if(this.gameEngine.projectiles.length==0) {
            const startPos = createVector(2, 0.75 * height);
            const speed = this.startSpeed;
            this.startSpeed -= 10;
            if(this.startSpeed <= 10) {
                this.startSpeed = 100;
            }
            const bearing = 45;
            const testProjectile = new TankGame.Projectile(
                startPos,
                speed,
                bearing,
                TankGame.ProjectileParamList.SmallMissile);

            this.gameEngine.addProjectile(testProjectile);
        }
    };

    /**
     * exits immediately
     */
    draw() {
    };
};