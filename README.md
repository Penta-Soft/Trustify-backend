# Trustify Backend

## Setuptools

Vi consiglio di leggervi la guida [QUI](https://docs.openzeppelin.com/learn/developing-smart-contracts), così capite almeno che state facendo.
Dopo aver scaricato tutto i comandi principali sono:

- per prima cosa andate sulla cartella di Trustify con `cd/Trustify`
- `npm install` (per installare tutto il necessario)
- `npx truffle test` (per verificare che i test funzionino)

Per compilare i contratti usare:
`npx truffle compile`

Se tutto funziona allora sei okey
Per uploddare lo smart contract in blockchain usare:
`npx truffle migrate --network development` (per uploddare lo smart contract Tulliocoin e lo smart contract ReviewHolder)
