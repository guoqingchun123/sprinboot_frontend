import login from './login'
import authority from './authority'
import article from './article'
import search from './remoteSearch'
import transaction from './transaction'

export default {
  ...login,
  ...authority,
  ...article,
  ...search,
  ...transaction
}

