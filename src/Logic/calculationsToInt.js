export default function calculationsToInt(obj) {
  const intCalculations = JSON.parse(JSON.stringify(obj));

  Object.keys(intCalculations).forEach(key => {intCalculations[key] = +intCalculations[key]})

  return intCalculations;
}