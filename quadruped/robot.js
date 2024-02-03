/*******************************************************************************
 *
 *  @file robot.js A class containing all methods to control a robot model
 *  assembly
 *
 *  @author Omar Essilfie-Quaye <omareq08@gmail.com>
 *  @version 1.0
 *  @date 21-August-2020
 *
 ******************************************************************************/

 // SERVO FULL CLOCKWISE ROTATION FROM ABOVE IS 180 DEGREES
 // AND FULL COUNTER CLOCKWISE ROTATION IS 0 DEGREES

/**
 * This class describes a quadruped robot and all the functions necessary to
 * control the robots pose as well as it's animation.
 *
 * @class      Robot (scale)
 */
class Robot {
    /**
     * Constructs a new instance of Robot.  Will automatically load the required
     * assets to animate the robot.
     *
     * @param      {number}  scale   The scale to animate the quadruped at, the
     *                               obj files naturally are animated with sub
     *                               pixel sizes.
     */
    constructor(scale) {
        // Look for a way to make this a private static const without breaking
        // the linter
        this.gaitStep = {
            RIGHT_FRONT_UP: 0,
            RIGHT_FRONT_TRAVEL: 1,
            RIGHT_FRONT_DOWN: 2,
            LEFT_BACK_UP: 3,
            LEFT_BACK_TRAVEL: 4,
            LEFT_BACK_DOWN: 5,
            LEFT_FRONT_UP: 6,
            LEFT_FRONT_TRAVEL: 7,
            LEFT_FRONT_DOWN: 8,
            RIGHT_BACK_UP: 9,
            RIGHT_BACK_TRAVEL: 10,
            RIGHT_BACK_DOWN:11,
            RETURN_TO_START: 12
        };
        this.base = undefined;
        this.under_base = undefined;
        //right front, left front, right back, left back
        this.servos = [];
        //right front, left front, right back, left back: upper, lower
        this.legs = [];
        this.servoAngles = [];
        this.servoHeight = 0.0361;
        this.servoWidth = 0.02;
        this.servoLength = 0.0405;
        this.coxa_length = 0.0591;
        this.upper_leg_length = 0.13;
        this.lower_leg_length = 0.13;
        this.under_base_width = 0.138;
        this.scale_val = scale;
        this.currentGaitStep = this.gaitStep.RIGHT_FRONT_UP;
        this.partsLoaded = false;

        this.load_parts(); // add error handling
        this.partsLoaded = true;
        console.log("OBJ Assets Loaded Successfully");

        for(let i = 0; i < 12; i++) {
            this.servoAngles[i] = random(0.35 * PI, 0.65 * PI);
        }
    }

    /**
     * Loads the obj parts from the assets folder.
     */
    load_parts() {
        this.base = loadModel("assets/quadruped_base.obj");
        this.under_base = loadModel("assets/quadruped_under_base.obj");
        this.load_servos();
        this.load_legs();
    }

    /**
     * Loads the obj servos from the assets folder.
     */
    load_servos() {
        for(let i = 0; i < 12; i++) {
            this.servos[i] = loadModel("assets/fake_servo.obj");
        }
    }

    /**
     * Loads the upper and lower leg obj files from the assets folder.
     */
    load_legs() {
        for(let i = 0 ; i < 8; i++) {
            if(i % 2 == 0) {
                this.legs[i] = loadModel("assets/upper_leg.obj");
            } else {
                this.legs[i] = loadModel("assets/lower_leg.obj");
            }
        }
    }

    /**
     * Function to write new values to all 12 servos on the quadruped robot. The
     * order of the legs is: right front, left front, right back, left back.  In
     * each leg the order of the servos is: hip yaw, hip elevation and knee.
     * Therefore the first index is the hip yaw for the right front leg and the
     * last index is the knee for the left back leg.
     *
     * @param      {Array<number>}  new_angles  The new servo angles in radians
     *                                          from 0 to PI.
     */
    servos_write(new_angles) {
        if(new_angles.length != 12) {
            console.log("The length of the \"servos_write()\" input param" +
                " \"new_angles\" array should be 12");
            return;
        }

        for(let i = 0; i < 12; i++) {
            if(new_angles[i] < 0 || new_angles[i] > PI) {
                console.log("The element " + str(i) + " in the input params " +
                    "\"new_angles\" of the \"servos_write()\" method should " +
                    "be between 0 and PI");
                return;
            }
        }
        this.servoAngles = new_angles;
    }

    /**
     * Function to write new values to the 3 servos of the right front leg of
     * the robot.  The order of the angles is as follows: hip yaw, hip elevation
     * and knee servo are index from 0-2 respectively.
     *
     * @param      {Array<number>}  new_angles  The new servo angles in radians
     *                                          from 0 to PI.
     */
    rf_servos_write(new_angles) {
        if(new_angles.length != 3) {
            console.log("The length of the \"rf_servos_write()\" input param" +
            " \"new_angles\" array should be 3");
            return;
        }

        for(let i = 0; i < 3; i++) {
            if(new_angles[i] < 0 || new_angles[i] > PI) {
                console.log("The element " + str(i) + " in the input params " +
                    "\"new_angles\" of the \"rf_servos_write()\" method " +
                    "should be between 0 and PI");
                return;
            }
        }
        this.servoAngles[0] = new_angles[0];
        this.servoAngles[1] = new_angles[1];
        this.servoAngles[2] = new_angles[2];
    }

    /**
     * Function to write new values to the 3 servos of the left front leg of
     * the robot.  The order of the angles is as follows: hip yaw, hip elevation
     * and knee servo are index from 0-2 respectively.
     *
     * @param      {Array<number>}  new_angles  The new servo angles in radians
     *                                          from 0 to PI.
     */
    lf_servos_write( new_angles) {
        if(new_angles.length != 3) {
            console.log("The length of the \"lf_servos_write()\" input param" +
                " \"new_angles\" array should be 3");
            return;
        }

        for(let i = 0; i < 3; i++) {
            if(new_angles[i] < 0 || new_angles[i] > PI) {
                console.log("The element " + str(i) + " in the input params " +
                    "\"new_angles\" of the \"lf_servos_write()\" method " +
                    "should be between 0 and PI");
                return;
            }
        }
        this.servoAngles[3] = new_angles[0];
        this.servoAngles[4] = new_angles[1];
        this.servoAngles[5] = new_angles[2];
    }

    /**
     * Function to write new values to the 3 servos of the right back leg of
     * the robot.  The order of the angles is as follows: hip yaw, hip elevation
     * and knee servo are index from 0-2 respectively.
     *
     * @param      {Array<number>}  new_angles  The new servo angles in radians
     *                                          from 0 to PI.
     */
    rb_servos_write(new_angles) {
        if(new_angles.length != 3) {
            console.log("The length of the \"rb_servos_write()\" input param" +
                " \"new_angles\" array should be 3");
            return;
        }

        for(let i = 0; i < 3; i++) {
            if(new_angles[i] < 0 || new_angles[i] > PI) {
                console.log("The element " + str(i) + " in the input params " +
                    "\"new_angles\" of the \"rb_servos_write()\" method " +
                    "should be between 0 and PI");
                return;
            }
        }
        this.servoAngles[6] = new_angles[0];
        this.servoAngles[7] = new_angles[1];
        this.servoAngles[8] = new_angles[2];
    }

    /**
     * Function to write new values to the 3 servos of the left back leg of
     * the robot.  The order of the angles is as follows: hip yaw, hip elevation
     * and knee servo are index from 0-2 respectively.
     *
     * @param      {Array<number>}  new_angles  The new servo angles in radians
     *                                          from 0 to PI.
     */
    lb_servos_write(new_angles) {
        if(new_angles.length != 3) {
            console.log("The length of the \"lb_servos_write()\" input param" +
                " \"new_angles\" array should be 3");
            return;
        }

        for(let i = 0; i < 3; i++) {
            if(new_angles[i] < 0 || new_angles[i] > PI) {
                console.log("The element " + str(i) + " in the input params " +
                    "\"new_angles\" of the \"lb_servos_write()\" method " +
                    "should be between 0 and PI");
                return;
            }
        }
        this.servoAngles[9] = new_angles[0];
        this.servoAngles[10] = new_angles[1];
        this.servoAngles[11] = new_angles[2];
    }

    /**
     * Function to give the angle of all 12 servos of the quadruped robot.  The
     * order of the legs is: right front, left front, right back, left back.  In
     * each leg the order of the servos is: hip yaw, hip elevation and knee.
     * Therefore the first index is the hip yaw for the right front leg and the
     * last index is the knee for the left back leg.
     *
     * @return     {Array<number>}  An array of angle values in radians denoting
     *                              the angles of the: hip yaw, hip elevation
     *                              and the knee servos from index 0-2
     *                              respectively.
     */
    servos_read() {
        return this.servoAngles;
    }

    /**
     * Function to give the angle of the 3 servos of the right front leg of the
     * robot in radians from 0 to PI.
     *
     * @return     {Array<number>}  An array of angle values in radians denoting
     *                              the angles of the: hip yaw, hip elevation
     *                              and the knee servos from index 0-2
     *                              respectively.
     */
    rf_servos_read() {
        let rf_angles = [this.servoAngles[0],
            this.servoAngles[1],
            this.servoAngles[2]];
        return rf_angles;
    }

    /**
     * Function to give the angle of the 3 servos of the left front leg of the
     * robot in radians from 0 to PI.
     *
     * @return     {Array<number>}  An array of angle values in radians denoting
     *                              the angles of the: hip yaw, hip elevation
     *                              and the knee servos from index 0-2
     *                              respectively.
     */
    lf_servos_read() {
        let lf_angles = [this.servoAngles[3],
            this.servoAngles[4],
            this.servoAngles[5]];
        return lf_angles;
    }

    /**
     * Function to give the angle of the 3 servos of the right back leg of the
     * robot in radians from 0 to PI.
     *
     * @return     {Array<number>}  An array of angle values in radians denoting
     *                              the angles of the: hip yaw, hip elevation
     *                              and the knee servos from index 0-2
     *                              respectively.
     */
    rb_servos_read() {
        let rb_angles = [this.servoAngles[6],
            this.servoAngles[7],
            this.servoAngles[8]];
        return rb_angles;
    }

    /**
     * Function to give the angle of the 3 servos of the left back leg of the
     * robot in radians from 0 to PI.
     *
     * @return     {Array<number>}  An array of angle values in radians denoting
     *                              the angles of the: hip yaw, hip elevation
     *                              and the knee servos from index 0-2
     *                              respectively.
     */
    lb_servos_read() {
        let lb_angles = [this.servoAngles[9],
            this.servoAngles[10],
            this.servoAngles[11]];
        return lb_angles;
    }

    //  list of signs to that the IK will match the global reference frame
    //  RF x(+), y(-), z(+) - theta1+half pi+quarter pi, pi-theta2, theta3
    //  LF x(+), y(+), z(+) - theta1+halfpi,             pi-theta2, theta3
    //  RB x(+), y(-), z(+) - theta1+quarter pi,         theta2,    theta3 honestly no clue maybe add an x offset
    //  LB x(), y(), z() -
    IK(pos) {
        if(pos.length != 3) {
            console.log("Robot.IK() pos parameter is meant to have a length " +
                "of 3.  X, Y and Z coordinates in cm.");
            return;
        }

        let x = 0.01 * pos[0];
        let y = 0.01 * pos[1];
        let z = 0.01 * pos[2];
        // Add positional validity checks for out of bounds regions

        let cx = this.coxa_length;
        let fm = this.upper_leg_length;
        let tb = this.lower_leg_length;

        let r2 = x * x + y * y;
        let r = sqrt(r2);
        let alpha = sqrt(pow(z + cx, 2) + r2);

        if(alpha >= 0.999 * (tb + fm)) {
            console.log("Robot.IK() this position is not physically reachable.");
            return;
        }

        let theta1;
        if(x == 0) {
            theta1 = HALF_PI;
        } else {
            theta1 = atan2(y, x);
        }

        let theta2 = acos((alpha * alpha - fm * fm - tb * tb) / (-2 * fm * tb));

        let phi1 = atan2(r, (z + cx));
        let phi2 = asin(sin(theta2) * tb / alpha);
        // let epsilon = 3 * HALF_PI - phi1 - phi2 - theta2;

        let theta3 = PI - phi1 - phi2;

        return [theta1, theta3, theta2];
    }

    rf_IK(pos) {
        let angles = this.IK([pos[0], pos[1], pos[2]]);
        if(angles == undefined) {
            return(this.rf_servos_read());
        }
        return [PI - angles[0] - QUARTER_PI, PI - angles[1], angles[2]];
    }

    lf_IK(pos) {
        let x = -pos[0];
        let y = pos[1];

        let r = sqrt(x*x + y*y);
        let theta = atan2(y, x);
        theta -= QUARTER_PI;

        x = r * sin(theta);
        y = r * cos(theta);

        let angles = this.IK([x, y, pos[2]]);
        if(angles == undefined) {
            return(this.lf_servos_read());
        }
        if(angles[0] < 0) {
            angles[0] += TWO_PI;
        }
        return [PI - angles[0], angles[1], PI - angles[2]];

        // 45 - 180
        // 90 - 135
        // 135- 90
        // 180- 45

        // 225 - theta1
    }

    rb_IK(pos) {
        let angles = this.IK([pos[0], pos[1], pos[2]]);
        if(angles == undefined) {
            return(this.rb_servos_read());
        }

        return [QUARTER_PI - angles[0], angles[1], PI - angles[2]];
    }

    lb_IK(pos) {
        let x = pos[0];
        let y = -pos[1];

        let r = sqrt(x*x + y*y);
        let theta = atan2(y, x);
        theta += PI;

        x = r * sin(theta);
        y = r * cos(theta);

        let angles = this.IK([x, y, pos[2]]);
        if(angles == undefined) {
            return(this.lb_servos_read());
        }
        if(angles[0] < 0) {
            angles[0] += TWO_PI;
        }
        return [PI - angles[0] + QUARTER_PI, PI - angles[1], angles[2]];
    }

    /**
     * Function to calculate the linear interpolation of a set of 3 angles.
     * This is calculated between the start and end sets using the given
     * increment.  The i parameter is the amount to interpolate between the
     * two sets where 0.0 equal to the first set, 0.1 is very near the first
     * set, 0.5 is half-way in between them, and 1.0 is equal to the second set.
     * If the value of i is more than 1.0 or less than 0.0, the number will be
     * calculated accordingly in the ratio of the two given numbers.  This usage
     * however is not recommended as it may lead to servo values that the exceed
     * the specification and are impossible to reach.
     *
     * @param      {Array<number>}  start   The start set of angles in radians
     *                                      between 0 and PI.
     * @param      {Array<number>}  end     The end set of angles in radians
     *                                      between 0 and PI.
     * @param      {number}         i       The increment value, it is suggested
     *                                      that this remains between 0 and 1.
     * @return     {Array<number>}  An array of interpolated angle values.
     */
    lerp_angles(start, end, i) {
        if(start.length != end.length) {
            console.log("\"lerp_angles()\" param float[] \"start\" and params" +
            " float[] \"end\" need to have the same dimensions");
            return start;
        }

        if(start.length != 3) {
            console.log("\"lerp_angles()\" param float[] \"start\" and params" +
            " float[] \"end\" need to have 3 elements");
            return start;
        }

        let lerp_0 = lerp(start[0], end[0], i);
        let lerp_1 = lerp(start[1], end[1], i);
        let lerp_2 = lerp(start[2], end[2], i);
        let lerp_vals = [lerp_0, lerp_1, lerp_2];

        return lerp_vals;
    }

    /**
     * Function to return the quadruped to the seated position with legs
     * above the base and folded neatly.
     *
     * @param      {number}  i       Increment value to determine how close
     *                               to the final position the servos should be.
     *                               Value is given between 0 and 1 with 1 being
     *                               the final position.
     */
    home(i) {
        let rf_end = [HALF_PI, PI, 0];
        let lf_end = [HALF_PI, 0, PI];
        let rb_end = [HALF_PI, 0, PI];
        let lb_end = [HALF_PI, PI, 0];

        let rf_start = this.rf_servos_read();
        let lf_start = this.lf_servos_read();
        let rb_start = this.rb_servos_read();
        let lb_start = this.lb_servos_read();

        this.rf_servos_write(this.lerp_angles(rf_start, rf_end, i));
        this.lf_servos_write(this.lerp_angles(lf_start, lf_end, i));
        this.rb_servos_write(this.lerp_angles(rb_start, rb_end, i));
        this.lb_servos_write(this.lerp_angles(lb_start, lb_end, i));
    }

    /**
     * Function to return the quadruped to the standing position with all servos
     * at 90 degrees, or HALF_PI radians.
     *
     * @param      {number}  i       Increment value to determine how close
     *                               to the final position the servos should be.
     *                               Value is given between 0 and 1 with 1 being
     *                               the final position.
     */
    stand90(i) {
        let rf_end = [HALF_PI, HALF_PI, HALF_PI];
        let lf_end = [HALF_PI, HALF_PI, HALF_PI];
        let rb_end = [HALF_PI, HALF_PI, HALF_PI];
        let lb_end = [HALF_PI, HALF_PI, HALF_PI];

        let rf_start = this.rf_servos_read();
        let lf_start = this.lf_servos_read();
        let rb_start = this.rb_servos_read();
        let lb_start = this.lb_servos_read();

        this.rf_servos_write(this.lerp_angles(rf_start, rf_end, i));
        this.lf_servos_write(this.lerp_angles(lf_start, lf_end, i));
        this.rb_servos_write(this.lerp_angles(rb_start, rb_end, i));
        this.lb_servos_write(this.lerp_angles(lb_start, lb_end, i));
    }

    /**
     * Function to control the motion of the robot.  The order of the control
     * parameters in the array are as follows:
     *   [0] walking x          [1] walking y            [2] walking rotation
     *   [3] static offset x    [4] static offset y      [5] static offset z
     *   [6] static offset yaw  [7] static offset pitch  [8] static offset roll
     *
     * @param      {Array<number>}  control  The control values array
     * @param      {number}         i        Increment value
     * @return     {boolean}        Success condition depending on correct input
     *                              parameters and valid servo motions.
     */
    walk(control, i) {
        if(control.length != 9) {
            return false;
        }

        // add validity checks on control data

        let walkX = control[0];
        let walkY = control[1];
        let walkR = control[2];

        let staticX = control[3];
        let staticY = control[4];
        let staticZ = control[5];

        let staticYaw = control[6];
        let staticPitch = control[7];
        let staticRoll = control[8];

        let delta_theta = control[0] * 0.15 * PI;

        let rf_start = this.rf_servos_read();
        let lb_start = this.lb_servos_read();
        let lf_start = this.lf_servos_read();
        let rb_start = this.rb_servos_read();

        let rf_end, lb_end, lf_end, rb_end;

        if (control[0] != 0) {
            switch(this.currentGaitStep) {
                //right front
                case this.gaitStep.RIGHT_FRONT_UP:
                    rf_end = [HALF_PI + staticYaw,
                        3 * QUARTER_PI,
                        QUARTER_PI];

                    this.rf_servos_write(this.lerp_angles(rf_start, rf_end, i));
                    break;
                case this.gaitStep.RIGHT_FRONT_TRAVEL:
                    rf_end = [HALF_PI + staticYaw - delta_theta,
                        3 * QUARTER_PI,
                        QUARTER_PI];

                    this.rf_servos_write(this.lerp_angles(rf_start, rf_end, i));
                    break;
                case this.gaitStep.RIGHT_FRONT_DOWN:
                    rf_end = [HALF_PI + staticYaw - delta_theta,
                        HALF_PI,
                        HALF_PI];

                    this.rf_servos_write(this.lerp_angles(rf_start, rf_end, i));
                    break;
                // left back
                case this.gaitStep.LEFT_BACK_UP:
                    lb_end = [HALF_PI + staticYaw,
                        3 * QUARTER_PI,
                        QUARTER_PI];

                    this.lb_servos_write(this.lerp_angles(lb_start, lb_end, i));
                    break;
                case this.gaitStep.LEFT_BACK_TRAVEL:
                    lb_end = [HALF_PI + staticYaw + delta_theta,
                        3 * QUARTER_PI,
                        QUARTER_PI];

                    this.lb_servos_write(this.lerp_angles(lb_start, lb_end, i));
                    break;
                case this.gaitStep.LEFT_BACK_DOWN:
                    lb_end = [HALF_PI + staticYaw + delta_theta,
                        HALF_PI,
                        HALF_PI];

                    this.lb_servos_write(this.lerp_angles(lb_start, lb_end, i));
                    break;
                // left front
                case this.gaitStep.LEFT_FRONT_UP:
                    lf_end = [HALF_PI + staticYaw,
                        QUARTER_PI,
                        3 * QUARTER_PI];

                    this.lf_servos_write(this.lerp_angles(lf_start, lf_end, i));
                    break;
                case this.gaitStep.LEFT_FRONT_TRAVEL:
                    lf_end = [HALF_PI + staticYaw + delta_theta,
                        QUARTER_PI,
                        3 * QUARTER_PI];

                    this.lf_servos_write(this.lerp_angles(lf_start, lf_end, i));
                    break;
                case this.gaitStep.LEFT_FRONT_DOWN:
                    lf_end = [HALF_PI + staticYaw + delta_theta,
                        HALF_PI,
                        HALF_PI];

                    this.lf_servos_write(this.lerp_angles(lf_start, lf_end, i));
                    break;
                // right back
                case this.gaitStep.RIGHT_BACK_UP:
                    rb_end = [HALF_PI + staticYaw ,
                        QUARTER_PI,
                        3 * QUARTER_PI];

                    this.rb_servos_write(this.lerp_angles(rb_start, rb_end, i));
                    break;
                case this.gaitStep.RIGHT_BACK_TRAVEL:
                    rb_end = [HALF_PI + staticYaw - delta_theta,
                    QUARTER_PI,
                    3 * QUARTER_PI];

                    this.rb_servos_write(this.lerp_angles(rb_start, rb_end, i));
                    break;
                case this.gaitStep.RIGHT_BACK_DOWN:
                    rb_end = [HALF_PI + staticYaw - delta_theta,
                        HALF_PI,
                        HALF_PI];

                    this.rb_servos_write(this.lerp_angles(rb_start, rb_end, i));
                    break;
                // return to start
                case this.gaitStep.RETURN_TO_START:
                    rf_end = [HALF_PI + staticYaw, HALF_PI, HALF_PI];
                    lf_end = [HALF_PI + staticYaw, HALF_PI, HALF_PI];
                    rb_end = [HALF_PI + staticYaw, HALF_PI, HALF_PI];
                    lb_end = [HALF_PI + staticYaw, HALF_PI, HALF_PI];

                    this.rf_servos_write(this.lerp_angles(rf_start, rf_end, i));
                    this.lf_servos_write(this.lerp_angles(lf_start, lf_end, i));
                    this.rb_servos_write(this.lerp_angles(rb_start, rb_end, i));
                    this.lb_servos_write(this.lerp_angles(lb_start, lb_end, i));
                    break;
            }
        }

        if(i >= 1) {
            this.currentGaitStep++;
            if(this.currentGaitStep > 12) {
                this.currentGaitStep = 0;
            }
        }

        return true;
    }

    /**
     * Draws the robot on the canvas.
     *
     * @param      {number}  tx      x translation parameter in pixels.
     * @param      {number}  ty      y translation parameter in pixels.
     * @param      {number}  tz      z translation parameter in pixels.
     * @param      {number}  rx      Rotation around the x axis in radians.
     * @param      {number}  ry      Rotation around the y axis in radians.
     * @param      {number}  rz      Rotation around the z axis in radians.
     */
    draw(tx, ty, tz, rx, ry, rz) {
        if(!this.partsLoaded) {
            console.log("The obj assets were not loaded correctly." +
                "  The robot can not be drawn at this time.");
            return;
        }

        fill(0);
        push();
        scale(this.scale_val);
        translate(tx, ty, tz);
        rotateX(rx);
        rotateY(ry);
        rotateZ(rz);

        push();
        stroke(255);
        strokeWeight(2.5);
        let y_line = 0.3 * this.servoHeight;
        line(0, -y_line, 0, 0, -y_line, -this.servoLength);
        pop();
        noStroke();
        this.base_draw();
        this.under_base_draw();
        this.rf_draw();
        this.lf_draw();
        this.rb_draw();
        this.lb_draw();
        pop();
    }

    /**
     * Draws the top base plate of the robot on the canvas.
     */
    base_draw() {
        push();
        model(this.base);
        pop();
    }

    /**
     * Draws the bottom base plate of the robot on the canvas.
     */
    under_base_draw() {
        push();
        translate(0,this.servoHeight - 0.0035,0);
        model(this.under_base);
        pop();
    }

    /**
     * Draws the right front leg of the robot on the canvas.
     */
    rf_draw() {
        push();
        translate(this.under_base_width/2 - this.servoLength*sin(PI/4),
            0, -this.under_base_width/2 + this.servoLength*sin(PI/4));//+,0,-
        rotateY(PI/4);//pi/4
        translate(0,this.servoHeight/2, 0);
        push();
        fill(125);
        model(this.servos[0]);
        pop();
        push();
        translate(0, - this.servoHeight, 0);
        rotateY((PI - this.servoAngles[0]) - HALF_PI); // control angle for hip + is forward and - is backward
        rotateX(HALF_PI);
        push();
        fill(125);
        model(this.servos[1]);
        pop();
        push();
        translate(0.5 * this.servoLength, -1.5 * this.servoWidth, 0);
        rotateY(PI - this.servoAngles[1]); //control angle for upper leg + is down and - is up
        push();
        fill(0);
        model(this.legs[0]);
        pop();
        push();
        translate(0, 0, 0.625 * this.upper_leg_length);
        //lower servo
        push();
        translate(0, this.servoWidth, 0);
        rotateY(HALF_PI);
        push();
        fill(125);
        model(this.servos[2]);
        pop();
        pop();
        // lower leg
        push();
        translate(0,- 0.35 * this.servoWidth,0);
        rotateY(PI + PI - this.servoAngles[2]); //control angle for lower leg - is down + is up
        rotateX(-PI);
        push();
        fill(125);
        model(this.legs[1]);
        pop();
        pop();
        pop();
        pop();
        pop();
        pop();
    }

    /**
     * Draws the left front leg of the robot on the canvas.
     */
    lf_draw() {
        push();
        translate(-this.under_base_width/2 + this.servoLength*sin(PI/4),
            0, -this.under_base_width/2 + this.servoLength*sin(PI/4)); //-,0,-
        rotateY(-PI/4);//-pi/4
        translate(0, this.servoHeight/2,0);
        push();
        fill(125);
        model(this.servos[3]);
        pop();
        push();
        translate(0, -this.servoHeight, 0);
        rotateY((PI -this.servoAngles[3]) - HALF_PI); // control angle for hip - is forward and + is backward
        rotateX(HALF_PI);
        push();
        fill(125);
        model(this.servos[4]);
        pop();
        push();
        translate(-0.5 * this.servoLength, -1.5 * this.servoWidth, 0);
        rotateY(-this.servoAngles[4]); //control angle for upper leg - is down and + is up
        push();
        fill(0);
        model(this.legs[2]);
        pop();
        push();
        translate(0, 0, 0.625 * this.upper_leg_length);
        //lower servo
        push();
        translate(0, this.servoWidth, 0);
        rotateY(HALF_PI);
        push();
        fill(125);
        model(this.servos[5]);
        pop();
        pop();
        // lower leg
        push();
        translate(0, -0.35 * this.servoWidth,0);
        rotateY(-this.servoAngles[5]); //control angle for lower leg - is down + is up
        //rotateZ(0);
        push();
        fill(125);
        model(this.legs[3]);
        pop();
        pop();
        pop();
        pop();
        pop();
        pop();
    }

    /**
     * Draws the right back leg of the robot on the canvas.
     */
    rb_draw() {
        push();
        translate(this.under_base_width/2 - this.servoLength*sin(PI/4),
            0, this.under_base_width/2 - this.servoLength*sin(PI/4)); //+,0,+
        rotateY(-PI/4);//-pi/4
        translate(0, this.servoHeight/2,0);
        push();
        fill(125);
        model(this.servos[0]);
        pop();
        push();
        translate(0, - this.servoHeight, 0);
        rotateY((PI - this.servoAngles[6]) - HALF_PI); // control angle for hip - is forward and + is backward
        rotateX(HALF_PI);
        push();
        fill(125);
        model(this.servos[4]);
        pop();
        push();
        translate(0.5 * this.servoLength, 0.9* this.servoWidth, 0);
        rotateY(this.servoAngles[7]); //control angle for upper leg - is down and + is up
        push();
        fill(0);
        model(this.legs[2]);
        pop();
        push();
        translate(0, 0, 0.625 * this.upper_leg_length);
        //lower servo
        push();
        translate(0, -0.8* this.servoWidth, 0);
        rotateY(HALF_PI);
        push();
        fill(125);
        model(this.servos[5]);
        pop();
        pop();
        // lower leg
        push();
        translate(0, 0.35 * this.servoWidth, 0);
        rotateY(PI + this.servoAngles[8]); //control angle for lower leg + is down - is up
        rotateX(PI);
        push();
        fill(125);
        model(this.legs[3]);
        pop();
        pop();
        pop();
        pop();
        pop();
        pop();
    }

    /**
     * Draws the left back leg of the robot on the canvas.
     */
    lb_draw() {
        push();
        translate(-this.under_base_width/2 + this.servoLength * sin(PI/4),
            0, this.under_base_width/2 - this.servoLength*sin(PI/4)); //-,0,+
        rotateY(PI/4);//pi/4
        translate(0, this.servoHeight/2,0);
        push();
        fill(125);
        model(this.servos[0]);
        pop();

        push();
        translate(0, -this.servoHeight, 0);
        rotateY((PI - this.servoAngles[9]) - HALF_PI); // control angle for hip - is forward and + is backward
        rotateX(HALF_PI);
        push();
        fill(125);
        model(this.servos[4]);
        pop();

        push();
        translate(-0.5 * this.servoLength, 0.9 * this.servoWidth, 0);
        rotateY(PI + this.servoAngles[10]); //control angle for upper leg - is down and + is up
        rotateY(0);
        push();
        fill(0);
        model(this.legs[2]);
        pop();

        push();
        translate(0, 0, 0.625 * this.upper_leg_length);
        //lower servo
        push();
        translate(0, -0.8 * this.servoWidth, 0);
        rotateY(HALF_PI);
        push();
        fill(125);
        model(this.servos[5]);
        pop();
        pop();

        // lower leg
        push();
        translate(0, 0.35 * this.servoWidth,0);
        rotateY(PI + this.servoAngles[11]); //control angle for lower leg + is down - is up
        rotateX(0);
        push();
        fill(125);
        model(this.legs[3]);
        pop();
        pop();

        pop();
        pop();
        pop();

        pop();
    }
}