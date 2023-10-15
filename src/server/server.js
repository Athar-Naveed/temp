import express from "express";
import cors from "cors";
import neo4j from "neo4j-driver";

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

      // Start your Express server after the driver is successfully connected
app.get("/query", async (req,res) => {
const driver =   await neo4j.driver("bolt://localhost:7687", neo4j.auth.basic('neo4j', '12345678'));
const session = driver.session();
res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
res.setHeader("Pragma", "no-cache");
res.setHeader("Expires", "0");
console.log(session)
// const data = session.run(`match (n) return id(n)`);
 return session
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
});