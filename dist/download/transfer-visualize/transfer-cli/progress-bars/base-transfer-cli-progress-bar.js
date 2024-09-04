import chalk from "chalk";
import { centerPad, TRUNCATE_TEXT_MAX_LENGTH, truncateText } from "../../utils/cli-text.js";
import { clamp } from "../../utils/numbers.js";
import { DownloadStatus } from "../../../download-engine/download-file/progress-status-file.js";
/**
 * A class to display transfer progress in the terminal, with a progress bar and other information.
 */
export default class BaseTransferCliProgressBar {
    status;
    options;
    constructor(status, options) {
        this.status = status;
        this.options = options;
    }
    createProgressBarLine(length) {
        const percentage = clamp(this.status.transferredBytes / this.status.totalBytes, 0, 1);
        const fullLength = Math.floor(percentage * length);
        const emptyLength = length - fullLength;
        return `${"=".repeat(fullLength)}>${" ".repeat(emptyLength)}`;
    }
    createProgressBarFormat() {
        const { formattedComment, formattedSpeed, formatTransferredOfTotal, formatTimeLeft, formattedPercentage } = this.status;
        return `${chalk.cyan(this.status.transferAction)} ${this.getFileName()} ${chalk.dim(formattedComment)}
${chalk.green(formattedPercentage.padEnd(7))
            .padStart(6)}  [${chalk.cyan(this.createProgressBarLine(50))}]  ${centerPad(formatTransferredOfTotal, 18)}  ${centerPad(formattedSpeed, 10)}  ${centerPad(formatTimeLeft, 5)} left`;
    }
    transferEnded() {
        const status = this.status.downloadStatus === DownloadStatus.Finished ? chalk.green("✓") : chalk.red("✗");
        return `${status} ${this.getFileName()} ${this.status.formatTransferred} ${chalk.dim(this.status.formattedComment)}`;
    }
    transferNotStarted() {
        return `⌛ ${this.getFileName()} ${this.status.formatTotal} ${chalk.dim(this.status.formattedComment)}`;
    }
    getFileName() {
        const { fileName } = this.status;
        if (this.options.truncateName && fileName) {
            const length = typeof this.options.truncateName === "number"
                ? this.options.truncateName
                : TRUNCATE_TEXT_MAX_LENGTH;
            return truncateText(fileName, length);
        }
        return fileName;
    }
    createStatusLine() {
        if ([DownloadStatus.Finished, DownloadStatus.Error, DownloadStatus.Cancelled].includes(this.status.downloadStatus)) {
            return this.transferEnded();
        }
        if (this.status.downloadStatus === DownloadStatus.NotStarted) {
            return this.transferNotStarted();
        }
        return this.createProgressBarFormat();
    }
    static createLineRenderer(options) {
        return (status) => {
            return new BaseTransferCliProgressBar(status, options).createStatusLine();
        };
    }
}
//# sourceMappingURL=base-transfer-cli-progress-bar.js.map