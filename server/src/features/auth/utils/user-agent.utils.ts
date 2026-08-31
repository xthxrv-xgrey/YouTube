import { UAParser } from "ua-parser-js";

export const parseUserAgent = (userAgent: string) => {
  const parser = new UAParser(userAgent);

  const result = parser.getResult();

  return {
    device: result.device.model
      ? `${result.device.vendor ?? ""} ${result.device.model}`.trim()
      : result.device.type
        ? result.device.type
        : "Desktop",

    browser: result.browser.name
      ? `${result.browser.name}${result.browser.version ? ` ${result.browser.version}` : ""}`
      : "Unknown browser",
  };
};
