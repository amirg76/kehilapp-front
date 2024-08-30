import { currentEndPointHelper } from "@utils/currentEndPointHelper";

//This JavaScript function, currentEndPointHelper, extracts the base endpoint from the current URL, removing any leading slashes and additional path parameters. It returns the resulting endpoint as a string.

export const ROOT = `/${currentEndPointHelper()}`;
// export const LOGIN = "/login";
export const LOGIN = `/${currentEndPointHelper()}/login`;
// export const REGISTER = "/register";
export const REGISTER = `/${currentEndPointHelper()}/register`;
// export const MESSAGES = "/messages";
export const MESSAGES = `/${currentEndPointHelper()}/messages`;
