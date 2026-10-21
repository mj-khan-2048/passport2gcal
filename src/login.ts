import { firefox } from "playwright";
import { Session, askUser } from "./utils.js";

const IS_HEADLESS = true;
const LOGIN_URL = "https://www.publix.org/";

export async function loginToPassport(email: string, password?: string): Promise<Session> {
    const browserInstance = await firefox.launch({ headless: IS_HEADLESS });
    const page = await browserInstance.newPage();

    await page.goto(LOGIN_URL);

    console.log("Logging in...");
    await page.getByRole("button", { name: "Log in" }).click();

    console.log("Entering email...");
    await page.locator('input[type="email"]').fill(email);
    await page.getByRole("button", { name: "Next" }).click();

    password = password ?? await askUser("Enter your Publix PASSPORT password: ");
    console.log("Entering password...");
    await page.locator('input[type="password"]').fill(password);
    await page.getByRole("button", { name: "Sign in" }).click();

    await page.getByRole("button", { name: /Text/i }).click();
    console.log("Waiting on OTP...");
    const otpCode = await askUser("Enter the OTP code you received: ");
    await page.getByPlaceholder('Code').fill(otpCode);
    await page.getByRole("button", { name: "Verify" }).click();

    await page.getByRole("link", { name: "Schedule" }).click();

    console.log("Success! Logged in!");

    console.log("Navigating to Schedule page...");

    return { browserInstance: browserInstance, page: page };
}