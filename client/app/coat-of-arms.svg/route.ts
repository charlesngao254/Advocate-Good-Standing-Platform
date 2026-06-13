import { readFile } from "node:fs/promises";

const COAT_OF_ARMS_PNG_ABS_PATH =
  "C:\\Users\\mesha\\.cursor\\projects\\e-advocate-good-standing-platform\\assets\\c__Users_mesha_AppData_Roaming_Cursor_User_workspaceStorage_6dedef0f62af7b2f4fd33c401209609b_images_image-f6ef45a4-0ba2-4f80-9bed-9dd2bfe2b355.png";

function svgWrapper(pngBase64: string) {
  // Sized for the sidebar badge, but scalable via CSS.
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <image href="data:image/png;base64,${pngBase64}" x="0" y="0" width="64" height="64" preserveAspectRatio="xMidYMid meet" />
</svg>`;
}

export async function GET() {
  try {
    const png = await readFile(COAT_OF_ARMS_PNG_ABS_PATH);
    const base64 = png.toString("base64");

    return new Response(svgWrapper(base64), {
      headers: {
        "content-type": "image/svg+xml; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const fallback = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="rgba(255,255,255,0.12)"/>
  <path d="M18 20h28v18c0 12-9 19-14 21-5-2-14-9-14-21V20Z" fill="none" stroke="white" stroke-width="3" />
  <text x="32" y="36" text-anchor="middle" fill="white" font-size="10" font-family="system-ui,Segoe UI,Arial">COA</text>
  <title>Coat of arms missing: ${message.replaceAll("<", "&lt;").replaceAll(">", "&gt;")}</title>
</svg>`;
    return new Response(fallback, {
      headers: {
        "content-type": "image/svg+xml; charset=utf-8",
        "cache-control": "no-store",
      },
      status: 200,
    });
  }
}

