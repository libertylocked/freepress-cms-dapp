const Bzz = require("web3-bzz");

const getBzz = new Promise<any>((resolve, reject) => {
  window.addEventListener("load", () => {
    // XXX: for now we'll just hard code a provider
    // since metamask or mist don't inject the provider yet
    const bzz = new Bzz(Bzz.givenProvider || "http://swarm-gateways.net/");
    (window as any).bzz = bzz;
    resolve(bzz);
  });
});

export default getBzz;
