import { GyroPoolTypes } from "../../../types/pool";

const dictionary: Record<GyroPoolTypes, string> = {
  Gyro2: "2-CLP",
  Gyro3: "3-CLP",
  GyroE: "E-CLP",
};

export type SubgraphPoolTypeType = GyroPoolTypes | null;

const convertPoolType = (subgraphPoolType?: SubgraphPoolTypeType) => {
  return (
    (subgraphPoolType && dictionary[subgraphPoolType]) ?? "Unknown Pool Type"
  );
};

export default convertPoolType;
