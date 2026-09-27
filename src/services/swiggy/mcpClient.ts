import { SwiggyMcpServerConfig, SwiggyPastOrder, SwiggyAddress, SwiggyRestaurant, SwiggyCartItem } from '../../types/swiggy';
import { MOCK_ADDRESSES, MOCK_PAST_ORDERS, MOCK_RESTAURANTS } from './mockData';

const MCP_CONFIG_KEY = 'decideit_swiggy_mcp_config';

export const DEFAULT_MCP_CONFIG: SwiggyMcpServerConfig = {
  endpoint: 'https://mcp.swiggy.com/food',
  authToken: '',
  enabled: true,
  useMockFallback: true
};

export class SwiggyMcpClient {
  private config: SwiggyMcpServerConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  loadConfig(): SwiggyMcpServerConfig {
    try {
      const stored = localStorage.getItem(MCP_CONFIG_KEY);
      if (stored) {
        return { ...DEFAULT_MCP_CONFIG, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.error('Failed to load MCP config:', e);
    }
    return { ...DEFAULT_MCP_CONFIG };
  }

  saveConfig(newConfig: Partial<SwiggyMcpServerConfig>): void {
    this.config = { ...this.config, ...newConfig };
    try {
      localStorage.setItem(MCP_CONFIG_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.error('Failed to save MCP config:', e);
    }
  }

  getConfig(): SwiggyMcpServerConfig {
    return { ...this.config };
  }

  /**
   * Invokes an MCP tool via JSON-RPC 2.0 over HTTP POST
   */
  async callTool<T>(toolName: string, args: Record<string, any> = {}): Promise<{ success: boolean; data: T; source: 'live_mcp' | 'mock_fallback'; error?: string }> {
    if (this.config.authToken && this.config.endpoint) {
      try {
        const response = await fetch(this.config.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.authToken.trim()}`,
            'X-Client-Id': 'decideIT-agent'
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            id: Date.now(),
            method: 'tools/call',
            params: {
              name: toolName,
              arguments: args
            }
          })
        });

        if (response.ok) {
          const json = await response.json();
          if (json.result && !json.error) {
            return {
              success: true,
              data: json.result.content?.[0]?.text ? JSON.parse(json.result.content[0].text) : json.result,
              source: 'live_mcp'
            };
          }
        }
      } catch (err: any) {
        console.warn(`Swiggy MCP call to ${toolName} failed, falling back to local dataset:`, err.message);
      }
    }

    // Fallback to local mock data
    const fallbackData = this.getMockDataForTool<T>(toolName, args);
    return {
      success: true,
      data: fallbackData,
      source: 'mock_fallback'
    };
  }

  private getMockDataForTool<T>(toolName: string, args: Record<string, any>): T {
    switch (toolName) {
      case 'get_food_orders':
        return MOCK_PAST_ORDERS as unknown as T;
      case 'get_addresses':
        return MOCK_ADDRESSES as unknown as T;
      case 'search_restaurants':
      case 'get_restaurants':
        return MOCK_RESTAURANTS as unknown as T;
      case 'add_to_cart':
        return {
          cartId: 'cart_' + Math.random().toString(36).substring(2, 9),
          status: 'items_added',
          itemCount: args.items?.length || 1,
          checkoutUrl: 'https://www.swiggy.com/checkout'
        } as unknown as T;
      case 'trigger_checkout':
        return {
          orderId: 'swiggy_ord_' + Math.floor(100000 + Math.random() * 900000),
          status: 'payment_pending',
          paymentLink: 'https://www.swiggy.com/payment/upi',
          estimatedDeliveryMinutes: 25
        } as unknown as T;
      default:
        return {} as T;
    }
  }

  async getPastOrders(): Promise<SwiggyPastOrder[]> {
    const res = await this.callTool<SwiggyPastOrder[]>('get_food_orders');
    return res.data || MOCK_PAST_ORDERS;
  }

  async getAddresses(): Promise<SwiggyAddress[]> {
    const res = await this.callTool<SwiggyAddress[]>('get_addresses');
    return res.data || MOCK_ADDRESSES;
  }

  async getRestaurants(): Promise<SwiggyRestaurant[]> {
    const res = await this.callTool<SwiggyRestaurant[]>('get_restaurants');
    return res.data || MOCK_RESTAURANTS;
  }

  async addToCart(cartItem: SwiggyCartItem): Promise<{ cartId: string; checkoutUrl: string }> {
    const res = await this.callTool<{ cartId: string; checkoutUrl: string }>('add_to_cart', {
      restaurantId: cartItem.restaurant.id,
      items: [
        {
          itemId: cartItem.menuItem.id,
          quantity: cartItem.quantity,
          customization: cartItem.customization
        }
      ]
    });
    return res.data;
  }
}

export const swiggyMcp = new SwiggyMcpClient();
