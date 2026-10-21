import * as fs from "fs";
import { authenticate } from "@google-cloud/local-auth";
import { OAuth2Client } from "google-auth-library";

const TOKEN_PATH = "google-oauth/token.json";
const CREDENTIALS_PATH = "google-oauth/credentials.json";
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

export async function getAuthorizedClient(): Promise<OAuth2Client> {
    const credentialsJson = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf8"));

    // Check if token.json already exists and authenticate with it
    if (fs.existsSync(TOKEN_PATH)) {
        const authClient = new OAuth2Client(
            credentialsJson.installed.client_id,
            credentialsJson.installed.client_secret,
        );

        authClient.setCredentials(
            JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8")),
        );

        return authClient;
    }
    
    // If not then authenticate and generate new token and store as token.json
    const authClient = await authenticate({
        keyfilePath: CREDENTIALS_PATH,
        scopes: SCOPES,
    });

    fs.writeFileSync(
        TOKEN_PATH,
        JSON.stringify(authClient.credentials, null, 2),
        { mode: 0o600 },
    );

    return authClient;
}

