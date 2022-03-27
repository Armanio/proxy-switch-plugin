let Server;
const chalk = require("chalk");
try {
  Server = require("webpack-dev-server");
} catch (e) {
  console.log(
    chalk.yellow(
      "Warning: Cannot find module webpack-dev-server, try deliver it via parameter"
    )
  );
}
class ProxySwitchPlugin {
  option: any;
  baseRouteStackLength: number;

  constructor(option, DevServer?) {
    this.option = option;
    if (!Server) {
      if (DevServer) {
        Server = DevServer;
      } else {
        throw new Error(
          chalk.red(
            'Error: Cannot find Server from parameter, try "npm i webpack-dev-server -D" to solve this problem'
          )
        );
      }
    }
  }

  apply() {
    const setupMiddlewares = Server.prototype.setupMiddlewares;
    Server.prototype.setupMiddlewares = function (middlewares, devServer) {
      this.app.get("/proxy/list", (req, res) => {
        res.status(200).json({
          list: [
            { label: "peter", value: "peter" },
            { label: "park", value: "park" },
          ],
        });
      });
      this.app.get("/proxy/change", (req, res) => {
        const { proxy } = req.query;
        console.log(proxy);
        res.status(200);
      });
      this.baseRouteStackLength = this.app._router.stack.length;
      setupMiddlewares.call(this, middlewares, devServer);
    };
  }
}

module.exports = ProxySwitchPlugin;
