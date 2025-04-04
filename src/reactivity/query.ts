import { Signal } from './signal';

export type QueryConfig<T, A extends object> = {
  callback: (arguments_: A) => Promise<T>;
  defaultArgs: A;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onLoading?: () => void;
};

export class Query<T, A extends object> {
  public data: Signal<T | null>;
  public isLoading: Signal<boolean>;
  public isError: Signal<boolean>;
  private error: Signal<Error | null>;
  private callback: (arguments_: A) => Promise<T>;

  private onSuccess?: (data: T) => void;
  private onError?: (error: Error) => void;
  private onLoading?: () => void;

  private lastArgs?: A;

  constructor(config: QueryConfig<T, A>) {
    this.callback = config.callback;
    this.lastArgs = config.defaultArgs;
    this.onSuccess = config.onSuccess;
    this.onError = config.onError;
    this.onLoading = config.onLoading;

    this.data = new Signal<T | null>(null);
    this.isLoading = new Signal<boolean>(false);
    this.isError = new Signal<boolean>(false);
    this.error = new Signal<Error | null>(null);

    if (Object.values(config.defaultArgs).length)
      void this.fetchData(config.defaultArgs);
  }

  public refetch(newArguments?: A): void {
    void this.fetchData(newArguments ?? this.lastArgs!);
  }

  private async fetchData(arguments_: A): Promise<void> {
    this.isLoading.set(true);
    this.isError.set(false);
    this.error.set(null);
    this.lastArgs = arguments_;

    if (this.onLoading) this.onLoading();

    try {
      const result = await this.callback(arguments_);
      this.data.set(result);

      if (this.onSuccess) this.onSuccess(result);
    } catch (error) {
      this.isError.set(true);
      const errorInstance =
        error instanceof Error ? error : new Error(String(error));
      this.error.set(errorInstance);

      if (this.onError) this.onError(errorInstance);
    } finally {
      this.isLoading.set(false);
    }
  }
}
