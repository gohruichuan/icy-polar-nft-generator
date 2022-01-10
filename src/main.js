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
  // let element;

  // GENERIC RANDOM GENERATION
  const traitsRNG = Math.floor(Math.random() * Object.keys(_layer.elements).length);
  let element = _layer.elements[Object.keys(_layer.elements)[traitsRNG]];

  console.log("element ", element)
  const rng = getRNG();
  switch (_layer.name) {
    case "Background":
      //console.log("rng Background", rng);
      // if (rng <= 24) {
      //   element = await findTraits(_layer, ["Silver Pink", "Coconut", "Ice Blue"]);
      // } else if (rng >= 25 && rng <= 50) {
      //   element = await findTraits(_layer, ["Dirty Green", "Pink"]);
      // }
      // else { // if rng is 50%, return elements that have prefix "pixil-frame-0"
      //   element = await findTraits(_layer, ["Blue", "Brown", "Green", "Grey", "Yellow", "Purple"]);
      // }
      // else {
      //   const blacklist = ["Coconut", "Ice Blue", "Silver Pink", "Pink"];
      //   element = await findOthers(_layer, blacklist)
      // }
      // console.log("element Background ", element);

      break;
    case "Body":
      //console.log("rng Body", rng);
      // if (rng <= 14) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Pixel", "lgbtq", "Pink 2"]);
      // } else if (rng >= 15 && rng <= 55) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Baby Blue", "Coral", "Ice Grey","Emerald"]);
      // } else { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Green", "Hazelnut", "Cream", "Pink", "Purple"]);
      // }
      // else {
      //   const blacklist = ["Pixel", "LGBTQ", "Coral"];
      //   element = await findOthers(_layer, blacklist)
      // }
      // console.log("element Body ", element);
      break;
    case "Horn":
      //console.log("rng Horn", rng);
      // if (rng <= 1) { // if rng is 80%, return empty .png
      //   element = await findTrait(_layer, "Pixel");
      // } else if (rng >= 2 && rng <= 6) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Odd", "Alien"]);
      // } else if (rng >= 7 && rng <= 25) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Chocolate", "Bolt", "Cream", "Grape"]);
      // } else if (rng >= 26 && rng <= 43) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Ice", "Lime", "Moss", "Peach"]);
      // }
      // else {
      //   //   // const blacklist = ["Normal", "Odd", "Ice", "Grape", "Moss", "Peach", "Bolt", "Chocolate"];
      //   //   // element = await findOthers(_layer, blacklist)
      //   //   // if (!element) {
      //   element = await findTrait(_layer, "Normal");
      // }
      // }
      // console.log("element Horn ", element);
      break;
    case "Eye":
      //console.log("rng Eye", rng);
      // if (rng <= 4) { // if rng is 80%, return empty .png
      //   element = await findTrait(_layer, "Alien");
      // } else if (rng >= 5 && rng <= 22) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Zombie","Tear Drop","Robot","Sleepy","Laser"]);
      // } else if (rng >= 23 && rng <= 33) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Cyborg","Blue Shade","Pink"]);
      // }else if (rng >= 34 && rng <= 84) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["3D","Blue Shade","Purple Shade","Yellow Shade","Reading Glasses","Green Boxed Shade","Red Boxed Shade","Orange Boxed Shade","Half Rim Glasses","Monocle","Shade","Rounded Shade","Eye Mask","Eye Patch","Sun Visor"]);
      // } else {
      //   // const blacklist = ["Tear Drop", "Robot", "Zombie", "Cyborg", "Blue", "Pink", "Sleepy", "Orange Boxed Shade", "Sun Visor", "Red Boxed Shade", "Green Boxed Shade", "Rounded Shade", "Yellow Shade", "Blue Shade", "Eye Mask", "Eye Patch", "Monocle", "3D", "Purple Shade", "Shade", "Normal"];
      //   // // if(_layer.elements.length !== blacklist.length){
      //   // element = await findOthers(_layer, blacklist)
      //   // if (!element) {
      //   element = await findTrait(_layer, "None");
      //   // }
      //   // }else{
      //   // element = await findTrait(_layer, "Half Rim Glasses");
      //   // }
      // }
      // console.log("element eyes ", element);
      break;
    case "Accessory":
      //console.log("rng Accessory", rng);
      // if (rng <= 2) { // if rng is 80%, return empty .png
      //   element = await findTrait(_layer, "Burger Mask");
      // } else if (rng >= 2 && rng <= 5) { // if rng is 80%, return empty .png
      //   element = await findTrait(_layer, "Mole");
      // } else if (rng >= 6 && rng <= 21) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Mask","Pacifier","Bubble Gum"]);
      // } else if (rng >= 22 && rng <= 92) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Cigarette","Pipe","Vape","Party Popper","Ear Ring"]);
      // }else {
      //   element = await findTrait(_layer, "Blank");
      // }
      // console.log("element Accessory", element);
      break;

    case "Accessory 2":
      //console.log("rng Accessory 2", rng);
      // if (rng <= 39) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Necklace","Scarf","Bell"]);
      // }else {
      //   element = await findTrait(_layer, "Blank");
      // }
      // console.log("element Accessory 2", element);
      break;
    case "Head":
      //  if (rng <= 1) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Kitsune Mask", "Tengu Mask"]);
      // } else if (rng >= 2 && rng <= 7) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Flame", "Rose","Bindi"]);
      // } else if (rng >= 8 && rng <= 20) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Fast Food Cap", "Turban", "Jewelry","Elvis"]);
      // } else if (rng >= 21 && rng <= 37) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Pirate Hat","Witch Hat", "Top Hat", "Crown", "Shower Cap"]);
      // } else if (rng >= 38 && rng <= 95) { // if rng is 80%, return empty .png
      //   element = await findTraits(_layer, ["Amish Hat", "Bandage", "Bandana", "Beanie", "Beret", ,"Candle", "Cap Forward", "Cowboy Hat", "Flower Clip", "Head Band", "Headphones", "Heli Cap", "Military Helmet", "Santa Cap", "Straw Hat", "Sushi Chef Rope"]);
      // } else {
      //   // element = await findTrait(_layer, "Blank");
      //   // const blacklist = ["Blank", "Kitsune Mask", "Tengu Mask", "Flame", "Fast Food Cap", "Candle", "Beret", "Crown", "Jewelry", "Flower Clip", "Headphones", "Bandage", "Santa Cap", "Bandana", "Police Cap", "Straw Hat", "Cap Forward", "Cowboy Hat", "Sushi Chef Rope", "Amish Hat", "Beanie"];
      //   // element = await findOthers(_layer, blacklist);
      //   // if (!element) {
      //   element = await findTrait(_layer, "Blank");
      //   // }
      // }
      // console.log("element head", element);

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
