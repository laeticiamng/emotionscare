
// Helps filter data for charts based on selected time range
export const getFilteredData = (
  data: Array<{ date: string; value: number }>,
  range: string
) => {
  if (range === "7j") return data;
  
  // Simulate more data for longer periods
  if (range === "30j") {
    return [...data, ...data.map(item => ({
      date: item.date + "*",
      value: Math.min(100, item.value * (1 + Math.random() * 0.4))
    }))];
  }
  
  if (range === "90j") {
    return [...data, ...data.map(item => ({
      date: item.date + "**",
      value: Math.min(100, item.value * (1 + Math.random() * 0.8))
    }))];
  }
  
  return data;
};
