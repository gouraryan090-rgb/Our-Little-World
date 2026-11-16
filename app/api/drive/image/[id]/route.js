import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const range = request.headers.get("range");

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    const meta = await drive.files.get({
      fileId: id,
      fields: "mimeType, size",
    });

    const mimeType = meta.data.mimeType;
    const size = parseInt(meta.data.size, 10);

    // 1 saal ka cache lagaya (Photos fast load hongi)
    const headers = {
      "Content-Type": mimeType,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000, immutable",
    };

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : size - 1;
      const chunksize = end - start + 1;

      headers["Content-Range"] = `bytes ${start}-${end}/${size}`;
      headers["Content-Length"] = chunksize;

      const response = await drive.files.get(
        { fileId: id, alt: "media" },
        { 
          responseType: "stream",
          headers: { Range: `bytes=${start}-${end}` }
        }
      );

      const chunks = [];
      for await (const chunk of response.data) {
        chunks.push(chunk);
      }
      return new NextResponse(Buffer.concat(chunks), { status: 206, headers });
    }

    const response = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "stream" }
    );

    const chunks = [];
    for await (const chunk of response.data) {
      chunks.push(chunk);
    }
    headers["Content-Length"] = size;

    return new NextResponse(Buffer.concat(chunks), { status: 200, headers });
  } catch (error) {
    console.error("Media fetch error:", error);
    return NextResponse.json({ error: "Media not found" }, { status: 404 });
  }
}