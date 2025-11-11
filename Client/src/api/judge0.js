// import dotenv from "dotenv";
// const headers = {
//     "Content-Type": "application/json",
//     "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
//     "X-RapidAPI-Key": "f66888ad5cmshf2b8e5f64277ba9p153dd5jsnf7a2020eb76c",
// };

// const JUDGE0_BASE_URL = "https://judge0-ce.p.rapidapi.com";

// export async function runCode(language_id, source_code, stdin = "") {
//     try {
//         // console.log(language_id, source_code, stdin);
//         // Step 1: Submit the code
//         const submissionRes = await fetch(
//             `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=false`,
//             {
//                 method: "POST",
//                 headers,
//                 body: JSON.stringify({ language_id, source_code, stdin }),
//             }
//         );

//         // console.log("hit1", submissionRes);
//         const { token } = await submissionRes.json();
//         // console.log("hit1", token);

//         // Step 2: Poll for result
//         let result;
//         while (true) {
//             const res = await fetch(
//                 `${JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=false`,
//                 {
//                     method: "GET",
//                     headers,
//                 }
//             );
//             // console.log("hit1", res);
//             result = await res.json();
//             // console.log(result.status.id);
//             // console.log("hit2");

//             if (result.status.id <= 2) {
//                 // console.log(result.status.id);
//                 // console.log("hit3");
//                 await new Promise((resolve) => setTimeout(resolve, 1000)); // wait
//                 continue;
//             } else {
//                 break;
//             }
//         }

//         return result;
//     } catch (error) {
//         console.error("Judge0 error:", error);
//         return { stderr: "Something went wrong." };
//     }
// }

// import dotenv from "dotenv";
// dotenv.config();

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
        console.log(language_id, source_code, stdin);
        const submissionRes = await fetch(
            `${JUDGE0_BASE_URL}/submissions?base64_encoded=false&wait=false`,
            {
                method: "POST",
                headers,
                body: JSON.stringify({ language_id, source_code, stdin }),
            }
        );

        console.log("submissionRes:", submissionRes);
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

        console.log("Final result:", result);

        return result;
    } catch (error) {
        console.error("Judge0 error:", error);
        return { stderr: "Something went wrong." };
    }
}

/**
 * Submit code against all test cases (used by "Submit" button).
 *
 * testCases = [
 *   { input: "5\n", expectedOutput: "120\n" },
 *   { input: "3\n", expectedOutput: "6\n" }
 * ]
 */

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
}

export async function submitCode(
    language_id,
    source_code,
    expectedOutputs = []
) {
    try {
        let passed = 0;
        const results = [];

        const result = await runCode(language_id, source_code, "");
        const stdoutLines = (result.stdout || "")
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter((line) => line !== "");

        console.log("result:", result);
        console.log("stdoutLines:", stdoutLines);
        console.log("expectedOutputs:", expectedOutputs);

        for (let i = 0; i < expectedOutputs.length; i++) {
            // const { input, expectedOutput } = testCases[i];

            // // Run code for this test case
            // const result = await runCode(language_id, source_code, input);

            // const actual = result.stdout?.trim() || "";
            // const expected = expectedOutput.trim();

            // console.log("Test Case", i + 1);
            // console.log("Input:", input);
            // console.log("Expected:", expected);
            // console.log("Actual:", actual);
            // console.log("Error:", result.stderr || "None");

            let isPassed;
            if (
                JSON.parse(stdoutLines[i]).isArray === true &&
                JSON.parse(expectedOutputs[i]).isArray === true
            ) {
                isPassed = arraysEqual(
                    JSON.parse(stdoutLines[i]),
                    JSON.parse(expectedOutputs[i])
                );
            } else {
                isPassed = stdoutLines[i] === expectedOutputs[i];
            }
            if (isPassed) passed++;

            results.push({
                case: i + 1,
                // input,
                // expected,
                // actual,
                status: isPassed ? "Passed ✅" : "Failed ❌",
                error: result.stderr || null,
            });
        }
        console.log("Total passed:", passed);
        const verdict =
            passed === expectedOutputs.length
                ? "Accepted"
                : `Wrong Answer (${passed}/${expectedOutputs.length} passed)`;

        console.log("Final verdict:", verdict);

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
            total: testCases.length,
            results: [],
        };
    }
}

// export async function submitCode(
//     language_id,
//     sourceCode,
//     expectedOutputs = []
// ) {
//     try {
//         const runResult = await runCode(language_id, sourceCode, "");
//         const stdout = runResult.stdout || "";
//         const stderr = runResult.stderr || "";

//         const verification = verifyMultiOutput(stdout, expectedOutputs, {
//             ignoreEmptyLines: true,
//         });

//         return {
//             verdict: verification.verdict,
//             passed: verification.passed,
//             total: verification.total,
//             results: verification.results,
//             stdoutLines: verification.rawLines,
//             stderr,
//         };
//     } catch (err) {
//         return {
//             verdict: "Error",
//             passed: 0,
//             total: expectedOutputs.length,
//             results: [],
//             error: err.message,
//         };
//     }
// }

// function normalizeLine(s) {
//     return (s ?? "").replace(/\r\n/g, "\n").trim();
// }

// function verifyMultiOutput(stdout, expectedOutputs, options = {}) {
//     // options: { ignoreEmptyLines: true, debugPrefixRegex: /^(Enter|Debug)/i }
//     const { ignoreEmptyLines = true, debugPrefixRegex = null } = options;
//     const lines = stdout.split(/\r?\n/).map(normalizeLine);
//     const filtered = lines.filter((l) => !(ignoreEmptyLines && l === ""));

//     const results = [];
//     let passed = 0;
//     for (let i = 0; i < expectedOutputs.length; i++) {
//         const expected = normalizeLine(expectedOutputs[i]);
//         let actual = filtered[i] ?? "";

//         if (debugPrefixRegex) {
//             actual = actual.replace(debugPrefixRegex, "").trim();
//         }

//         const isPassed = actual === expected;
//         if (isPassed) passed++;

//         results.push({
//             case: i + 1,
//             expected,
//             actual,
//             status: isPassed ? "Passed ✅" : "Failed ❌",
//         });
//     }

//     const verdict =
//         passed === expectedOutputs.length
//             ? "Accepted"
//             : `Wrong Answer (${passed}/${expectedOutputs.length} passed)`;

//     return {
//         verdict,
//         passed,
//         total: expectedOutputs.length,
//         results,
//         rawLines: filtered,
//     };
// }

// export async function submitCode(language_id, baseSourceCode, testCases = []) {
//     try {
//         let passed = 0;
//         const results = [];

//         for (let i = 0; i < testCases.length; i++) {
//             const { input, expectedOutput } = testCases[i];

//             // Example input: "nums = [2,7,11,15], target = 9"
//             let nums = [];
//             let target;

//             // 🔹 Extract using regular expressions
//             const numsMatch = input.match(/nums\s*=\s*\[([^\]]+)\]/);
//             const targetMatch = input.match(/target\s*=\s*(\d+)/);

//             if (numsMatch) {
//                 nums = numsMatch[1].split(",").map((n) => Number(n.trim()));
//             } else {
//                 throw new Error(
//                     `Invalid input format: missing nums array in "${input}"`
//                 );
//             }

//             if (targetMatch) {
//                 target = Number(targetMatch[1]);
//             } else {
//                 throw new Error(
//                     `Invalid input format: missing target in "${input}"`
//                 );
//             }

//             console.log("Test Case", i + 1);
//             console.log("Input:", input);
//             console.log("nums:", nums);
//             console.log("target:", target);

//             const functionCall = `
//                 int[] result = twoSum(new int[]{${nums.join(",")}}, ${target});
//                 System.out.println(Arrays.toString(result));
//             `;

//             // 🔹 Replace main body with this function call
//             const modifiedSource = baseSourceCode.replace(
//                 /public static void main\(String\[\] args\)\s*\{[\s\S]*?\}/,
//                 `public static void main(String[] args) {
//                     ${functionCall}
//                 }`
//             );

//             // 🔹 Run code for this test case
//             const result = await runCode(language_id, modifiedSource, "");

//             const actual = (result.stdout || "").trim();
//             const expected = expectedOutput.trim();
//             const isPassed = actual === expected;

//             console.log("Expected:", expected);
//             console.log("Actual:", result.stdout || "None");
//             console.log("Error:", result.stderr || "None");

//             if (isPassed) passed++;

//             results.push({
//                 case: i + 1,
//                 input,
//                 expected,
//                 actual,
//                 status: isPassed ? "Passed ✅" : "Failed ❌",
//                 error: result.stderr || null,
//             });
//         }

//         const verdict =
//             passed === testCases.length
//                 ? "Accepted"
//                 : `Wrong Answer (${passed}/${testCases.length} passed)`;

//         return { verdict, passed, total: testCases.length, results };
//     } catch (error) {
//         console.error("Submit error:", error);
//         return {
//             verdict: "Error",
//             passed: 0,
//             total: testCases.length,
//             results: [],
//         };
//     }
// }
