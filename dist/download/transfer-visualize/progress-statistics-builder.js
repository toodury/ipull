import { EventEmitter } from "eventemitter3";
import TransferStatistics from "./transfer-statistics.js";
import { createFormattedStatus } from "./format-transfer-status.js";
export default class ProgressStatisticsBuilder extends EventEmitter {
    _engines = [];
    _activeTransfers = {};
    _totalBytes = 0;
    _transferredBytes = 0;
    statistics = new TransferStatistics();
    get totalBytes() {
        return this._totalBytes;
    }
    get transferredBytesWithActiveTransfers() {
        return this._transferredBytes + Object.values(this._activeTransfers)
            .reduce((acc, bytes) => acc + bytes, 0);
    }
    add(...engines) {
        for (const engine of engines) {
            this._initEvents(engine);
        }
    }
    _initEvents(engine) {
        this._engines.push(engine);
        this._totalBytes += engine.downloadSize;
        const index = this._engines.length - 1;
        engine.on("progress", (data) => {
            this._activeTransfers[index] = data.transferredBytes;
            const progress = this.statistics.updateProgress(this.transferredBytesWithActiveTransfers, this.totalBytes);
            this.emit("progress", {
                ...createFormattedStatus({
                    ...data,
                    ...progress
                }),
                index
            });
        });
        engine.on("finished", () => {
            delete this._activeTransfers[index];
            this._transferredBytes += engine.downloadSize;
        });
    }
    static oneStatistics(engine) {
        const progress = engine.status;
        const statistics = TransferStatistics.oneStatistics(progress.transferredBytes, progress.totalBytes);
        return createFormattedStatus({
            ...progress,
            ...statistics
        });
    }
}
//# sourceMappingURL=progress-statistics-builder.js.map