import responseVirsotne from "./mock-virsotne.json"
import responseOliunid from "./mock-oliunid.json"

export function fetchMock(url: string): Promise<Response> {
  let response: any;
  if (url.includes("virsotne")) {
    response = responseVirsotne;
  } else if (url.includes("oliunid")) {
    response = responseOliunid;
  }
  return new Promise((res, rej) => {
    setTimeout(() => {
      res({ json: () => response } as unknown as Response);
    }, 500);
  });
}