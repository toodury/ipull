import { FormattedStatus } from "../../format-transfer-status.js";
export type CliFormattedStatus = FormattedStatus & {
    transferAction: string;
};
export type BaseCliOptions = {
    truncateName?: boolean | number;
};
/**
 * A class to display transfer progress in the terminal, with a progress bar and other information.
 */
export default class BaseTransferCliProgressBar {
    protected status: CliFormattedStatus;
    protected options: BaseCliOptions;
    protected constructor(status: CliFormattedStatus, options: BaseCliOptions);
    protected createProgressBarLine(length: number): string;
    protected createProgressBarFormat(): string;
    protected transferEnded(): string;
    protected transferNotStarted(): string;
    protected getFileName(): string;
    createStatusLine(): string;
    static createLineRenderer(options: BaseCliOptions): (status: CliFormattedStatus) => string;
}
