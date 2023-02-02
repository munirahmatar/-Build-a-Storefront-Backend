import db from "../database";
import Error from "../interfaces/error.interface";
import OrderProduct from "../types/order-product.type";
import Order from "../types/order.type";

class OrderModel {
  private formatOrder(order: {
    id?: number | undefined;
    status: string;
    user_id: string;
    username?: string;
    products: OrderProduct[];
  }): Order {
    return {
      id: order.id,
      status: order.status,
      user_id: +order.user_id,
      username: order.username,
      products:
        Array.isArray(order.products) && order.products.length > 0 && order.products[0]?.quantity
          ? order.products
          : []
    };
  }

  async create(o: Order): Promise<Order> {
    try {
      const connection = await db.connect();
      const sql = "INSERT INTO orders (user_id, status) values ($1, $2) RETURNING *";

      const result = await connection.query(sql, [o.user_id, o.status]);

      const order = result.rows[0];

      connection.release();

      return {
        id: order.id,
        status: order.status,
        user_id: +order.user_id
      };
    } catch (err) {
      throw new Error("Could not create order! Try again. ");
    }
  }

  async index(): Promise<Order[]> {
    try {
      const connection = await db.connect();
      const sql =
        "SELECT o.id AS id, u.username, o.user_id, JSON_AGG(JSONB_BUILD_OBJECT('productId', p.id, 'name', p.name, 'description', p.description,'category', p.category, 'price', p.price, 'quantity', op.quantity)) AS products, o.status AS status FROM orders AS o LEFT JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id GROUP BY o.id, u.username, o.status";
      const result = await connection.query(sql);
      connection.release();
      return result.rows.map((o) => this.formatOrder(o));
    } catch (err) {
      throw new Error("Error can't retrieving products ");
    }
  }

  async edit(o: Order): Promise<Order> {
    try {
      const connection = await db.connect();
      const sql = "UPDATE orders SET user_id=$1, status=$2 WHERE id=$3 RETURNING *";
      const result = await connection.query(sql, [o.user_id, o.status, o.id]);

      const order = result.rows[0];

      connection.release();

      return {
        id: order.id,
        status: order.status,
        user_id: +order.user_id
      };
    } catch (err) {
      throw new Error(`Could not update product ${o.id}.`);
    }
  }

  async delete(id: number): Promise<Order> {
    try {
      const connection = await db.connect();
      const sql = "DELETE FROM orders WHERE id=($1) RETURNING *";

      const result = await connection.query(sql, [id]);

      const order = result.rows[0];

      connection.release();

      return {
        id: order.id,
        status: order.status,
        user_id: +order.user_id
      };
    } catch (err) {
      throw new Error(`Could not delete order ${id}. `);
    }
  }

  async show(id: number): Promise<Order> {
    try {
      const sql =
        "SELECT o.id AS id, u.username, o.user_id, JSON_AGG(JSONB_BUILD_OBJECT('productId', p.id, 'name', p.name, 'description', p.description,'category', p.category, 'price', p.price, 'quantity', op.quantity)) AS products, o.status AS status FROM orders AS o LEFT JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id WHERE o.id = $1 GROUP BY o.id, u.username, o.status, o.user_id";

      const connection = await db.connect();

      const result = await connection.query(sql, [id]);

      connection.release();
      return this.formatOrder(result.rows[0]);
    } catch (err) {
      const error: Error = new Error(`Could not find order with ${id}. Error: ${err}`);
      error.status = 404;
      throw error;
    }
  }

  async getOrderByUserId(userId: number): Promise<Order> {
    try {
      const sql =
        "SELECT o.id AS id, u.username, o.user_id, JSON_AGG(JSONB_BUILD_OBJECT('productId', p.id, 'name', p.name, 'description', p.description,'category', p.category, 'price', p.price, 'quantity', op.quantity)) AS products, o.status AS status FROM orders AS o LEFT JOIN order_products AS op ON o.id = op.order_id LEFT JOIN products AS p ON op.product_id = p.id LEFT JOIN users AS u ON u.id = o.user_id WHERE o.user_id = $1 AND o.status = 'active' GROUP BY o.id, u.username, o.status, o.user_id";

      const connection = await db.connect();
      const result = await connection.query(sql, [userId]);

      connection.release();
      return this.formatOrder(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not find order for user Id ${userId}. `);
    }
  }
}

export default OrderModel;