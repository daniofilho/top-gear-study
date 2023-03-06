declare interface ITrackStep {
  curvature: number /*  from -1 to 1 */;
  distance: number;
}

declare interface ITrack {
  name: string;
  coordinates: ITrackStep[];
}
