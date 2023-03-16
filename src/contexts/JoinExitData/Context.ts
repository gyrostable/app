import { createContext, Dispatch, SetStateAction } from "react";
import { JoinExitDataType } from "./Provider";

interface JoinExitDataProps {
  loading: boolean;
  data: JoinExitDataType[];
  selectionChoices: ("All" | "My")[];
  setSelected: Dispatch<SetStateAction<"All" | "My">>;
  selected: "All" | "My";
  limit: number;
  incrementLimit: () => void;
}

const Context = createContext<JoinExitDataProps>({
  loading: true,
  data: [],
  selectionChoices: [],
  setSelected: () => {},
  selected: "All",
  limit: 5,
  incrementLimit: () => {},
});

export default Context;
