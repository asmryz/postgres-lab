import { Hono } from "hono";
const indexRoute = new Hono();
import { sql } from "../db"; // Importing from db to ensure it's initialized

indexRoute.get("/api/", async (c) => c.json({ name: "Cloudflare" }));

indexRoute.get("/execute/:query", async (c) => {
    console.log(c.req.param("query"));

	try {
		const result = await sql.query(c.req.param("query"));
		//console.log(result);
		return c.json(result, 200);
	} catch (err) {
		return c.json({ error: (err as Error).message }, 500);
	}
});

indexRoute.get("/schema/:schema", async (c) => {
    console.log(c.req.param("schema"));

	try {
		const result = await sql.query(`SET SCHEMA '${c.req.param("schema")}';`);
		//console.log(result);
		return c.json(result, 200);
	} catch (err) {
		return c.json({ error: (err as Error).message }, 500);
	}
});



export default indexRoute;