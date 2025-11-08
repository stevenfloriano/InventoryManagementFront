export const timeMultipliers = {
  seconds: 1000,
  minutes: 1000 * 60,
  hours: 1000 * 60 * 60,
  days: 1000 * 60 * 60 * 24,
};

export type TimeType = 'seconds' | 'minutes' | 'hours' | 'days';

export const calculateDatesDifference = (date1: Date, date2: Date, time: TimeType) => {
    const timeDifference = date1.getTime() - date2.getTime();
    return timeDifference / (timeMultipliers[time] || 1);
};