import { NextResponse } from "next/server";
import { getSessionOrJwt } from "@/lib/jwt-auth";
import fs from "fs";
import path from "path";

const statePath = path.join(process.cwd(), "src/lib/ai/state.json");

function ensureStateFile() {
  const dir = path.dirname(statePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(statePath)) {
    const defaultState = {
      KILL_CRITIC_MODE: false,
      EXPOSED_MODE: true,
      IQ_200: true,
      THINKING_10X: true,
      AUTOPSY_MODE: false,
      ZERO_ASSUMPTIONS: true,
      NO_SHORTCUTS: true,
      NO_PLACEHOLDER: true,
    };
    fs.writeFileSync(statePath, JSON.stringify(defaultState, null, 2));
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSessionOrJwt(req);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    ensureStateFile();
    const content = fs.readFileSync(statePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error("[AI_SETTINGS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSessionOrJwt(req);
    if (!session || session.user?.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    ensureStateFile();
    
    fs.writeFileSync(statePath, JSON.stringify(body, null, 2));
    return NextResponse.json(body);
  } catch (error) {
    console.error("[AI_SETTINGS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
