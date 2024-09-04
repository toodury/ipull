import UpdateManager from "stdout-update";
import debounce from "lodash.debounce";
import cliSpinners from "cli-spinners";
import CliSpinnersLoadingAnimation from "./loading-animation/cli-spinners-loading-animation.js";
import switchCliProgressStyle from "./progress-bars/switch-cli-progress-style.js";
import { BaseMultiProgressBar } from "./multiProgressBars/baseMultiProgressBar.js";
export const DEFAULT_TRANSFER_CLI_OPTIONS = {
    maxViewDownloads: 10,
    truncateName: true,
    debounceWait: 20,
    maxDebounceWait: 100,
    createProgressBar: switchCliProgressStyle("basic", { truncateName: true }),
    loadingAnimation: "dots",
    loadingText: "Gathering information",
    createMultiProgressBar: BaseMultiProgressBar
};
export var CLI_LEVEL;
(function (CLI_LEVEL) {
    CLI_LEVEL[CLI_LEVEL["LOW"] = 0] = "LOW";
    CLI_LEVEL[CLI_LEVEL["HIGH"] = 2] = "HIGH";
})(CLI_LEVEL || (CLI_LEVEL = {}));
export default class TransferCli {
    static activeCLILevel = CLI_LEVEL.LOW;
    loadingAnimation;
    options;
    stdoutManager = UpdateManager.getInstance();
    myCLILevel;
    latestProgress = [];
    _cliStopped = true;
    _updateStatuesDebounce;
    _multiProgressBar;
    constructor(options, myCLILevel = CLI_LEVEL.LOW) {
        TransferCli.activeCLILevel = this.myCLILevel = myCLILevel;
        this.options = { ...DEFAULT_TRANSFER_CLI_OPTIONS, ...options };
        this._updateStatuesDebounce = debounce(this._updateStatues.bind(this), this.options.debounceWait, {
            maxWait: this.options.maxDebounceWait
        });
        this.loadingAnimation = new CliSpinnersLoadingAnimation(cliSpinners[this.options.loadingAnimation], {
            loadingText: this.options.loadingText
        });
        this._processExit = this._processExit.bind(this);
        this._multiProgressBar = new this.options.createMultiProgressBar(this.options);
    }
    start() {
        if (this.myCLILevel !== TransferCli.activeCLILevel)
            return;
        this._cliStopped = false;
        this.stdoutManager.hook();
        process.on("SIGINT", this._processExit);
    }
    stop() {
        if (this._cliStopped || this.myCLILevel !== TransferCli.activeCLILevel)
            return;
        this._updateStatues();
        this._cliStopped = true;
        this.stdoutManager.unhook(false);
        process.off("SIGINT", this._processExit);
    }
    _processExit() {
        this.stop();
        process.exit(0);
    }
    updateStatues(statues) {
        this.latestProgress = statues;
        this._updateStatuesDebounce();
    }
    _updateStatues() {
        if (this._cliStopped || this.myCLILevel !== TransferCli.activeCLILevel) {
            return; // Do not update if there is a higher level CLI, meaning that this CLI is sub-CLI
        }
        const printLog = this._multiProgressBar.createMultiProgressBar(this.latestProgress);
        this._logUpdate(printLog);
    }
    _logUpdate(text) {
        this.stdoutManager.update(text.split("\n"));
    }
}
//# sourceMappingURL=transfer-cli.js.map