#!/bin/bash

download(){
  curl -L https://raw.githubusercontent.com/nervosnetwork/godwoken/v0.6.2-rc5/crates/types/schemas/$1.mol -o tmp/$1.mol
}

generate(){
    moleculec --language - --schema-file tmp/$1.mol --format json > tmp/$1.json
    ./molecule-es/moleculec-es -hasBigInt -inputFile tmp/$1.json -outputFile schemas/$1.esm.js -generateTypeScriptDefinition
    rollup -f umd -i schemas/$1.esm.js -o schemas/$1.js --name $2
    mv schemas/$1.esm.d.ts schemas/$1.d.ts
    mv tmp/$1.json schemas/$1.json
}

rename_godwoken(){
  for i in ./schemas/godwoken.* ; do mv "$i" "${i/godwoken/index}" ; done
}

# download molecylec-es, must be v0.3.1
DIR=molecule-es
mkdir -p $DIR
FILENAME=moleculec-es_0.3.1_$(uname -s)_$(uname -m).tar.gz
curl -L https://github.com/nervosnetwork/moleculec-es/releases/download/0.3.1/${FILENAME} -o ${DIR}/${FILENAME}
tar xzvf $DIR/$FILENAME -C $DIR

mkdir -p tmp
mkdir -p schemas

download "blockchain"
download "godwoken"
download "store"

generate "godwoken" "Godwoken"
rename_godwoken
rm -rf ../schemas
mv schemas ../schemas

rm -rf tmp
rm -rf $DIR

