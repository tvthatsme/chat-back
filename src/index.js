const { GraphQLServer } = require('graphql-yoga');
const { Prisma } = require('prisma-binding');
// const cors = require('cors');

const resolvers = {
  Query: {
    feed(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: true } }, info);
    },
    drafts(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: false } }, info);
    },
    post(parent, { id }, ctx, info) {
      return ctx.db.query.post({ where: { id } }, info);
    },
    channel(parent, { id }, ctx, info) {
      console.log('in here');
      return ctx.db.query.channel({ where: { id } }, info);
    }
  },
  Mutation: {
    createDraft(parent, { title, text }, ctx, info) {
      return ctx.db.mutation.createPost(
        {
          data: {
            title,
            text,
            isPublished: false
          }
        },
        info
      );
    },
    deletePost(parent, { id }, ctx, info) {
      return ctx.db.mutation.deletePost({ where: { id } }, info);
    },
    publish(parent, { id }, ctx, info) {
      return ctx.db.mutation.updatePost(
        {
          where: { id },
          data: { isPublished: true }
        },
        info
      );
    }
  }
};

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'http://localhost:4466/chat-back/dev', // the endpoint of the Prisma DB service
      secret: 'mysecret123', // specified in database/prisma.yml
      debug: true // log all GraphQL queryies & mutations
    })
  })
});
// server.use(cors);

server.start(() => console.log('Server is running on http://localhost:4000'));
