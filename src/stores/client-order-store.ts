import { defineStore } from 'pinia';
import axios from 'axios';
import { Item, Order, OrderItem, Room, User } from 'src/interfaces/basic';

const apiUrl = 'http://localhost:3000';

export const useClientOrderStore = defineStore('clientOrderStore', {
  state: () => ({
    order: null as Order | null,
    orderItem: [] as OrderItem[],
    items: [] as Item[],
    user: null as User | null,
    room: null as Room | null,
  }),
  getters: {
    getOrder(state) {
      return state.order;
    },
    getOrderItem(state) {
      return state.orderItem;
    },
    itemSummary(state) {
      return state.order?.room_total_price; // Using room_total_price as item summary example
    },
    orderId(state) {
      return state.order?.id;
    },
    startTime(state) {
      return state.order?.start_time;
    },
    getItems(state) {
      return state.items;
    },
  },
  actions: {
    async fetchOrderItems(orderId: number) {
      try {
        const response = await axios.get(`${apiUrl}/orders/${orderId}/items`);
        this.items = response.data.map((itemData: Item) => ({
          id: itemData.id,
          name: itemData.name,
          price: itemData.price,
          category_id: itemData.category_id,
          imageUrl: itemData.imageUrl,
        }));
      } catch (error) {
        console.error('Failed to fetch items:', error);
      }
    },
    async closeOrder() {
      if (!this.order) {
        throw new Error('Order not found');
      }
      try {
        await axios.put(`${apiUrl}/orders/${this.order.id}`, {
          order: { status: 'completed' },
        });
      } catch (error) {
        console.error('Failed to close order:', error);
      }
    },
    async fetchOrder(deviceId: string) {
      try {
        const response = await axios.get(`${apiUrl}/order/room/${deviceId}`);
        this.order = response.data;
      } catch (error) {
        console.error('Failed to fetch order:', error);
      }
    },
    async fetchItems() {
      try {
        const response = await axios.get(`${apiUrl}/items`);
        this.items = response.data;
        return response.data;
      } catch (error) {
        console.error('Failed to fetch order item:', error);
      }
    },
    async addItemToOrder(orderItemDetails: OrderItem[]) {
      if (!this.order) {
        throw new Error('Order not found');
      }
      let totalItems = 0;
      let totalPrices = 0;

      orderItemDetails.forEach((detail) => {
        totalItems += detail.quantity;
        totalPrices += detail.total_price;
      });

      const itemSummary = {
        totalItems,
        totalPrices,
      };

      console.log('itemSummary:', itemSummary);

      try {
        await axios.put(`${apiUrl}/orders/${this.order.id}`, {
          order: { grand_total_price: totalPrices },
        });
        this.order.grand_total_price = totalPrices;
      } catch (error) {
        console.error('Failed to add items to order:', error);
      }
    },
  },
});
