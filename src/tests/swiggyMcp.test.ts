import { describe, expect, test } from 'bun:test';
import { SwiggyMcpClient } from '../services/swiggy/mcpClient';
import { SwiggyCartItem } from '../types/swiggy';

describe('Swiggy MCP Client & Data Service', () => {
  const client = new SwiggyMcpClient();

  test('should fetch past food orders with authentic details', async () => {
    const orders = await client.getPastOrders();
    expect(orders.length).toBeGreaterThan(0);
    const firstOrder = orders[0];
    expect(firstOrder.orderId).toBeDefined();
    expect(firstOrder.restaurantName).toBeDefined();
    expect(firstOrder.items.length).toBeGreaterThan(0);
    expect(firstOrder.totalAmount).toBeGreaterThan(0);
  });

  test('should fetch available delivery addresses', async () => {
    const addresses = await client.getAddresses();
    expect(addresses.length).toBeGreaterThan(0);
    expect(addresses[0].tag).toBe('Home');
    expect(addresses[0].city).toBe('Bengaluru');
    expect(addresses[0].lat).toBeGreaterThan(0);
    expect(addresses[0].lng).toBeGreaterThan(0);
  });

  test('should fetch restaurants catalog with menus and ratings', async () => {
    const rests = await client.getRestaurants();
    expect(rests.length).toBeGreaterThan(0);

    const meghan = rests.find(r => r.name.includes('Meghana'));
    expect(meghan).toBeDefined();
    expect(meghan?.menu.length).toBeGreaterThan(0);
    expect(meghan?.avgRating).toBeGreaterThanOrEqual(4.0);
    expect(meghan?.swiggyUrl).toContain('swiggy.com/restaurants');
  });

  test('should invoke add_to_cart tool and return cart metadata', async () => {
    const rests = await client.getRestaurants();
    const item = rests[0].menu[0];

    const cartPayload: SwiggyCartItem = {
      menuItem: item,
      restaurant: rests[0],
      quantity: 2
    };

    const res = await client.addToCart(cartPayload);
    expect(res.cartId).toBeDefined();
    expect(res.checkoutUrl).toContain('swiggy.com');
  });
});
