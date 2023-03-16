// Whitelist of poolIds
const POLYGON_WHITELIST = [
  "0xfa9ee04a5545d8e0a26b30f5ca5cbecd75ea645f000200000000000000000798",
  "0x17f1ef81707811ea15d9ee7c741179bbe2a63887000100000000000000000799",
  "0x97469e6236bd467cd147065f77752b00efadce8a0002000000000000000008c0",
  "0xdac42eeb17758daa38caf9a3540c808247527ae3000200000000000000000a2b",
];

const GOERLI_WHITELIST = [
  "0xe0711573a96806182c01ef6c349948edc6635b040002000000000000000002ab",
];

export const POOL_WHITELIST = [...POLYGON_WHITELIST, ...GOERLI_WHITELIST];

export function matchAddressToId(address: string) {
  const id = POOL_WHITELIST.find(
    (id) => id.slice(0, 42).toLowerCase() === address?.toLowerCase()
  );
  return id ? id : "";
}

// Whitelist of DSM joiners
export const PAMM_WHITELIST: string[] = [];
