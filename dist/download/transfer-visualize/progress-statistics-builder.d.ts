import BaseDownloadEngine from "../download-engine/engine/base-download-engine.js";
import { EventEmitter } from "eventemitter3";
import TransferStatistics from "./transfer-statistics.js";
import DownloadEngineMultiDownload from "../download-engine/engine/download-engine-multi-download.js";
import { FormattedStatus } from "./format-transfer-status.js";
import DownloadEngineFile from "../download-engine/download-file/download-engine-file.js";
export type ProgressStatusWithIndex = FormattedStatus & {
    index: number;
};
interface CliProgressBuilderEvents {
    progress: (progress: ProgressStatusWithIndex) => void;
}
export type AnyEngine = DownloadEngineFile | BaseDownloadEngine | DownloadEngineMultiDownload;
export default class ProgressStatisticsBuilder extends EventEmitter<CliProgressBuilderEvents> {
    protected _engines: AnyEngine[];
    protected _activeTransfers: {
        [index: number]: number;
    };
    protected _totalBytes: number;
    protected _transferredBytes: number;
    protected statistics: TransferStatistics;
    get totalBytes(): number;
    get transferredBytesWithActiveTransfers(): number;
    add(...engines: AnyEngine[]): void;
    protected _initEvents(engine: AnyEngine): void;
    static oneStatistics(engine: DownloadEngineFile): FormattedStatus;
}
export {};
