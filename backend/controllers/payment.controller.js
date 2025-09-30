export const createCheckoutSession = async (req, res) => {
    try{
        const {products} = req.body;
        if(!Array.isArray(products) || products.length === 0){
            return res.status(400).json({error: "Invalid or empty products"});
        }

        let totalAmount = 0;

        const lineItems = products.map(product => {
            const amount = Math.round(product.price * 100)
            totalAmount += amount * product.quantity

            return {
                price_data:{
                    currency: "ngn",
                    product_data: {
                        name: product.name,
                        images: [product.image],
                    },
                    unit_amount:amount
                }
            }
        });
    }catch(error){

    }
}