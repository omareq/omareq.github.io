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
        this.base = undefined;
        this.under_base = undefined;
        //right front, left front, right back, left back
        this.servos = [];
        //right front, left front, right back, left back: upper, lower
        this.legs = [];
        this.servo_angles = [];
        this.servo_height = 0.0361;
        this.servo_width = 0.02;
        this.servo_length = 0.0405;
        this.upper_leg_length = 0.13;
        this.lower_leg_length = 0.13;
        this.under_base_width = 0.138;
        this.scale_val = scale;
        this.gait_step = 0;
        this.partsLoaded = false;

        this.load_parts(); // add error handling
        this.partsLoaded = true;
        console.log("OBJ Assets Loaded Successfully");

        for(let i = 0; i < 12; i++) {
            this.servo_angles[i] = random(0.35 * PI, 0.65 * PI);
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
        this.servo_angles = new_angles;
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
        this.servo_angles[0] = new_angles[0];
        this.servo_angles[1] = new_angles[1];
        this.servo_angles[2] = new_angles[2];
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
        this.servo_angles[3] = new_angles[0];
        this.servo_angles[4] = new_angles[1];
        this.servo_angles[5] = new_angles[2];
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
        this.servo_angles[6] = new_angles[0];
        this.servo_angles[7] = new_angles[1];
        this.servo_angles[8] = new_angles[2];
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
        this.servo_angles[9] = new_angles[0];
        this.servo_angles[10] = new_angles[1];
        this.servo_angles[11] = new_angles[2];
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
        return this.servo_angles;
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
        let rf_angles = [this.servo_angles[0],
            this.servo_angles[1],
            this.servo_angles[2]];
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
        let lf_angles = [this.servo_angles[3],
            this.servo_angles[4],
            this.servo_angles[5]];
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
        let rb_angles = [this.servo_angles[6],
            this.servo_angles[7],
            this.servo_angles[8]];
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
        let lb_angles = [this.servo_angles[9],
            this.servo_angles[10],
            this.servo_angles[11]];
        return lb_angles;
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
        let rf_end = [HALF_PI, PI, PI];
        let lf_end = [HALF_PI, 0, PI];
        let rb_end = [HALF_PI, 0, PI];
        let lb_end = [HALF_PI, PI, PI];

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
        let itt = i * HALF_PI;
        let rf_vals = [HALF_PI, PI - itt, PI - itt];
        this.rf_servos_write(rf_vals);

        let lf_vals = [HALF_PI, itt, PI - itt];
        this.lf_servos_write(lf_vals);

        let rb_vals = [HALF_PI, itt, PI - itt];
        this.rb_servos_write(rb_vals);

        let lb_vals = [HALF_PI, PI - itt, PI - itt];
        this.lb_servos_write(lb_vals);
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

        if (control[0] != 0) {

            //right front
            if(this.gait_step == 0) {
                let rf_start = this.rf_servos_read();
                let rf_end = [0.50 * PI + staticYaw, 0.75 * PI, 0.75 * PI];

                this.rf_servos_write(this.lerp_angles(rf_start, rf_end, i));
            } else if(this.gait_step == 1) {
                let rf_start = this.rf_servos_read();
                let rf_end = [0.50 * PI + staticYaw - delta_theta, 0.75 * PI, 0.75 * PI];

                this.rf_servos_write(this.lerp_angles(rf_start, rf_end, i));
            } else if(this.gait_step == 2) {
                let rf_start = this.rf_servos_read();
                let rf_end = [0.50 * PI + staticYaw - delta_theta, 0.50 * PI, 0.50 * PI];

                this.rf_servos_write(this.lerp_angles(rf_start, rf_end, i));

            // left back
            } else if(this.gait_step == 3) {
                let lb_start = this.lb_servos_read();
                let lb_end = [0.50 * PI + staticYaw, 0.75 * PI, 0.75 * PI];

                this.lb_servos_write(this.lerp_angles(lb_start, lb_end, i));
            } else if(this.gait_step == 4) {
                let lb_start = this.lb_servos_read();
                let lb_end = [0.50 * PI + staticYaw + delta_theta, 0.75 * PI, 0.75 * PI];

                this.lb_servos_write(this.lerp_angles(lb_start, lb_end, i));
            } else if(this.gait_step == 5) {
                let lb_start = this.lb_servos_read();
                let lb_end = [0.50 * PI + staticYaw + delta_theta, 0.50 * PI, 0.50 * PI];

                this.lb_servos_write(this.lerp_angles(lb_start, lb_end, i));

            // left front
            } else if(this.gait_step == 6) {
                let lf_start = this.lf_servos_read();
                let lf_end = [0.50 * PI + staticYaw, 0.25 * PI, 0.75 * PI];

                this.lf_servos_write(this.lerp_angles(lf_start, lf_end, i));
            } else if(this.gait_step == 7) {
                let lf_start = this.lf_servos_read();
                let lf_end = [0.50 * PI + staticYaw + delta_theta, 0.25 * PI, 0.75 * PI];

                this.lf_servos_write(this.lerp_angles(lf_start, lf_end, i));
            } else if(this.gait_step == 8) {
                let lf_start = this.lf_servos_read();
                let lf_end = [0.50 * PI + staticYaw + delta_theta, 0.50 * PI, 0.50 * PI];

                this.lf_servos_write(this.lerp_angles(lf_start, lf_end, i));

            // right back
            } else if(this.gait_step == 9) {
                let rb_start = this.rb_servos_read();
                let rb_end = [0.50 * PI + staticYaw , 0.25 * PI, 0.75 * PI];

                this.rb_servos_write(this.lerp_angles(rb_start, rb_end, i));
            } else if(this.gait_step == 10) {
                let rb_start = this.rb_servos_read();
                let rb_end = [0.50 * PI + staticYaw - delta_theta, 0.25 * PI, 0.75 * PI];

                this.rb_servos_write(this.lerp_angles(rb_start, rb_end, i));
            } else if(this.gait_step == 11) {
                let rb_start = this.rb_servos_read();
                let rb_end = [0.50 * PI + staticYaw - delta_theta, 0.50 * PI, 0.50 * PI];

                this.rb_servos_write(this.lerp_angles(rb_start, rb_end, i));

            // return to start
            } else if(this.gait_step == 12) {
                let rf_start = this.rf_servos_read();
                let lf_start = this.lf_servos_read();
                let rb_start = this.rb_servos_read();
                let lb_start = this.lb_servos_read();
                let rf_end = [0.5 * PI + staticYaw, 0.5 * PI, 0.5 * PI];
                let lf_end = [0.5 * PI + staticYaw, 0.5 * PI, 0.5 * PI];
                let rb_end = [0.5 * PI + staticYaw, 0.5 * PI, 0.5 * PI];
                let lb_end = [0.5 * PI + staticYaw, 0.5 * PI, 0.5 * PI];

                this.rf_servos_write(this.lerp_angles(rf_start, rf_end, i));
                this.lf_servos_write(this.lerp_angles(lf_start, lf_end, i));
                this.rb_servos_write(this.lerp_angles(rb_start, rb_end, i));
                this.lb_servos_write(this.lerp_angles(lb_start, lb_end, i));
            }
        }

        if(i >= 1) {
            this.gait_step++;
            if(this.gait_step > 12) {
                this.gait_step = 0;
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
        let y_line = 0.3 * this.servo_height;
        line(0, -y_line, 0, 0, -y_line, -this.servo_length);
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
        translate(0,this.servo_height - 0.0035,0);
        model(this.under_base);
        pop();
    }

    /**
     * Draws the right front leg of the robot on the canvas.
     */
    rf_draw() {
        push();
        translate(this.under_base_width/2 - this.servo_length*sin(PI/4),
            0, -this.under_base_width/2 + this.servo_length*sin(PI/4));//+,0,-
        rotateY(PI/4);//pi/4
        translate(0,this.servo_height/2, 0);
        push();
        fill(125);
        model(this.servos[0]);
        pop();
        push();
        translate(0, - this.servo_height, 0);
        rotateY((PI - this.servo_angles[0]) - HALF_PI); // control angle for hip + is forward and - is backward
        rotateX(HALF_PI);
        push();
        fill(125);
        model(this.servos[1]);
        pop();
        push();
        translate(0.5 * this.servo_length, -1.5 * this.servo_width, 0);
        rotateY(PI - this.servo_angles[1]); //control angle for upper leg + is down and - is up
        push();
        fill(0);
        model(this.legs[0]);
        pop();
        push();
        translate(0, 0, 0.625 * this.upper_leg_length);
        //lower servo
        push();
        translate(0, this.servo_width, 0);
        rotateY(HALF_PI);
        push();
        fill(125);
        model(this.servos[2]);
        pop();
        pop();
        // lower leg
        push();
        translate(0,- 0.35 * this.servo_width,0);
        rotateY(PI + this.servo_angles[2]); //control angle for lower leg - is down + is up
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
        translate(-this.under_base_width/2 + this.servo_length*sin(PI/4),
            0, -this.under_base_width/2 + this.servo_length*sin(PI/4)); //-,0,-
        rotateY(-PI/4);//-pi/4
        translate(0, this.servo_height/2,0);
        push();
        fill(125);
        model(this.servos[3]);
        pop();
        push();
        translate(0, -this.servo_height, 0);
        rotateY((PI -this.servo_angles[3]) - HALF_PI); // control angle for hip - is forward and + is backward
        rotateX(HALF_PI);
        push();
        fill(125);
        model(this.servos[4]);
        pop();
        push();
        translate(-0.5 * this.servo_length, -1.5 * this.servo_width, 0);
        rotateY(-this.servo_angles[4]); //control angle for upper leg - is down and + is up
        push();
        fill(0);
        model(this.legs[2]);
        pop();
        push();
        translate(0, 0, 0.625 * this.upper_leg_length);
        //lower servo
        push();
        translate(0, this.servo_width, 0);
        rotateY(HALF_PI);
        push();
        fill(125);
        model(this.servos[5]);
        pop();
        pop();
        // lower leg
        push();
        translate(0, -0.35 * this.servo_width,0);
        rotateY(-this.servo_angles[5]); //control angle for lower leg - is down + is up
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
        translate(this.under_base_width/2 - this.servo_length*sin(PI/4),
            0, this.under_base_width/2 - this.servo_length*sin(PI/4)); //+,0,+
        rotateY(-PI/4);//-pi/4
        translate(0, this.servo_height/2,0);
        push();
        fill(125);
        model(this.servos[0]);
        pop();
        push();
        translate(0, - this.servo_height, 0);
        rotateY((PI - this.servo_angles[6]) - HALF_PI); // control angle for hip - is forward and + is backward
        rotateX(HALF_PI);
        push();
        fill(125);
        model(this.servos[4]);
        pop();
        push();
        translate(0.5 * this.servo_length, 0.9* this.servo_width, 0);
        rotateY(this.servo_angles[7]); //control angle for upper leg - is down and + is up
        push();
        fill(0);
        model(this.legs[2]);
        pop();
        push();
        translate(0, 0, 0.625 * this.upper_leg_length);
        //lower servo
        push();
        translate(0, -0.8* this.servo_width, 0);
        rotateY(HALF_PI);
        push();
        fill(125);
        model(this.servos[5]);
        pop();
        pop();
        // lower leg
        push();
        translate(0, 0.35 * this.servo_width, 0);
        rotateY(PI + this.servo_angles[8]); //control angle for lower leg + is down - is up
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
        translate(-this.under_base_width/2 + this.servo_length * sin(PI/4),
            0, this.under_base_width/2 - this.servo_length*sin(PI/4)); //-,0,+
        rotateY(PI/4);//pi/4
        translate(0, this.servo_height/2,0);
        push();
        fill(125);
        model(this.servos[0]);
        pop();

        push();
        translate(0, -this.servo_height, 0);
        rotateY((PI - this.servo_angles[9]) - HALF_PI); // control angle for hip - is forward and + is backward
        rotateX(HALF_PI);
        push();
        fill(125);
        model(this.servos[4]);
        pop();

        push();
        translate(-0.5 * this.servo_length, 0.9 * this.servo_width, 0);
        rotateY(PI + this.servo_angles[10]); //control angle for upper leg - is down and + is up
        rotateY(0);
        push();
        fill(0);
        model(this.legs[2]);
        pop();

        push();
        translate(0, 0, 0.625 * this.upper_leg_length);
        //lower servo
        push();
        translate(0, -0.8 * this.servo_width, 0);
        rotateY(HALF_PI);
        push();
        fill(125);
        model(this.servos[5]);
        pop();
        pop();

        // lower leg
        push();
        translate(0, 0.35 * this.servo_width,0);
        rotateY(-this.servo_angles[11]); //control angle for lower leg + is down - is up
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