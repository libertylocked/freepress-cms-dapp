module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    testrpc: {
      host: "localhost",
      port: 8546,
      network_id: 1503307538283
    },
    ropsten: {
      host: "localhost",
      port: 8545,
      network_id: 3
    }
  }
};
