import type { NextConfig } from "next";

// Vendor-allowlisted CSP (no nonces, so pages stay statically renderable). Every origin here
// belongs to a real third party: Cloudinary (media), Firebase/Google (sign-in), Paystack
// (checkout) and Google Maps. Set CSP_REPORT_ONLY=true to trial changes without enforcing.
const isDev = process.env.NODE_ENV === "development";

const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://maps.googleapis.com https://*.gstatic.com https://js.paystack.co https://apis.google.com`, // React needs eval in dev
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' blob: data: https://res.cloudinary.com https://picsum.photos https://lh3.googleusercontent.com https://*.gstatic.com https://*.googleapis.com https://*.ggpht.com",
  "font-src 'self' https://fonts.gstatic.com",
  "connect-src 'self' https://*.googleapis.com https://securetoken.googleapis.com https://identitytoolkit.googleapis.com https://api.paystack.co https://*.gstatic.com",
  "frame-src 'self' https://*.firebaseapp.com https://accounts.google.com https://checkout.paystack.com https://*.paystack.com",
  "worker-src 'self' blob:", // Google Maps renders in blob workers
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  // No upgrade-insecure-requests: HSTS already forces HTTPS and every allowed origin is https,
  // while the directive breaks redirects when running `next start` over plain-http localhost.
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self), browsing-topics=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: process.env.CSP_REPORT_ONLY === "true" ? "Content-Security-Policy-Report-Only" : "Content-Security-Policy",
    value: csp,
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" }, // listing media
      { protocol: "https", hostname: "picsum.photos" }, // seed data placeholders
      { protocol: "https", hostname: "lh3.googleusercontent.com" }, // Google avatars
    ],
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
