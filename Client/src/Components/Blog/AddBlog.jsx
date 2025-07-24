import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Link } from '@tiptap/extension-link';
import { Image } from '@tiptap/extension-image';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Bold, Italic, Strikethrough, List, ListOrdered, Link as LinkIcon, Image as ImageIcon, AlignLeft, AlignCenter, AlignRight, AlignJustify, Undo, Redo, Tag } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { postService } from '../../services/api';

const AddBlog = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    author: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  
  const getCurrentUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = localStorage.getItem('token');
      
      if (!token || !user || !user.id) {
        toast.error('Please log in to create or edit posts');
        navigate('/login');
        return null;
      }
      
      return {
        id: user.id,
        username: user.username || 'Unknown User',
        email: user.email || ''
      };
    } catch (error) {
      console.error('Error getting user data:', error);
      toast.error('Failed to load user data');
      navigate('/login');
      return null;
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Placeholder.configure({
        placeholder: 'Write your blog description here...',
      }),
    ],
    content: formData.description || '',
    onUpdate: ({ editor }) => {
      setFormData(prev => ({
        ...prev,
        description: editor.getHTML()
      }));
    },
  });

  const addImage = () => {
    const url = window.prompt('Enter the URL of the image:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) {
      return;
    }

    if (url === '') {
      descriptionEditor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    descriptionEditor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  // Set initial form data with current user as author
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return; // Redirect handled in getCurrentUser

    const initializeForm = async () => {
      if (id) {
        // Edit mode: Fetch post data
        try {
          const post = await postService.getPostById(id);
          
          // Only allow the original author to edit the post
          if (post.userId !== currentUser.id) {
            toast.error('You are not authorized to edit this post');
            navigate('/blog');
            return;
          }
          
          setFormData({
            title: post.title || '',
            description: post.description || '',
            tags: post.tags ? post.tags.join(', ') : '',
            author: post.author || currentUser.username
          });
          
          if (post.content) {
            editor.commands.setContent(post.content);
          }
          
          setIsEditing(true);
        } catch (error) {
          console.error('Error fetching post:', error);
          toast.error('Failed to load post');
          navigate('/blog');
        }
      } else {
        // New post: Set current user as author
        setFormData({
          title: '',
          description: '',
          tags: '',
          author: currentUser.username
        });
      }
    };
    
    initializeForm();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Title and description are required');
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser) {
      toast.error('User not authenticated');
      navigate('/login');
      return;
    }

    // Validate required fields
    if (!formData.description || !formData.description.trim()) {
      toast.error('Please enter a description');
      return;
    }

    const tagArray = formData.tags
      ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      : [];

    const postData = {
      title: formData.title,
      description: formData.description, // This now contains the HTML content from the editor
      tags: tagArray,
      userId: currentUser.id,
      author: formData.author || currentUser.username || 'Unknown Author'
    };
    
    console.log('Submitting post data:', JSON.stringify(postData, null, 2));
    
    try {
      let response;
      if (isEditing) {
        response = await postService.updatePost(id, postData);
        toast.success('Blog post updated successfully!');
      } else {
        response = await postService.createPost(postData);
        toast.success('Blog post created successfully!');
      }
      console.log('Server response:', response);
      navigate('/blog');
    } catch (error) {
      console.error('Error submitting post:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        toast.error(error.response.data?.message || 'Error submitting post');
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('No response from server');
      } else {
        console.error('Error setting up request:', error.message);
        toast.error('Error setting up request');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-white mb-6">
        {isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter blog title"
            required
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="tag1, tag2, tag3"
          />
          <p className="mt-1 text-xs text-gray-400">
            Separate tags with commas. Example: react, javascript, webdev
          </p>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-medium text-gray-300 mb-3">Author Information</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Author
              </label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-gray-600 border border-gray-500 rounded-md text-white"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-300">Description</label>
            <div className="flex space-x-1">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-2 rounded ${editor?.isActive('bold') ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                title="Bold"
                disabled={!editor}
              >
                <Bold size={18} className="text-gray-300" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-2 rounded ${editor?.isActive('italic') ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                title="Italic"
                disabled={!editor}
              >
                <Italic size={18} className="text-gray-300" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleStrike().run()}
                className={`p-2 rounded ${editor?.isActive('strike') ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                title="Strikethrough"
                disabled={!editor}
              >
                <Strikethrough size={18} className="text-gray-300" />
              </button>
              <div className="h-6 w-px bg-gray-600 mx-1"></div>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded ${editor?.isActive('bulletList') ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                title="Bullet List"
                disabled={!editor}
              >
                <List size={18} className="text-gray-300" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded ${editor.isActive('orderedList') ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                title="Numbered List"
              >
                <ListOrdered size={18} className="text-gray-300" />
              </button>
              <div className="h-6 w-px bg-gray-600 mx-1"></div>
              <button
                type="button"
                onClick={setLink}
                className={`p-2 rounded ${editor.isActive('link') ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                title="Add Link"
              >
                <LinkIcon size={18} className="text-gray-300" />
              </button>
              <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-700"
                title="Add Image"
              >
                <ImageIcon size={18} className="text-gray-300" />
              </button>
              <div className="h-6 w-px bg-gray-600 mx-1"></div>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign('left').run()}
                  className={`p-2 rounded ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                  title="Align Left"
                >
                  <AlignLeft size={18} className="text-gray-300" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign('center').run()}
                  className={`p-2 rounded ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                  title="Align Center"
                >
                  <AlignCenter size={18} className="text-gray-300" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign('right').run()}
                  className={`p-2 rounded ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                  title="Align Right"
                >
                  <AlignRight size={18} className="text-gray-300" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                  className={`p-2 rounded ${editor.isActive({ textAlign: 'justify' }) ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
                  title="Justify"
                >
                  <AlignJustify size={18} className="text-gray-300" />
                </button>
              </div>
              <div className="h-6 w-px bg-gray-600 mx-1"></div>
              <input
                type="color"
                onInput={event => editor.chain().focus().setColor(event.target.value).run()}
                value={editor.getAttributes('textStyle').color || '#000000'}
                className="w-8 h-8 p-0 border-0 rounded cursor-pointer bg-gray-700"
                title="Text Color"
                
              />
              <div className="h-6 w-px bg-gray-600 mx-1"></div>
              <button
                type="button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="p-2 rounded disabled:opacity-50 hover:bg-gray-700"
                title="Undo"
              >
                <Undo size={18} className="text-gray-300" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="p-2 rounded disabled:opacity-50 hover:bg-gray-700"
                title="Redo"
              >
                <Redo size={18} className="text-gray-300" />
              </button>
            </div>
          </div>
          <div className="prose prose-invert max-w-none text-white bg-gray-800 border border-gray-700 rounded-md p-4 min-h-[300px]">
            <EditorContent editor={editor} className="outline-none min-h-[250px]" />
          </div>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={() => navigate('/blog')}
            className="px-6 py-2 text-sm font-medium text-white bg-gray-600 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddBlog;