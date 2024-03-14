import EngineError from "./engine-error.js";

export default class InvalidContentLengthError extends EngineError {
    constructor(url: string) {
        super(`Invalid content length, for request URL: ${url}`);
    }
}
