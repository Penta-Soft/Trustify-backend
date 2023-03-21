# Trustify Backend

## Setup tools

Vi consiglio di leggervi la guida [QUI](https://docs.openzeppelin.com/learn/developing-smart-contracts), così capite almeno che state facendo.
Dopo aver scaricato tutto i comandi principali sono:

- per prima cosa andate sulla cartella di Trustify con `cd/Trustify`
- `npm install` (per installare tutto il necessario)
- Aprire ganache con `npx ganache`
- `npx truffle test` (per verificare che i test funzionino)

Per compilare i contratti usare:
`npx truffle compile`

Se tutto funziona allora sei okey
Per uploddare lo smart contract in blockchain usare:
`npx truffle migrate --network development` (per uploddare lo smart contract Tcoin e lo smart contract Trustify)

## Strumenti di analisi statica

Useremo [slither](https://github.com/crytic/slither)
Per urilizzare slither bisogna avere python installato con il path aggiornato al cmd (cercate su internet come fare) poi:

- `pip3 install slither-analyzer` per installare
- `slither .` per runnare l'analisi statica

##Code coverage
Vi sconsigllio di farla perchè ci mette tipo 10 minuti
- `npx truffle run coverage`
