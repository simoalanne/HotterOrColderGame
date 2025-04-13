/**
 * Determines whether it's currently day or night based on the local time.
 *
 * @returns {'night' | 'day'} - Returns 'night' if the current hour is before 7 AM or after 7 PM, 'day' otherwise.
 *
 * This is used to dynamically switch between day and night-themed images in the app home section.
 */
export default getIsNightOrDay = () => {
  const currentHour = new Date().getHours();
  return currentHour <= 7 || currentHour >= 19 ? 'night' : 'day';
};
