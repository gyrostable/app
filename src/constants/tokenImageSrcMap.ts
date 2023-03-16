import { StaticImageData } from "next/image";
import dai from "../../public/tokens/dai.png";
import usdc from "../../public/tokens/usdc.png";
import usdt from "../../public/tokens/usdt.png";
import busd from "../../public/tokens/busd.png";
import tusd from "../../public/tokens/tusd.png";
import weth from "../../public/tokens/weth.png";

const tokenImageSrcMap: Record<string, StaticImageData> = {
  DAI: dai,
  USDC: usdc,
  USDT: usdt,
  BUSD: busd,
  TUSD: tusd,
  WETH: weth,
};

export default tokenImageSrcMap;
