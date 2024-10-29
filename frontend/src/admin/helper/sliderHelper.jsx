const duplicateActivities = (activities) => {
  if (activities.length >= 4) return activities;
  const duplicated = [...activities];
  while (duplicated.length < 4) {
    duplicated.push(...activities);
  }
  return duplicated.slice(0, 4);
};
export default duplicateActivities;
