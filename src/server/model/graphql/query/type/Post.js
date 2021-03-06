const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLID,
  GraphQLNonNull,
  GraphQLList
} = require('graphql')

const TagEntity = require('../entity/Tag')

const PostType = new GraphQLObjectType({
  name: 'PostType',
  fields: () => {
    // 在此引用，避免循序引用出现空对象
    const TagType = require('./Tag')
    return {
      id: {
        type: new GraphQLNonNull(GraphQLID)
      },
      name: {
        type: GraphQLString
      },
      createdTime: {
        type: GraphQLString
      },
      title: {
        type: new GraphQLNonNull(GraphQLString)
      },
      subtitle: {
        type: GraphQLString
      },
      headerImgName: {
        type: GraphQLString
      },
      content: {
        type: GraphQLString
      },
      tags: {
        type: new GraphQLList(TagType),
        resolve: post => post.tags.map(tag => TagEntity.getTagByName(tag))
      }
    }
  }
})
module.exports = PostType
