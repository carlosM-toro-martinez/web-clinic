const toTitleCase = (str) => {
  if (!str || typeof str !== "string") return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export default toTitleCase;
