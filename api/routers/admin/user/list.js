var ObjectId = require('mongodb').ObjectID
const Route = require('lib/router/route')
const {User, Organization, Role, Group} = require('models')

module.exports = new Route({
  method: 'get',
  path: '/',
  handler: async function (ctx) {
    var filters = {}
    for (var filter in ctx.request.query) {
      if (filter === 'limit' || filter === 'start' || filter === 'sort') {
        continue
      }

      if (filter === 'role') {
        const role = await Role.findOne(
          {'uuid': ctx.request.query[filter]}
        )

        if (role) {
          filters['role'] = ObjectId(role._id)
        }

        continue
      }

      if (filter === 'organization') {
        const organization = await Organization.findOne(
          {'uuid': ctx.request.query[filter]}
        )

        if (organization) {
          filters['organizations'] = { $in: [ObjectId(organization._id)] }
        }

        continue
      }

      if (filter === 'group') {
        const group = await Group.findOne(
          {'uuid': ctx.request.query[filter]}
        )

        if (group) {
          filters['groups'] = { $in: [ObjectId(group._id)] }
        }

        continue
      }

      if (!isNaN(parseInt(ctx.request.query[filter]))) {
        filters[filter] = parseInt(ctx.request.query[filter])
      } else {
        filters[filter] = ctx.request.query[filter]
      }
    }

    var users = await User.dataTables({
      limit: ctx.request.query.limit || 20,
      skip: ctx.request.query.start,
      find: {isDeleted: {$ne: true}, ...filters},
      sort: ctx.request.query.sort || '-email'
    })

    users.data = users.data.map((user) => { return user.toAdmin() })

    ctx.body = users
  }
})
