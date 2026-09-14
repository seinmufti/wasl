import type { NextConfig } from "next";
import os from "node:os";

function getNetworkAddresses(): string[] {
  const addresses: string[] = ["localhost", "127.0.0.1"];
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === "IPv4" && !net.internal) {
        addresses.push(net.address);
      }
    }
  }
  return [...new Set(addresses)];
}

const nextConfig: NextConfig = {
  basePath: "/wasl",
  allowedDevOrigins: getNetworkAddresses(),
  async redirects() {
    return [
      {
        source: "/",
        destination: "/wasl",
        permanent: false,
        basePath: false,
      },
    ];
  },
};

export default nextConfig;
