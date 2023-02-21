import responseVirsotne from "./mock-virsotne.json"
import responseOliunid from "./mock-oliunid.json"
import responseEpicTv from "./mock-epictv.json"
import startCase from "lodash-es/startCase";

export function fetchMock(url: string): Promise<Response> {
  let response: any;
  if (url.includes("virsotne")) {
    response = responseVirsotne;
  } else if (url.includes("oliunid")) {
    response = responseOliunid;
  } else {
    response = responseEpicTv;
  }
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ json: () => response } as unknown as Response);
    }, 500);
  });
}

export function capitalize(value: string) {
  return startCase(value.toLowerCase());
}

export function knownManufacturers() {
  return [
    "Andrea Boldrini",
    "Black Diamond",
    "Boreal",
    "Butora",
    "EB",
    "Evolv",
    "Five Ten",
    "La Sportiva",
    "Ocun",
    "Red Chili",
    "Scarpa",
    "Tenaya",
    "Unparallel",
    "Wild Climb",
  ];
}