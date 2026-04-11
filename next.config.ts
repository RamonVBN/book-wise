import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  pageExtensions: ['page.tsx', 'api.ts'],

  images: {
    domains: ["books.google.com", "lh3.googleusercontent.com", "covers.openlibrary.org"],
  },
  
};

export default nextConfig;
