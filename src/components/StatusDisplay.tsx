/**
 * This component shows the status of the network and contract
 */
import * as BigNumber from "bignumber.js";
import * as React from "react";

interface IProps {
  coinbase: string | null;
  network: string;
  contractAddress: string;
  blogOwner: string;
  postCount: BigNumber.BigNumber;
}

const StatusDisplay: React.StatelessComponent<IProps> = (props) => {
  return (
    <div>
      <p>Coinbase: {props.coinbase ? props.coinbase : "unset"}</p>
      <p>Network ID: {props.network}</p>
      <p>Contract Address: {props.contractAddress}</p>
      <p>Blog Owner: {props.blogOwner}</p>
      <p>Post Count: {props.postCount.toString()}</p>
    </div>
  );
};

export default StatusDisplay;
