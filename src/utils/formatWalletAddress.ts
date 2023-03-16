const MIN_LENGTH_BEFORE_TRUNCATION = 12;

const formatWalletAddress = (address: string) => {
  const segmentLength = MIN_LENGTH_BEFORE_TRUNCATION / 2;
  return (
    address &&
    (address.length > MIN_LENGTH_BEFORE_TRUNCATION
      ? `${address.slice(0, segmentLength)}...${address.slice(
          address.length - segmentLength
        )}`
      : address)
  );
};

export default formatWalletAddress;
