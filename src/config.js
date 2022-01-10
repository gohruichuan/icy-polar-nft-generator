const layersOrder = [
    { name: 'Background' },
    { name: 'Body' },
    { name: 'Horn'},
    { name: 'Eye'},
    { name: 'Accessory',},
    { name: 'Accessory 2' },
    { name: 'Head' }
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

const defaultEdition = 10;

module.exports = { layersOrder, format, rarity, defaultEdition };