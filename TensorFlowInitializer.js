import * as tf from "@tensorflow/tfjs";

async function init() {
    console.log(tf.getBackend());
    await tf.ready();
    console.log("TensorFlow.js is ready");
}

export default init;
