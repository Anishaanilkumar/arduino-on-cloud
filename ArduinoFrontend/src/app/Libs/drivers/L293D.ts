import { CircuitElement } from "../CircuitElement";
import { BreadBoard } from "../General";
import { ArduinoUno } from "../outputs/Arduino";
import { Point } from "../Point";

/**
 * MotorDriver L293D class
 */
export class L293D extends CircuitElement {
    /**
     * Pin Name mapped to Pins
     */
    pinNamedMap: any = {};
    /**
     * Speed of Motor A in range of 0 to 5.
     */
    speedA = 5;
    /**
     * Speed of Motor B in range of 0 to 5
     */
    speedB = 5;
    /**
     * Previous values of the pins.
     */
    prevValues: any = {
        IN1: -1,
        IN2: -1,
        IN3: -1,
        IN4: -1
    };
    /**
     * boolean to store EN1 value
     */
    enable1 = false;
    /**
     * boolean to store EN2 value
     */
    enable2 = false;
    /**
     * boolean for GND1
     */
    ground1 = false;
    /**
     * boolean for GND2
     */
    ground2 = false;

    /**
     * MotorDriver L293D constructor
     * @param canvas Raphael Canvas (Paper)
     * @param x  position x
     * @param y  position y
     */
    constructor(public canvas: any, x: number, y: number) {
        super('L293D', x, y, 'L293D.json', canvas);
    }
    /**
     * Initialize Motor class.
     */
    init() {
        for (const node of this.nodes) {
            this.pinNamedMap[node.label] = node;
        }
        this.pinNamedMap['VS'].addValueListener(v => {
            this.pinNamedMap['GND1'].setValue(v, this.pinNamedMap['GND1']);
            if (v >= 5) {
                this.pinNamedMap['GND2'].setValue(5, this.pinNamedMap['GND2']);
            }
            this.update();
        });


        this.pinNamedMap['VSS'].addValueListener(v => {
            this.pinNamedMap['GND3'].setValue(v, this.pinNamedMap['GND3']);
            if (v >= 5) {
                this.pinNamedMap['GND4'].setValue(5, this.pinNamedMap['GND4']);
            }
            this.update();
        });


        this.pinNamedMap['IN1'].addValueListener(v => {
            if (v !== this.prevValues.IN1) {
                this.prevValues.IN1 = v;
                this.update();
            }
        });
        this.pinNamedMap['IN2'].addValueListener(v => {
            if (v !== this.prevValues.IN2) {
                this.prevValues.IN2 = v;
                this.update();
            }
        });
        this.pinNamedMap['IN3'].addValueListener(v => {
            if (v !== this.prevValues.IN3) {
                this.prevValues.IN3 = v;
                this.update();
            }
        });
        this.pinNamedMap['IN4'].addValueListener(v => {
            if (v !== this.prevValues.IN4) {
                this.prevValues.IN4 = v;
                this.update();
            }
        });

        this.pinNamedMap['EN2'].addValueListener(v => {
            console.log(v)
            if (v > 0) {
                this.enable2 = true;
            } else {
                this.enable2 = false;
            }
        });
    }
    /**
     * Simulation Logic For L293D Motor driver
     */
    update() {
        setTimeout(() => {
            if (this.pinNamedMap['IN1'].value > 0 && this.pinNamedMap['IN2'].value > 0) {
                window['showToast']('Both IN1 and IN2 Pins are High!');
                return;
            }

            if (this.pinNamedMap['IN3'].value > 0 && this.pinNamedMap['IN4'].value > 0) {
                window['showToast']('Both IN3 and IN4 Pins are High!');
                return;
            }
        }, 100);

        // If EN2 is HIGH
        if (this.enable2 && this.ground2) {
            if (this.pinNamedMap['IN4'].value > 0) {
                this.pinNamedMap['OUT4'].setValue(this.pinNamedMap['VS'].value * (this.speedB / 5), this.pinNamedMap['OUT4']);
            }
            if (this.pinNamedMap['IN3'].value > 0) {
                this.pinNamedMap['OUT3'].setValue(this.pinNamedMap['VS'].value * (this.speedB / 5), this.pinNamedMap['OUT3']);
            }
        } else {
            this.pinNamedMap['OUT4'].setValue(0, this.pinNamedMap['OUT4']);
            this.pinNamedMap['OUT3'].setValue(0, this.pinNamedMap['OUT3']);
        }

        // If EN1 is HIGH
        if (this.enable1 && this.ground1) {
            if (this.pinNamedMap['IN1'].value > 0) {
                this.pinNamedMap['OUT1'].setValue(this.pinNamedMap['VS'].value * (this.speedB / 5), this.pinNamedMap['OUT1']);
            }
            if (this.pinNamedMap['IN3'].value > 0) {
                this.pinNamedMap['OUT2'].setValue(this.pinNamedMap['VS'].value * (this.speedB / 5), this.pinNamedMap['OUT2']);
            }
        } else {
            this.pinNamedMap['OUT2'].setValue(0, this.pinNamedMap['OUT2']);
            this.pinNamedMap['OUT1'].setValue(0, this.pinNamedMap['OUT1']);

        }


        // if (this.pinNamedMap['IN1'].value > 0) {
        //     this.pinNamedMap['OUT2'].setValue(
        //         this.pinNamedMap['VS'].value * (this.speedA / 5),
        //         this.pinNamedMap['OUT2']
        //     );
        // } else if (this.pinNamedMap['IN2'].value > 0) {
        //     this.pinNamedMap['OUT1'].setValue(
        //         this.pinNamedMap['VS'].value * (this.speedA / 5),
        //         this.pinNamedMap['OUT1']
        //     );
        // } else {
        //     this.pinNamedMap['OUT1'].setValue(
        //         0,
        //         this.pinNamedMap['OUT1']
        //     );
        // }

        // if (this.pinNamedMap['IN3'].value > 0) {
        //     this.pinNamedMap['OUT4'].setValue(
        //         this.pinNamedMap['VS'].value * (this.speedB / 5),
        //         this.pinNamedMap['OUT4']
        //     );
        // } else if (this.pinNamedMap['IN4'].value > 0) {
        //     this.pinNamedMap['OUT3'].setValue(
        //         this.pinNamedMap['VS'].value * (this.speedB / 5),
        //         this.pinNamedMap['OUT3']
        //     );
        // } else {
        //     this.pinNamedMap['OUT3'].setValue(
        //         0,
        //         this.pinNamedMap['OUT3']
        //     );
        // }
    }
    /**
     * Function provides component details
     * @param keyName Unique Class name
     * @param id Component id
     * @param body body of property box
     * @param title Component title
     */
    properties(): { keyName: string; id: number; body: HTMLElement; title: string; } {
        const body = document.createElement('div');
        body.innerText = 'If you Don\'t Connect The EN1 and EN2 Pins it automatically connects to the 5V suppy';
        return {
            keyName: this.keyName,
            id: this.id,
            body,
            title: 'Motor Driver (L293D)'
        };
    }
    /**
     * Return the node which is connected to arduino
     * @param node The Node which need to be checked
     */
    private getArduino(node: Point) {
        if (
            node.connectedTo &&
            node.connectedTo.start &&
            node.connectedTo.start.parent.keyName === 'ArduinoUno'
        ) {
            return node.connectedTo.start;
        }
        if (
            node.connectedTo &&
            node.connectedTo.end &&
            node.connectedTo.end.parent.keyName === 'ArduinoUno'
        ) {
            return node.connectedTo.end;
        }
        return null;
    }
    /**
     * Called on Start Simulation
     */
    initSimulation(): void {
        // const arduinoEnd: any = this.getArduino(this.pinNamedMap['EN2']);
        // if (arduinoEnd) {
        //     const arduino = arduinoEnd.parent;
        //     (arduino as ArduinoUno).addPWM(arduinoEnd, (v, p) => {
        //         this.speedA = v / 100;
        //         this.update();
        //     });
        // }

        // const arduinoEnd1: any = this.getArduino(this.pinNamedMap['EN1']);
        // if (arduinoEnd1) {
        //     const arduino = arduinoEnd1.parent;
        //     (arduino as ArduinoUno).addPWM(arduinoEnd1, (v, p) => {
        //         this.speedB = v;
        //         this.update();
        //     });
        // }
        // Check for enable pin value
        if (this.pinNamedMap['EN2'].value > 0) {
            // init 2nd side
            this.enable2 = true;

            const arduinoEnd4 = BreadBoard.getRecArduinov2(this.pinNamedMap['GND4'], 'GND4');
            const arduinoEnd3 = BreadBoard.getRecArduinov2(this.pinNamedMap['GND3'], 'GND3');
            if (arduinoEnd4 && arduinoEnd3) {
                if (arduinoEnd4.parent.keyName === 'ArduinoUno' || arduinoEnd3.parent.keyName === 'ArduinoUno') {
                    this.ground2 = true;
                } else {
                    console.error('GND is not connected')
                    window['showToast']('GND is not connected properly!');
                }
            }
        }
        if (this.pinNamedMap['EN1'].value > 0) {
            // init 1sr side
            this.enable1 = true;

            const arduinoEnd2 = BreadBoard.getRecArduinov2(this.pinNamedMap['GND2'], 'GND2');
            const arduinoEnd1 = BreadBoard.getRecArduinov2(this.pinNamedMap['GND1'], 'GND1');
            if (arduinoEnd2 && arduinoEnd1) {
                if (arduinoEnd2.parent.keyName === 'ArduinoUno' || arduinoEnd1.parent.keyName === 'ArduinoUno') {
                    this.ground1 = true;
                } else {
                    console.error('GND is not connected')
                    window['showToast']('GND is not connected properly!');
                }
            }
        }

        // console.log(this.enable2, ' - ', this.enable1)
        // console.log(this.ground2, ' - ', this.ground1)

        // run simulation
        this.update();

    }
    /**
     * Called on Stop Simulation
     */
    closeSimulation(): void {
        this.pinNamedMap['IN1'].value = -1;
        this.pinNamedMap['IN2'].value = -1;
        this.pinNamedMap['IN3'].value = -1;
        this.pinNamedMap['IN4'].value = -1;
        this.speedA = 5;
        this.speedB = 5;
        this.prevValues = {
            IN1: -1,
            IN2: -1,
            IN3: -1,
            IN4: -1
        };
        this.enable1 = false;
        this.enable2 = false;
        this.ground1 = false;
        this.ground2 = false;
    }
}


