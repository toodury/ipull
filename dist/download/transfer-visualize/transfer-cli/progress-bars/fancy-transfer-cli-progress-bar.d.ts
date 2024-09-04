import { FormattedStatus } from "../../format-transfer-status.js";
import { DataPart } from "../../utils/data-line.js";
export type FancyCliOptions = {
    truncateName?: boolean | number;
};
/**
 * A class to display transfer progress in the terminal, with a progress bar and other information.
 */
export default class FancyTransferCliProgressBar {
    protected status: FormattedStatus;
    protected options: FancyCliOptions;
    protected constructor(status: FormattedStatus, options?: FancyCliOptions);
    protected renderProgressLine(): string;
    protected getNameAndCommentDataParts(): DataPart[];
    protected renderFinishedLine(): string;
    protected renderPendingLine(): string;
    renderStatusLine(): string;
    static createLineRenderer(options: FancyCliOptions): (status: FormattedStatus) => string;
}
