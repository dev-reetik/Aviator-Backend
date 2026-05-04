import AuthService from "../services/Auth.Service.js";

export default class AuthController {
  static async register(req, res) {
    try {
      const user = await AuthService.register(
        req.body.username,
        req.body.password,
      );
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req, res) {
    try {
      const result = await AuthService.login(
        req.body.username,
        req.body.password,
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async profile(req, res) {
    try {
      const user = await AuthService.profile(req.user.id);
      res.json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
