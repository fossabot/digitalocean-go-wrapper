import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

export async function main(event, context) {
  try {
    console.log('Function invoked');
    console.log(`Working directory: ${process.cwd()}`);
    console.log('Event:', JSON.stringify(event));
    console.log('Context:', JSON.stringify(context));
    
    const { stdout, stderr } = await execFileAsync(`./compiled_function`, [JSON.stringify(context), JSON.stringify(event)]);

    if (stderr) {
      console.log(`Standard Error: ${stderr}`);
      return {
        body: `Error: ${stderr}`,
        statusCode: 500,
        headers: {
          "Content-Type": "text/plain",
        },
      };
    }

    console.log(`Standard Output: ${stdout}`);
    return {
      body: `${stdout}`,
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
    };
  } catch (error) {
    console.error('Execution failed:', error);
    return {
      body: `Execution failed: ${error.message}`,
      statusCode: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    };
  }
};