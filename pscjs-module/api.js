const superagent = require('superagent');
const base = 'https://phone-specs-api.vercel.app/';

//search by brands
const brand = async (brandName, page) => {
    // https://phone-specs-api.vercel.app/brands/apple-phones-48?page=1
    // Every brand and phones have their own id, we need those IDs for our API link.
    // Since the user will have no idea what those IDs are, we need to find it ourself.
    try {
        // List all the brand
        const brandURL = `${base}/brands`;
        const res = await superagent.get(brandURL);
        // Find the requsted brand object
        const brand = res.body.data.find((brand) => brand.brand_name.toLowerCase().includes(brandName.toLowerCase()));

        // Get the object brand_slug
        // brand_slug contain `brand_name-phones-brand_id`
        const brandNameURL = `${base}/brands/${brand.brand_slug}?page=${page}`;
        //console.log(brandNameURL);
        const resquest = await superagent.get(brandNameURL);
        //console.log(resquest.body.data.phones);
        return resquest.body.data;
    } catch (error) {
        console.log(`Item not found or the server is having issues, please try again.`);
    }
};

/* search link don't work with the recently updated api link, 'https://phone-specs-api.vercel.app/'
//search by model
const model = async (modelsName) => {
    // https://phone-specs-api.azharimm.dev/search?query=iPhone_12_pro_max
    try {
        const modelURL = `${base}/search?query=${modelsName}`;
        //console.log(modelURL);

        const res = await superagent.get(modelURL);
        //console.log(res.body);

        return res.body.data;
    } catch (error) {
        console.log(`Item not found or the server is having issues, please try again.`);
    }
};
*/

const itemDetail = async (slug) => {
    try {
        const specsURL = `${base}/${slug}`;
        // console.log(specsURL);

        const res = await superagent.get(specsURL);
        // console.log(res.body);

        return res.body.data;
    } catch (error) {
        console.log(`Item not found or the server is having issues, please try again.`);
    }
};

module.exports = {
    brand,
    itemDetail
}