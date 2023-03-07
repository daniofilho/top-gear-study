import config from '../../../config';
import CanvasDrawer from '../../core/CanvasDrawer';
import { ICanvasDrawer } from '../../core/CanvasDrawer/types';
import Car from '../car';
import { ILevelProps } from './types';

class Level {
  #drawer?: ICanvasDrawer;
  #car?: Car;
  #track?: ITrack;

  #sky = {
    height: config.canvas.height * 0.4,
    color: '#0000A0',
  };

  #mountain = {
    color: '#020080',
    size: {
      min: this.#sky.height * 0.3,
      max: this.#sky.height * 0.9,
    },
  };

  #lines = new Array(config.canvas.height / 1.5).fill('');
  #lineHeight = Math.round((config.canvas.height - this.#sky.height) / this.#lines.length);

  #columns = new Array(config.canvas.width).fill('');
  #columnsWidth = config.canvas.width / this.#columns.length;

  #roadProps = {
    color: '#555555',
    width: (config.canvas.width * 1) / 2, // Road takes 100% of screen, but / 2 is to make road symmetrical on both sides
  };

  #grassProps = {
    colors: ['#058900', '#076C02'],
    frequency: 60,
  };

  #roadLineProps = {
    colors: ['#940000', '#CECECE'],
    width: this.#roadProps.width * 0.1,
    frequency: 60,
  };

  #screenWidth = config.canvas.width;

  // Points on track
  //offset: number = 0; // how much the car has moved
  #trackSection: number = 0; // in which section of the track is the car
  #lap: number = 1;

  #curvature: number = 0;
  #curvatureLimit: number = 0.4;

  constructor({ context, car, track }: ILevelProps) {
    this.#drawer = CanvasDrawer({ context });
    this.#car = car;
    this.#track = track;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  get trackSection() {
    return this.#trackSection;
  }

  get curvature() {
    return this.#curvature;
  }

  get lap() {
    return this.#lap;
  }

  // * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

  // find position on track
  #updateTrackSection = (carPositionOnTrack: number): void => {
    if (!this.#track || !this.#car) return;

    if (carPositionOnTrack <= this.#track.coordinates[this.#trackSection].distance) return;

    let newTrackSection = this.#trackSection + 1;
    if (newTrackSection > this.#track.coordinates.length - 1) {
      newTrackSection = 0;
      this.#lap++;
      this.#car.positionOnTrack = 0;
    }

    this.#trackSection = newTrackSection;
  };

  #checkIfCarIsOutOfTrack = (carPosition: number, trackCurvature: number) => {
    if (!this.#car) return;

    // If player is out of track, slow down the car
    const isCardOutOfTrack = Math.abs(carPosition - trackCurvature) >= 0.8;

    this.#car.isOutOfTrack = isCardOutOfTrack;
  };

  #getMiddleSkyPointAsPositiveValue = (trackCurvature: number): number => {
    // -1 = min curvature
    // 1 = max curvature
    // but output will be 0 - 0.5 for < 0 curvature and 0.5 - 1 for > 0;

    let target = 0;

    let min = -1;
    let max = 1;

    const range = max - min;
    const correctedStartValue = trackCurvature - min;
    target = (correctedStartValue * 100) / range / 100;

    return target;
  };

  #drawSky = (trackCurvature: number) => {
    const heightIncrement = this.#sky.height * 0.003;

    const middleSky = this.#getMiddleSkyPointAsPositiveValue(trackCurvature);

    let lineHeight = this.#mountain.size.min + middleSky * this.#sky.height;

    let incrementDirection = 'up';

    let x = 0;

    this.#columns.map((_, index) => {
      if (!this.#drawer) return;

      if (incrementDirection === 'down') {
        lineHeight += heightIncrement;
      } else {
        lineHeight -= heightIncrement;
      }

      if (lineHeight > this.#mountain.size.max) {
        lineHeight = this.#mountain.size.max;
        incrementDirection = 'up';
      }

      if (lineHeight <= this.#mountain.size.min) {
        lineHeight = this.#mountain.size.min;
        incrementDirection = 'down';
      }

      // * Draw

      // Sky
      this.#drawer.rectangle({
        color: this.#sky.color,
        x,
        y: 0,
        width: this.#columnsWidth,
        height: lineHeight,
      });

      // Mountain
      this.#drawer.rectangle({
        color: this.#mountain.color,
        x,
        y: lineHeight,
        width: this.#columnsWidth,
        height: this.#sky.height - lineHeight,
      });

      x = index + this.#columnsWidth;
    });
  };

  render = ({ deltaTime }: IRenderObjectProps) => {
    if (!this.#car) return;

    const carSpeed = this.#car.speed;
    const carSpeedNormalized = carSpeed / 100;
    const carPositionOnTrack = this.#car.positionOnTrack;
    const carPosition = this.#car.position;

    const roadColor = this.#trackSection === 0 ? '#999' : this.#roadProps.color;

    this.#updateTrackSection(carPositionOnTrack);

    this.#drawSky(this.#curvature);

    this.#lines.map((_, index) => {
      if (!this.#drawer || !this.#car || !this.#track) return;

      const initialY = this.#sky.height + index * this.#lineHeight;

      // * This is the key code to define the width of each line and make the perspective effect of road

      let perspective = index / (config.canvas.height / 2);
      perspective = 0.04 + perspective * 0.8; // limit perspective to goes from 5% to 80%

      // * - - -

      // * Elements Props

      let targetCurvature = this.#track.coordinates[this.#trackSection].curvature;
      targetCurvature = targetCurvature * this.#curvatureLimit;

      // Makes the curvature of the track interpolate from a value to another instead
      // of changing values directly. This avoids an strange effect when showing curves
      const trackCurvatureDiff = targetCurvature - this.#curvature;

      this.#curvature += (trackCurvatureDiff * deltaTime * carSpeedNormalized) / 1200; // ! this is making the curves a bit glitch

      this.#checkIfCarIsOutOfTrack(carPosition, this.#curvature);

      // Calculate the remaining values considering curvature
      const middlePoint = 0.5 + this.#curvature * Math.pow(1 - perspective, 3); // * correctly apply perspective to curve
      const centerX = this.#screenWidth * middlePoint;
      const variableRoadWidth = this.#roadProps.width * perspective;

      // # Road props
      const road = {
        ...this.#roadProps,
        x: centerX - variableRoadWidth,
        width: variableRoadWidth,
        color: roadColor,
      };

      // # Road line props
      const variableLineWidth = this.#roadLineProps.width * perspective;

      const roadLine = {
        ...this.#roadLineProps,
        color:
          Math.sin(
            this.#roadLineProps.frequency * Math.pow(1 - perspective, 2) + // make bigger line as it gets closer to camera
              carPositionOnTrack * 2
          ) > 0
            ? this.#roadLineProps.colors[0]
            : this.#roadLineProps.colors[1],
        left: {
          x: centerX - road.width - variableLineWidth,
        },
        right: {
          x: centerX + road.width,
        },
        width: variableLineWidth,
      };

      // Grass props
      const grassVariableWidth = this.#screenWidth / 2 - variableLineWidth;
      const grassLeftWidth = centerX - road.width - variableLineWidth;

      const grass = {
        ...this.#grassProps,
        width: grassVariableWidth,
        color:
          Math.sin(
            this.#grassProps.frequency * Math.pow(1 - perspective, 2) + carPositionOnTrack * 2
          ) > 0
            ? this.#grassProps.colors[0]
            : this.#grassProps.colors[1],
        right: {
          x: centerX + road.width + variableLineWidth,
        },
        left: {
          width: grassLeftWidth,
        },
      };

      // * Draw

      // # Left Grass
      this.#drawer.rectangle({
        color: grass.color,
        x: 0, // fit the rest of screen from left
        y: initialY,
        width: grass.left.width,
        height: this.#lineHeight,
      });

      // # Left Road Line
      this.#drawer.rectangle({
        color: roadLine.color,
        x: roadLine.left.x,
        y: initialY,
        width: roadLine.width,
        height: this.#lineHeight,
      });

      // # Road
      this.#drawer.rectangle({
        color: road.color,
        x: road.x,
        y: initialY,
        width: road.width * 2,
        height: this.#lineHeight,
      });

      // # Right Grass
      this.#drawer.rectangle({
        color: grass.color,
        x: grass.right.x,
        y: initialY,
        width: this.#screenWidth - grass.right.x, // fit the rest of the screen
        height: this.#lineHeight,
      });

      // # Right Road Line
      this.#drawer.rectangle({
        color: roadLine.color,
        x: roadLine.right.x,
        y: initialY,
        width: roadLine.width,
        height: this.#lineHeight,
      });
    });
  };
}

export default Level;
