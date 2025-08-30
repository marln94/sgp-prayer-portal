import { google } from "googleapis";

export async function connectToSheets() {
    const auth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    return google.sheets({ version: 'v4', auth })

}

export async function readSheet(range: string) {
    const sheets = await connectToSheets()
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.SGP_SHEETS_ID,
        range,
    })
    return response.data.values || []
}

