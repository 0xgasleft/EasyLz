
const DATA = {
    "fuji": {
      "connections": ["sonic"],
      "endpoint": "",
      "eid": ,
      "deployment": "",
      "sendLib": "",
      "receiveLib": "",
      "dvns": [""],
      "executor": ""
    },
    "sonic": {
      "connections": ["fuji"],
      "endpoint": "",
      "eid": ,
      "deployment": "",
      "sendLib": "",
      "receiveLib": "",
      "dvns": [""],
      "executor": ""
    }
  }

const ENDPOINT_ABI = [
  'function setConfig(address oappAddress, address sendLibAddress, tuple(uint32 eid, uint32 configType, bytes config)[] setConfigParams) external',
  'function setSendLibrary(address oapp, uint32 eid, address sendLib) external',
  'function setReceiveLibrary(address oapp, uint32 eid, address receiveLib, uint256 _gracePeriod) external',
];
  

module.exports = {
  DATA,
  ENDPOINT_ABI
}

