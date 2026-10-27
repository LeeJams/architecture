// Vite owns every runtime image; the standalone build inlines the same assets.
const files = import.meta.glob(
  ["../../assets/**/*.{svg,png,jpg,jpeg}", "!../../assets/tech/linux.svg"],
  {
    eager: true,
    query: "?url",
    import: "default",
  },
);
export const assetURL = (path) => files["../../" + path] || path;
export const resolveAssets = (value) =>
  typeof value === "string"
    ? assetURL(value)
    : Array.isArray(value)
      ? value.map(resolveAssets)
      : value && typeof value === "object"
        ? Object.fromEntries(
            Object.entries(value).map(([key, item]) => [
              key,
              resolveAssets(item),
            ]),
          )
        : value;
export const assets = resolveAssets({
  aws: "assets/tech/aws.svg",
  ocaIcon: "assets/tech/oca-icon.svg",
  routing: "assets/tech/routing.svg",
  fill: "assets/tech/fill.svg",
  poster: "assets/netflix-case.svg",
  oca: "assets/tech/oca-appliance.svg",
  freebsd: "assets/tech/freebsd.svg",
  nginx: "assets/tech/nginx-mark.svg",
  https: "assets/tech/https.svg",
  storage: "assets/tech/storage.svg",
  player: "assets/tech/player.svg",
  cloudfront: "assets/tech/cloudfront.png",
  fastly: "assets/tech/fastly.svg",
  caddy: "assets/tech/caddy.svg",
  cloudflare: "assets/tech/cloudflare.svg",
  apache: "assets/tech/apache.svg",
  ubuntu: "assets/tech/ubuntu.svg",
  debian: "assets/tech/debian.svg",
  gcp: "assets/tech/gcp.svg",
  azure: "assets/tech/azure.svg",
  s3: "assets/tech/s3.png",
  gcs: "assets/tech/gcs.svg",
});
