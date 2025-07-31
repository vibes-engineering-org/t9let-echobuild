import { PROJECT_TITLE } from "~/lib/constants";

export async function GET() {
  const appUrl =
    process.env.NEXT_PUBLIC_URL ||
    `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;

  const config = {
    accountAssociation: {
      header: "eyJmaWQiOjg2OTk5OSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDc2ZDUwQjBFMTQ3OWE5QmEyYkQ5MzVGMUU5YTI3QzBjNjQ5QzhDMTIifQ",
      payload: "eyJkb21haW4iOiJ0OWxldC1lY2hvYnVpbGQudmVyY2VsLmFwcCJ9",
      signature: "MHhjMmEyMTZkN2JmZDQ5ZjA3ZTJkMTY0MDc0OGFlZWYxMjAyZGZlMjNkOWU3YTFjNTE1NDkyZWQxYjQ1OWVlNWRiMTJiMDM5OThjMDhjYjUyZTU5ZGJiZTIxNTdjODUwMmZkM2I0ZjI2ZjU0ODE1OTJiMDdhMGVhZTU1ZGFjYmI4YjFj"
    },
    frame: {
      version: "1",
      name: PROJECT_TITLE,
      iconUrl: `${appUrl}/icon.png`,
      homeUrl: appUrl,
      imageUrl: `${appUrl}/og.png`,
      buttonTitle: "Open",
      splashImageUrl: `${appUrl}/splash.png`,
      splashBackgroundColor: "#555555",
      webhookUrl: `${appUrl}/api/webhook`,
      primaryCategory: "developer-tools",
      tags: ["builder", "farcaster", "base", "web3", "miniapp"],
    },
  };

  return Response.json(config);
}
