import erc20 from "./ERC20.json";
import vault from "./Vault.json";
import balancerHelpers from "./BalancerHelpers.json";
import chainalysis from "./Chainalysis.json";
import gyro2 from "./GyroTwoPool.json";
import gyro3 from "./GyroThreePool.json";
import gyroE from "./GyroEPool.json";
import reserveManager from "./ReserveManager.json";
import motherboard from "./Motherboard.json";
import primaryAMMV1 from "./PrimaryAMMV1.json";
import gydToken from "./GydToken.json";
import gyroConfig from "./GyroConfig.json";
import capAuthentication from "./CapAuthentication.json";
import multicall from "./Multicall.json";
import reserveSystemRead from "./ReserveSystemRead.json";
import balancer2CLPPriceOracle from "./Balancer2CLPPriceOracle.json";
import balancer3CLPPriceOracle from "./Balancer3CLPPriceOracle.json";
import balancerECLPPriceOracle from "./BalancerECLPPriceOracle.json";

export {
  erc20,
  vault,
  balancerHelpers,
  chainalysis,
  gyro2,
  gyro3,
  gyroE,
  reserveManager,
  motherboard,
  primaryAMMV1,
  gydToken,
  gyroConfig,
  capAuthentication,
  multicall,
  reserveSystemRead,
  balancer2CLPPriceOracle,
  balancer3CLPPriceOracle,
  balancerECLPPriceOracle,
};

export const ABI_MAP = {
  Gyro2: gyro2,
  Gyro3: gyro3,
  GyroE: gyroE,
};
