import Car from '../car';

declare interface ILevelProps extends IObjectProps {
  car: Car;
  track: ITrack;
}
