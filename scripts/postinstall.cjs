console.log('postinstall.cjs');


const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');
const iconsDir = path.join(__dirname, '..', 'static', 'static', 'icons');

let iconsData = { icons: {} };

importCarbon();
importFa();

fs.writeFileSync(path.join(dataDir, 'icons.json'), JSON.stringify(iconsData));


function importFa() {
    const fa = require('@fortawesome/fontawesome-free/metadata/icon-families.json');
    for (const [name, icon] of Object.entries(fa)) {
        for (const [style,svg] of Object.entries(icon.svgs.classic)) {
            iconsData.icons['fa-' + name + '-' + style] = 'fa-' + name + '-' + style;
            iconsData.icons['fa-' + name] = 'fa-' + name + '-' + style;
            fs.writeFileSync(path.join(iconsDir, 'fa-' + name + '-' + style + '.svg'), svg.raw);
        }
    }
}

function importCarbon() {
// import @carbon/icons from metadata.json
    const metadata = require('@carbon/icons/metadata.json');



    metadata.icons.forEach(
        (icon) => {
            icon.assets.forEach((asset) => {
                if (asset.size === 32) {

                    let optimized = asset.optimized;
                    if (optimized === undefined) {
                        console.log(icon.name + ' has no optimized data');
                    }

                    iconsData.icons[icon.name] = icon.name;
                    icon.aliases.forEach((alias) => {
                        iconsData.icons[alias] = icon.name;
                    });

                    fs.writeFileSync(path.join(iconsDir, icon.name + '.svg'), optimized.data);
                }
            });
        }
    );
}