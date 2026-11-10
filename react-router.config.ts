import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  buildDirectory: "dist",
  ssr: false,
  prerender: ["/"],
  routeDiscovery: { mode: "initial" },
} satisfies Config;
