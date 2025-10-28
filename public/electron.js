const path = require("path");
const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const { exec } = require("child_process");

let backendProcess;
let yoloProcess;

function createWindow() {
  console.log(path.join(__dirname, "../assets", "icon.ico"));
  const mainWindow = new BrowserWindow({
    width: 1600,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    icon: path.join(__dirname, "../assets", "icon.ico")
    // icon: app.isPackaged
    //   ? path.join(process.resourcesPath, "favicon.ico")  // after packaging
    //   : path.join(__dirname, "../build/public", "icon.ico"),  // dev mode
  });

  mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
}

function killProcess(pid) {
  if (!pid) return;
  // /F = force, /T = terminate child processes too
  exec(`taskkill /PID ${pid} /F /T`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Failed to kill PID ${pid}:`, err);
    } else {
      console.log(`Process ${pid} killed successfully`);
    }
  });
}

app.whenReady().then(() => {
  // 👉 Path to .NET backend exe
  const backendExePath = app.isPackaged
    ? path.join(process.resourcesPath, "backend", "MyFirstApi.exe")
    : path.join(__dirname, "../build/backend/MyFirstApi.exe");

  console.log("👉 Expected .NET backend exe path:", backendExePath);

  backendProcess = spawn(backendExePath, [], { cwd: path.dirname(backendExePath) });

  backendProcess.on("error", (err) => {
    console.error("Failed to start .NET backend:", err);
  });

  backendProcess.stdout.on("data", (data) => {
    console.log(`.NET Backend: ${data}`);
  });

  backendProcess.stderr.on("data", (data) => {
    console.error(`.NET Backend error: ${data}`);
  });

  // 👉 Path to YOLO service exe
  const yoloExePath = app.isPackaged
    ? path.join(process.resourcesPath, "backend", "yolo_service.exe")
    : path.join(__dirname, "../build/backend/yolo_service.exe");

  console.log("👉 Expected YOLO service exe path:", yoloExePath);

  yoloProcess = spawn(yoloExePath, [], { cwd: path.dirname(yoloExePath) });

  yoloProcess.on("error", (err) => {
    console.error("Failed to start YOLO service:", err);
  });

  yoloProcess.stdout.on("data", (data) => {
    console.log(`YOLO Service: ${data}`);
  });

  yoloProcess.stderr.on("data", (data) => {
    console.error(`YOLO Service error: ${data}`);
  });

  createWindow();
});

app.on("before-quit", () => {
  console.log("🛑 App quitting, killing backend processes...");
  if (backendProcess) {
    killProcess(backendProcess.pid);
    backendProcess = null;
  }

  if (yoloProcess) {
    killProcess(yoloProcess.pid);
    yoloProcess = null;
  }
});

// Optional: also quit when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("will-quit", () => {
  if (backendProcess) backendProcess.kill();
  if (yoloProcess) yoloProcess.kill();   // <--- important
});



// const path = require("path");
// const { app, BrowserWindow } = require("electron");
// const { spawn } = require("child_process");

// let backendProcess;

// function createWindow() {
//   const mainWindow = new BrowserWindow({
//     width: 1280,
//     height: 720,
//     webPreferences: {
//       nodeIntegration: true,
//       contextIsolation: false,
//     },
//   });

//   mainWindow.loadFile(path.join(__dirname, "../build/index.html"));
// }

// app.whenReady().then(() => {
//   // Path to backend exe
//   const exePath = app.isPackaged
//     ? path.join(process.resourcesPath, "backend", "MyFirstApi.exe")
//     : path.join(__dirname, "../build/backend/MyFirstApi.exe");

//   console.log("👉 Expected backend exe path:", exePath);

//   backendProcess = spawn(exePath, [], {
//     cwd: path.dirname(exePath),
//   });

//   backendProcess.on("error", (err) => {
//     console.error("❌ Failed to start backend:", err);
//   });

//   backendProcess.stdout.on("data", (data) => {
//     console.log(`📢 Backend: ${data}`);
//   });

//   backendProcess.stderr.on("data", (data) => {
//     console.error(`⚠️ Backend error: ${data}`);
//   });

//   createWindow();
// });

// app.on("will-quit", () => {
//   if (backendProcess) backendProcess.kill();
// });
