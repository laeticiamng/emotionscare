// @ts-nocheck
export const useHaptics = () => {
  const pattern = (sequence: number[]) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(sequence);
    }
  };
  return { pattern };
};

export default useHaptics;
