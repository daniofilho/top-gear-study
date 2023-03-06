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
      distance: 100,
    },
    {
      curvature: -1,
      distance: 150,
    },
    {
      curvature: 0,
      distance: 200,
    },
  ],
};

export default track;
