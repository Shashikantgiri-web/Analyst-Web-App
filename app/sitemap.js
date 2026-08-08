export default function sitemap() {
  const base = process.env.APP_URL || "https://analyst-web-app-ten.vercel.app";

  return [
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/login`, changeFrequency: "yearly", priority: 0.5 },
  ];
}
