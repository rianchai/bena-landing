/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // bikin semua file .svg bisa diimport sebagai komponen React
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: true,
            svgoConfig: {
              plugins: [{ name: "removeViewBox", active: false }],
            },
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;
