const {DATA} = require("../scripts/data.js");

const {
  setLibs, 
  setConfigs, 
  filterChain, 
  enoughDeployments,
  waitFor,
  SAFETY_WAIT_PERIOD
} = require("../scripts/utils.js");



task("configure-lz", "Configure LayerZero Oapp/OFT/ONFT")
  .setAction(async (taskArgs, hre) => {

    if(!enoughDeployments())
    {
        console.log("Need at least 2 deployments configured in 'data.js'");
        return;
    }
    for (const [localChainName, localChain] of Object.entries(DATA))
    {
      
      console.log("--------------------------------------------------------");
      const hreChain = hre.config.networks[localChainName];
      const rpc = new hre.ethers.providers.JsonRpcProvider(hreChain);
      const signer = new hre.ethers.Wallet(hreChain.accounts[0], rpc);
      const remoteChains = filterChain(localChainName);

      for (const [remoteChainName, remoteChain] of Object.entries(remoteChains)) {

        if(!localChain.connections.includes(remoteChainName)) continue;


        console.log(`Setting send & receive libraries for ${localChainName}`);
        await setLibs(hre.ethers, localChain, remoteChain, signer);
        await waitFor(SAFETY_WAIT_PERIOD);

        console.log(`Setting dvn & executor configs for ${localChainName}`);
        await setConfigs(hre.ethers, localChain, remoteChain, signer);
      }
    }
    
  });
