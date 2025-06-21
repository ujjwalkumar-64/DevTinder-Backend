import axios from "axios";

/**
 * @param {string} language - e.g. "python", "javascript", "java"
 * @param {string} code - The code to execute.
 * @returns {Promise<string>} - Execution output or error message.
 */
export async function runCodeWithJudge0(language, code) {
  const languageMap = {
    python: 71,
    javascript: 63,
    java: 62,
  };
  const language_id = languageMap[language];
  if (!language_id) throw new Error("Unsupported language for Judge0");

  const { data: submission } = await axios.post(
    process.env.JUDGE0_API_END_POINT,
    {
      source_code: code,
      language_id,
    },
    {
      headers: {
        "x-rapidapi-key": process.env.JUDGE0_API_KEY,
        "x-rapidapi-host": process.env.JUDGE0_API_HOST,
        "Content-Type": process.env.JUDGE0_API_TYPE,
      },
    }
  );

  if (submission.stderr) return submission.stderr;
  if (submission.compile_output) return submission.compile_output;
  return submission.stdout || "No output";
}
