import { ethers } from "ethers";
import { Multicall } from "../../types/typechain";

async function multicall(
  multicallContract: Multicall,
  contract:
    | {
        abi: any[];
        address: string;
      }
    | {
        abi: any[];
        address: string;
      }[],
  functions: (string | string[])[]
) {
  const contracts = Array.isArray(contract)
    ? contract
    : new Array(functions.length).fill(contract);

  const { returnData } = await multicallContract.callStatic.aggregate(
    functions.map((functionName, index) => {
      const iface = new ethers.utils.Interface(contracts[index].abi);
      return {
        target: contracts[index].address,
        callData: iface.encodeFunctionData(
          Array.isArray(functionName) ? functionName[0] : functionName,
          Array.isArray(functionName) ? functionName.slice(1) : []
        ),
      };
    })
  );

  return functions.map((functionName, index) => {
    const iface = new ethers.utils.Interface(contracts[index].abi);
    const decodedResult = iface.decodeFunctionResult(
      Array.isArray(functionName) ? functionName[0] : functionName,
      returnData[index]
    );
    return decodedResult.length === 1 ? decodedResult[0] : decodedResult;
  });
}

export default multicall;
