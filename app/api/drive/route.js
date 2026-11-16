import { NextResponse } from "next/server";
import { google } from "googleapis";

export async function GET() {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    const drive = google.drive({ version: "v3", auth: oauth2Client });
    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

    // Photos fetch karo (no thumbnail needed, src proxy will handle)
    const photosRes = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "files(id, name)",
      pageSize: 100,
      orderBy: "createdTime desc",
    });

    // Videos fetch karo WITH thumbnailLink for cover
    const videosRes = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'video/' and trashed = false`,
      fields: "files(id, name, thumbnailLink)", // <-- Yaha thumbnailLink add kiya
      pageSize: 100,
      orderBy: "createdTime desc",
    });

    const photos = (photosRes.data.files || []).map((file) => ({
      id: file.id,
      name: file.name,
      src: `/api/drive/image/${file.id}`, // Proxy URL for fast loading
    }));

    const videos = (videosRes.data.files || []).map((file) => ({
      id: file.id,
      name: file.name,
      src: `/api/drive/image/${file.id}`,
      // Thumbnail URL (agar Google deta hai toh)
      thumbnail: file.thumbnailLink ? file.thumbnailLink.replace(/=s\d+/, "=s1000") : null,
    }));

    return NextResponse.json({ photos, videos });
  } catch (error) {
    console.error("Drive API Error:", error);
    return NextResponse.json({ error: "Failed to fetch from Drive" }, { status: 500 });
  }
}