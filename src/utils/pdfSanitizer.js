const OKLCH_REGEX = /oklch\([^)]*\)/gi;

const createOklchToRgbConverter = (doc) => {
  const cache = new Map();
  const helper = doc.createElement("span");
  helper.style.display = "none";
  doc.body.appendChild(helper);

  return {
    convert: (oklchValue) => {
      if (cache.has(oklchValue)) return cache.get(oklchValue);
      helper.style.color = "";
      helper.style.color = oklchValue;
      const converted =
        doc.defaultView.getComputedStyle(helper).color || "rgb(15, 23, 42)";
      cache.set(oklchValue, converted);
      return converted;
    },
    cleanup: () => {
      if (helper.parentNode) helper.parentNode.removeChild(helper);
    },
  };
};

const replaceOklch = (value = "", convert) =>
  value.replace(OKLCH_REGEX, (match) => convert(match));

export const sanitizeDocumentForHtml2Pdf = (doc) => {
  if (!doc) return;
  if (!doc.body) return;

  const { convert, cleanup } = createOklchToRgbConverter(doc);

  doc.querySelectorAll("style").forEach((styleTag) => {
    if (!styleTag.textContent || !styleTag.textContent.includes("oklch(")) return;
    styleTag.textContent = replaceOklch(styleTag.textContent, convert);
  });

  doc.querySelectorAll("[style]").forEach((node) => {
    const currentStyle = node.getAttribute("style");
    if (!currentStyle || !currentStyle.includes("oklch(")) return;
    node.setAttribute("style", replaceOklch(currentStyle, convert));
  });

  cleanup();
};

export const withHtml2PdfColorFallback = (options = {}) => ({
  ...options,
  onclone: (clonedDoc) => {
    sanitizeDocumentForHtml2Pdf(clonedDoc);
    if (typeof options.onclone === "function") {
      options.onclone(clonedDoc);
    }
  },
});
