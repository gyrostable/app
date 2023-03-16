/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  trailingSlash: true,
  images: {
    loader: "akamai",
    path: "",
  },
  async rewrites() {
    return [
      {
        source: "/:chainName*/:poolType*/:poolAddress*",
        destination: "/:chainName*/:poolType*/:poolAddress*",
      },
    ];
  },
};

module.exports = nextConfig;
