import * as React from "react";

const appStyles = require("./App.css");
const logo = require("./logo.svg");

class App extends React.Component<{}, {}> {
  public render() {
    return (
      <div className={appStyles.app}>
        <div className={appStyles.appHeader}>
          <img src={logo} className={appStyles.appLogo} alt="logo" />
          <h2>Welcome to React with TypeScript</h2>
        </div>
        <p className={appStyles.appIntro}>
          To get started, edit <code>src/App.tsx</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
