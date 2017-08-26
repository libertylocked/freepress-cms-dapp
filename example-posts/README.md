Example Blog Posts
---

Here're some example blog posts in markdown that I've made, and uploaded to Swarm

# bzz hashes on Swarm testnet
- `welcome.md`
  - 4bfc3b3028fd33f2a4ef180935029f95fb867b3628acd782dc0e9fcc1a8bcc5b
- `website-ideas.md`
  - 38d83ab4c4e28b9be0e5133dcf917f9b2e79dc91a63c8e0a42a20917e0b7d3fc

# Adding a post to Swarm
Currently I haven't made the UI to upload posts to Swarm, so you gotta do it manually.

- Start Swarm with `--datadir` and `--bzzaccount` set. Other args are optional
  - *Note for Mist Users*: Mist Browser comes with Swarm since v0.9.0. It automatically starts Swarm if it's not already running
- Attach to Swarm's IPC. On Linux/MacOS the IPC file should be in the datadir you set. On Windows it's always `\\.\pipe\bzzd.ipc`
```
geth attach \\.\pipe\bzzd.ipc
```
- Use [bzz.upload](https://web3js.readthedocs.io/en/1.0/web3-bzz.html#upload) function to upload the file. It should return the hash

# Caveats
- Because Swarm is alpha software, it may take a while for the file to propagate through the network
  - Sometimes you'll still lose the file you've uploaded
  - You can use `admin.peers` to check if you have peers
