import fetch from 'node-fetch';

const createOrder = async (req, res) => {
    try {
        const credentials = Buffer.from(`${process.env.KLARNA_USER_NAME}:${process.env.KLARNA_PASSWORD}`).toString('base64');

        const createOrderResp = await fetch(
            `${process.env.KLARNA_LIVE_DOMAIN}/checkout/v3/orders`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`,
                    'Klarna-Partner': 'string'
                },
                body: JSON.stringify({
                    purchase_country: 'US',
                    purchase_currency: 'USD',
                    locale: 'en-US',
                    order_amount: 50000,
                    order_tax_amount: 4545,
                    order_lines: [
                        {
                            type: 'physical',
                            reference: '19-402-USA',
                            name: 'Red T-Shirt',
                            quantity: 5,
                            quantity_unit: 'pcs',
                            unit_price: 10000,
                            tax_rate: 1000,
                            total_amount: 50000,
                            total_discount_amount: 0,
                            total_tax_amount: 4545,
                            merchant_data: '{"marketplace_seller_info":[{"product_category":"Women\'s Fashion","product_name":"Women Sweatshirt"}]}',
                            product_url: 'https://www.example.com/products/f2a8d7e34',
                            image_url: 'https://www.exampleobjects.com/product-image-1200x1200.jpg',
                            product_identifiers: {
                                brand: 'Intel',
                                color: 'Blue',
                                category_path: 'Electronics Store > Computers & Tablets > Desktops',
                                global_trade_item_number: '735858293167',
                                manufacturer_part_number: 'BOXNUC5CPYH',
                                size: 'Medium'
                            },
                            shipping_attributes: {
                                weight: 1000,
                                dimensions: {
                                    height: 100,
                                    width: 100,
                                    length: 100
                                },
                                tags: ['string']
                            }
                        }
                    ],
                    merchant_urls: {
                        checkout: 'https://example.com/checkout',
                        confirmation: 'https://example.com/confirmation',
                        push: 'https://example.com/push',
                        terms: 'https://example.com/terms',
                        validation: 'https://example.com/validation',
                        cancel: 'https://example.com/cancel',
                    }
                })
            }
        );

        const data = await createOrderResp.json();
        console.log("create order response data :>", data);
        res.json(data)
    } catch (error) {
        console.log("<<== create order error ==>>");
        console.log(error);
    }
}

const orderDetail = async (req, res) => {
    try {
        const credentials = Buffer.from(`${process.env.KLARNA_USER_NAME}:${process.env.KLARNA_PASSWORD}`).toString('base64');
        const orderId = 'ff7fcbef-ab5c-5c81-bcda-6f60ebe3ac7c';
        const orderDetailResp = await fetch(
            `${process.env.KLARNA_LIVE_DOMAIN}/checkout/v3/orders/${orderId}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Basic ${credentials}`,
                }
            }
        );
        const data = await orderDetailResp.json();
        console.log(" order detail data :>", data);
        res.json(data)
    } catch (error) {
        console.log("<<== order detail error ==>>");
        console.log(error);
    }
}
export {
    createOrder, orderDetail
}