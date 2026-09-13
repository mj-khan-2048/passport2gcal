import * as fs from "fs";
import * as http from "http";
import { OAuth2Client } from "google-auth-library";

const TOKEN_PATH = "google-oauth/token.json";
const CREDENTIALS_PATH = "google-oauth/credentials.json";
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

function waitForAuthCode(server: http.Server): Promise<string> {
  return new Promise((resolve, reject) => {
    server.on("request", (req, res) => {
      const url = new URL(req.url ?? "", "http://localhost");
      const code = url.searchParams.get("code");

      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h1>Success!</h1>You can close this tab and return to the terminal.");

      if (code) {
        resolve(code);
      } else {
        reject(new Error("No authorization code found in redirect."));
      }
    });
  });
}

export async function getAuthorizedClient(): Promise<OAuth2Client> {
  const credentialsRaw = fs.readFileSync(CREDENTIALS_PATH, "utf-8");
  const credentials = JSON.parse(credentialsRaw);
  const { client_id, client_secret } = credentials.installed;

  if (fs.existsSync(TOKEN_PATH)) {
    const tokenRaw = fs.readFileSync(TOKEN_PATH, "utf-8");
    const token = JSON.parse(tokenRaw);
    const oAuth2Client = new OAuth2Client(client_id, client_secret);
    oAuth2Client.setCredentials(token);
    return oAuth2Client;
  }

  // Start a local server on a random available port (0 = "pick any free port")
  const server = http.createServer();
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address();
  if (typeof address === "string" || address === null) {
    throw new Error("Failed to determine local server port.");
  }

  const port = address.port;
  const redirectUri = `http://localhost:${port}`;

  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirectUri);

  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });

  console.log("Opening browser for Google authorization...");
  console.log(`If it doesn't open automatically, visit:\n${authUrl}\n`);

  const codePromise = waitForAuthCode(server);

  // Try to open the browser automatically
  const { exec } = await import("child_process");
  exec(`start "" "${authUrl}"`); // Windows-specific; see note below

  const code = await codePromise;
  server.close();

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log(`Token saved to ${TOKEN_PATH}`);

  return oAuth2Client;
}
