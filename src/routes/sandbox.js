import express from "express";
import { Octokit } from "@octokit/rest";
import { runCodeWithJudge0 } from "../utils/judgeO.js";

const sandboxRouter = express.Router();

// // Initialize Octokit for GitHub API
// const octokit = new Octokit({
//   auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN, // Replace with your GitHub OAuth token
// });

// // Route: Fetch user repositories
// sandboxRouter.get("/repos", async (req, res) => {
//   try {
//     const { data } = await octokit.repos.listForAuthenticatedUser();
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching repositories:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Route: Fetch files from a repository
// sandboxRouter.get("/repos/:owner/:repo/contents/:path", async (req, res) => {
//   const { owner, repo, path } = req.params;
//   try {
//     const { data } = await octokit.repos.getContent({ owner, repo, path });
//     res.json(data);
//   } catch (error) {
//     console.error("Error fetching file contents:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// // Route: Commit changes to a file (with SHA)
// sandboxRouter.post("/repos/:owner/:repo/contents/:path", async (req, res) => {
//   const { owner, repo, path } = req.params;
//   const { content, message } = req.body;
//   try {
//     // Get current file SHA (if file exists)
//     let sha;
//     try {
//       const { data } = await octokit.repos.getContent({ owner, repo, path });
//       sha = data.sha;
//     } catch (e) {
//       // File doesn't exist, sha remains undefined for create
//     }

//     const { data } = await octokit.repos.createOrUpdateFileContents({
//       owner,
//       repo,
//       path,
//       message,
//       content: Buffer.from(content).toString("base64"),
//       ...(sha && { sha }),
//     });
//     res.json(data);
//   } catch (error) {
//     console.error("Error committing changes:", error.message);
//     res.status(500).json({ error: error.message });
//   }
// });

// Route: Execute code in sandbox
sandboxRouter.post("/run-code", async (req, res) => {
  const { language, code } = req.body;

  try {
    const output = await runCodeWithJudge0(language, code);
    res.json({ success: true, output });
  } catch (err) {
    console.error("Error executing code:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default sandboxRouter;
