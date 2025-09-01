const isNight = (): boolean => {
  const currentHour = new Date().getHours();
  return currentHour <= 7 || currentHour >= 19;
};

export default isNight;
