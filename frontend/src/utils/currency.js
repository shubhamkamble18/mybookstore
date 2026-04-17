// Currency utility - formats price in INR
export const toINR = (price) => {
  const val = Math.round(Number(price));
  return `₹${val.toLocaleString('en-IN')}`;
};

export default toINR;
