import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";

export async function POST() {
  const batchSize = 100;
  const batches = [];

  for (let i = 0; i < advocateData.length; i += batchSize) {
    const batch = advocateData.slice(i, i + batchSize);
    batches.push(db.insert(advocates).values(batch));
  }

  const records = await Promise.all(batches);
  return Response.json({ advocates: records.flat() });
}
