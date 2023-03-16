const POOLS_DISCLAIMER = {
  type: "pools",
  content:
    "Code for the pool contracts is available on GitHub for review. This code underwent two audits. However, this is experimental software. FTL Labs accepts no liability for lost funds. You can use the interface and underlying functionalities at your own risk only. The risks of providing liquidity to these pools are described further in the docs and Terms of Service.",
  links: [
    {
      url: "https://github.com/gyrostable/concentrated-lps",
      range: [44, 50],
    },
    {
      url: "https://docs.gyro.finance/gyroscope-protocol/audit-reports",
      range: [83, 93],
    },
    {
      url: "https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools",
      range: [338, 342],
    },
    {
      url: "https://www.gyro.finance/terms-of-service",
      range: [347, 363],
    },
  ],
};

export default POOLS_DISCLAIMER;
