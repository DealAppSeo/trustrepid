import type { NextConfig } from "next";

// Same engine the site already reads (lib/engine.ts).
const ENGINE_URL = process.env.NEXT_PUBLIC_REPID_ENGINE_URL || "https://repid-engine-production.up.railway.app";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: process.cwd(),
  },
  // ERC-8004 agent registration files (D-113: the engine is the canonical host).
  // Tokens 6705-6712 on IdentityRegistry 0x8004A818BFB912233c491871b3d84c89A494BD9e
  // (Base Sepolia) carry agentURI https://trustrepid.dev/agents/trinity-<name>, and the spec
  // says the agentURI MUST resolve to the registration file. No page lives under /agents, so
  // every /agents/<name> forwards to the engine's file; the engine accepts a name or a UUID.
  // Temporary (307): the tokens may later be repointed at the engine directly (setAgentURI).
  async redirects() {
    return [
      {
        source: "/agents/:name",
        destination: `${ENGINE_URL}/api/v1/agents/:name/registration.json`,
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
