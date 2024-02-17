import * as tf from "@tensorflow/tfjs";

async function init() {
    await tf.ready();
    console.log("TensorFlow.js is ready");
}

export default init;
