import UserController from './controllers/user.controller';
import App from './app';
import IndexController from './controllers/IndexController';
import PostController from './controllers/PostController';

const app: App = new App([
   new IndexController(),
   new UserController(),
   new PostController()
]);

app.listen();