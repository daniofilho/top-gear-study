const track: ITrack = {
  name: 'Test track',
  coordinates: [
    {
      curvature: 0,
      distance: 10, // short section for start/finish
    },
    {
      curvature: 0,
      distance: 20,
    },
    {
      curvature: 1,
      distance: 25,
    },
    {
      curvature: 1,
      distance: 150,
    },
    {
      curvature: 0,
      distance: 300,
    },
    {
      curvature: -1,
      distance: 500,
    },
    {
      curvature: 0,
      distance: 750,
    },
  ],
};

export default track;
