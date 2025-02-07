/** Common settings for auth-api app. */

const DB_URI = (process.env.NODE_ENV === "test")
  ? "postgresql:///express_auth_test"
  : "postgresql:///express_auth";

const SECRET_KEY = process.env.SECRET_KEY || "demonloveselena2024";

const BCRYPT_WORK_FACTOR = 12;

module.exports = {
  DB_URI,
  SECRET_KEY,
  BCRYPT_WORK_FACTOR
};