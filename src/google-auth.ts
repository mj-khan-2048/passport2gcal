import * as fs from "fs";
import { authenticate } from "@google-cloud/local-auth";
import { OAuth2Client } from "google-auth-library";

const TOKEN_PATH = "google-oauth/token.json";
const CREDENTIALS_PATH = "google-oauth/credentials.json";
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

export async function getAuthorizedClient(): Promise<OAuth2Client> {
    // Parse credentials.json
    const { installed } = JSON.parse(
        fs.readFileSync(CREDENTIALS_PATH, "utf8"),
    );

    // Check if token.json already exists
    if (fs.existsSync(TOKEN_PATH)) {
        const client = new OAuth2Client(
            installed.client_id,
            installed.client_secret,
        );

        client.setCredentials(
            JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8")),
        );

        return client;
    }
    
    // If not then authenticate and generate new token and store as token.json
    const client = await authenticate({
        keyfilePath: CREDENTIALS_PATH,
        scopes: SCOPES,
    });

    fs.writeFileSync(
        TOKEN_PATH,
        JSON.stringify(client.credentials, null, 2),
        { mode: 0o600 },
    );

    return client as unknown as OAuth2Client;
}

