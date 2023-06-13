import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import { readFileSync } from 'fs';
import solc from 'solc';

export function readSolidityCode(callerUrl, ...paths) {
    const currentDir = dirname(fileURLToPath(callerUrl))
    const filepath = resolve(currentDir, ...paths);
    const source = readFileSync(filepath, 'utf8');
    return source;
}

export function compileSolidityToJson(source, key) {
    const input = {
        language: 'Solidity',
        sources: {
          [ key ] : {
            content: source,
          },
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*'],
            },
          },
        },
      };

    const jsonInput = JSON.stringify(input);
    return solc.compile(jsonInput);
}

export function compileSolidityFromFile(sourceName, callerUrl, ...paths) {
    const solidity = readSolidityCode(callerUrl, ...paths);
    return compileSolidity(solidity, sourceName);
}

export function compileContractsFromFile(sourceName, callerUrl, ...paths) {
    const compiled = compileSolidityFromFile(sourceName, callerUrl, ...paths);
    return compiled.contracts[sourceName]
}


export function compileSolidity(solidity, sourceName) {
    const json = compileSolidityToJson(solidity, sourceName);
    return JSON.parse(json);
}

export function extractContract(compilation, fileName, contractName) {
    const fileContracts = compilation.contracts[fileName]
    const contract = fileContracts[contractName];
    return contract;
}

export function compileContracts(contractName, callerUrl, ...path) {
    const solidity = readSolidityCode(callerUrl, ...path);
    return compileContractFromSolidity(contractName, solidity);
}

export function compileContractFromSolidity(contractName, code) {
    const compilation = compileSolidity(code, contractName);
    return extractContract(compilation, contractName, contractName);
}