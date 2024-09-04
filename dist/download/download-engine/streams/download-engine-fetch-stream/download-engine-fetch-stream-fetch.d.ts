import BaseDownloadEngineFetchStream, { DownloadInfoResponse, FetchSubState, WriteCallback } from "./base-download-engine-fetch-stream.js";
type GetNextChunk = () => Promise<ReadableStreamReadResult<Uint8Array>> | ReadableStreamReadResult<Uint8Array>;
export default class DownloadEngineFetchStreamFetch extends BaseDownloadEngineFetchStream {
    transferAction: string;
    withSubState(state: FetchSubState): this;
    protected fetchWithoutRetryChunks(callback: WriteCallback): Promise<void>;
    protected fetchDownloadInfoWithoutRetry(url: string): Promise<DownloadInfoResponse>;
    protected fetchDownloadInfoWithoutRetryContentRange(url: string): Promise<number>;
    chunkGenerator(callback: WriteCallback, getNextChunk: GetNextChunk): Promise<void>;
    protected static convertHeadersToRecord(headers: Headers): {
        [key: string]: string;
    };
}
export {};
