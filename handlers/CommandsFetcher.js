const fs = require("node:fs");
const path = require("node:path");

const commandsArray = [];

const GetCommands = (dir) => {
    const files = fs.readdirSync(dir);
  
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
  
      if (stat.isDirectory()) {
        GetCommands(filePath);
      } else if (file.endsWith(".js")) {
        const command = require(filePath);
        if ("data" in command && "execute" in command) {
          commandsArray.push([command.data.name, command.data.description]);
        } else {
          console.log(
            `[Warning] The command at ${filePath} is missing a required "data" or "execute" property.`
          );
        }
      }
    }
    return commandsArray;
  };

module.exports = GetCommands;