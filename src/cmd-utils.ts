import * as readline from "readline/promises";

export async function askUser(questionStr: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const answer = await rl.question(questionStr);
    rl.close();
    return answer.trim();
}