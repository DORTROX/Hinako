const fs = require("node:fs");

const path = require("node:path");

const commandsArray = [];

const loadCommands = (dir, commands) => {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      loadCommands(filePath, commands);
    } else if (file.endsWith(".js")) {
      const command = require(filePath);
      if ("data" in command && "execute" in command) {
        commands.set(command.data.name, command);
        commandsArray.push(command.data.toJSON());
        console.log("Sucessfully loaded", command.data.name, "✔️");
      } else {
        console.log(
          `[Warning] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }
  
  const filteredCommandsArray = commandsArray.filter(
    (command) => !command.name.match(/hidden/i)
  );

  return filteredCommandsArray;
};


module.exports = loadCommands;
