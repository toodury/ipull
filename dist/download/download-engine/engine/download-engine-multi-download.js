import { EventEmitter } from "eventemitter3";
import ProgressStatisticsBuilder from "../../transfer-visualize/progress-statistics-builder.js";
import DownloadAlreadyStartedError from "./error/download-already-started-error.js";
import { concurrency } from "./utils/concurrency.js";
const DEFAULT_PARALLEL_DOWNLOADS = 1;
export default class DownloadEngineMultiDownload extends EventEmitter {
    downloads;
    options;
    _aborted = false;
    _activeEngines = new Set();
    _progressStatisticsBuilder = new ProgressStatisticsBuilder();
    _downloadStatues = [];
    _closeFiles = [];
    constructor(engines, options) {
        super();
        this.downloads = DownloadEngineMultiDownload._extractEngines(engines);
        this.options = options;
        this._init();
    }
    get downloadStatues() {
        return this._downloadStatues;
    }
    get downloadSize() {
        return this.downloads.reduce((acc, engine) => acc + engine.downloadSize, 0);
    }
    _init() {
        this._changeEngineFinishDownload();
        for (const [index, engine] of Object.entries(this.downloads)) {
            const numberIndex = Number(index);
            this._downloadStatues[numberIndex] = engine.status;
            engine.on("progress", (progress) => {
                this._downloadStatues[numberIndex] = progress;
            });
        }
        this._progressStatisticsBuilder.add(...this.downloads);
        this._progressStatisticsBuilder.on("progress", progress => {
            this.emit("progress", progress);
        });
    }
    async download() {
        if (this._activeEngines.size) {
            throw new DownloadAlreadyStartedError();
        }
        this.emit("start");
        const concurrencyCount = this.options.parallelDownloads ?? DEFAULT_PARALLEL_DOWNLOADS;
        await concurrency(this.downloads, concurrencyCount, async (engine) => {
            if (this._aborted)
                return;
            this._activeEngines.add(engine);
            this.emit("childDownloadStarted", engine);
            await engine.download();
            this.emit("childDownloadClosed", engine);
            this._activeEngines.delete(engine);
        });
        this.emit("finished");
        await this._finishEnginesDownload();
        await this.close();
    }
    _changeEngineFinishDownload() {
        for (const engine of this.downloads) {
            const options = engine._fileEngineOptions;
            const onFinishAsync = options.onFinishAsync;
            const onCloseAsync = options.onCloseAsync;
            options.onFinishAsync = undefined;
            options.onCloseAsync = undefined;
            this._closeFiles.push(async () => {
                await onFinishAsync?.();
                await options.writeStream.close();
                await onCloseAsync?.();
            });
        }
    }
    async _finishEnginesDownload() {
        await Promise.all(this._closeFiles.map(func => func()));
    }
    pause() {
        this._activeEngines.forEach(engine => engine.pause());
    }
    resume() {
        this._activeEngines.forEach(engine => engine.resume());
    }
    async close() {
        if (this._aborted)
            return;
        this._aborted = true;
        const closePromises = Array.from(this._activeEngines)
            .map(engine => engine.close());
        await Promise.all(closePromises);
        this.emit("closed");
    }
    static _extractEngines(engines) {
        return engines.map(engine => {
            if (engine instanceof DownloadEngineMultiDownload) {
                return engine.downloads;
            }
            return engine;
        })
            .flat();
    }
    static async fromEngines(engines, options = {}) {
        return new DownloadEngineMultiDownload(await Promise.all(engines), options);
    }
}
//# sourceMappingURL=download-engine-multi-download.js.map