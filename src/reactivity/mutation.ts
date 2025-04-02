import { Signal } from './signal';

type MutationConfig<T, A extends object> = {
  mutateFn: (arguments_: A) => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  onLoading?: () => void;
};

export class Mutation<T, A extends object> {
  public isLoading: Signal<boolean>;
  public isError: Signal<boolean>;
  private error: Signal<Error | null>;
  private mutateFn: (arguments_: A) => Promise<T>;

  private onSuccess?: (data: T) => void;
  private onError?: (error: Error) => void;
  private onLoading?: () => void;

  constructor(config: MutationConfig<T, A>) {
    this.mutateFn = config.mutateFn;
    this.onSuccess = config.onSuccess;
    this.onError = config.onError;
    this.onLoading = config.onLoading;

    this.isLoading = new Signal<boolean>(false);
    this.isError = new Signal<boolean>(false);
    this.error = new Signal<Error | null>(null);
  }

  public async mutate(arguments_: A): Promise<void> {
    this.isLoading.set(true);
    this.isError.set(false);
    this.error.set(null);

    if (this.onLoading) this.onLoading();

    try {
      const result = await this.mutateFn(arguments_);

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
