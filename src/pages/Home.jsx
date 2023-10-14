import { useState } from "react";
import neo4j from "neo4j-driver";
import ForceGraph2D from "react-force-graph-2d";
export default function Home() {
  const [address, setAddress] = useState("");
  const [retData,setRetData] = useState("");
  const [index,setIndex] = useState(0);
  const [len,setLength] = useState(0);
  const resultArray = [];
  const nodes = [];
  const links = [];
  const HandleReturn = async () =>{
    const driver = await neo4j.driver("bolt://localhost:7687", neo4j.auth.basic('neo4j', '12345678'));
    const session = await driver.session();
    // Address id should return a single id of the node instead, an object returned.
// The issue is with the neo4j query in javascript
// After getting the id, you just have to place it in the next query with the 'where' keyword.
const data = await session.run(`match (n)-[t:Transaction]-(m) where n.addressId='${address}' return (n),(t),(m) limit 5`);
console.log(data);
// Iterate over the records in the data
data.records.forEach(record => {
  const currentNode = record._fields[0];
  const relationship = record._fields[1];
  const relatedNode = record._fields[2];
  
  
  const resultObject = {
    addressId: currentNode.properties.addressId,
    transactionType: relationship.type,
    transaction_fee:relationship.properties.transaction_fee,
    transaction_index:relationship.properties.transaction_index,
    wallet: relationship.properties.value,
    label: currentNode.labels[0],
    relatedAddressId: relatedNode.properties.addressId,
    gas:relationship.properties.gas,
    gas_price:relationship.properties.gas_price,
    gas_used:relationship.properties.gas_used,
    hash:relationship.properties.hash,
    inp:relationship.properties.inp,
    block_timestamp:relationship.properties.block_timestamp,
    block_number:relationship.properties.block_number,
    block_hash:relationship.properties.block_hash,
  };
  
  resultArray.push(resultObject);
});
console.log(resultArray[index]);
let re = await resultArray[index]
setRetData(re)
setLength(resultArray.length)
}
const CallNext = async () =>{
  setIndex(index+1);
  await HandleReturn()
}
const CallPrev = async () =>{
  setIndex(index-1);
  await HandleReturn()
}
  return (
    <>
      <div className="grid justify-center">
        <span className="mx-auto text-xl pt-2 font-semibold">Web3 Bank (A trusted wallet!)</span>
        <div className="my-10"></div>
      </div>
      <div className="form grid grid-cols-1 justify-center">
        <div className="ml-20">
          <input
            type="text"
            className="p-4 border border-blue-500 rounded-xl w-[90%]"
            required
            onChange={(e) => setAddress(e.currentTarget.value)}
            placeholder="Enter your wallet address here..."
          />
        </div>
        <div>
          <button
          onClick={HandleReturn}
            className="p-2 ml-20 mt-2 rounded-lg border border-blue-500"
          >
            Fetch
          </button>
        </div>
      </div>
      <div className="display-data">
        {retData ?
        <>
        
        <span>Fetched data for: {retData.addressId}</span>
        <br />
        <span>Transaction to: {retData.relatedAddressId}</span> <br />
        <span>Transaction Type: {retData.label}</span>
        <br />
        <span>Transaction amount: {retData.wallet}</span>
        <br />
        <span>Transaction fee: {retData.transaction_fee}</span>
        <br />
        <span>Transaction index: {retData.transaction_index}</span>
        <br />
        <span>Gas: {retData.gas}</span>
        <br />
        <span>Gas price: {retData.gas_price}</span>
        <br />
        <span>Gas used: {retData.gas_used}</span>
        <br />
        <span>Hash: {retData.hash}</span>
        <br />
        {/* <span>Input: {retData.inp}</span> */}
        <br />
        <span>Block Timestamp: {retData.block_timestamp}</span>
        <br />
        <span>Block hash: {retData.block_hash}</span>
        <br />
        <span>Block number: {retData.block_number}</span>
        <br />
          {index >= 0 ?  
          
            <button onClick={CallPrev} className="btn bg-orange-500 text-white p-2 rouded-xl mx-4">Prev</button>
          
          :
          
            <button disabled className="btn bg-orange-200 text-white p-2 rouded-xl mx-4">Prev</button>
          
        }
        {index <= len ?  
        
          <button onClick={CallNext} className="btn bg-orange-500 text-white p-2 rouded-xl mx-4">Next</button>
        
        :
        
          <button disabled className="btn bg-orange-200 text-white p-2 rouded-xl mx-4">Next</button>
        
      }
        <div>Total transactions: {len-2}</div>
        </>
        :
        address.length <= 0
        ?
        ''
        :
        <div>No Address Found!</div>
        }
         <ForceGraph2D
         height={300}
      graphData={{ nodes: [
        { id: 1, label: 'Node 1' },
        { id: 2, label: 'Node 2' },
        // Additional nodes
      ],
      links: [
        { source: 1, target: 2, type: 'Transaction', wallet: '12345' },
        // Additional links
      ], }}
    />
        </div>
    </>
  );
}
