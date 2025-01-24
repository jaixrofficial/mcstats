const axios = require("axios");

/**
 * Fetches the stats of a Minecraft server
 * @param {string} address - The address of the server (IP:Port)
 * @param {string} type - The type of server ("java" or "bedrock")
 * @returns {Promise<object>} - The server stats
 */
async function getServerStats(address, type = "java") {
  const url = `https://api.mcsrvstat.us/${type === "bedrock" ? "bedrock" : "3"}/${address}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch server stats. Please check the server address and type.");
  }
}

module.exports = getServerStats;
