
export const executeAction = async (actionType: string, data: any) => {
  console.log(`Executing action ${actionType}`, data);
  return { success: true };
};

export const getSupportedActions = () => {
  return ["notify", "schedule", "recommend", "analyze"];
};
