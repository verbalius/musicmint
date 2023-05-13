export const trimAddress = (address?: string) => {
  if (!address) {
    return "";
  }
  return `${address.slice(0, 4)}....${address.slice(address.length - 4)}`;
};

export const getImageUrl = (artistName?: string) => {
  if (!artistName) {
    return;
  }
  const date = new Date();

  const baseURL = "https://noun-api.com/beta/pfp?name=";
  const imageFormat = ".png";

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hour = date.getHours().toString().padStart(2, "0");
  const minute = date.getMinutes().toString().padStart(2, "0");

  return (
    baseURL + artistName + year + month + day + hour + minute + imageFormat
  );
};
