import { WinnersApiService } from '../../bll/winners';
import type { SaveWinnerRequest } from '../../bll/winners/types';
import type { MutationConfig } from '../mutation';
import { Mutation } from '../mutation';

type Response = void;

type SaveWinnerMutationConfig = Omit<
  MutationConfig<Response, SaveWinnerRequest>,
  'mutateFn'
>;

export const useSaveWinnerMutation = (
  config: SaveWinnerMutationConfig
): Mutation<Response, SaveWinnerRequest> =>
  new Mutation({
    mutateFn: (props) => WinnersApiService.saveWinner(props),
    ...config,
  });
