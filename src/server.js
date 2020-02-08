const { ApolloServer } = require('apollo-server');
const dns = require('dns');
const database = require("./services/database");

const typeDefs = `
    type Item {
        id: Int
        type: String
        description: String
    }

    type Domain {
      name: String,
      extension: String,
      checkout: String,
      available: Boolean
    }

    type Query {
        items(type: String): [Item]
    }

    input ItemInput {
      type: String
      description: String
    }

    type Mutation {
      saveItem (item: ItemInput): Item
      deleteItem(id: Int): Boolean
      generateDomains: [Domain]
      generateDomain(name: String): [Domain]
    }
`;

const isDomainAvailable = function (url) {
  return new Promise(function (resolve, reject) {
    dns.resolve(url, function (error) {
      error ? resolve(true) : resolve(false);
    });
  });

};

const resolvers = {
  Query: {
    async items(_, args) {
      const items = await database.getItemsByType(args.type);
      return items;
    },
  },
  Mutation: {
    async saveItem(_, args) {
      const newItem = await database.saveItem(args.item);
      const [item] = await database.getItemById(newItem.insertId);
      return item;
    },
    async deleteItem(_, args) {
      await database.deleteItem(args.id);
      return true;
    },
    async generateDomains() {
      const items = await database.getItems();
      const domains = [];
      for (const prefix of items.filter(item => item.type === "prefix")) {
        for (const suffix of items.filter(item => item.type === "suffix")) {
          const name = prefix.description + suffix.description;
          const url = name.toLowerCase();
          const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=.com.br`;
          const available = await isDomainAvailable(`${url}.com.br`);
          domains.push({
            name,
            checkout,
            available
          });
        }
      }
      return domains;
    },
    async generateDomain(_, args) {
      const name = args.name;
      const domains = [];
      const extensions = [".com.br", ".com", ".net", ".org"];
      for (extension of extensions) {
        const url = name.toLowerCase();
        const checkout = `https://checkout.hostgator.com.br/?a=add&sld=${url}&tld=${extension}`;
        const available = await isDomainAvailable(`${url}${extension}`);
        domains.push({
          name,
          extension,
          checkout,
          available
        });
      }
      return domains;
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen(4000, () => {
  console.log('[SERVER] Running at port 4000')
});
