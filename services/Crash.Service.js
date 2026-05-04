import crypto from "crypto";

export default class CrashService {
  static generate(serverSeed) {
    const hash = crypto
      .createHmac("sha256", serverSeed)
      .update("aviator")
      .digest("hex");

    const intVal = parseInt(hash.substring(0, 8), 16);
    const normalized = intVal / 0xffffffff;
    const crashPoint = Number((1 + normalized * 9).toFixed(2));

    return { crashPoint, hash };
  }
}
