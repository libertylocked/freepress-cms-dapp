import * as BigNumber from "bignumber.js";
import * as Bluebird from "bluebird";
import * as React from "react";
import * as Web3 from "web3";
import StatusDisplay from "./components/StatusDisplay";
import getWeb3 from "./utils/getWeb3";
const TruffleContract = require("Truffle-Contract");
const BlogManagerJSON = require("../build/contracts/BlogManager.json");

const appStyles = require("./App.css");

interface IState {
  web3: any; // not using Web3 as type because we promisified some functions
  clientState: IClientState | undefined;
  contractInstance: any;
  contractState: IContractState | undefined;
}

interface IClientState {
  coinbase: string;
  network: string;
}

interface IContractState {
  instance: any;
  owner: string;
  postCount: BigNumber.BigNumber;
}

class App extends React.Component<{}, IState> {
  public constructor() {
    super();
    this.state = {
      web3: undefined,
      clientState: undefined,
      contractInstance: undefined,
      contractState: undefined,
    };
  }

  public async componentWillMount() {
    const web3 = await getWeb3;
    this.setState({ web3 });
    Bluebird.promisifyAll(web3.eth, { suffix: "Promise" });
    Bluebird.promisifyAll(web3.version, { suffix: "Promise" });

    const coinbase: string = await (web3 as any).eth.getCoinbasePromise();
    const network: string = await (web3 as any).version.getNetworkPromise();
    this.setState({
      clientState: {
        coinbase,
        network,
      },
    });
    this.instantiateContract(web3);
  }

  public render() {
    return (
      <div className={appStyles.app}>
        <div className={appStyles.appHeader}>
          <h2>Blogging CMS DApp</h2>
        </div>
        {this.state.clientState && this.state.contractState ?
          <StatusDisplay
            coinbase={this.state.clientState.coinbase}
            network={this.state.clientState.network}
            blogOwner={this.state.contractState.owner}
            postCount={this.state.contractState.postCount}
            contractAddress={this.state.contractState.instance.address}
          />
          : <p>Loading</p>}
      </div >
    );
  }

  private async instantiateContract(web3: Web3) {
    const BlogManager = TruffleContract(BlogManagerJSON);
    BlogManager.setProvider(web3.currentProvider);
    const contractInstance = await BlogManager.deployed();
    this.setState({ contractInstance });
    const postCount: BigNumber.BigNumber = await contractInstance.getPostCount.call();
    const owner: string = await contractInstance.owner();
    this.setState({
      contractState: {
        instance: contractInstance,
        owner,
        postCount,
      },
    });
  }
}

export default App;
