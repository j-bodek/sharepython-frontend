
importScripts("https://cdn.jsdelivr.net/pyodide/v0.22.0/full/pyodide.js");
let pyodide = null;

function stdOutputHandler(output){
  postMessage({
    "method":"stdOutputHandler", 
    "payload":output}
  )
}

function stdErrorHandler(error){
  postMessage({
    "method":"stdErrorHandler", 
    "payload":error}
  )
}

async function loadPyodideWrapper(){
    pyodide = await loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.22.0/full/",
        stdout:stdOutputHandler,
        stderr:stdErrorHandler,
    });
    postMessage({"method":"onPyodideLoaded", "payload": null})
}

loadPyodideWrapper();

onmessage = async (event) => {
  // make sure loading is done
  let data = event.data;
  // Now is the easy part, the one that is similar to working in the main thread:
  try {
    await pyodide.runPython(data.code);
  } catch (error) {
    postMessage({
      "method":"stdErrorHandler", 
      "payload":{"error":error}}
    )
  }
};