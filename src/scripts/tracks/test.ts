const track: ITrack = {
  name: 'Test track',
  coordinates: [
    {
      curvature: 0,
      distance: 5, // short section for start/finish
    },
    {
      curvature: 0,
      distance: 20,
    },
    {
      curvature: 1,
      distance: 50,
    },
    {
      curvature: 0,
      distance: 200,
    },
    {
      curvature: 0.4,
      distance: 250,
    },
    {
      curvature: 0.8,
      distance: 400,
    },
    {
      curvature: -1,
      distance: 550,
    },
    {
      curvature: -0.7,
      distance: 700,
    },
    {
      curvature: 0,
      distance: 750,
    },
    {
      curvature: 0.5,
      distance: 900,
    },
  ],
};

export default track;
