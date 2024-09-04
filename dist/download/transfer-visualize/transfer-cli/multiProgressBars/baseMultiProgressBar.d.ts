import { CliFormattedStatus } from "../progress-bars/base-transfer-cli-progress-bar.js";
import { FormattedStatus } from "../../format-transfer-status.js";
export type MultiProgressBarOptions = {
    maxViewDownloads: number;
    createProgressBar: (status: CliFormattedStatus) => string;
    action?: string;
};
export declare class BaseMultiProgressBar {
    protected options: MultiProgressBarOptions;
    constructor(options: MultiProgressBarOptions);
    protected createProgresses(statuses: FormattedStatus[]): string;
    /**
     * Sorts the statuses by importance, active downloads first, then remaining, then finished (by end time - latest first)
     */
    protected recorderStatusByImportance(statuses: FormattedStatus[]): {
        notFinished: boolean;
        remaining: number;
        allStatusesSorted: FormattedStatus[];
    };
    createMultiProgressBar(statuses: FormattedStatus[]): string;
}
