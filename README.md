# Trustify Backend

## Setuptools

Vi consiglio di leggervi la guida [QUI](https://docs.openzeppelin.com/learn/developing-smart-contracts), così capite almeno che state facendo
Scaricare [Ganache](https://trufflesuite.com/ganache/)
Dopo aver scaricato tutto i comandi principali sono:

- per prima cosa andate sulla cartella di Trustify con cd/Trustify
- `npx truffle migrate --f 1 --to 1 --network development` (per uploddare lo smart contract Tulliocoin)
- copiare l'address di TullioCoin e incollarlo nello smart contract Trustify.sol, l'address lo trovate o su Ganache o sulla console di VSCode
- `npx truffle migrate --f 2 --to 2 --network development` (per uploddare lo smart contract Trustify)
- il resto lo scriverò dopo
-
