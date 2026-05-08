'use client';

import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react';
import { useState, useRef, useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { uploadApi } from '@/lib/api';
import ResizableImageNode from './ResizableImageNode';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Upload,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

export default function RichTextEditor({
  value,
  onChange,
  error,
  placeholder = 'Viết nội dung bài viết của bạn tại đây...',
}: RichTextEditorProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-600 underline',
        },
      }),
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            width: {
              default: null,
              renderHTML: attributes => {
                if (!attributes.width) {
                  return {};
                }
                return {
                  width: attributes.width,
                };
              },
            },
            height: {
              default: null,
              renderHTML: attributes => {
                if (!attributes.height) {
                  return {};
                }
                return {
                  height: attributes.height,
                };
              },
            },
          };
        },
        addNodeView() {
          return ReactNodeViewRenderer(ResizableImageNode);
        },
      }).configure({
        inline: false,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Nhập URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true);
      const uploadResult = await uploadApi.uploadImage(file);
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';
      const imageUrl = `${baseUrl}${uploadResult.path}`;
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setShowImageModal(false);
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Không thể tải ảnh lên. Vui lòng thử lại.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh tối đa 5MB');
        return;
      }

      handleImageUpload(file);
    }
  };

  const insertImageFromUrl = () => {
    if (imageUrl.trim()) {
      editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
      setImageUrl('');
      setShowImageModal(false);
    }
  };

  const ToolbarButton = ({
    onClick,
    active,
    disabled,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        active
          ? 'bg-primary-100 text-primary-700'
          : 'hover:bg-gray-100 text-gray-700'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div>
      <div
        className={`border rounded-lg overflow-hidden transition-colors ${
          error
            ? 'border-red-300 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-500'
            : 'border-gray-300 focus-within:border-primary-500 focus-within:ring-1 focus-within:ring-primary-500'
        }`}
      >
        {/* Toolbar */}
        <div className="bg-gray-50 border-b border-gray-200 p-2 flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              active={editor.isActive('bold')}
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              active={editor.isActive('italic')}
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              active={editor.isActive('underline')}
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              active={editor.isActive('strike')}
              title="Strikethrough"
            >
              <Strikethrough className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              active={editor.isActive('code')}
              title="Code"
            >
              <Code className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Headings */}
          <div className="flex gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              active={editor.isActive('heading', { level: 1 })}
              title="Heading 1"
            >
              <Heading1 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor.isActive('heading', { level: 2 })}
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              active={editor.isActive('heading', { level: 3 })}
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Lists */}
          <div className="flex gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              active={editor.isActive('bulletList')}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              active={editor.isActive('orderedList')}
              title="Ordered List"
            >
              <ListOrdered className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              active={editor.isActive('blockquote')}
              title="Blockquote"
            >
              <Quote className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Alignment */}
          <div className="flex gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              active={editor.isActive({ textAlign: 'left' })}
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              active={editor.isActive({ textAlign: 'center' })}
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              active={editor.isActive({ textAlign: 'right' })}
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().setTextAlign('justify').run()}
              active={editor.isActive({ textAlign: 'justify' })}
              title="Justify"
            >
              <AlignJustify className="w-4 h-4" />
            </ToolbarButton>
          </div>

          {/* Insert */}
          <div className="flex gap-1 pr-2 border-r border-gray-300">
            <ToolbarButton onClick={addLink} title="Insert Link">
              <LinkIcon className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton 
              onClick={() => setShowImageModal(true)} 
              title="Insert Image"
              disabled={uploadingImage}
            >
              {uploadingImage ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
              ) : (
                <ImageIcon className="w-4 h-4" />
              )}
            </ToolbarButton>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-1">
            <ToolbarButton
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().undo()}
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4" />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().redo()}
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4" />
            </ToolbarButton>
          </div>
        </div>

        {/* Editor Content */}
        <div ref={editorRef} className="editor-content-wrapper">
          <EditorContent editor={editor} />
        </div>
      </div>

      {/* Custom CSS for editor */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
        }
        
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }

        /* Image node view styles */
        .ProseMirror .resizable-image-wrapper {
          display: inline-block;
          max-width: 100%;
          margin: 1rem 0;
        }

        .ProseMirror .resizable-image-wrapper img {
          cursor: pointer;
          transition: all 0.2s;
        }

        .ProseMirror .resizable-image-wrapper img:hover {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }

        /* Ensure node views are selectable */
        .ProseMirror .ProseMirror-selectednode {
          outline: none;
        }
      `}</style>

      {/* Image Upload Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Thêm ảnh</h3>
            
            {/* Upload from computer */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tải ảnh từ máy tính
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploadingImage}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                    <span className="text-sm font-medium text-gray-700">Đang tải lên...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Chọn ảnh từ máy tính</span>
                  </>
                )}
              </button>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF tối đa 5MB</p>
            </div>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">hoặc</span>
              </div>
            </div>

            {/* URL input */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập URL ảnh
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    insertImageFromUrl();
                  }
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={insertImageFromUrl}
                disabled={!imageUrl.trim()}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Thêm ảnh
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}
