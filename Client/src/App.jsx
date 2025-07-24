import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Layout from './Layout';
import Home from './pages/Home';
import Blog from './pages/Blog';
import BlogDetail from './Components/Blog/BlogDetail';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddBlog from './Components/Blog/AddBlog';

const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-400">Page Not Found</p>
    </div>
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blog">
            <Route index element={<Blog />} />
            <Route path="new" element={<AddBlog />} />
            <Route path=":id" element={<BlogDetail />} />
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
