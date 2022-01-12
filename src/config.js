const layersOrder = [
    { name: 'Background' },
    { name: 'Base' },
    { name: 'Accessory 2' },
    { name: 'Eye' },
    { name: 'Accessory' },
    { name: 'Head' },
    { name: 'Body' },
    // // { name: 'Spacesuit'},
    { name: 'Extra' },
    // { name: 'ThirdEye'}
];
  
const format = {
    width: 1080,
    height: 1080
};

const rarity = [
    { key: "", val: "original" },
    { key: "_r", val: "rare" },
    { key: "_sr", val: "super rare" },
];

const defaultEdition = 3000;

module.exports = { layersOrder, format, rarity, defaultEdition };