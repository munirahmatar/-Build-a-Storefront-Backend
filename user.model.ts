/* eslint-disable camelcase  */
/* eslint-disable class-methods-use-this  */
import bcrypt from "bcrypt";
import config from "../config";
import db from "../database";
import User from "../types/user.type";
import hashPassword from "../utilities/hash-password";

class UserModel {
  private formUser(user: {
    id?: number | undefined;
    email: string;
    username: string;
    firstname: string;
    lastname: string;
    password: string;
  }): User {
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      firstname: user.firstname,
      lastname: user.lastname
    };
  }

  async create(u: User): Promise<User> {
    try {
      const connection = await db.connect();
      const sql =
        "INSERT INTO users (email, username, firstname, lastname, password) values ($1, $2, $3, $4, $5) returning id, email, username, firstname, lastname";
      const result = await connection.query(sql, [
        u.email,
        u.username,
        u.firstname,
        u.lastname,
        hashPassword(u.password as string)
      ]);
      connection.release();
      return this.formUser(result.rows[0]);
    } catch (error) {
      throw new Error(`Unable to create (${u.username}): `);
    }
  }

  async index(): Promise<User[]> {
    try {
      const connection = await db.connect();
      const sql = "SELECT * FROM users";
      const result = await connection.query(sql);
      connection.release();
      return result.rows.map((u) => this.formUser(u));
    } catch (err) {
      throw new Error("Error at retrieving users ");
    }
  }

  async edit(u: User): Promise<User> {
    try {
      const connection = await db.connect();
      const sql =
        "UPDATE users SET email=$1, username=$2, firstname=$3, lastname=$4, password=$5 WHERE id=$6 RETURNING *";

      const result = await connection.query(sql, [
        u.email,
        u.username,
        u.firstname,
        u.lastname,
        hashPassword(u.password as string),
        u.id
      ]);
      connection.release();
      return this.formUser(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not update user: ${u.username}`);
    }
  }

  async delete(id: number): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = "DELETE FROM users WHERE id=($1) RETURNING *";

      const result = await connection.query(sql, [id]);

      connection.release();

      return this.formUser(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not delete user ${id},`);
    }
  }

  async show(id: number): Promise<User> {
    try {
      const sql = "SELECT * FROM users WHERE id=($1)";

      const connection = await db.connect();

      const result = await connection.query(sql, [id]);

      connection.release();
      return this.formUser(result.rows[0]);
    } catch (err) {
      throw new Error(`Could not find user ${id}, `);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql = "SELECT password FROM users WHERE username= $1";
      const result = await connection.query(sql, [username]);

      if (result.rows.length) {
        const { password: hashedPassword } = result.rows[0];
        const isPasswordValid = bcrypt.compareSync(`${password}${config.pepper}`, hashedPassword);
        if (isPasswordValid) {
          const userInfo = await connection.query("SELECT * FROM users WHERE username= ($1)", [
            username
          ]);
          return this.formUser(userInfo.rows[0]);
        }
      }
      connection.release();
      return null;
    } catch (error) {
      throw new Error(`Unable to login: ${error}`);
    }
  }
}

export default UserModel;