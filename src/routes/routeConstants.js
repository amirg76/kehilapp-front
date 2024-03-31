import { currentEndPointHelper } from "@utils/currentEndPointHelper";

console.log(currentEndPointHelper());

export const ROOT = `/${currentEndPointHelper()}`;
// export const LOGIN = "/login";
export const LOGIN = `/${currentEndPointHelper()}/login`;
// export const MESSAGES = "/messages";
export const MESSAGES = `/${currentEndPointHelper()}/messages`;
