import { log } from "./log";

export const assertResponseOk = async (response: Response) => {
    if (!response.ok) {
        let textContent = "";
        try {
            textContent = await response.text();
        } catch(e) {
            log.error("Failed to read response", e);
        }

        log.info("Call failed", response.url, response.status, textContent);
        throw new Error(`Failed to call ${response.url} ${response.status} ${textContent}`);
    }
}

export const assertResponseAndJsonOk = async <T = any>(response: Response) => {
    await assertResponseOk(response);
    try {
        return (await response.json() as T);
    } catch (e) {
        log.error("Failed to parse json", e);
        throw new Error(`Failed to parse json ${e}`);
    }
}