export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about", "/login"],
      disallow: ["/ceo", "/manage", "/employee", "/test"],
    },
    sitemap: `${process.env.APP_URL || "https://analyst-web-app-ten.vercel.app"}/sitemap.xml`,
  };
}
