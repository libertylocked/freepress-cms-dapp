const Bzz = require("web3-bzz");

const getBzz = new Promise<any>((resolve, reject) => {
  window.addEventListener("load", () => {
    // XXX: for now we'll just use local swarm node
    // since it's not yet supported in metamask
    const bzz = new Bzz(Bzz.givenProvider || "http://localhost:8500");
    (window as any).bzz = bzz;
    resolve(bzz);
  });
});

export default getBzz;
