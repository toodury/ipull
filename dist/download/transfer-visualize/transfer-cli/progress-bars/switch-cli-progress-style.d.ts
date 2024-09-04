export type AvailableCLIProgressStyle = "basic" | "fancy";
export default function switchCliProgressStyle(cliStyle: AvailableCLIProgressStyle, { truncateName }: {
    truncateName?: boolean | number;
}): (status: import("./base-transfer-cli-progress-bar.js").CliFormattedStatus) => string;
