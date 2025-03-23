



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
        const startPos = createVector(0, height / 2);
        const startVel = createVector(5, -5);
        this.testProjectile = new TankGame.Projectile(
            startPos,
            startVel,
            TankGame.ProjectileParamList.SmallMissile);
    };

    /**
     * exits immediately
     */
    update(dt) {
        this.testProjectile.update(dt);
    };

    /**
     * exits immediately
     */
    draw() {
        this.testProjectile.draw();
    };
};