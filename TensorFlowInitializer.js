import * as tf from "@tensorflow/tfjs";

async function init() {
    console.log(tf.getBackend());
    await tf.ready();
}

export default init;
