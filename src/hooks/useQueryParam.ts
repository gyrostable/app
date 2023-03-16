import { useRouter } from "next/router";

const useQueryParam = (param: string): string => {
  const {
    query: { [param]: value },
  } = useRouter();

  return value as string;
};

export default useQueryParam;
