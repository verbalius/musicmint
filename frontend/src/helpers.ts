export const trimAddress = (address?: string) => {
  if (!address) {
    return "";
  }
  return `${address.slice(0, 4)}....${address.slice(address.length - 4)}`;
};
