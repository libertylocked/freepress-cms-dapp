const Bzz = require("web3-bzz");

const getBzz = new Promise<any>((resolve, reject) => {
  window.addEventListener("load", () => {
    // XXX: for now we'll just use swarm-gateways.net
    // since it's not yet supported in metamask
    const bzz = new Bzz(Bzz.givenProvider || "http://swarm-gateways.net");
    (window as any).bzz = bzz;
    resolve(bzz);
  });
});

export default getBzz;
