import BaseTransferCliProgressBar from "./base-transfer-cli-progress-bar.js";
import FancyTransferCliProgressBar from "./fancy-transfer-cli-progress-bar.js";
export default function switchCliProgressStyle(cliStyle, { truncateName }) {
    switch (cliStyle) {
        case "basic":
            return BaseTransferCliProgressBar.createLineRenderer({ truncateName });
        case "fancy":
            return FancyTransferCliProgressBar.createLineRenderer({ truncateName });
    }
    void cliStyle;
    throw new Error(`Unknown CLI progress style: ${cliStyle}`);
}
//# sourceMappingURL=switch-cli-progress-style.js.map