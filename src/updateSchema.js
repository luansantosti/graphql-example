const fs = require('fs');
const path = require ('path');
const { promisify } = require('util');

const { printSchema } = require('graphql/utilities');

const schema = require('./schema');

const writeFileAsync = promisify(fs.writeFile);

(async () => {
  const configs = [
    {
      schema: schema,
      path: './schemas/graphql',
    },
  ];

  await Promise.all([
    ...configs.map(async (config) => {
      await writeFileAsync(
        path.join(__dirname, `${config.path}/schema.graphql`),
        printSchema(config.schema),
      );
    }),
  ]);

  process.exit(0);
})();