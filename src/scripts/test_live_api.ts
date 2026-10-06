import "dotenv/config";
import { connectDatabase } from "../config/database.js";
import { getServices } from "../controllers/service.controller.js";

async function testApi() {
  await connectDatabase();

  const testCases = [
    { name: "All Services (no param)", query: {} },
    { name: "Full Home Renovation", query: { category: "full-home-renovation" } },
    { name: "Kitchen Renovation", query: { category: "kitchen-renovation" } },
    { name: "Bathroom Renovation", query: { category: "bathroom-renovation" } },
    { name: "Custom Furniture", query: { category: "custom-furniture" } },
    { name: "Wardrobe & Cabinet", query: { category: "wardrobe-cabinet" } },
    { name: "Doors, Windows & Frames", query: { category: "doors-windows-frames" } },
    { name: "Wooden Flooring & Decking", query: { category: "wooden-flooring-decking" } },
    { name: "Painting, Wall Finishing & Interior Design", query: { category: "painting-wall-finishing-interior-design" } },
  ];

  console.log("\n============================================================");
  console.log("LIVE API ENDPOINT TEST (GET /api/services)");
  console.log("============================================================\n");

  for (const tc of testCases) {
    let responseData: any = null;
    let statusCode = 200;

    const req: any = { query: tc.query };
    const res: any = {
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        responseData = data;
        return this;
      },
    };
    const next = (err: any) => {
      console.error("API Error:", err);
    };

    await (getServices as any)(req, res, next);

    const services = responseData?.services || [];
    console.log(`[API TEST] ${tc.name} (?category=${tc.query.category || "none"})`);
    console.log(`  -> Status: ${statusCode}, Count: ${services.length}`);
    services.forEach((s: any) => {
      console.log(`     * ${s.title} [Category: ${s.category?.name || "None"}]`);
    });
    console.log("");
  }

  process.exit(0);
}

testApi().catch((err) => {
  console.error(err);
  process.exit(1);
});
