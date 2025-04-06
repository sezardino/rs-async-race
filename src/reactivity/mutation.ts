import { Signal } from './signal';

export type MutationConfig<Response, Props extends object> = {
  mutateFn: (arguments_: Props) => Promise<Response>;
  onSuccess?: (data: Response) => void;
  onError?: (error: Error) => void;
  onLoading?: () => void;
};

export class Mutation<Response, Props extends object> {
  public isLoading: Signal<boolean>;
  public isError: Signal<boolean>;
  private error: Signal<Error | null>;
  private mutateFn: (arguments_: Props) => Promise<Response>;

  private onSuccess?: (data: Response) => void;
  private onError?: (error: Error) => void;
  private onLoading?: () => void;

  constructor(config: MutationConfig<Response, Props>) {
    this.mutateFn = config.mutateFn;
    this.onSuccess = config.onSuccess;
    this.onError = config.onError;
    this.onLoading = config.onLoading;

    this.isLoading = new Signal<boolean>(false);
    this.isError = new Signal<boolean>(false);
    this.error = new Signal<Error | null>(null);
  }

  public async mutate(props: Props): Promise<Response> {
    this.isLoading.set(true);
    this.isError.set(false);
    this.error.set(null);

    if (this.onLoading) this.onLoading();

    try {
      const result = await this.mutateFn(props);

      if (this.onSuccess) this.onSuccess(result);

      return result;
    } catch (error) {
      this.isError.set(true);

      const errorInstance =
        error instanceof Error ? error : new Error(String(error));
      this.error.set(errorInstance);

      if (this.onError) this.onError(errorInstance);

      throw errorInstance;
    } finally {
      this.isLoading.set(false);
    }
  }
}
