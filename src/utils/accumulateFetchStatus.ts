const accumulateFetchStatus = (...fetchStatuses: FetchType[]): FetchType => {
  if (fetchStatuses.some((el) => el === "failed")) return "failed";
  if (fetchStatuses.every((el) => el === "success")) return "success";
  return "fetching";
};

export default accumulateFetchStatus;
