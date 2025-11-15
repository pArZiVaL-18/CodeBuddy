const headers = {
    "Content-Type": "application/json",
    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
    "X-RapidAPI-Key": "f66888ad5cmshf2b8e5f64277ba9p153dd5jsnf7a2020eb76c", // store key in .env
};

const JUDGE0_BASE_URL = "https://judge0-ce.p.rapidapi.com";

/**
 * Run code for a single input (used by "Run Code" and internally by submitCode).
 */
export async function runCode(language_id, source_code, stdin = "") {
    try {
        // Step 1: Submit code to Judge0
        // console.log(language_id, source_code, stdin);
        const submissionRes = await fetch(
            `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=false`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({ language_id, source_code, stdin }),
            }
        );

        // console.log("submissionRes:", submissionRes);
        const { token } = await submissionRes.json();

        // Step 2: Poll until execution is complete
        let result;
        while (true) {
            const res = await fetch(
                `${JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=false`,
                {
                    method: "GET",
                    headers,
                }
            );
            result = await res.json();

            if (result.status.id <= 2) {
                // 1: In Queue, 2: Processing
                await new Promise((resolve) => setTimeout(resolve, 3000));
                continue;
            } else {
                break;
            }
        }

        // console.log("Final result:", result);

        return result;
    } catch (error) {
        console.error("Judge0 error:", error);
        return { stderr: "Something went wrong." };
    }
}

export async function submitCode(
    language_id,
    source_code,
    expectedOutputs = []
) {
    // Canonical normalization for meaningful comparison
    function normalizeOutput(raw) {
        if (raw == null) return raw;

        raw = raw.trim();

        // JSON parse (strict)
        try {
            return JSON.parse(raw);
        } catch {}

        // JS object/array parse (loose)
        try {
            // Wrapping in parentheses allows parsing objects like {a:1}
            return Function(`"use strict"; return (${raw})`)();
        } catch {}

        // Numeric
        if (!isNaN(raw)) return Number(raw);

        // Boolean
        if (raw === "true") return true;
        if (raw === "false") return false;

        // Default: return as string
        return raw;
    }

    // Structural comparison
    function deepEqual(a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    }

    try {
        let passed = 0;
        const results = [];

        // Run code only once (your style)
        const result = await runCode(language_id, source_code, "");

        const stdoutLines = (result.stdout || "")
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line !== "");

        console.log("stdoutLines:", stdoutLines);
        console.log("expectedOutputs:", expectedOutputs);

        for (let i = 0; i < expectedOutputs.length; i++) {
            const actualRaw = stdoutLines[i] ?? "";
            const expectedRaw = expectedOutputs[i] ?? "";

            const normActual = normalizeOutput(actualRaw);
            const normExpected = normalizeOutput(expectedRaw);

            const isPassed = deepEqual(normActual, normExpected);

            if (isPassed) passed++;

            results.push({
                case: i + 1,
                actual: actualRaw,
                expected: expectedRaw,
                normalizedActual: normActual,
                normalizedExpected: normExpected,
                status: isPassed ? "Passed ✅" : "Failed ❌",
                error: result.stderr || null,
            });
        }

        const verdict =
            passed === expectedOutputs.length
                ? "Accepted"
                : `Wrong Answer (${passed}/${expectedOutputs.length} passed)`;

        return {
            verdict,
            passed,
            total: expectedOutputs.length,
            results,
        };
    } catch (error) {
        console.error("Submit error:", error);
        return {
            verdict: "Error",
            passed: 0,
            total: expectedOutputs.length,
            results: [],
        };
    }
}
