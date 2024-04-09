import App from './app';
import IndexController from './controllers/IndexController';
import PostController from './controllers/PostController';

const app: App = new App([
//    new IndexController(),
   new PostController()
]);

app.listen();