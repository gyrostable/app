import { BigNumber } from "ethers";
import { defaultAbiCoder } from "@ethersproject/abi";

export enum JoinKind {
  INIT,
  EXACT_TOKENS_IN_FOR_BPT_OUT,
  TOKEN_IN_FOR_EXACT_BPT_OUT,
  ALL_TOKENS_IN_FOR_EXACT_BPT_OUT,
}

export enum ExitKind {
  EXACT_BPT_IN_FOR_ONE_TOKEN_OUT,
  EXACT_BPT_IN_FOR_TOKENS_OUT,
  BPT_IN_FOR_EXACT_TOKENS_OUT,
}

export function generateUserData(
  isJoin: boolean,
  kind: JoinKind | ExitKind,
  amounts?: BigNumber[],
  bptAmount?: BigNumber,
  tokenIndex?: BigNumber
) {
  const userData = isJoin
    ? {
        [JoinKind["INIT"]]: [JoinKind["INIT"], amounts],
        [JoinKind["EXACT_TOKENS_IN_FOR_BPT_OUT"]]: [
          JoinKind["EXACT_TOKENS_IN_FOR_BPT_OUT"],
          amounts,
          bptAmount,
        ],
        [JoinKind["TOKEN_IN_FOR_EXACT_BPT_OUT"]]: [
          JoinKind["TOKEN_IN_FOR_EXACT_BPT_OUT"],
          bptAmount,
          tokenIndex,
        ],
        [JoinKind["ALL_TOKENS_IN_FOR_EXACT_BPT_OUT"]]: [
          JoinKind["ALL_TOKENS_IN_FOR_EXACT_BPT_OUT"],
          bptAmount,
        ],
      }[kind as JoinKind]
    : {
        [ExitKind["EXACT_BPT_IN_FOR_ONE_TOKEN_OUT"]]: [
          ExitKind["EXACT_BPT_IN_FOR_ONE_TOKEN_OUT"],
          bptAmount,
          tokenIndex,
        ],
        [ExitKind["EXACT_BPT_IN_FOR_TOKENS_OUT"]]: [
          ExitKind["EXACT_BPT_IN_FOR_TOKENS_OUT"],
          bptAmount,
        ],
        [ExitKind["BPT_IN_FOR_EXACT_TOKENS_OUT"]]: [
          ExitKind["BPT_IN_FOR_EXACT_TOKENS_OUT"],
          amounts,
          bptAmount,
        ],
      }[kind as ExitKind];

  const userDataAbi = isJoin
    ? joinKindAbiMap[kind as JoinKind]
    : exitKindAbiMap[kind as ExitKind];

  const userDataEncoded = defaultAbiCoder.encode(userDataAbi, userData);

  return userDataEncoded;
}

const joinKindAbiMap: {
  [key in JoinKind]: string[];
} = {
  [JoinKind["INIT"]]: ["uint256", "uint256[]"],
  [JoinKind["EXACT_TOKENS_IN_FOR_BPT_OUT"]]: [
    "uint256",
    "uint256[]",
    "uint256",
  ],
  [JoinKind["TOKEN_IN_FOR_EXACT_BPT_OUT"]]: ["uint256", "uint256", "uint256"],
  [JoinKind["ALL_TOKENS_IN_FOR_EXACT_BPT_OUT"]]: ["uint256", "uint256"],
};

const exitKindAbiMap: {
  [key in ExitKind]: string[];
} = {
  [ExitKind["EXACT_BPT_IN_FOR_ONE_TOKEN_OUT"]]: ["uint256", "uint256"],
  [ExitKind["EXACT_BPT_IN_FOR_TOKENS_OUT"]]: ["uint256", "uint256"],
  [ExitKind["BPT_IN_FOR_EXACT_TOKENS_OUT"]]: [
    "uint256",
    "uint256[]",
    "uint256",
  ],
};
