import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { runDFMSPHCalculation, PRESET_REACTIONS } from "./src/physics/dfmsphEngine";
import { CalculationInput } from "./src/types/dfmsph";

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  /* Health Check API */
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      program: "DFMSPH22",
      description: "Double Folding Interaction Potential for Spherical Nuclei",
      version: "2022.1",
      timestamp: new Date().toISOString()
    });
  });

  /* Get Preset Reaction Systems */
  app.get("/api/presets", (req, res) => {
    res.json(PRESET_REACTIONS);
  });

  /* Calculate Double Folding Interaction Potential */
  app.post("/api/calculate", (req, res) => {
    try {
      const input: CalculationInput = req.body;
      if (!input || !input.proj || !input.targ) {
        return res.status(400).json({ error: "Invalid calculation input structure" });
      }

      const result = runDFMSPHCalculation(input);
      return res.json(result);
    } catch (err: any) {
      console.error("Calculation Error:", err);
      return res.status(500).json({ error: err.message || "Failed to execute DFMSPH22 calculation" });
    }
  });

  /* Get Original C Code & Header Files */
  app.get("/api/c-code", (req, res) => {
    try {
      const requestedFile = (req.query.file as string) || "dfmsph22.c";
      // Sanitize filename to prevent directory traversal
      const safeFilename = path.basename(requestedFile);
      const cFilePath = path.join(process.cwd(), safeFilename);
      
      if (fs.existsSync(cFilePath)) {
        const code = fs.readFileSync(cFilePath, "utf-8");
        res.setHeader("Content-Type", "text/plain");
        return res.send(code);
      } else {
        return res.status(404).send(`// File ${safeFilename} not found`);
      }
    } catch (err: any) {
      return res.status(500).send(`// Error reading C file: ${err.message}`);
    }
  });

  /* Export formatted calculation data */
  app.post("/api/export", (req, res) => {
    try {
      const { format, input } = req.body;
      const result = runDFMSPHCalculation(input);

      if (format === "csv") {
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename="dfmsph22_${result.systemName.replace(/[^a-zA-Z0-9]/g, "_")}.csv"`);
        
        let csv = "R_fm,V_DF_MeV,V_C_MeV,V_Cent_MeV,V_Tot_MeV,V_WS_fit_MeV\n";
        result.radialData.forEach(p => {
          csv += `${p.R},${p.V_df},${p.V_c},${p.V_cent},${p.V_tot},${p.V_ws}\n`;
        });
        return res.send(csv);
      } else if (format === "json") {
        res.setHeader("Content-Type", "application/json");
        return res.json(result);
      } else if (format === "input") {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", `attachment; filename="dfmsph22.in"`);
        return res.send(result.cInputText);
      } else {
        /* Default .out format */
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Content-Disposition", `attachment; filename="dfmsph22.out"`);
        return res.send(result.cOutputText);
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  /* Vite Middleware for Dev or Static files for Production */
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", () => {
    console.log(`DFMSPH22 Web Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
