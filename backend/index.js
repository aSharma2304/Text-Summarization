import express from "express";
import "dotenv/config";
import cors from "cors";
import { spawn } from "child_process";
const app = express();

app.use(cors());
app.use(express.json());

const executePython = async (script, args) => {
  const argument = args.map((args) => args.toString());
  const py = spawn("python", [script, ...argument]);

  const result = await new Promise((resolve, reject) => {
    let output;

    py.stdout.on("data", (data) => {
      output = data;
    });

    //handling error
    py.stderr.on("data", (data) => {
      console.log(`[python] error occured ${data}`);
      reject("error occured in python script");
    });

    py.on("exit", (code) => {
      console.log(`child process exited with code ${code}`);
      resolve(output);
    });
  });

  return result;
};

app.post("/api", async (req, res) => {
  console.log(req.body);
  let result;
  try {
    result = await executePython("./sum.py", [req.body.input, req.body.length]);
  } catch (err) {
    console.log(err);
  }

  res.json({
    output: `${result}`,
    // length_summary: `${result.length}`,
  });
});

app.listen(process.env.PORT || 8000, () => {
  console.log(`server listning on port ${process.env.PORT}`);
});
