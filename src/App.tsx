import * as BigNumber from "bignumber.js";
import * as Bluebird from "bluebird";
import * as React from "react";
import * as Web3 from "web3";
import getWeb3 from "./utils/getWeb3";
const TruffleContract = require("truffle-contract");
const BlogManagerJSON = require("../build/contracts/BlogManager.json");

import AddPost from "./components/AddPost";
import PostDirectory from "./components/PostDirectory";
import StatusDisplay from "./components/StatusDisplay";

const appStyles = require("./App.css");

interface IState {
  web3: any; // not using Web3 as type because we promisified some functions
  clientState: IClientState | undefined;
  contractState: IContractState | undefined;
}

interface IClientState {
  coinbase: string;
  network: string;
}

interface IContractState {
  instance: BlogManager.BlogManager;
  owner: string;
  postCount: BigNumber.BigNumber;
}

class App extends React.Component<{}, IState> {
  private postDirectoryComponent: PostDirectory | null;

  public constructor() {
    super();
    this.state = {
      web3: undefined,
      clientState: undefined,
      contractState: undefined,
    };
  }

  public async componentWillMount() {
    const web3 = await getWeb3;
    Bluebird.promisifyAll(web3.eth, { suffix: "Promise" });
    Bluebird.promisifyAll(web3.version, { suffix: "Promise" });
    // Bluebird.promisifyAll((web3 as any).bzz, { suffix: "Promise" });
    this.setState({ web3 });

    const coinbase: string = await (web3 as any).eth.getCoinbasePromise();
    const network: string = await (web3 as any).version.getNetworkPromise();
    this.setState({
      clientState: {
        coinbase,
        network,
      },
    });
    this.updateContractState(web3);
  }

  public render() {
    return (
      <div className={appStyles.app}>
        <div className={appStyles.appHeader}>
          <h2>Freepress CMS</h2>
        </div>
        <div>
          {this.state.clientState && this.state.contractState ?
            <StatusDisplay
              coinbase={this.state.clientState.coinbase}
              network={this.state.clientState.network}
              blogOwner={this.state.contractState.owner}
              postCount={this.state.contractState.postCount}
              contractAddress={this.state.contractState.instance.address}
            />
            : <p>Loading</p>}
        </div>
        <hr />
        <div>
          {this.state.clientState && this.state.contractState ?
            <AddPost
              web3={this.state.web3}
              contractInstance={this.state.contractState.instance}
              isOwner={this.state.clientState.coinbase === this.state.contractState.owner}
              onSubmitSuccess={() => {
                this.updateContractState(this.state.web3);
                if (this.postDirectoryComponent) {
                  this.postDirectoryComponent.updatePostsState();
                }
              }}
            />
            : <p>Loading</p>}
        </div>
        <hr />
        {this.state.clientState && this.state.contractState ?
          <PostDirectory
            ref={(c) => { this.postDirectoryComponent = c; }}
            contractInstance={this.state.contractState.instance}
            isOwner={this.state.clientState.coinbase === this.state.contractState.owner}
            onDeleteSuccess={() => {
              this.updateContractState(this.state.web3);
            }}
          />
          : null
        }
      </div>
    );
  }

  private updateContractState = async (web3: Web3) => {
    const BlogManagerContract = TruffleContract(BlogManagerJSON);
    BlogManagerContract.setProvider(web3.currentProvider);
    try {
      const contractInstance = await BlogManagerContract.deployed() as BlogManager.BlogManager;
      const postCount: BigNumber.BigNumber = await contractInstance.getPostCount();
      const owner: string = await contractInstance.owner();
      this.setState({
        contractState: {
          instance: contractInstance,
          owner,
          postCount,
        },
      });
    } catch (err) {
      alert(err);
      this.setState({
        contractState: undefined,
      });
    }
  }
}

export default App;
