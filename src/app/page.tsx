import { google } from "googleapis";

import { Prayer } from "./types";
import Prayers from "../components/prayers";

export default async function Home() {
  async function fetchPrayers(): Promise<Prayer[]> {
    "use server";

    const auth = new google.auth.GoogleAuth({
      projectId: process.env.GOOGLE_PROJECT_ID,
      credentials: {
        type: process.env.GOOGLE_TYPE,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN,
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });
    const sheets = google.sheets({ version: "v4", auth });
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SGP_SHEETS_ID,
      range: process.env.ASSIGN_SHEET_RANGE,
    });
    if (
      response.data.values?.length === 2 &&
      response.data.values[1][0] === "Filas"
    )
      return [];
    return (response.data.values?.slice(1) ?? []).map(
      (row) =>
        ({
          id: row[3],
          text: row[2]?.replaceAll(/\u00A0/g, " "),
          category: row[1],
          priority: row[0],
        } as Prayer)
    );
  }

  async function markAssignedPrayers(prayerIds: string[]) {
    "use server";

    const url = process.env.N8N_WEBHOOK_HOST + "/set-assigned-prayers";
    try {
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({ ids: prayerIds }),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${process.env.N8N_USER}:${process.env.N8N_PASSWORD}`
          ).toString("base64")}`,
        },
      });
    } catch (error) {
      console.error("Error marking prayers as assigned:", error);
    }
  }

  return (
    <div className="flex flex-col gap-2 p-4 max-w-2xl mx-auto mt-(--header-height)">
      <Prayers
        markAssignedPrayers={markAssignedPrayers}
        prayersPromise={fetchPrayers()}
        fetchPrayers={fetchPrayers}
      />
    </div>
  );
}
