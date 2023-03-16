import responseVirsotne from "./mock-virsotne.json"
import responseOliunid from "./mock-oliunid.json"
import responseEpicTv from "./mock-epictv.json"
import startCase from "lodash-es/startCase";
import { useEffect, useState } from "react";

export function fetchMock(url: string): Promise<Response> {
  let response: any;
  let timeout = 500;
  if (url.includes("virsotne")) {
    response = responseVirsotne;
    timeout = 500;
  } else if (url.includes("oliunid")) {
    response = responseOliunid;
    timeout = 1000;
  } else {
    response = responseEpicTv;
    timeout = 1500;
  }
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ json: () => response } as unknown as Response);
    }, timeout);
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

export function useTimeout(condition: boolean, timeout: number) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (condition) {
      setTimeout(() => setReady(true), timeout);
    }
  }, [condition]);
  return ready;
}