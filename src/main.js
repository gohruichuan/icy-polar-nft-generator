const fs = require("fs");
const { createCanvas, loadImage } = require("canvas");
const console = require("console");
const { layersOrder, format, rarity } = require("./config.js");

const canvas = createCanvas(format.width, format.height);
const ctx = canvas.getContext("2d");

if (!process.env.PWD) {
  process.env.PWD = process.cwd();
}

const buildDir = `${process.env.PWD}/build`;
const metDataFile = '_metadata.json';
const layersDir = `${process.env.PWD}/layers`;

let metadata = [];
let attributes = [];
let hash = [];
let hashObj = {};
let decodedHash = [];
let edition_global;

const cleanName = _str => {
  let name = _str.slice(0, -4);
  rarity.forEach((r) => {
    name = name.replace(r.key, "");
  });
  return name;
};

const addRarity = _str => {
  let itemRarity;

  rarity.forEach((r) => {
    if (_str.includes(r.key)) {
      itemRarity = r.val;
    }
  });

  return itemRarity;
};

const getElements = path => {
  const elements = {};

  fs.readdirSync(path)
    .filter((item) => !/(^|\/)\.[^\/\.]/g.test(item))
    .map((i, index) => {
      elements[cleanName(i)] = {
        id: index + 1,
        name: cleanName(i),
        fileName: i,
        rarity: addRarity(i),
      };
    });

  return elements;
};

const layersSetup = layersOrder => {
  const layers = layersOrder.map((layerObj, index) => ({
    id: index,
    name: layerObj.name,
    location: `${layersDir}/${layerObj.name}/`,
    elements: getElements(`${layersDir}/${layerObj.name}/`),
    position: { x: 0, y: 0 },
    size: { width: format.width, height: format.height },
    // number: layerObj.number
  }));

  return layers;
};

const layers = layersSetup(layersOrder);

const buildSetup = () => {
  if (fs.existsSync(buildDir)) {
    fs.rmdirSync(buildDir, { recursive: true });
  }
  fs.mkdirSync(buildDir);
};

const saveLayer = (_canvas, _edition) => {
  fs.writeFileSync(`${buildDir}/${_edition}.png`, _canvas.toBuffer("image/png"));
};

const addMetadata = _edition => {
  let dateTime = Date.now();
  let tempMetadata = {
    hash: hash.join(""),
    decodedHash: decodedHash,
    edition: _edition,
    date: dateTime,
    attributes: attributes,
  };
  metadata.push(tempMetadata);
  attributes = [];
  hash = [];
  decodedHash = [];
};

const checkAndAddAttributes = (_element, _layer) => {
  let tempAttr = {
    id: _element.id,
    layer: _layer.name,
    name: _element.name,
    rarity: _element.rarity,
  };
  attributes.push(tempAttr);
  hash.push(_layer.id);
  hash.push(_element.id);
  decodedHash.push({ [_layer.id]: _element.id });
  if(layers.length === decodedHash.length){
  // if (4 === decodedHash.length) {
    const currentHash = hash.join("");
    if (hashObj[currentHash]) {
      
      attributes = [];
      hash = [];
      decodedHash = [];
      // edition_global++;
      console.log("edition_global ", edition_global);
      console.log("Hash EXIST ===========================", currentHash);
      return true;
    } else {
      hashObj[currentHash] = currentHash;
      return false;
    }
  }
};
const findTrait = (_layer, name) => {
  return _layer.elements[name];
};

const findTraits = (_layer, names) => {
  const rngName = names[Math.floor(Math.random() * names.length)];
  return _layer.elements[rngName];
};

const getRNG = _ => {
  return (Math.random() * 100).toFixed(1);
}
const drawLayer = async (_layer, _edition, layersArray) => {
  let element;
  let whitelist;
  // GENERIC RANDOM GENERATION
  let traitsRNG;
  // let element = _layer.elements[Object.keys(_layer.elements)[traitsRNG]];

  // console.log("element ", element)
  const rng = getRNG();
  switch (_layer.name) {
    case "Background":
      //console.log("rng Background", rng);
      whitelist = ["Gradient", "Ash Maroon", "Ash Purple"];

      if (rng <= 5) {
        element = await findTraits(_layer, whitelist);
      } 
      else { // if rng is 50%, return elements that have prefix "pixil-frame-0"
        const others = Object.keys(_layer.elements).filter( layer =>  !whitelist.includes(layer));
        element =  await findTraits(_layer, others);
      }
      break;

    case "Base":
      whitelist = ["Rainbow", "Alien"];

      if (rng <= 5) {
        element = await findTraits(_layer, whitelist);
      } 
      else { // if rng is 50%, return elements that have prefix "pixil-frame-0"
        const others = Object.keys(_layer.elements).filter( layer =>  !whitelist.includes(layer));
        element =  await findTraits(_layer, others);
      }
      break;

    case "Accessory 2":
      whitelist = ["Balloon", "Ghost"];

      if (rng <= 1) {
        element = await findTraits(_layer, whitelist);
      } 
      else { // if rng is 50%, return elements that have prefix "pixil-frame-0"
        const others = Object.keys(_layer.elements).filter( layer =>  !whitelist.includes(layer));
        element =  await findTraits(_layer, others);
      }
      break;

    case "Head":
      whitelist = ["Love", "Jay Z"];

      if (rng <= 5) {
        element = await findTraits(_layer, whitelist);
      } 
      else { // if rng is 50%, return elements that have prefix "pixil-frame-0"
        const others = Object.keys(_layer.elements).filter( layer =>  !whitelist.includes(layer));
        element =  await findTraits(_layer, others);
      }
      break;

    case "Eye":
      whitelist = ["Blue Beam", "Laser", "Robot", "Alien", "Zombie eye"];

      if (rng <= 5) {
        element = await findTraits(_layer, whitelist);
      } 
      else { // if rng is 50%, return elements that have prefix "pixil-frame-0"
        const others = Object.keys(_layer.elements).filter( layer =>  !whitelist.includes(layer));
        element =  await findTraits(_layer, others);
      }
      break;

    case "Accessory":
      traitsRNG = Math.floor(Math.random() * Object.keys(_layer.elements).length);
      element = _layer.elements[Object.keys(_layer.elements)[traitsRNG]];
      break;

    case "Body":
      whitelist = ["Tuxedo", "Black Suit"];

      if (rng <= 5) {
        element = await findTraits(_layer, whitelist);
      } 
      else { // if rng is 50%, return elements that have prefix "pixil-frame-0"
        const others = Object.keys(_layer.elements).filter( layer =>  !whitelist.includes(layer));
        element =  await findTraits(_layer, others);
      }
      break;

    case "Extra":
      whitelist = ["Mole"];

      if (rng <= 1) {
        element = await findTraits(_layer, whitelist);
      } 
      else { // if rng is 50%, return elements that have prefix "pixil-frame-0"
        const others = Object.keys(_layer.elements).filter( layer =>  !whitelist.includes(layer));
        element =  await findTraits(_layer, others);
      }
      break;
  };
  if (element) {
    const isNFTExist = checkAndAddAttributes(element, _layer);

    if (isNFTExist) {
      return true;
    }

    layersArray.push({ layer: _layer, element: element });

    if (layers.length === layersArray.length) {

      layersArray.map( async layer => {
        const image = await loadImage(`${layer.layer.location}${layer.element.fileName}`);

        // image.onload = _ => {
          canvas.width = this.naturalWidth;
          canvas.height = this.naturalHeight;
          ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
        // };
        // ctx.drawImage(  
        //   image,
        //   layer.layer.position.x,
        //   layer.layer.position.y,
        //   layer.layer.size.width,
        //   layer.layer.size.height
        // );
        saveLayer(canvas, _edition);
      })
    }
  }

};

const createFiles = async edition => {
  edition_global = edition;
  for (let i = 1; i <= edition_global; i++) {
    const layersArray = [];
    for(const layer of layers){
      const isExistTrait = await drawLayer(layer, i, layersArray);
      if(isExistTrait){
        i--;
        break;
      }
    }
    // await layers.map(async (layer) => {
      
    // });
    // if(!isExist){
      addMetadata(i);
      console.log("Creating edition " + i);
    // }
  }
};

const createMetaData = () => {
  fs.stat(`${buildDir}/${metDataFile}`, (err) => {
    if (err == null || err.code === 'ENOENT') {
      fs.writeFileSync(`${buildDir}/${metDataFile}`, JSON.stringify(metadata, null, 2));
    } else {
      console.log('Oh no, error: ', err.code);
    }
  });
};

module.exports = { buildSetup, createFiles, createMetaData };
