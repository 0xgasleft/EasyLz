const { DATA, ENDPOINT_ABI } = require("./data.js");



const SAFETY_WAIT_PERIOD = 3;


const filterChain = (chain) => {
  const filteredData = { ...DATA };
  delete filteredData[chain];
  return filteredData;
}

const waitFor = async (seconds) => {
  await new Promise(dummy => setTimeout(dummy, seconds * 1000));
}

const enoughDeployments = () => {  
  return Object.keys(DATA).length >= 2;
}


const setLibs = async (ethers, localChain, remoteChain, signer) => {
  const endpointContract = new ethers.Contract(localChain.endpoint, ENDPOINT_ABI, signer);
  try {
    const sendTx = await endpointContract.setSendLibrary(
      localChain.deployment,
      remoteChain.eid,
      localChain.sendLib,
    );
    await sendTx.wait();
    console.log('Send library set successfully.');

    await waitFor(SAFETY_WAIT_PERIOD);

    const receiveTx = await endpointContract.setReceiveLibrary(
      localChain.deployment,
      remoteChain.eid,
      localChain.receiveLib,
      0
    );
    await receiveTx.wait();
    console.log('Receive library set successfully.');

  } catch (error) {
    console.error('Transaction failed:', error);
  }
}

const setSendConfig = async (ethers, localChain, remoteChain, signer) => {
  const endpointContract = new ethers.Contract(localChain.endpoint, ENDPOINT_ABI, signer);

  const dvnConfig = {
    confirmations: 10,
    requiredDVNCount: localChain.dvns.length,
    optionalDVNCount: 0,
    optionalDVNThreshold: 0,
    requiredDVNs: localChain.dvns.sort(),
    optionalDVNs: [],
  };

  const executorConfig = {
    maxMessageSize: 10000,
    executorAddress: localChain.executor,
  };

  const dvnStruct =
    'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)';
  const encodedUlnConfig = ethers.utils.defaultAbiCoder.encode([dvnStruct], [dvnConfig]);

  const executorStruct = 'tuple(uint32 maxMessageSize, address executorAddress)';
  const encodedExecutorConfig = ethers.utils.defaultAbiCoder.encode(
    [executorStruct],
    [executorConfig],
  );

  const dvnConfigParams = {
    eid: remoteChain.eid,
    configType: 2,
    config: encodedUlnConfig,
  };

  const executorConfigParams = {
    eid: remoteChain.eid,
    configType: 1,
    config: encodedExecutorConfig,
  };

  try {
    const tx = await endpointContract.setConfig(
      localChain.deployment,
      localChain.sendLib,
      [dvnConfigParams, executorConfigParams],
    );
    
    await tx.wait();
    console.log("Send config has been set successfully!");

  } catch (error) {
    console.error('Transaction failed:', error);
  } 
}

const setReceiveConfig = async (ethers, localChain, remoteChain, signer) => {
  const endpointContract = new ethers.Contract(localChain.endpoint, ENDPOINT_ABI, signer);

  const dvnConfig = {
    confirmations: 10,
    requiredDVNCount: localChain.dvns.length,
    optionalDVNCount: 0,
    optionalDVNThreshold: 0,
    requiredDVNs: localChain.dvns.sort(),
    optionalDVNs: [],
  };

  const dvnStruct =
    'tuple(uint64 confirmations, uint8 requiredDVNCount, uint8 optionalDVNCount, uint8 optionalDVNThreshold, address[] requiredDVNs, address[] optionalDVNs)';
  const encodedUlnConfig = ethers.utils.defaultAbiCoder.encode([dvnStruct], [dvnConfig]);

  const dvnConfigParams = {
    eid: remoteChain.eid,
    configType: 2,
    config: encodedUlnConfig,
  };

  try {
    const tx = await endpointContract.setConfig(
      localChain.deployment,
      localChain.receiveLib,
      [dvnConfigParams],
    );
    
    await tx.wait();
    console.log("Receive config has been set successfully!");

  } catch (error) {
    console.error('Transaction failed:', error);
  } 
}

const setConfigs = async (ethers, localChain, remoteChain, signer) => {
  await setSendConfig(ethers, localChain, remoteChain, signer);

  await waitFor(SAFETY_WAIT_PERIOD);

  await setReceiveConfig(ethers, localChain, remoteChain, signer);
}




module.exports = {
  setLibs, 
  setConfigs, 
  filterChain, 
  enoughDeployments,
  waitFor,
  SAFETY_WAIT_PERIOD
};
