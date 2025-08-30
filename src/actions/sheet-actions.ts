'use server'
import { Prayer } from '@/app/types';
import { readSheet } from '@/lib/google-sheets'

export async function getPrayersToAssign() {
    try {
        const data = await readSheet(process.env.ASSIGN_SHEET_RANGE ?? '')
        if (
            data.length === 2 &&
            data[1][0] === "Filas"
        )
            return { success: true, data: [] };
        const mappedPrayers = (data.slice(1) ?? []).map(
            (row) =>
            ({
                id: row[3],
                text: row[2]?.replaceAll(/\u00A0/g, " "),
                category: row[1],
                priority: row[0],
            } as Prayer)
        );
        return {
            success: true, data: mappedPrayers
        }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : error
        return { success: false, error: message, data: [] }
    }
}

export async function markAssignedPrayers(prayerIds: string[]) {
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

        return { success: true, data: {} }
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : error
        return { success: false, error: message, data: [] }
    }
}