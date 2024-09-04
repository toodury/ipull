import UpdateManager from "stdout-update";
export type BaseLoadingAnimationOptions = {
    updateIntervalMs?: number;
    loadingText?: string;
};
export declare const DEFAULT_LOADING_ANIMATION_OPTIONS: BaseLoadingAnimationOptions;
export default abstract class BaseLoadingAnimation {
    protected options: BaseLoadingAnimationOptions;
    protected stdoutManager: UpdateManager;
    protected _animationActive: boolean;
    protected constructor(options?: BaseLoadingAnimationOptions);
    protected _render(): void;
    protected abstract createFrame(): string;
    start(): Promise<void>;
    stop(): void;
    private _processExit;
}
